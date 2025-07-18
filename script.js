const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const cartBadge = document.querySelector('.cart-badge');

let cartCount = 0;

// Toggle mobile menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Fetch products from FakeStore API
async function loadProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const products = await res.json();

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <div class="info">
          <h3>${product.title.slice(0, 30)}...</h3>
          <p>$${product.price.toFixed(2)}</p>
          <button>Add to Cart</button>
        </div>
      `;

      // Handle Add to Cart
      card.querySelector('button').addEventListener('click', () => {
        cartCount++;
        cartBadge.textContent = cartCount;
      });

      productGrid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load products', err);
    productGrid.innerHTML = `<p>Error loading products. Try again later.</p>`;
  }
}

loadProducts();
