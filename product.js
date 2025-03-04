const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

const productContainer = $('#product-container');
const loadingP = $('#loading');
const errorMsgP = $('#error');

(async function init() {
  loadingP.style.display = 'block';
  errorMsgP.textContent = '';
  productContainer.innerHTML = '';

  try {
    const product = await fetchProductById(productId);
    renderProductDetail(product);
  } catch (e) {
    console.error(e);
    errorMsgP.textContent = 'Failed to load product. Please try again later.';
  } finally {
    loadingP.style.display = 'none';
  }
})();

function renderProductDetail(product) {
  productContainer.innerHTML = `
    <div class="product-detail-card">
      <div class="image-zoom-container">
        <img src="${product.image}" alt="${product.title}" class="detail-img" id="main-img">
        <div class="zoom-lens" id="zoom-lens"></div>
      </div>
      <div class="detail-info">
        <h2>${product.title}</h2>
        <div class="price" id="product-price" data-base="${product.price}">
          $${formatUSD(product.price)}
        </div>
        <p>${product.description}</p>

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

        <div class="quantity">
          <button id="decrease">−</button>
          <span id="quantity">1</span>
          <button id="increase">+</button>
        </div>

        <div class="card-actions">
          <button id="add-to-cart" class="btn-primary">Add to Cart</button>
          <a class="btn-outline" href="cart.html">Go to Cart</a>
        </div>
        <p id="cart-feedback" class="feedback"></p>
      </div>
    </div>
  `;

  setupInteractions(product);
  enableImageZoom();
}

function setupInteractions(product) {
  const priceElem = $('#product-price');
  const qtyElem = $('#quantity');
  const feedbackElem = $('#cart-feedback');

  let quantity = 1;
  const basePrice = Number(priceElem.dataset.base);

  function updatePrice() {
    priceElem.textContent = `$${formatUSD(basePrice * quantity)}`;
  }

  $('#increase').addEventListener('click', () => {
    if (quantity < 10) {
      quantity++;
      qtyElem.textContent = quantity;
      updatePrice();
    }
  });

  $('#decrease').addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      qtyElem.textContent = quantity;
      updatePrice();
    }
  });

  $('#add-to-cart').addEventListener('click', () => {
    const size = $('#size').value;
    const color = $('#color').value;

    addToCart({
      id: product.id,
      name: product.title,
      image: product.image,
      price: basePrice,
      size,
      color,
      quantity
    });

    feedbackElem.textContent = 'Added to cart!';
    feedbackElem.classList.add('show');
    setTimeout(() => feedbackElem.classList.remove('show'), 1200);
  });
}

function enableImageZoom() {
  const img = $('#main-img');
  const lens = $('#zoom-lens');

  if (!img || !lens) return;

  img.addEventListener('mouseenter', () => (lens.style.display = 'block'));
  img.addEventListener('mouseleave', () => (lens.style.display = 'none'));
  img.addEventListener('mousemove', moveLens);

  function moveLens(e) {
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const lensSize = 120;
    lens.style.width = lensSize + 'px';
    lens.style.height = lensSize + 'px';

    let lx = x - lensSize / 2;
    let ly = y - lensSize / 2;
    lx = Math.max(0, Math.min(lx, rect.width - lensSize));
    ly = Math.max(0, Math.min(ly, rect.height - lensSize));

    lens.style.left = lx + 'px';
    lens.style.top = ly + 'px';
    lens.style.backgroundImage = `url(${img.src})`;
    lens.style.backgroundRepeat = 'no-repeat';
    lens.style.backgroundSize = (img.width * 2) + 'px ' + (img.height * 2) + 'px';
    lens.style.backgroundPosition = `-${(lx) * 2}px -${(ly) * 2}px`;
  }
}
