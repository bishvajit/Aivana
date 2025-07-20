const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const loading = document.getElementById('loading');
const errorMsg = document.getElementById('error');
const cartBadge = document.querySelector('.cart-badge');

let cartCount = JSON.parse(localStorage.getItem('cartCount')) || 0;
cartBadge.textContent = cartCount;

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Fetch and cache products
async function fetchProducts() {
  loading.style.display = 'block';
  errorMsg.textContent = '';
  productGrid.innerHTML = '';

  try {
    let products = JSON.parse(localStorage.getItem('cachedProducts'));

    if (!products) {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      products = await res.json();
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

// Render product cards
function renderProducts(products) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </a>
      <div class="info">
        <h3>${product.title.slice(0, 40)}...</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button>Add to Cart</button>
      </div>
    `;

    // Add to cart functionality
    card.querySelector('button').addEventListener('click', () => {
      cartCount++;
      localStorage.setItem('cartCount', cartCount);
      cartBadge.textContent = cartCount;
    });

    productGrid.appendChild(card);
  });
}

fetchProducts();
