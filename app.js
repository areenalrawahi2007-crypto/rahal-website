// منطق الموقع المشترك: السلة، البحث الحي، القائمة الجوالة، والتنبيهات (Toast)
// هذا الملف يعتمد على المتغيرات المعرّفة في data.js (CATEGORIES, PRODUCTS, SUPPLIERS)

const CART_KEY = 'rahalCart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadges();
}

function findProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

function setQty(id, qty) {
  const cart = readCart();
  if (qty <= 0) {
    delete cart[id];
  } else {
    cart[id] = qty;
  }
  writeCart(cart);
}

function removeFromCart(id) {
  const cart = readCart();
  delete cart[id];
  writeCart(cart);
}

function addToCart(id, qty = 1) {
  const cart = readCart();
  cart[id] = (cart[id] || 0) + qty;
  writeCart(cart);
}

function cartCount() {
  const cart = readCart();
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function updateCartBadges() {
  const count = cartCount();
  document.querySelectorAll('.js-cart-badge').forEach(badge => {
    badge.textContent = String(count);
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function highlightActiveNav() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[data-nav]').forEach(link => {
    const page = link.getAttribute('href');
    link.classList.toggle('active', page === current);
  });
}

function setupMobileDrawer() {
  const drawer = document.querySelector('.mobile-drawer');
  const toggleBtn = document.querySelector('.menu-toggle');
  const closeBtn = document.querySelector('.mobile-drawer .close-x');
  if (!drawer || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => drawer.classList.add('show'));
  if (closeBtn) closeBtn.addEventListener('click', () => drawer.classList.remove('show'));
  drawer.addEventListener('click', e => {
    if (e.target === drawer) drawer.classList.remove('show');
  });
}

function searchIndex(term) {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  const productMatches = PRODUCTS.filter(p =>
    (p.name + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q)
  ).slice(0, 6);
  return productMatches;
}

function setupSearch(input) {
  const wrap = input.closest('.nav-search, .m-search');
  const resultsBox = wrap ? wrap.querySelector('.search-results') : null;
  if (!resultsBox) return;

  function renderResults() {
    const matches = searchIndex(input.value);
    if (!matches.length) {
      resultsBox.classList.remove('show');
      resultsBox.innerHTML = '';
      return;
    }
    resultsBox.innerHTML = matches.map(p => {
      const category = CATEGORIES.find(c => c.id === p.category);
      const href = `${category.page}?q=${encodeURIComponent(p.name)}`;
      return `<a href="${href}"><span>${p.emoji}</span><span>${p.name}<br><small style="color:#8b9188">${category.name}</small></span></a>`;
    }).join('');
    resultsBox.classList.add('show');
  }

  input.addEventListener('input', renderResults);
  input.addEventListener('focus', renderResults);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) location.href = `equipment.html?q=${encodeURIComponent(q)}`;
    }
    if (e.key === 'Escape') resultsBox.classList.remove('show');
  });
  document.addEventListener('click', e => {
    if (!wrap.contains(e.target)) resultsBox.classList.remove('show');
  });
}

function setupAddToCartDelegation() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-btn');
    if (!btn) return;
    const id = btn.dataset.id;
    const product = findProduct(id);
    if (!product) return;
    addToCart(id, 1);
    showToast(`تمت إضافة "${product.name}" إلى السلة`);
    btn.classList.add('added');
    setTimeout(() => btn.classList.remove('added'), 900);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
  highlightActiveNav();
  setupMobileDrawer();
  setupAddToCartDelegation();
  document.querySelectorAll('.js-search-input').forEach(setupSearch);
});
