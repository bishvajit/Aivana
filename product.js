const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');
const productContainer = document.getElementById('product-container');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error');
const cartBadge = document.querySelector('.cart-badge');

let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
cartBadge.textContent = cartCount;

async function fetchProductDetails() {
  loading.style.display = 'block';
  try {
    const cachedProducts = JSON.parse(localStorage.getItem('cachedProducts')) || [];
    let product = cachedProducts.find(p => p.id == productId);

    if (!product) {
      const res = await fetch(`https://fakestoreapi.com/products/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product details');
      product = await res.json();
    }

    renderProductDetail(product);
  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Failed to load product. Please try again later.';
  } finally {
    loading.style.display = 'none';
  }
}

function renderProductDetail(product) {
  productContainer.innerHTML = `
    <div class="product-detail-card">
      <div class="image-zoom-container">
        <img src="${product.image}" alt="${product.title}" class="detail-img" id="main-img">
        <div class="zoom-lens" id="zoom-lens"></div>
      </div>
      <div class="detail-info">
        <h2>${product.title}</h2>
        <p class="price" id="product-price" data-base="${product.price}">
          $${product.price.toFixed(2)}
        </p>
        <p>${product.description}</p>

        <!-- Variations -->
        <div class="variation">
          <label for="size">Size:</label>
          <select id="size">
            <option value="S">Small</option>
            <option value="M" selected>Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        <div class="variation">
          <label for="color">Color:</label>
          <select id="color">
            <option value="Red">Red</option>
            <option value="Blue" selected>Blue</option>
            <option value="Black">Black</option>
          </select>
        </div>

        <!-- Quantity -->
        <div class="quantity">
          <button id="decrease">−</button>
          <span id="quantity">1</span>
          <button id="increase">+</button>
        </div>

        <!-- Add to Cart -->
        <button id="add-to-cart">Add to Cart</button>
        <p id="cart-feedback" class="feedback"></p>
      </div>
    </div>
  `;

  setupInteractions(product.price);
  enableImageZoom();
}

function setupInteractions(basePrice) {
  const priceElem = document.getElementById('product-price');
  const quantityElem = document.getElementById('quantity');
  const feedbackElem = document.getElementById('cart-feedback');

  let quantity = 1;

  function updatePrice() {
    const total = basePrice * quantity;
    priceElem.textContent = `$${total.toFixed(2)}`;
  }

  document.getElementById('increase').addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      quantityElem.textContent = quantity;
      updatePrice();
    }
  });

  document.getElementById('decrease').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityElem.textContent = quantity;
      updatePrice();
    }
  });

  document.getElementById('add-to-cart').addEventListener('click', () => {
    cartCount += quantity;
    localStorage.setItem('cartCount', cartCount);
    cartBadge.textContent = cartCount;

    // Save product selection to cart storage
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const size = document.getElementById('size').value;
    const color = document.getElementById('color').value;

    cartItems.push({
      productId,
      quantity,
      size,
      color,
      price: basePrice * quantity
    });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    feedbackElem.textContent = 'Added to cart!';
    feedbackElem.classList.add('show');
    setTimeout(() => feedbackElem.classList.remove('show'), 1500);
  });
}

// Add item to localStorage cart
function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];

  // Check if this product (with same variation) already exists
  const existingItem = cart.find(cartItem =>
    cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
  );

  if (existingItem) {
    existingItem.quantity += item.quantity; // update quantity
  } else {
    cart.push(item);
  }

  localStorage.setItem('cartItems', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalCount;
}

function enableImageZoom() {
  const img = document.getElementById('main-img');
  const lens = document.getElementById('zoom-lens');

  img.addEventListener('mousemove', moveLens);
  img.addEventListener('mouseleave', () => lens.style.display = 'none');
  img.addEventListener('mouseenter', () => lens.style.display = 'block');

  function moveLens(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 100;
    lens.style.width = lensSize + 'px';
    lens.style.height = lensSize + 'px';
    lens.style.left = (x - lensSize / 2) + 'px';
    lens.style.top = (y - lensSize / 2) + 'px';
    lens.style.backgroundImage = `url(${img.src})`;
    lens.style.backgroundRepeat = 'no-repeat';
    lens.style.backgroundSize = (img.width * 2) + 'px ' + (img.height * 2) + 'px';
    lens.style.backgroundPosition = `-${x * 2 - lensSize / 2}px -${y * 2 - lensSize / 2}px`;
  }
}

fetchProductDetails();

