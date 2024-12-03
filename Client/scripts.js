let cart = [];
let totalCost = 0;

// Add or Update Cart Function
function addToCart(itemName, itemPrice, itemImage) {
  const itemIndex = cart.findIndex(item => item.name === itemName);

  if (itemIndex > -1) {
    // Item already exists, increment quantity
    cart[itemIndex].quantity += 1;
  } else {
    // Add new item to the cart
    cart.push({
      name: itemName,
      price: itemPrice,
      image: itemImage,
      quantity: 1
    });
  }
  updateCart();
}

// Subtract from Cart Function
function subtractFromCart(itemName) {
  const itemIndex = cart.findIndex(item => item.name === itemName);

  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      // Remove the item from the cart if quantity is 0
      cart.splice(itemIndex, 1);
    }
    updateCart();
  }
}

// Update Cart Display
function updateCart() {
  const cartSection = document.getElementById('cart-items');
  const totalCostElement = document.getElementById('total-cost');
  const cartCount = document.getElementById('cart-count');

  cartSection.innerHTML = '';
  totalCost = 0;

  cart.forEach(item => {
    totalCost += item.price * item.quantity;

    // Create cart item element
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>
        <div class="cart-item-actions">
          <button onclick="subtractFromCart('${item.name}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="addToCart('${item.name}', ${item.price}, '${item.image}')">+</button>
        </div>
      </div>
    `;
    cartSection.appendChild(cartItem);
  });

  // Update total cost and cart count
  totalCostElement.textContent = `Total: $${totalCost.toFixed(2)}`;
  cartCount.innerText = cart.length;
}

// Checkout Button
function goToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  document.getElementById('checkout-page').classList.remove('hidden');
  updateCart();
}

// Finalize Order
function finalizeOrder() {
  document.getElementById('checkout-page').classList.add('hidden');
  document.getElementById('glassmorphism-card').classList.remove('hidden');
}

// Return to Home
function returnToHome() {
  document.getElementById('glassmorphism-card').classList.add('hidden');
  cart = [];
  updateCart();
}
