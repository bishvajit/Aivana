const cartItemsContainer = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotalElem = document.getElementById('cart-total');
const cartBadge = document.querySelector('.cart-badge');
const checkoutBtn = document.getElementById('checkout-btn');

loadCart();

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  updateCartBadge();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '';
    cartEmpty.style.display = 'block';
    document.getElementById('cart-summary').style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  document.getElementById('cart-summary').style.display = 'block';
  cartItemsContainer.innerHTML = '';

  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = (item.price * item.quantity);
    total += itemTotal;

    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.size}, Color: ${item.color}</p>
        <p>$${item.price.toFixed(2)} each</p>
        <div class="quantity-control">
          <button class="decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p class="item-total">Subtotal: $${itemTotal.toFixed(2)}</p>
      </div>
      <button class="remove" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalElem.textContent = total.toFixed(2);

  // Event Listeners for Quantity and Remove
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), 1));
  });

  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.index), -1));
  });

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.index)));
  });
}

function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  if (!cart[index]) return;

  cart[index].quantity += change;
  if (cart[index].quantity < 1) cart[index].quantity = 1;

  localStorage.setItem('cartItems', JSON.stringify(cart));
  loadCart();
}

function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cartItems', JSON.stringify(cart));
  loadCart();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalCount;
}

checkoutBtn.addEventListener('click', () => {
  alert('Checkout feature coming soon!');
});
