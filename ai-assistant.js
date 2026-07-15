// مساعد "رحّال" الذكي — يفهم وصف رحلة العميل بلغته العادية ويقترح منتجات حقيقية من الكتالوج (data.js)
// يحاول أولاً /api/ai-assistant على الباك اند (Claude API الفعلي)، ولو ما رد بسرعة أو ما كان متاحاً
// يرجع لمطابقة محلية بسيطة حسب الكلمات المفتاحية على نفس كتالوج PRODUCTS — بدون اختراع أي منتج وهمي.
(function () {
  const API_URL = 'https://rahal-backend-production.up.railway.app';
  const SESSION_KEY = 'rahalAssistantSession';
  const MAX_TURNS = 15;
  const MAX_HISTORY = 6;
  const BACKEND_TIMEOUT_MS = 4000;

  const SYNONYMS = {
    'تخييم': ['تخييم', 'مخيم', 'خيمة', 'خيام', 'كشته', 'كشتة', 'كمبينج', 'كمبنج', 'camping'],
    'غوص': ['غوص', 'قناع', 'سنوركل', 'شنركل', 'snorkel', 'diving'],
    'تسلق': ['تسلق', 'climbing'],
    'مشي': ['مشي', 'ترايكنق', 'trekking', 'مسير', 'هايكنق'],
    'صيد': ['صيد', 'سمك', 'صياد', 'fishing'],
    'صحراء': ['صحراء', 'رمل', 'رمال', 'كثبان', 'desert'],
    'دفع رباعي': ['دفع رباعي', 'رباعي', '4x4', 'جيب'],
    'بحر': ['بحر', 'بحري', 'شاطئ', 'ساحل', 'sea', 'beach'],
    'قوارب': ['قارب', 'قوارب', 'boat'],
    'جبال': ['جبل', 'جبال', 'mountain'],
    'طرق برية': ['رحلة طويلة', 'road trip'],
    'عائلي': ['عيال', 'أطفال', 'اطفال', 'عائلة', 'family', 'ولد', 'بنت', 'اولاد', 'أولاد'],
    'مخيم': ['عشاء مخيم', 'بوفيه مخيم'],
    'إفطار': ['فطور', 'إفطار', 'breakfast'],
    'مؤن': ['مؤن', 'اكل', 'أكل', 'طعام', 'وجبات', 'مويه', 'مياه', 'ماء'],
    'معدات سلامة': ['أمان', 'سلامة', 'safety'],
    'بدلات': ['بدلة غوص', 'بدلة'],
    'دراجات': ['دراجة', 'دباب', 'bike', 'motorcycle'],
  };

  const NEG_TRIGGERS = ['بدون', 'بلا', 'ما احتاج', 'ما ابي', 'ما أبي', 'ما ابغى', 'مو محتاج'];

  function normalize(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[إأآا]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/[ًٌٍَُِّْ]/g, '')
      .trim();
  }

  function detectTags(rawText) {
    const text = normalize(rawText);
    const found = new Set();
    Object.entries(SYNONYMS).forEach(([tag, words]) => {
      if (words.some(w => text.includes(normalize(w)))) found.add(tag);
    });
    return found;
  }

  function detectNegatedTags(rawText) {
    const text = normalize(rawText);
    const negated = new Set();
    NEG_TRIGGERS.forEach(trigger => {
      const idx = text.indexOf(normalize(trigger));
      if (idx === -1) return;
      const after = text.slice(idx, idx + trigger.length + 24);
      Object.entries(SYNONYMS).forEach(([tag, words]) => {
        if (words.some(w => after.includes(normalize(w)))) negated.add(tag);
      });
    });
    return negated;
  }

  function loadSession() {
    try {
      const s = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      if (s) return s;
    } catch (e) {}
    return { turns: 0, includeTags: [], excludeTags: [], messages: [] };
  }

  function saveSession(session) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function resetSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function matchProducts(session) {
    const include = session.includeTags;
    const exclude = new Set(session.excludeTags);
    const scored = PRODUCTS
      .map(p => ({ p, score: p.tags.filter(t => include.includes(t) && !exclude.has(t)).length }))
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    const result = [];
    const perCategory = {};
    scored.forEach(({ p }) => {
      const count = perCategory[p.category] || 0;
      if (count >= 3 || result.length >= 6) return;
      result.push(p);
      perCategory[p.category] = count + 1;
    });
    return result;
  }

  function buildReason(p, session) {
    const matchedTag = p.tags.find(t => session.includeTags.includes(t));
    return matchedTag ? `مناسب لـ${matchedTag}` : 'يكمّل احتياجات رحلتك';
  }

  function localAssistantReply(message, session) {
    const newTags = detectTags(message);
    const negTags = detectNegatedTags(message);

    newTags.forEach(t => {
      if (!session.includeTags.includes(t)) session.includeTags.push(t);
    });
    negTags.forEach(t => {
      if (!session.excludeTags.includes(t)) session.excludeTags.push(t);
      session.includeTags = session.includeTags.filter(t2 => t2 !== t);
    });

    if (!session.includeTags.length) {
      return {
        clarify: 'ما فهمت طلبك بالضبط 🙂 تقدر توضح أكثر؟ مثال: "تخييم في الصحراء"، "غوص في مسقط"، "تسلق جبال"، "رحلة صيد بحرية"...',
      };
    }

    const products = matchProducts(session);
    if (!products.length) {
      return {
        clarify: 'ما لقيت عناصر مطابقة بالضبط بالكتالوج الحالي. جرّب توصف احتياجك بطريقة ثانية أو تصفح الأقسام مباشرة.',
      };
    }

    return {
      items: products.map(p => ({ product_id: p.id, category: p.category, reason: buildReason(p, session) })),
    };
  }

  function isValidReply(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.clarify === 'string') return true;
    if (Array.isArray(data.items)) {
      return data.items.every(it => it && typeof it.product_id === 'string' && findProduct(it.product_id));
    }
    return false;
  }

  async function fetchBackendReply(message, session) {
    if (typeof AbortController === 'undefined') return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);
    try {
      const res = await fetch(`${API_URL}/api/ai-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: session.messages.slice(-MAX_HISTORY) }),
        signal: controller.signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return isValidReply(data) ? data : null;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  async function askAssistant(message) {
    const session = loadSession();
    if (session.turns >= MAX_TURNS) {
      return { error: 'وصلت للحد الأقصى من الأسئلة بهالجلسة. حدّث الصفحة إذا تبي تبدأ محادثة جديدة.' };
    }
    session.turns += 1;
    session.messages.push({ role: 'user', text: message });
    session.messages = session.messages.slice(-MAX_HISTORY);

    let reply;
    try {
      reply = (await fetchBackendReply(message, session)) || localAssistantReply(message, session);
    } catch (e) {
      reply = { clarify: 'صار خلل بسيط، جرّب تكتبها بطريقة ثانية.' };
    }

    session.messages.push({ role: 'assistant', text: reply.clarify || `اقترحت ${reply.items ? reply.items.length : 0} عنصر` });
    session.messages = session.messages.slice(-MAX_HISTORY);
    saveSession(session);
    return reply;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderUserBubble(text) {
    return `<div class="chat-bubble user"><p>${escapeHtml(text)}</p></div>`;
  }

  function renderTyping() {
    return `<div class="chat-bubble assistant typing" id="assistantTyping"><span></span><span></span><span></span></div>`;
  }

  function renderMessage(text, isError) {
    return `<div class="chat-bubble assistant${isError ? ' error' : ''}"><p>${escapeHtml(text)}</p></div>`;
  }

  function renderCards(items) {
    const cart = readCart();
    const cards = items
      .map(item => {
        const p = findProduct(item.product_id);
        if (!p) return '';
        const inCart = !!cart[p.id];
        return `
        <div class="assistant-card" data-id="${p.id}">
          <div class="product-media">${p.emoji}</div>
          <div class="product-body">
            <div class="product-cat">${escapeHtml(item.reason || '')}</div>
            <div class="product-name">${p.name}</div>
            <div class="product-foot">
              <div class="price">${p.price} ر.ع <small>/ ${p.unit}</small></div>
              <button class="ai-toggle-btn${inCart ? ' added' : ''}" data-id="${p.id}">${inCart ? '✓ مضاف — احذف' : 'أضف للسلة'}</button>
            </div>
          </div>
        </div>`;
      })
      .join('');
    return `<div class="chat-bubble assistant"><p>هذا اللي يناسب رحلتك:</p><div class="assistant-cards">${cards}</div></div>`;
  }

  function setupAssistantUI() {
    const form = document.getElementById('assistantForm');
    if (!form) return;
    const input = document.getElementById('assistantInput');
    const thread = document.getElementById('assistantThread');
    const submitBtn = document.getElementById('assistantSubmit');

    thread.addEventListener('click', e => {
      const btn = e.target.closest('.ai-toggle-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      const p = findProduct(id);
      if (!p) return;
      const cart = readCart();
      if (cart[id]) {
        removeFromCart(id);
        btn.textContent = 'أضف للسلة';
        btn.classList.remove('added');
        showToast('تم الحذف من السلة');
      } else {
        addToCart(id, 1);
        btn.textContent = '✓ مضاف — احذف';
        btn.classList.add('added');
        showToast(`تمت إضافة "${p.name}" إلى السلة`);
      }
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text || submitBtn.disabled) return;

      thread.insertAdjacentHTML('beforeend', renderUserBubble(text));
      input.value = '';
      submitBtn.disabled = true;
      thread.insertAdjacentHTML('beforeend', renderTyping());
      thread.scrollTop = thread.scrollHeight;

      const reply = await askAssistant(text);

      const typingEl = document.getElementById('assistantTyping');
      if (typingEl) typingEl.remove();

      if (reply.error) {
        thread.insertAdjacentHTML('beforeend', renderMessage(reply.error, true));
      } else if (reply.clarify) {
        thread.insertAdjacentHTML('beforeend', renderMessage(reply.clarify, false));
      } else if (reply.items && reply.items.length) {
        thread.insertAdjacentHTML('beforeend', renderCards(reply.items));
      } else {
        thread.insertAdjacentHTML('beforeend', renderMessage('جرّب تكتبها بطريقة ثانية 🙂', true));
      }

      submitBtn.disabled = false;
      thread.scrollTop = thread.scrollHeight;
      input.focus();
    });
  }

  document.addEventListener('DOMContentLoaded', setupAssistantUI);

  window.RahalAssistant = { askAssistant, resetSession };
})();
