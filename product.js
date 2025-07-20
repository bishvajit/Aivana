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
  errorMsg.textContent = '';
  productContainer.innerHTML = '';

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
      <img src="${product.image}" alt="${product.title}" class="detail-img">
      <div class="detail-info">
        <h2>${product.title}</h2>
        <p class="price">$${product.price.toFixed(2)}</p>
        <p>${product.description}</p>
        <button id="add-to-cart">Add to Cart</button>
      </div>
    </div>
  `;

  document.getElementById('add-to-cart').addEventListener('click', () => {
    cartCount++;
    localStorage.setItem('cartCount', cartCount);
    cartBadge.textContent = cartCount;
  });
}

fetchProductDetails();
