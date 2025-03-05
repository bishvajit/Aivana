// ---- Constants
const LS_CART = 'cart.items.v1';
const LS_CACHE = 'cache.products.v1';

// ---- DOM helpers
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

// ---- Mobile nav
(function initNav() {
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('show'));
  }
})();

// ---- Storage
function getCart() {
  try { return JSON.parse(localStorage.getItem(LS_CART)) || []; }
  catch { return []; }
}
function setCart(cart) {
  localStorage.setItem(LS_CART, JSON.stringify(cart));
  updateCartBadge();
}
function clearCart() {
  localStorage.removeItem(LS_CART);
  updateCartBadge();
}
function updateCartBadge() {
  const badge = $('#cart-badge');
  if (!badge) return;
  const total = getCart().reduce((s, it) => s + it.quantity, 0);
  badge.textContent = total;
}
updateCartBadge();

// ---- Cart ops
function addToCart(item) {
  const cart = getCart();
  const keyMatch = (a, b) =>
    a.id === b.id && a.size === b.size && a.color === b.color;
  const existing = cart.find(c => keyMatch(c, item));
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setCart(cart);
}

function updateQuantityByIndex(index, delta) {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].quantity = Math.max(1, cart[index].quantity + delta);
  setCart(cart);
}

function removeByIndex(index) {
  const cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
}

// ---- API (with offline fallback)
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Casual T-Shirt",
    price: 19.99,
    description: "Soft cotton tee for everyday comfort.",
    category: "men's clothing",
    image: "https://via.placeholder.com/400x400?text=T-Shirt"
  },
  {
    id: 2,
    title: "Leather Handbag",
    price: 79.00,
    description: "Stylish handbag with multiple compartments.",
    category: "women's clothing",
    image: "https://via.placeholder.com/400x400?text=Handbag"
  },
  {
    id: 3,
    title: "Wireless Headphones",
    price: 129.50,
    description: "Noise-cancelling over-ear headphones.",
    category: "electronics",
    image: "https://via.placeholder.com/400x400?text=Headphones"
  },
  {
    id: 4,
    title: "Silver Ring",
    price: 45.00,
    description: "Minimal sterling silver ring.",
    category: "jewelery",
    image: "https://via.placeholder.com/400x400?text=Ring"
  }
];

async function fetchProducts() {
  // cache first
  const cached = localStorage.getItem(LS_CACHE);
  if (cached) {
    try { return JSON.parse(cached); } catch {}
  }
  // network
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    localStorage.setItem(LS_CACHE, JSON.stringify(data));
    return data;
  } catch {
    // fallback
    localStorage.setItem(LS_CACHE, JSON.stringify(MOCK_PRODUCTS));
    return MOCK_PRODUCTS;
  }
}

async function fetchProductById(id) {
  // try cache first
  try {
    const products = await fetchProducts();
    const found = products.find(p => String(p.id) === String(id));
    if (found) return found;
  } catch {}
  // network as backup
  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    if (!res.ok) throw new Error('Network error');
    return await res.json();
  } catch {
    // fallback from mock
    const found = MOCK_PRODUCTS.find(p => String(p.id) === String(id));
    if (found) return found;
    throw new Error('Product not found');
  }
}

// ---- Price helpers
function formatUSD(num) {
  return Number(num).toFixed(2);
}
