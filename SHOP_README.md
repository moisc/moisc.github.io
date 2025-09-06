# E-Commerce Shop Integration for moiscohen.com

A complete e-commerce solution integrated into Mois Cohen's portfolio website with Stripe payment processing.

## 🚀 Features

### Frontend
- **Clean, Responsive Design**: Matches the existing website aesthetic
- **Product Display**: Single t-shirt product with size selection
- **Shopping Cart**: localStorage persistence with quantity management
- **Size Selection**: S, M, L, XL options
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode**: Integrated with existing theme system
- **Success/Cancel Pages**: Complete checkout flow

### Backend
- **Express.js Server**: RESTful API with security middleware
- **Stripe Integration**: Secure payment processing
- **Webhook Support**: Real-time payment status updates
- **CORS Configuration**: Proper cross-origin setup
- **Rate Limiting**: Protection against abuse
- **Error Handling**: Comprehensive error management

## 📁 Project Structure

```
moisc.github.io/
├── server.js                 # Express.js server with Stripe integration
├── package.json              # Dependencies and scripts
├── vercel.json              # Vercel deployment configuration
├── .env.example             # Environment variables template
├── shop/
│   ├── index.html           # Shop page
│   └── shop.js              # Frontend cart and checkout logic
├── success.html             # Payment success page
├── cancel.html              # Payment cancelled page
├── index.html               # Main site (updated with Shop links)
└── SHOP_README.md           # This file
```

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+
- Stripe Account (free for testing)
- GitHub account for hosting

### 1. Stripe Account Setup

1. **Create a Stripe Account**
   - Sign up at [stripe.com](https://stripe.com)
   - Complete account verification

2. **Get API Keys**
   - Go to Developers → API keys
   - Copy your Publishable key (`pk_test_...`)
   - Copy your Secret key (`sk_test_...`)
   - Keep these secure!

3. **Create Product in Stripe Dashboard**
   ```bash
   # Alternative: Use the Stripe CLI
   stripe products create \
     --name="Premium T-Shirt" \
     --description="High-quality cotton t-shirt" \
   
   stripe prices create \
     --unit-amount=4500 \
     --currency=usd \
     --product=prod_xxx
   ```

### 2. Local Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your actual Stripe keys
   nano .env
   ```

3. **Update Stripe Keys**
   - Edit `shop/shop.js` line 15 to include your publishable key
   - Update `.env` with your secret keys

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Test Locally**
   - Visit `http://localhost:3000`
   - Navigate to `/shop`
   - Test the checkout flow

### 3. Stripe Webhook Setup

1. **Install Stripe CLI** (for local testing)
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows/Linux - download from stripe.com/docs/stripe-cli
   ```

2. **Login to Stripe**
   ```bash
   stripe login
   ```

3. **Forward Webhooks Locally**
   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```

4. **Copy Webhook Secret**
   - The CLI will display a webhook secret
   - Add it to your `.env` file as `STRIPE_WEBHOOK_SECRET`

### 4. Production Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   ```bash
   # Set production environment variables
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_PUBLISHABLE_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   vercel env add DOMAIN
   ```

4. **Configure Production Webhook**
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://your-domain.vercel.app/webhook`
   - Select events: `checkout.session.completed`, `payment_intent.payment_failed`
   - Copy the signing secret to your environment variables

### 5. GitHub Pages Integration

Since GitHub Pages only serves static files, you'll need:

1. **Dual Hosting Setup**
   - Static files: GitHub Pages (`moisc.github.io`)
   - API server: Vercel (`your-api.vercel.app`)

2. **Update API Base URL**
   ```javascript
   // In shop/shop.js, update line 8:
   this.apiBase = 'https://your-api-domain.vercel.app';
   ```

3. **CORS Configuration**
   - Ensure your server's CORS settings include your GitHub Pages domain

## 💳 Test Payment Information

Use Stripe's test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Authentication**: `4000 0025 0000 3155`

Use any future expiry date, any 3-digit CVC, and any billing postal code.

## 🔧 Customization

### Adding New Products

1. **Update Server Product Catalog** (`server.js`)
   ```javascript
   const PRODUCTS = {
     'tshirt': { /* existing */ },
     'hoodie': {
       id: 'hoodie',
       name: 'Premium Hoodie',
       price: 6500, // $65.00 in cents
       // ... other properties
     }
   };
   ```

2. **Update Frontend** (`shop/index.html` and `shop.js`)
   - Add product selection UI
   - Update cart logic for multiple products

### Styling Modifications

- Colors are defined in Tailwind config
- Main accent color: `#3B82F6` (blue)
- Dark mode is fully implemented

### Inventory Management

The current setup includes basic inventory tracking in the `PRODUCTS` object. For production:

1. **Database Integration**
   - Add PostgreSQL/MySQL database
   - Track inventory levels
   - Update on successful payments

2. **Real-time Updates**
   - Use webhooks to decrement inventory
   - Add low-stock notifications

## 📱 Mobile Optimization

The shop is fully mobile-responsive with:
- Touch-friendly size selectors
- Mobile-optimized cart modal
- Responsive product images
- Mobile payment forms (handled by Stripe)

## 🔒 Security Features

- **Helmet.js**: Security headers
- **Rate Limiting**: API endpoint protection
- **CORS**: Proper cross-origin configuration
- **Environment Variables**: Sensitive data protection
- **Stripe Elements**: PCI-compliant payment forms

## 🛡️ Error Handling

The system includes comprehensive error handling for:
- Network failures
- Payment processing errors
- Inventory issues
- Server errors
- User input validation

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics for shop page
- Stripe Dashboard for payment analytics
- Error logging service (e.g., Sentry)
- Uptime monitoring for your API

## 🚀 Go Live Checklist

- [ ] Test all payment flows thoroughly
- [ ] Set up production webhook endpoints
- [ ] Configure live Stripe keys
- [ ] Test mobile responsiveness
- [ ] Set up monitoring and alerts
- [ ] Update any placeholder images
- [ ] Verify CORS settings for production domains
- [ ] Test order confirmation emails
- [ ] Review and update return/refund policies
- [ ] Set up customer support processes

## 📞 Support

For technical issues or questions about the shop implementation:
- Email: mois.cohen787@gmail.com
- Check Stripe documentation: [stripe.com/docs](https://stripe.com/docs)

## 📄 License

This e-commerce integration is part of Mois Cohen's portfolio website. All rights reserved.

---

Built with ❤️ using modern web technologies and secure payment processing.