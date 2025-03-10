const productGrid = $('#product-grid');
const loading = $('#loading');
const errorMsg = $('#error');

const searchInput = $('#search-input');
const categorySelect = $('#category-filter');
const priceRange = $('#price-range');
const priceValue = $('#price-value');
const clearFiltersBtn = $('#clear-filters');

let allProducts = [];
let filtered = [];

init();

async function init() {
  loading.style.display = 'block';
  errorMsg.textContent = '';
  productGrid.innerHTML = '';

  try {
    allProducts = await fetchProducts();
    buildCategoryFilter(allProducts);
    filtered = [...allProducts];
    renderProducts(filtered);
  } catch (e) {
    console.error(e);
    errorMsg.textContent = 'Failed to load products. Please try again later.';
  } finally {
    loading.style.display = 'none';
  }

  // events
  searchInput?.addEventListener('input', applyFilters);
  categorySelect?.addEventListener('change', applyFilters);
  priceRange?.addEventListener('input', () => {
    priceValue.textContent = `$${priceRange.value}`;
    applyFilters();
  });
  clearFiltersBtn?.addEventListener('click', clearFilters);
}

function buildCategoryFilter(products) {
  const categories = Array.from(new Set(products.map(p => p.category))).sort();
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat[0].toUpperCase() + cat.slice(1);
    categorySelect.appendChild(opt);
  });
}

function applyFilters() {
  const q = (searchInput.value || '').toLowerCase();
  const cat = categorySelect.value;
  const maxPrice = Number(priceRange.value);

  filtered = allProducts.filter(p => {
    const matchesText =
      p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const matchesCat = (cat === 'all') ? true : p.category === cat;
    const matchesPrice = Number(p.price) <= maxPrice;
    return matchesText && matchesCat && matchesPrice;
  });

  renderProducts(filtered);
}

function clearFilters() {
  if (searchInput) searchInput.value = '';
  if (categorySelect) categorySelect.value = 'all';
  if (priceRange) {
    priceRange.value = 1000;
    priceValue.textContent = '$1000';
  }
  applyFilters();
}

function renderProducts(products) {
  productGrid.innerHTML = '';
  if (!products.length) {
    productGrid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">No products found.</p>';
    return;
  }
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </a>
      <div class="info">
        <h3 title="${product.title}">${product.title.slice(0, 60)}${product.title.length>60?'…':''}</h3>
        <div class="price">$${formatUSD(product.price)}</div>
        <div class="card-actions">
          <a class="btn-outline" href="product.html?id=${product.id}">View</a>
          <button data-id="${product.id}" class="btn-add">Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  // add-to-cart buttons
  $all('.btn-add', productGrid).forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const prod = await fetchProductById(id);
      addToCart({
        id: prod.id,
        name: prod.title,
        image: prod.image,
        price: Number(prod.price),
        size: 'M',
        color: 'Blue',
        quantity: 1
      });
      btn.textContent = 'Added!';
      setTimeout(() => (btn.textContent = 'Add to Cart'), 1000);
    });
  });
}
