const orderItemsBox = $('#order-items');
const sumSubtotal = $('#sum-subtotal');
const sumTotal = $('#sum-total');
const form = $('#checkout-form');
const feedback = $('#order-feedback');

renderSummary();

function renderSummary() {
  const cart = getCart();
  orderItemsBox.innerHTML = '';
  if (!cart.length) {
    orderItemsBox.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    let subtotal = 0;
    cart.forEach(item => {
      const line = document.createElement('div');
      const lineTotal = item.price * item.quantity;
      subtotal += lineTotal;
      line.innerHTML = `
        <div>
          <strong>${item.name}</strong><br/>
          ${item.size} • ${item.color} × ${item.quantity}
        </div>
        <div>$${formatUSD(lineTotal)}</div>
      `;
      line.style.display = 'flex';
      line.style.justifyContent = 'space-between';
      orderItemsBox.appendChild(line);
    });
    sumSubtotal.textContent = formatUSD(subtotal);
    sumTotal.textContent = formatUSD(subtotal); // shipping free
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // pretend to place order
  const payload = {
    name: $('#name').value.trim(),
    phone: $('#phone').value.trim(),
    addr1: $('#addr1').value.trim(),
    addr2: $('#addr2').value.trim(),
    city: $('#city').value.trim(),
    zip: $('#zip').value.trim(),
    payment: $('#payment-method').value,
    items: getCart(),
    total: sumTotal.textContent
  };

  if (!payload.items.length) {
    feedback.textContent = 'Your cart is empty.';
    feedback.style.color = 'red';
    feedback.classList.add('show');
    return;
  }

  // Save a simple "order" to localStorage (mock)
  const orders = JSON.parse(localStorage.getItem('orders.v1') || '[]');
  orders.push({ id: Date.now(), ...payload, status: 'Pending' });
  localStorage.setItem('orders.v1', JSON.stringify(orders));

  // Clear cart
  clearCart();
  renderSummary();

  feedback.textContent = 'Order placed! (Demo) — Thank you.';
  feedback.style.color = 'green';
  feedback.classList.add('show');

  // Redirect to home after a moment
  setTimeout(() => { window.location.href = 'index.html'; }, 1200);
});
