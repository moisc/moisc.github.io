const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

// Initialize Stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Allow inline scripts for static files
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://moisc.github.io', 'https://moiscohen.com'],
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Webhook endpoint (must be before express.json())
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment was successful:', session.id);
      
      // Here you could:
      // - Update inventory
      // - Send confirmation email
      // - Update order status in database
      // - Trigger fulfillment process
      
      break;
    case 'payment_intent.payment_failed':
      const paymentIntent = event.data.object;
      console.log('Payment failed:', paymentIntent.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Product catalog
const PRODUCTS = {
  'tshirt': {
    id: 'tshirt',
    name: 'Premium T-Shirt',
    description: 'High-quality cotton t-shirt with premium feel',
    price: 4500, // $45.00 in cents
    currency: 'usd',
    images: ['https://moisc.github.io/shop/MC. Tshirt.png'], // Actual product image
    sizes: ['S', 'M', 'L', 'XL'],
    inventory: {
      'S': 10,
      'M': 15,
      'L': 20,
      'XL': 12
    }
  }
};

// API Routes
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    products: Object.values(PRODUCTS)
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS[req.params.id];
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  res.json({
    success: true,
    product: product
  });
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid items array'
      });
    }

    // Validate and calculate line items
    const lineItems = [];
    let hasErrors = false;
    let errorMessage = '';

    for (const item of items) {
      const product = PRODUCTS[item.productId];
      
      if (!product) {
        hasErrors = true;
        errorMessage = `Product ${item.productId} not found`;
        break;
      }

      if (!product.sizes.includes(item.size)) {
        hasErrors = true;
        errorMessage = `Invalid size ${item.size} for product ${item.productId}`;
        break;
      }

      if (product.inventory[item.size] < item.quantity) {
        hasErrors = true;
        errorMessage = `Insufficient inventory for ${product.name} size ${item.size}`;
        break;
      }

      lineItems.push({
        price_data: {
          currency: product.currency,
          product_data: {
            name: `${product.name} (${item.size})`,
            description: product.description,
            images: product.images,
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      });
    }

    if (hasErrors) {
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }

    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/cancel.html`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
});

app.get('/api/session/:sessionId', async (req, res) => {
  try {
    const session = await stripeClient.checkout.sessions.retrieve(req.params.sessionId);
    
    res.json({
      success: true,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        customer_email: session.customer_details?.email,
        amount_total: session.amount_total,
        currency: session.currency
      }
    });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve session'
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Stripe keys configured: ${process.env.STRIPE_SECRET_KEY ? 'Yes' : 'No'}`);
});

module.exports = app;