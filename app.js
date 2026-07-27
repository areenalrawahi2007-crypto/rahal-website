// منطق الموقع المشترك: السلة، البحث الحي، القائمة الجوالة، والتنبيهات (Toast)
// هذا الملف يعتمد على المتغيرات المعرّفة في data.js (CATEGORIES, PRODUCTS, SUPPLIERS)

const CART_KEY = 'rahalCart';
const CART_NOTES_KEY = 'rahalCartNotes';

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

// رموز الدول لحقول رقم الجوال بالموقع (التسجيل، الدفع، تسجيل الموردين) — عُمان +968 افتراضي
const COUNTRY_CODES = [
  { code: '968', name: 'عُمان' },
  { code: '971', name: 'الإمارات' },
  { code: '966', name: 'السعودية' },
  { code: '974', name: 'قطر' },
  { code: '973', name: 'البحرين' },
  { code: '965', name: 'الكويت' },
  { code: '20', name: 'مصر' },
  { code: '962', name: 'الأردن' },
  { code: '961', name: 'لبنان' },
  { code: '212', name: 'المغرب' },
  { code: '216', name: 'تونس' },
  { code: '213', name: 'الجزائر' },
  { code: '91', name: 'الهند' },
  { code: '92', name: 'باكستان' },
  { code: '63', name: 'الفلبين' },
  { code: '44', name: 'بريطانيا' },
  { code: '1', name: 'أمريكا/كندا' },
];

function countryCodeSelectHtml(id, selected) {
  const sel = selected || '968';
  const options = COUNTRY_CODES.map(c => `<option value="${c.code}"${c.code === sel ? ' selected' : ''}>+${c.code} ${c.name}</option>`).join('');
  return `<select id="${id}" class="country-code-select">${options}</select>`;
}

function setQty(id, qty) {
  const cart = readCart();
  if (qty <= 0) {
    delete cart[id];
    setCartNote(id, '');
  } else {
    cart[id] = qty;
  }
  writeCart(cart);
}

function removeFromCart(id) {
  const cart = readCart();
  delete cart[id];
  writeCart(cart);
  setCartNote(id, '');
}

// ملاحظات/حساسية حرة لكل عنصر بالسلة (تُستخدم لعناصر التموين، تُعرض بملخص الطلب)
function readCartNotes() {
  try {
    return JSON.parse(localStorage.getItem(CART_NOTES_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function setCartNote(id, note) {
  const notes = readCartNotes();
  if (note && note.trim()) {
    notes[id] = note.trim();
  } else {
    delete notes[id];
  }
  localStorage.setItem(CART_NOTES_KEY, JSON.stringify(notes));
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

// يفكّ وسمي #المحافظة #النوع بنهاية وصف الرحلة (نفس منطق trips.html) لعرضهما بنتائج البحث
function parseTripMetaForSearch(trip) {
  const m = trip.desc.match(/\s*#(\S+)\s*#(\S+)\s*$/);
  if (!m) return { desc: trip.desc, region: null, terrain: null };
  return { desc: trip.desc.slice(0, m.index).trim(), region: m[1], terrain: m[2] };
}

function searchIndex(term) {
  const q = term.trim().toLowerCase();
  if (!q) return [];
  return TRIPS.filter(t => {
    const meta = parseTripMetaForSearch(t);
    return (t.name + ' ' + meta.desc + ' ' + (meta.region || '') + ' ' + (meta.terrain || '')).toLowerCase().includes(q);
  }).slice(0, 6);
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
    resultsBox.innerHTML = matches.map(t => {
      const meta = parseTripMetaForSearch(t);
      const href = `trips.html?q=${encodeURIComponent(t.name)}`;
      return `<a href="${href}"><span>${t.emoji}</span><span>${t.name}<br><small style="color:#8b9188">${meta.region || ''} ${meta.terrain || ''}</small></span></a>`;
    }).join('');
    resultsBox.classList.add('show');
  }

  input.addEventListener('input', renderResults);
  input.addEventListener('focus', renderResults);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim();
      if (q) location.href = `trips.html?q=${encodeURIComponent(q)}`;
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
