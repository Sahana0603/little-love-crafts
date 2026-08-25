// js/cart.js

/**
 * Retrieves the current cart array from localStorage.
 * @returns {Array}
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('llc_cart')) || [];
    } catch (e) {
        return [];
    }
}

/**
 * Saves the cart array to localStorage.
 * @param {Array} cart 
 */
function saveCart(cart) {
    localStorage.setItem('llc_cart', JSON.stringify(cart));
    // Trigger custom event to update header cart count
    window.dispatchEvent(new Event('cart-updated'));
}

/**
 * Adds an item to the cart.
 * @param {Object} product - Product record from database
 * @param {number} quantity 
 * @param {Object} customizations - { color, sizeOccasion, message, referenceUrl }
 */
function addToCart(product, quantity = 1, customizations = {}) {
    const cart = getCart();
    
    // Create unique key for same product with different customizations
    const customizationKey = JSON.stringify(customizations);
    const existingIndex = cart.findIndex(item => item.id === product.id && JSON.stringify(item.customizations) === customizationKey);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: Number(product.price),
            image_url: product.image_url,
            is_starts_from: product.is_starts_from,
            quantity: quantity,
            customizations: customizations
        });
    }
    
    saveCart(cart);
}

/**
 * Updates quantity of a specific cart item.
 * @param {string} productId 
 * @param {string} customizationKeyJSON 
 * @param {number} delta 
 */
function updateCartQuantity(productId, customizationKeyJSON, delta) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId && JSON.stringify(item.customizations) === customizationKeyJSON);

    if (index > -1) {
        cart[index].quantity += delta;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart(cart);
    }
}

/**
 * Removes an item from the cart.
 * @param {string} productId 
 * @param {string} customizationKeyJSON 
 */
function removeFromCart(productId, customizationKeyJSON) {
    let cart = getCart();
    const index = cart.findIndex(item => item.id === productId && JSON.stringify(item.customizations) === customizationKeyJSON);

    if (index > -1) {
        cart.splice(index, 1);
        saveCart(cart);
    }
}

/**
 * Empties the cart.
 */
function clearCart() {
    saveCart([]);
}

/**
 * Calculates cart total cost.
 * @returns {number}
 */
function getCartTotal() {
    return getCart().reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Formats cart summary as a WhatsApp order message.
 * @param {Object} profile - Logged in user profile (optional)
 * @returns {string}
 */
function generateWhatsAppMessage(profile = null) {
    const cart = getCart();
    if (cart.length === 0) return "";

    let text = "Hello Craftifyy! 💕\n";
    text += "I'd like to place an order for the following items:\n\n";

    cart.forEach((item, index) => {
        const itemPrice = item.price * item.quantity;
        const priceLabel = item.is_starts_from ? "starts from " : "";
        
        text += `${index + 1}. *${item.name}* (Qty: ${item.quantity}) - ₹${item.price} each\n`;
        text += `   Category: ${item.category}\n`;
        
        // Customizations
        if (item.customizations && Object.keys(item.customizations).length > 0) {
            const cust = item.customizations;
            if (cust.color) text += `   - Color: ${cust.color}\n`;
            if (cust.sizeOccasion) text += `   - Size/Occasion: ${cust.sizeOccasion}\n`;
            if (cust.message) text += `   - Custom Message: "${cust.message}"\n`;
            if (cust.referenceUrl) text += `   - Reference details: ${cust.referenceUrl}\n`;
        }
        
        text += `   Subtotal: ₹${itemPrice}\n\n`;
    });

    const total = getCartTotal();
    text += `*Total Order Value: ₹${total}*\n\n`;

    if (profile) {
        text += `*Customer Details:*\n`;
        text += `- Name: ${profile.name}\n`;
        text += `- Phone: ${profile.phone}\n\n`;
    }

    text += "Please confirm my order details and share next steps for payment. Thank you! ✨";
    return encodeURIComponent(text);
}

/**
 * Redirects to WhatsApp to checkout.
 */
function checkoutViaWhatsApp(profile = null) {
    const encodedMsg = generateWhatsAppMessage(profile);
    if (!encodedMsg) return;
    
    // Business WhatsApp number
    const whatsappNum = "917892510154";
    const url = `https://wa.me/${whatsappNum}?text=${encodedMsg}`;
    window.open(url, "_blank");
}
