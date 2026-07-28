// مساعد "رحّال" الذكي — يفهم وصف رحلة العميل بلغته العادية ويقترح حقائب رحلات كاملة وحقيقية من الكتالوج (TRIPS بـdata.js)
// يحاول أولاً /api/ai-assistant على الباك اند (Claude API الفعلي)، ولو ما رد بسرعة أو ما كان متاحاً
// يرجع لمطابقة محلية بسيطة حسب الكلمات المفتاحية على نفس كتالوج TRIPS — بدون اختراع أي حقيبة وهمية.
(function () {
  const API_URL = 'https://rahal-backend-production.up.railway.app';
  const SESSION_KEY = 'rahalAssistantSession';
  const MAX_TURNS = 15;
  const MAX_HISTORY = 6;
  const BACKEND_TIMEOUT_MS = 4000;

  // الوسوم هنا هي أنواع الحقائب الثمانية بالضبط (نفس مفاتيح CATEGORIES_BAG بـ trips.html)
  const SYNONYMS = {
    'السيارة': ['سيارة', 'سياره', 'طريق طويل', 'رحلة سيارة', 'مشوار سيارة', 'car', 'road trip'],
    'البر': ['البر', 'سيح', 'سيحة', 'تخييم', 'مخيم', 'خيمة', 'خيام', 'كشته', 'كشتة', 'كمبينج', 'شوي', 'شواء', 'منقل', 'فحم', 'camping', 'bbq'],
    'الشاطئ': ['شاطئ', 'بحر', 'بحري', 'ساحل', 'سباحة', 'beach', 'sea'],
    'الوادي': ['وادي', 'ودي', 'ويدان', 'برك', 'wadi'],
    'الجبال': ['جبل', 'جبال', 'مشي', 'ترايكنق', 'trekking', 'مسير', 'هايكنق', 'mountain', 'hiking'],
    'السهول': ['سهول', 'سهل', 'نزهة', 'بيكنك', 'picnic', 'plains'],
    'التسلق': ['تسلق', 'climbing', 'صخور'],
    'الغوص': ['غوص', 'قناع', 'سنوركل', 'شنركل', 'زعانف', 'snorkel', 'diving'],
    'عائلي': ['عيال', 'أطفال', 'اطفال', 'عائلة', 'family', 'ولد', 'بنت', 'اولاد', 'أولاد'],
  };

  const NEG_TRIGGERS = ['بدون', 'بلا', 'ما احتاج', 'ما ابي', 'ما أبي', 'ما ابغى', 'مو محتاج'];

  // معرفة بأماكن مشهورة بعُمان — لربط اسم المكان بنوع الحقيبة المناسبة تلقائياً
  const PLACES = {
    'جبل شمس': ['الجبال'],
    'الجبل الأخضر': ['الجبال'],
    'جبل بني جبر': ['الجبال'],
    'جبل القرة': ['الجبال'],
    'جبل سمحان': ['الجبال'],
    'جبال الحجر': ['الجبال', 'التسلق'],
    'وادي شاب': ['الوادي'],
    'وادي بني خالد': ['الوادي'],
    'وادي درم': ['الوادي'],
    'وادي دايقة': ['الوادي'],
    'وادي طيوي': ['الوادي'],
    'وادي عربيين': ['الوادي'],
    'شاطئ القرم': ['الشاطئ'],
    'مسيرة': ['الشاطئ'],
    'الرمال البيضاء': ['الشاطئ'],
    'رأس الحد': ['الشاطئ'],
    'رأس الجنز': ['الشاطئ'],
    'رمال الشرقية': ['البر'],
    'ويهيبة': ['البر'],
    'جزيرة مصيرة': ['الشاطئ'],
    'جزر الديمانيات': ['الغوص', 'الشاطئ'],
    'صلالة': ['الجبال', 'الشاطئ'],
    'نزوى': ['الجبال', 'التسلق'],
    'صور': ['الشاطئ'],
    'مسقط': ['الشاطئ'],
    'صحار': ['الشاطئ'],
    'البريمي': ['البر'],
    'عبري': ['البر', 'الجبال'],
    'بهلاء': ['الجبال'],
    'الرستاق': ['الجبال'],
    'مسندم': ['الغوص', 'الشاطئ'],
    'خصب': ['الغوص', 'الشاطئ'],
    'الدقم': ['البر'],
  };

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
    Object.entries(PLACES).forEach(([place, tags]) => {
      if (text.includes(normalize(place))) tags.forEach(t => found.add(t));
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

  const REMOTE_RISK_CATEGORIES = new Set(['البر', 'الوادي', 'الجبال', 'التسلق']);

  // يفكّ وسمي #النوع #الحالة بنهاية وصف الحقيبة (نفس اصطلاح trips.html)
  function parseTripMeta(trip) {
    const m = trip.desc.match(/\s*#(\S+)\s*#(\S+)\s*$/);
    if (!m) return { desc: trip.desc, category: null, condition: 'جديد', remote: false };
    const category = m[1];
    const condition = m[2];
    return { desc: trip.desc.slice(0, m.index).trim(), category, condition, remote: REMOTE_RISK_CATEGORIES.has(category) };
  }

  function tripPrice(trip) {
    return trip.items.reduce((sum, item) => {
      const p = findProduct(item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function matchTrips(session) {
    const include = session.includeTags;
    const exclude = new Set(session.excludeTags);

    const scored = TRIPS.map(trip => {
      const meta = parseTripMeta(trip);
      if (meta.condition !== 'جديد') return { trip, score: -1 }; // المساعد يقترح الحقائب الجديدة فقط، المستعملة تُتصفّح يدوياً
      let score = 0;
      if (meta.category) {
        if (exclude.has(meta.category)) return { trip, score: -1 };
        if (include.includes(meta.category)) score += 3;
      }
      // تطابق إضافي حسب وسوم عناصر الحقيبة نفسها (أساسية/البر/الشاطئ...)
      const itemTags = new Set();
      trip.items.forEach(it => {
        const p = findProduct(it.id);
        if (p) p.tags.forEach(t => itemTags.add(t));
      });
      include.forEach(tag => {
        if (itemTags.has(tag) && !exclude.has(tag)) score += 1;
      });
      return { trip, score };
    })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, 6).map(x => x.trip);
  }

  function buildReason(trip, session) {
    const meta = parseTripMeta(trip);
    if (meta.category && session.includeTags.includes(meta.category)) return `مناسبة لـ${meta.category}`;
    return 'تكمّل احتياجات رحلتك';
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
        clarify: 'ما فهمت طلبك بالضبط 🙂 تقدر توضح أكثر؟ مثال: "بغيت حقيبة تخييم بالبر"، "حقيبة غوص"، "رايح جبل شمس"، "نزهة عائلية بالسهول"...',
      };
    }

    const trips = matchTrips(session);
    if (!trips.length) {
      return {
        clarify: 'ما لقيت حقيبة مطابقة بالضبط بالكتالوج الحالي. جرّب توصف احتياجك بطريقة ثانية أو تصفح كل الحقائب مباشرة.',
      };
    }

    return {
      items: trips.map(t => ({ trip_id: t.id, reason: buildReason(t, session) })),
    };
  }

  function isValidReply(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.clarify === 'string') return true;
    if (Array.isArray(data.items)) {
      return data.items.every(it => it && typeof it.trip_id === 'string' && TRIPS.some(t => t.id === it.trip_id));
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

    session.messages.push({ role: 'assistant', text: reply.clarify || `اقترحت ${reply.items ? reply.items.length : 0} حقيبة` });
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
    let hasRemote = false;
    let hasFloodRisk = false;
    const cards = items
      .map(item => {
        const t = TRIPS.find(x => x.id === item.trip_id);
        if (!t) return '';
        const meta = parseTripMeta(t);
        if (meta.remote) hasRemote = true;
        if (meta.category === 'الوادي' && isFloodRiskSeason()) hasFloodRisk = true;
        const badges = [
          meta.remote ? '<span class="trip-badge trip-badge-remote">📡 قد تكون وجهة نائية</span>' : '',
          meta.category === 'الوادي' && isFloodRiskSeason() ? '<span class="trip-badge trip-badge-flood">⚠️ تنبيه سيول</span>' : '',
        ].filter(Boolean).join('');
        return `
        <div class="assistant-card" data-id="${t.id}">
          <div class="product-media">${t.emoji}</div>
          <div class="product-body">
            <div class="product-cat">${escapeHtml(item.reason || '')}</div>
            <div class="product-name">${t.name}</div>
            ${badges ? `<div class="trip-badges">${badges}</div>` : ''}
            <div class="product-foot">
              <div class="price">من ${tripPrice(t)} ر.ع</div>
              <button class="ai-toggle-btn" data-id="${t.id}">أضف الحقيبة</button>
            </div>
          </div>
        </div>`;
      })
      .join('');
    const notes = [];
    if (hasFloodRisk) notes.push('⚠️ فيه حقيبة وادي بالاقتراحات، وهذا الوقت من السنة يزيد فيه احتمال السيول — تابع حالة الطقس قبل التحرك.');
    if (hasRemote) notes.push('📡 فيه حقيبة لوجهة نائية — بنطلب منك عند الدفع خطة رجوع آمنة (موعد رجوع وجهة اتصال طوارئ).');
    const noteHtml = notes.length ? `<p style="margin-top:8px;font-size:13px;color:var(--rust)">${notes.join('<br>')}</p>` : '';
    return `<div class="chat-bubble assistant"><p>هذي الحقائب اللي تناسب رحلتك:</p><div class="assistant-cards">${cards}</div>${noteHtml}</div>`;
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
      const trip = TRIPS.find(t => t.id === id);
      if (!trip) return;
      trip.items.forEach(item => addToCart(item.id, item.qty));
      if (parseTripMeta(trip).remote) addRemoteTripFlag(trip.name);
      btn.textContent = '✓ أُضيفت الحقيبة';
      btn.classList.add('added');
      btn.disabled = true;
      showToast(`تمت إضافة حقيبة "${trip.name}" إلى السلة`);
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
