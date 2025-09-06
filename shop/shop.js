// Shop functionality
class ShopManager {
    constructor() {
        this.cart = this.loadCart();
        this.selectedSize = null;
        this.stripe = null;
        this.apiBase = window.location.hostname === 'localhost' ? 
            'http://localhost:3000' : 'https://moiscgithubio-production.up.railway.app';
        
        this.initStripe();
        this.initEventListeners();
        this.updateCartDisplay();
    }

    async initStripe() {
        try {
            const publishableKey = 'pk_test_51S4HRTKILbCMbGTLeDHZCq293w3ghICB8vYwhmqyFw0PFGoNliyR1srCFbcWPbXBkLa7qViBvna1pnzscsbHGIOx00awv04etv';
            this.stripe = Stripe(publishableKey);
            console.log('Stripe initialized successfully with TEST keys - safe for testing!');
        } catch (error) {
            console.error('Failed to initialize Stripe:', error);
        }
    }

    initEventListeners() {
        // Size selection
        document.querySelectorAll('.size-option').forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectSize(e.target.dataset.size);
            });
        });

        // Quantity controls
        document.getElementById('quantity-minus').addEventListener('click', () => {
            this.adjustQuantity(-1);
        });

        document.getElementById('quantity-plus').addEventListener('click', () => {
            this.adjustQuantity(1);
        });

        document.getElementById('quantity').addEventListener('input', (e) => {
            this.setQuantity(parseInt(e.target.value) || 1);
        });

        // Add to cart
        document.getElementById('add-to-cart').addEventListener('click', () => {
            this.addToCart();
        });

        // Cart modal controls
        document.getElementById('cart-toggle').addEventListener('click', () => {
            this.toggleCartModal();
        });

        document.getElementById('mobile-cart-toggle').addEventListener('click', () => {
            this.toggleCartModal();
        });

        document.getElementById('close-cart').addEventListener('click', () => {
            this.closeCartModal();
        });

        document.getElementById('continue-shopping').addEventListener('click', () => {
            this.closeCartModal();
        });

        document.getElementById('checkout-button').addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Close modal when clicking outside
        document.getElementById('cart-modal').addEventListener('click', (e) => {
            if (e.target.id === 'cart-modal') {
                this.closeCartModal();
            }
        });

        // Theme toggle
        this.initTheme();
        document.getElementById('theme-toggle').addEventListener('click', this.toggleTheme);
        document.getElementById('mobile-theme-toggle').addEventListener('click', this.toggleTheme);

        // Mobile menu
        document.getElementById('mobile-menu-button').addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        });
    }

    selectSize(size) {
        this.selectedSize = size;
        
        // Update UI
        document.querySelectorAll('.size-option').forEach(button => {
            button.classList.remove('selected');
        });
        
        document.querySelector(`[data-size="${size}"]`).classList.add('selected');
        document.getElementById('size-error').classList.add('hidden');
    }

    adjustQuantity(delta) {
        const quantityInput = document.getElementById('quantity');
        const currentQuantity = parseInt(quantityInput.value) || 1;
        const newQuantity = Math.max(1, Math.min(10, currentQuantity + delta));
        this.setQuantity(newQuantity);
    }

    setQuantity(quantity) {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = Math.max(1, Math.min(10, quantity));
    }

    addToCart() {
        if (!this.selectedSize) {
            document.getElementById('size-error').classList.remove('hidden');
            return;
        }

        const quantity = parseInt(document.getElementById('quantity').value) || 1;
        
        const item = {
            productId: 'tshirt',
            name: 'Premium T-Shirt',
            size: this.selectedSize,
            quantity: quantity,
            price: 45.00,
            image: 'MC. Tshirt.png'
        };

        // Check if item already exists in cart
        const existingItemIndex = this.cart.findIndex(
            cartItem => cartItem.productId === item.productId && cartItem.size === item.size
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            this.cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            this.cart.push(item);
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showSuccessToast();

        // Reset form
        this.selectedSize = null;
        document.querySelectorAll('.size-option').forEach(button => {
            button.classList.remove('selected');
        });
        document.getElementById('quantity').value = 1;
    }

    removeFromCart(productId, size) {
        this.cart = this.cart.filter(item => 
            !(item.productId === productId && item.size === size)
        );
        this.saveCart();
        this.updateCartDisplay();
        this.renderCartItems();
    }

    updateCartQuantity(productId, size, quantity) {
        const item = this.cart.find(item => 
            item.productId === productId && item.size === size
        );
        
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity));
            this.saveCart();
            this.updateCartDisplay();
            this.renderCartItems();
        }
    }

    updateCartDisplay() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const cartCounts = document.querySelectorAll('#cart-count, #mobile-cart-count');
        
        cartCounts.forEach(count => {
            if (totalItems > 0) {
                count.textContent = totalItems;
                count.classList.remove('hidden');
            } else {
                count.classList.add('hidden');
            }
        });
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCart = document.getElementById('empty-cart');
        const cartFooter = document.getElementById('cart-footer');

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = '';
            emptyCart.classList.remove('hidden');
            cartFooter.classList.add('hidden');
            return;
        }

        emptyCart.classList.add('hidden');
        cartFooter.classList.remove('hidden');

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-semibold">${item.name}</h3>
                    <p class="text-sm text-gray-600">Size: ${item.size}</p>
                    <p class="text-accent font-semibold">$${item.price.toFixed(2)}</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="shopManager.updateCartQuantity('${item.productId}', '${item.size}', ${item.quantity - 1})" 
                            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-accent">
                        <i class="fas fa-minus text-xs"></i>
                    </button>
                    <span class="w-8 text-center">${item.quantity}</span>
                    <button onclick="shopManager.updateCartQuantity('${item.productId}', '${item.size}', ${item.quantity + 1})" 
                            class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-accent">
                        <i class="fas fa-plus text-xs"></i>
                    </button>
                    <button onclick="shopManager.removeFromCart('${item.productId}', '${item.size}')" 
                            class="ml-2 text-red-500 hover:text-red-700">
                        <i class="fas fa-trash text-sm"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    toggleCartModal() {
        const modal = document.getElementById('cart-modal');
        modal.classList.toggle('hidden');
        
        if (!modal.classList.contains('hidden')) {
            this.renderCartItems();
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    closeCartModal() {
        document.getElementById('cart-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    async proceedToCheckout() {
        console.log('Checkout button clicked!');
        console.log('Cart contents:', this.cart);
        
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Show loading state
        const checkoutButton = document.getElementById('checkout-button');
        const originalText = checkoutButton.innerHTML;
        checkoutButton.innerHTML = 'Processing...';
        checkoutButton.disabled = true;

        try {
            const items = this.cart.map(item => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity
            }));

            console.log('Sending checkout request with items:', items);
            console.log('API Base URL:', this.apiBase);

            const response = await fetch(`${this.apiBase}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items })
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Server responded with ${response.status}: ${errorText}`);
            }

            const responseData = await response.json();
            console.log('Response data:', responseData);
            
            const { sessionId, url } = responseData;
            
            // Redirect to Stripe Checkout
            if (url) {
                console.log('Redirecting to Stripe checkout:', url);
                window.location.href = url;
            } else if (this.stripe && sessionId) {
                console.log('Using Stripe.js to redirect to checkout');
                const { error } = await this.stripe.redirectToCheckout({ sessionId });
                if (error) {
                    console.error('Stripe redirect error:', error);
                    alert('There was an error processing your payment. Please try again.');
                }
            } else {
                throw new Error('No checkout URL or session ID received');
            }

        } catch (error) {
            console.error('Checkout error:', error);
            alert(`Error: ${error.message}`);
            
            // Reset button state
            checkoutButton.innerHTML = originalText;
            checkoutButton.disabled = false;
        }
    }

    showSuccessToast() {
        const toast = document.getElementById('success-toast');
        toast.classList.remove('translate-x-full');
        
        setTimeout(() => {
            toast.classList.add('translate-x-full');
        }, 3000);
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('moiscohen_cart');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    saveCart() {
        try {
            localStorage.setItem('moiscohen_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Theme functionality
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            this.updateThemeIcons('dark');
        } else {
            document.documentElement.classList.remove('dark');
            this.updateThemeIcons('light');
        }
    }

    updateThemeIcons(theme) {
        const desktopIcon = document.getElementById('theme-icon');
        const mobileIcon = document.getElementById('mobile-theme-icon');
        
        if (theme === 'dark') {
            desktopIcon.className = 'fas fa-moon text-lg';
            mobileIcon.className = 'fas fa-moon text-lg';
        } else {
            desktopIcon.className = 'fas fa-sun text-lg';
            mobileIcon.className = 'fas fa-sun text-lg';
        }
    }

    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            shopManager.updateThemeIcons('light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            shopManager.updateThemeIcons('dark');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize shop manager
    window.shopManager = new ShopManager();
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.classList.add('dark');
            shopManager.updateThemeIcons('dark');
        } else {
            document.documentElement.classList.remove('dark');
            shopManager.updateThemeIcons('light');
        }
    }
});