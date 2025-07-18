const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error');
const cartBadge = document.querySelector('.cart-badge');

let cartCount = 0;

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Fetch and Cache Products
async function fetchProducts() {
  loading.style.display = 'block';
  errorMsg.textContent = '';
  productGrid.innerHTML = '';

  try {
    // Check cache
    let products = JSON.parse(localStorage.getItem('cachedProducts'));

    if (!products) {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      products = await res.json();
      // Cache response
      localStorage.setItem('cachedProducts', JSON.stringify(products));
    }

    renderProducts(products);
  } catch (err) {
    console.error(err);
    errorMsg.textContent = 'Failed to load products. Please try again later.';
  } finally {
    loading.style.display = 'none';
  }
}

// Render products dynamically
function renderProducts(products) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" loading="lazy">
      <div class="info">
        <h3>${product.title.slice(0, 40)}...</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button>Add to Cart</button>
      </div>
    `;

    // Add to cart functionality
    card.querySelector('button').addEventListener('click', () => {
      cartCount++;
      cartBadge.textContent = cartCount;
    });

    productGrid.appendChild(card);
  });
}

// Initial fetch
fetchProducts();
