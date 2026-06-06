/* ============================================
   FreshMart - Vanilla JavaScript
   Shopping Cart Functionality & DOM Management
   ============================================ */

// -------- Product Database --------
const products = [
    {
        id: 1,
        name: 'Fresh Apples',
        category: 'Fruits',
        price: 4.99,
        emoji: '🍎',
        description: 'Crisp and juicy apples'
    },
    {
        id: 2,
        name: 'Organic Bananas',
        category: 'Fruits',
        price: 2.49,
        emoji: '🍌',
        description: 'Ripe organic bananas'
    },
    {
        id: 3,
        name: 'Red Tomatoes',
        category: 'Vegetables',
        price: 3.99,
        emoji: '🍅',
        description: 'Fresh garden tomatoes'
    },
    {
        id: 4,
        name: 'Crisp Lettuce',
        category: 'Vegetables',
        price: 2.99,
        emoji: '🥬',
        description: 'Green and fresh lettuce'
    },
    {
        id: 5,
        name: 'Juicy Oranges',
        category: 'Fruits',
        price: 5.99,
        emoji: '🍊',
        description: 'Sweet orange citrus fruits'
    },
    {
        id: 6,
        name: 'Sweet Carrots',
        category: 'Vegetables',
        price: 1.99,
        emoji: '🥕',
        description: 'Fresh crunchy carrots'
    },
    {
        id: 7,
        name: 'Purple Eggplant',
        category: 'Vegetables',
        price: 3.49,
        emoji: '🍆',
        description: 'Fresh purple eggplant'
    },
    {
        id: 8,
        name: 'Green Peppers',
        category: 'Vegetables',
        price: 2.79,
        emoji: '🫑',
        description: 'Fresh bell peppers'
    },
    {
        id: 9,
        name: 'Garlic Bulbs',
        category: 'Vegetables',
        price: 0.99,
        emoji: '🧄',
        description: 'Fresh aromatic garlic'
    },
    {
        id: 10,
        name: 'Red Strawberries',
        category: 'Fruits',
        price: 6.49,
        emoji: '🍓',
        description: 'Sweet fresh strawberries'
    },
    {
        id: 11,
        name: 'Green Cucumbers',
        category: 'Vegetables',
        price: 1.49,
        emoji: '🥒',
        description: 'Crisp fresh cucumbers'
    },
    {
        id: 12,
        name: 'Corn on the Cob',
        category: 'Vegetables',
        price: 2.99,
        emoji: '🌽',
        description: 'Fresh sweet corn'
    }
];

// -------- State Management --------
let cart = [];
let filteredProducts = [...products];

// -------- DOM Elements --------
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItems = document.getElementById('cartItems');
const emptyCart = document.getElementById('emptyCart');
const cartCount = document.getElementById('cartCount');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const continueShopping = document.getElementById('continueShopping');
const noProducts = document.getElementById('noProducts');
const productCount = document.getElementById('productCount');

// -------- Initialization --------
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    renderProducts(products);
    updateCartUI();
});

// -------- Event Listeners --------
searchInput.addEventListener('input', handleSearch);
cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
continueShopping.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', handleCheckout);
cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) closeCart();
});

// -------- Search Functionality --------
/**
 * Filters products based on search input
 * Searches in product name, category, and description
 */
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredProducts = [...products];
    } else {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// -------- Render Products --------
/**
 * Dynamically renders product cards to the DOM
 * @param {Array} productsToRender - Array of products to display
 */
function renderProducts(productsToRender) {
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        noProducts.style.display = 'block';
        productCount.textContent = 'No products found';
        return;
    }
    
    noProducts.style.display = 'none';
    productCount.textContent = `Showing ${productsToRender.length} products`;
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// -------- Create Product Card --------
/**
 * Creates a product card element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-body">
            <p class="product-name">${product.name}</p>
            <p class="product-category">${product.category}</p>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <div class="product-actions">
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>
                <button class="view-details-btn" title="View Details">👁️</button>
            </div>
        </div>
    `;
    
    // Add to cart button listener
    card.querySelector('.add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
    });

    // View details button listener
    card.querySelector('.view-details-btn').addEventListener('click', () => {
        showProductDetails(product);
    });
    
    return card;
}

/**
 * Shows a modal with the selected product details
 * @param {Object} product - Product object
 */
function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.className = 'product-details-modal';
    modal.innerHTML = `
        <div class="details-dialog" role="dialog" aria-modal="true" aria-label="Product details">
            <button class="details-close" aria-label="Close product details">&times;</button>
            <div class="details-header">
                <div class="details-image">${product.emoji}</div>
                <div>
                    <h3>${product.name}</h3>
                    <p class="details-category">${product.category}</p>
                </div>
            </div>
            <p class="details-description">${product.description}</p>
            <p class="details-price">Price: $${product.price.toFixed(2)}</p>
            <button class="details-add-to-cart-btn">Add to Cart</button>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    };

    modal.querySelector('.details-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    modal.querySelector('.details-add-to-cart-btn').addEventListener('click', () => {
        addToCart(product);
        closeModal();
    });
}

// -------- Shopping Cart Functions --------
/**
 * Adds a product to the shopping cart
 * @param {Object} product - Product to add
 */
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // If product already in cart, increment quantity
        existingItem.quantity += 1;
    } else {
        // Add new product to cart
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showAddedNotification(product.name);
}

/**
 * Removes a product from the shopping cart
 * @param {number} productId - Product ID to remove
 */
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

/**
 * Updates the quantity of a product in the cart
 * @param {number} productId - Product ID
 * @param {number} newQuantity - New quantity value
 */
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartUI();
    }
}

// -------- Cart UI Updates --------
/**
 * Updates all cart-related UI elements
 * Renders cart items, updates counts, and calculates totals
 */
function updateCartUI() {
    updateCartCount();
    renderCartItems();
    calculateTotals();
}

/**
 * Updates the cart count badge
 */
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

/**
 * Renders all items currently in the shopping cart
 */
function renderCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        return;
    }
    
    emptyCart.style.display = 'none';
    
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItems.appendChild(cartItemElement);
    });
}

/**
 * Creates a shopping cart item element
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} Cart item element
 */
function createCartItemElement(item) {
    const itemTotal = (item.price * item.quantity).toFixed(2);
    
    const element = document.createElement('div');
    element.className = 'cart-item';
    element.innerHTML = `
        <div class="cart-item-image">${item.emoji}</div>
        <div class="cart-item-details">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">$${itemTotal}</p>
        </div>
        <div class="cart-item-actions">
            <div class="quantity-control">
                <button class="quantity-btn minus-btn" data-id="${item.id}">−</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item-btn" data-id="${item.id}">Remove</button>
        </div>
    `;
    
    // Quantity controls
    element.querySelector('.minus-btn').addEventListener('click', () => {
        updateQuantity(item.id, item.quantity - 1);
    });
    
    element.querySelector('.plus-btn').addEventListener('click', () => {
        updateQuantity(item.id, item.quantity + 1);
    });
    
    // Remove button
    element.querySelector('.remove-item-btn').addEventListener('click', () => {
        removeFromCart(item.id);
    });
    
    return element;
}

/**
 * Calculates and displays subtotal, tax, and total price
 */
function calculateTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    taxEl.textContent = `$${tax.toFixed(2)}`;
    totalEl.textContent = `$${total.toFixed(2)}`;
}

// -------- Modal Controls --------
/**
 * Opens the shopping cart modal
 */
function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

/**
 * Closes the shopping cart modal
 */
function closeCart() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable background scrolling
}

// -------- Checkout Handling --------
/**
 * Handles checkout process
 */
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.10;
    alert(`Thank you for your purchase! Total: $${total.toFixed(2)}\n\nThis is a demo. No actual payment processing.`);
    
    // Clear the cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
    closeCart();
}

// -------- Local Storage Management --------
/**
 * Saves the current cart to browser's Local Storage
 */
function saveCartToStorage() {
    localStorage.setItem('freshmart_cart', JSON.stringify(cart));
}

/**
 * Loads the cart from browser's Local Storage
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('freshmart_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }
}

// -------- User Feedback --------
/**
 * Shows a brief notification when an item is added to cart
 * @param {string} productName - Name of the product added
 */
function showAddedNotification(productName) {
    // Create temporary notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.textContent = `✓ ${productName} added to cart!`;
    
    document.body.appendChild(notification);
    
    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// -------- Animation Keyframes --------
/**
 * Add animation styles dynamically
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// -------- Accessibility: Keyboard Navigation --------
/**
 * Handle escape key to close cart modal
 */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartModal.classList.contains('active')) {
        closeCart();
    }
});

// -------- Console Messages --------
console.log('%c🛒 FreshMart Grocery Store', 'font-size: 20px; color: #2ecc71; font-weight: bold;');
console.log('%cWelcome! Your cart data is saved in Local Storage.', 'color: #27ae60; font-size: 14px;');