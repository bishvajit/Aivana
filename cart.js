const cartItemsContainer = $('#cart-items');
const cartEmpty = $('#cart-empty');
const subtotalElem = $('#cart-subtotal');
const totalElem = $('#cart-total');

renderCart();

function renderCart() {
  const cart = getCart();

  if (!cart.length) {
    cartItemsContainer.innerHTML = '';
    cartEmpty.style.display = 'block';
    $('.cart-summary').style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  $('.cart-summary').style.display = 'block';
  cartItemsContainer.innerHTML = '';

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>
        <p>Size: ${item.size} • Color: ${item.color}</p>
        <p>$${formatUSD(item.price)} each</p>
        <div class="quantity-control">
          <button class="decrease" data-index="${index}">−</button>
          <span>${item.quantity}</span>
          <button class="increase" data-index="${index}">+</button>
        </div>
        <p class="item-total">Subtotal: $${formatUSD(itemTotal)}</p>
      </div>
      <button class="remove" data-index="${index}">Remove</button>
    `;
    cartItemsContainer.appendChild(div);
  });

  subtotalElem.textContent = formatUSD(subtotal);
  totalElem.textContent = formatUSD(subtotal); // shipping free

  // Bind events
  $all('.increase').forEach(btn =>
    btn.addEventListener('click', () => {
      updateQuantityByIndex(parseInt(btn.dataset.index, 10), +1);
      renderCart();
    })
  );

  $all('.decrease').forEach(btn =>
    btn.addEventListener('click', () => {
      updateQuantityByIndex(parseInt(btn.dataset.index, 10), -1);
      renderCart();
    })
  );

  $all('.remove').forEach(btn =>
    btn.addEventListener('click', () => {
      removeByIndex(parseInt(btn.dataset.index, 10));
      renderCart();
    })
  );
}
