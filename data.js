// بيانات الموقع — نسخة مرجعية محلية فقط للتوثيق والتطوير المحلي.
// الموقع الحي يحمّل data.js من خادم رحال على Railway (يُدار عبر لوحة الإدارة admin.html)،
// فأي تعديل هنا لا ينعكس على الموقع الفعلي إلا إذا طُبّق أيضاً من لوحة الإدارة.

const CATEGORIES = [
  { id: 'trips', page: 'trips.html', name: 'الرحلات المجهزة', desc: 'حزم جاهزة تجمع كل اللي تحتاجه من معدات ومركبات وطعام', icon: 'trips' },
  { id: 'equipment', page: 'equipment.html', name: 'المعدات', desc: 'معدات غوص وتخييم ورحلات براً وبحراً', icon: 'equipment' },
  { id: 'vehicles', page: 'vehicles.html', name: 'المركبات', desc: 'دفع رباعي، دراجات، وقوارب للإيجار', icon: 'vehicles' },
  { id: 'food', page: 'food.html', name: 'التموين والطعام', desc: 'وجبات ومؤن جاهزة لرحلات الغوص والبر', icon: 'food' },
];

const CATEGORY_SVG = {
  trips: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 7h-3V5a2 2 0 0 0-2-2h-6a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z"/><path d="M9 5h6M3 12h18"/></svg>`,
  equipment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20.4 14.5L16 10.1a2 2 0 0 0-2.8 0l-.7.7a2 2 0 0 0 0 2.8l4.4 4.4"/><path d="M3.6 9.5L8 13.9a2 2 0 0 0 2.8 0l.7-.7a2 2 0 0 0 0-2.8L7.1 6"/><path d="M14 5l5 5M5 14l5 5"/></svg>`,
  vehicles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 13l1.6-4.8A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13"/><path d="M3 13h18v4a1 1 0 0 1-1 1h-1a2 2 0 1 1-4 0H8a2 2 0 1 1-4 0H3a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z"/></svg>`,
  food: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2v6a2 2 0 0 0 2 2v12M6 2v10M10 2v6a2 2 0 0 1-2 2M18 2c-2 0-3 2-3 5v4a2 2 0 0 0 2 2h1v9"/></svg>`,
};

const PRODUCTS = [
  // ---- معدات (equipment) ----
  { id: 'e1', category: 'equipment', name: 'قناع غوص + شنركل احترافي', desc: 'رؤية واسعة وزجاج مقاوم للبخار، مناسب للغوص السطحي والعميق.', price: 8, unit: 'القطعة', emoji: '🤿', tags: ['غوص', 'معدات سلامة'] },
  { id: 'e2', category: 'equipment', name: 'بدلة غوص 3mm', desc: 'تحافظ على دفء الجسم في مياه عُمان طوال العام.', price: 12, unit: 'القطعة', emoji: '🥽', tags: ['غوص', 'بدلات'] },
  { id: 'e3', category: 'equipment', name: 'اسطوانة أكسجين + منظم', desc: 'اسطوانة مفحوصة مع منظم غوص معتمد.', price: 18, unit: 'القطعة', emoji: '🫧', tags: ['غوص', 'معدات سلامة'] },
  { id: 'e4', category: 'equipment', name: 'خيمة تخييم 4 أشخاص', desc: 'خيمة شكل قبة (Dome)، تتسع لـ4 أشخاص، مقاومة للرياح والمطر، تركيب خلال دقائق.', price: 15, unit: 'القطعة', emoji: '⛺', tags: ['تخييم'] },
  { id: 'e5', category: 'equipment', name: 'كيس نوم صحراوي', desc: 'كيس نوم مضغوط (كيس حمل 25×15 سم)، مناسب لدرجات حرارة حتى 5°م، جيد للصحراء والجبال ليلاً.', price: 6, unit: 'القطعة', emoji: '🛌', tags: ['تخييم'] },
  { id: 'e6', category: 'equipment', name: 'موقد غاز محمول + وقود', desc: 'طبخ سريع أثناء الرحلة، يشمل أسطوانة غاز واحدة.', price: 7, unit: 'القطعة', emoji: '🔥', tags: ['تخييم', 'طبخ'] },
  { id: 'e7', category: 'equipment', name: 'حبل تسلق معتمد 30م', desc: 'شهادة فحص سلامة سارية، مناسب لتسلق الجبال.', price: 10, unit: 'القطعة', emoji: '🧗', tags: ['تسلق', 'معدات سلامة'] },
  { id: 'e8', category: 'equipment', name: 'حزام أمان + خوذة تسلق', desc: 'طقم كامل معتمد لأمان التسلق.', price: 9, unit: 'القطعة', emoji: '⛑️', tags: ['تسلق', 'معدات سلامة'] },
  { id: 'e9', category: 'equipment', name: 'عدة صيد بحري كاملة', desc: 'سنارة، خيط، وطعم صناعي لرحلات الصيد الساحلي.', price: 11, unit: 'القطعة', emoji: '🎣', tags: ['صيد'] },
  { id: 'e10', category: 'equipment', name: 'كشاف رأس LED', desc: 'إضاءة قوية بدون استخدام اليدين، بطارية تدوم 20 ساعة.', price: 4, unit: 'القطعة', emoji: '🔦', tags: ['تخييم', 'معدات سلامة'] },
  { id: 'e11', category: 'equipment', name: 'حقيبة ظهر رحلات 60L', desc: 'مقاومة للماء مع دعم للظهر لرحلات المشي الطويلة.', price: 9, unit: 'القطعة', emoji: '🎒', tags: ['مشي', 'تخييم'] },
  { id: 'e12', category: 'equipment', name: 'زعانف غوص احترافية', desc: 'دفع أقوى وجهد أقل تحت الماء.', price: 6, unit: 'القطعة', emoji: '🦶', tags: ['غوص'] },
  { id: 'e13', category: 'equipment', name: 'خيمة تخييم نفق شخصين', desc: 'خيمة شكل نفق (Tunnel)، تتسع لشخصين، خفيفة وسريعة التركيب.', price: 10, unit: 'القطعة', emoji: '⛺', tags: ['تخييم'] },
  { id: 'e14', category: 'equipment', name: 'فانوس تخييم LED قابل للشحن', desc: 'إضاءة قوية للخيمة بالكامل، بطارية قابلة للشحن تدوم ليلتين.', price: 5, unit: 'القطعة', emoji: '🏮', tags: ['تخييم'] },
  { id: 'e15', category: 'equipment', name: 'ولاعة سفرية مقاومة للرياح', desc: 'ولاعة بلازما تشتغل بأجواء الرياح، مناسبة لإشعال الموقد والفحم.', price: 2, unit: 'القطعة', emoji: '🔥', tags: ['تخييم'] },
  { id: 'e16', category: 'equipment', name: 'عيدان كبريت مقاومة للماء (علبة)', desc: 'علبة عيدان كبريت لا تنطفئ بالرطوبة، أساسية لأي رحلة تخييم.', price: 1, unit: 'القطعة', emoji: '🔥', tags: ['تخييم'] },
  { id: 'e17', category: 'equipment', name: 'منشار تخييم قابل للطي', desc: 'لقطع الحطب وتجهيز موقع النار، مقبض مريح وشفرة حادة.', price: 4, unit: 'القطعة', emoji: '🪚', tags: ['تخييم'] },
  { id: 'e18', category: 'equipment', name: 'حصيرة أرضية عازلة للرطوبة', desc: 'تُفرش تحت الخيمة أو كيس النوم لعزل البرودة والرطوبة عن الأرض.', price: 5, unit: 'القطعة', emoji: '🧺', tags: ['تخييم'] },
  { id: 'e19', category: 'equipment', name: 'وسادة نفخ للتخييم', desc: 'وسادة قابلة للنفخ والطي، حجم صغير بحقيبة الظهر.', price: 3, unit: 'القطعة', emoji: '🛏️', tags: ['تخييم'] },
  { id: 'e20', category: 'equipment', name: 'طاولة تخييم قابلة للطي', desc: 'طاولة خفيفة الوزن تكفي لـ4 أشخاص، تُطوى بحقيبة صغيرة.', price: 8, unit: 'القطعة', emoji: '🪑', tags: ['تخييم'] },
  { id: 'e21', category: 'equipment', name: 'كرسي تخييم قابل للطي', desc: 'كرسي مريح بمسند ذراعين، خفيف وسهل الحمل.', price: 4, unit: 'القطعة', emoji: '🪑', tags: ['تخييم'] },
  { id: 'e22', category: 'equipment', name: 'صندوق تبريد متنقل 25 لتر', desc: 'يحافظ على برودة الأكل والمشروبات حتى 24 ساعة.', price: 12, unit: 'القطعة', emoji: '🧊', tags: ['تخييم'] },
  { id: 'e23', category: 'equipment', name: 'شبكة ناموسية للخيمة', desc: 'حماية من الحشرات أثناء النوم بالمخيم.', price: 3, unit: 'القطعة', emoji: '🦟', tags: ['تخييم'] },
  { id: 'e24', category: 'equipment', name: 'طقم قدور طبخ تخييم (3 قطع)', desc: 'قدور وأواني خفيفة قابلة للتكديس، مناسبة للطبخ بالموقد المحمول.', price: 9, unit: 'القطعة', emoji: '🍲', tags: ['تخييم', 'طبخ'] },
  { id: 'e25', category: 'equipment', name: 'سترة نجاة معتمدة', desc: 'سترة نجاة بمقاسات متعددة، أساسية لأي نشاط بحري (غوص، قوارب، جت سكي).', price: 7, unit: 'القطعة', emoji: '🦺', tags: ['بحر', 'معدات سلامة'] },
  { id: 'e26', category: 'equipment', name: 'عوامة غوص سطحية للأمان', desc: 'تُربط بالغطاس لتنبيه القوارب المارة وتحديد موقعه على السطح.', price: 5, unit: 'القطعة', emoji: '🟠', tags: ['غوص', 'معدات سلامة'] },
  { id: 'e27', category: 'equipment', name: 'حذاء تسلق جبلي', desc: 'نعل قوي ماسك للصخور، دعم كاحل للمسارات الوعرة.', price: 14, unit: 'القطعة', emoji: '🥾', tags: ['تسلق'] },
  { id: 'e28', category: 'equipment', name: 'ونش استرجاع كهربائي 4x4', desc: 'قدرة سحب حتى 4.5 طن، لإخراج المركبات العالقة بالرمل أو الطين.', price: 45, unit: 'القطعة', emoji: '🪝', tags: ['صحراء', 'دفع رباعي'] },
  { id: 'e29', category: 'equipment', name: 'ألواح استرجاع من الرمل (زوج)', desc: 'ألواح تركيب تحت الإطار العالق بالرمل لاستعادة الجر بسرعة.', price: 16, unit: 'القطعة', emoji: '🟧', tags: ['صحراء', 'دفع رباعي'] },
  { id: 'e30', category: 'equipment', name: 'ضاغط هواء لإطارات السيارة', desc: 'لضبط ضغط الإطارات قبل وبعد القيادة بالرمال (تنزيل/تعبئة الهواء).', price: 10, unit: 'القطعة', emoji: '💨', tags: ['صحراء', 'دفع رباعي'] },
  { id: 'e31', category: 'equipment', name: 'طقم إصلاح إطارات طارئ', desc: 'رقع وغراء ومضخة يدوية لإصلاح ثقب الإطار بالطريق أو الصحراء.', price: 6, unit: 'القطعة', emoji: '🔧', tags: ['صحراء', 'دفع رباعي'] },
  { id: 'e32', category: 'equipment', name: 'حبل جر وسحب معتمد 5 طن', desc: 'حبل قطر مقوّى مع خطافات معدنية، لسحب مركبة عالقة بأمان.', price: 8, unit: 'القطعة', emoji: '🪢', tags: ['صحراء', 'دفع رباعي'] },

  // ---- مركبات (vehicles) ----
  { id: 'v1', category: 'vehicles', name: 'جيب دفع رباعي 4x4', desc: 'مناسب للكثبان الرملية والطرق الجبلية الوعرة.', price: 45, unit: 'اليوم', emoji: '🚙', tags: ['صحراء', 'دفع رباعي'] },
  { id: 'v2', category: 'vehicles', name: 'دراجة نارية جبلية', desc: 'خفيفة وسريعة لمسارات الجبال الضيقة.', price: 30, unit: 'اليوم', emoji: '🏍️', tags: ['جبال', 'دراجات'] },
  { id: 'v3', category: 'vehicles', name: 'قارب صيد صغير', desc: 'يتسع لـ4 أشخاص، مناسب للصيد والرحلات الساحلية القصيرة.', price: 55, unit: 'اليوم', emoji: '🚤', tags: ['بحر', 'قوارب'] },
  { id: 'v4', category: 'vehicles', name: 'جت سكي', desc: 'متعة سرعة على الشاطئ، يشمل سترة نجاة.', price: 35, unit: 'الساعة', emoji: '🛥️', tags: ['بحر'] },
  { id: 'v5', category: 'vehicles', name: 'فان كرافان مجهز', desc: 'يشمل أسرّة وتجهيزات مطبخ صغيرة، مناسب للرحلات الطويلة.', price: 60, unit: 'اليوم', emoji: '🚐', tags: ['طرق برية', 'عائلي'] },
  { id: 'v6', category: 'vehicles', name: 'دراجة جبلية هوائية', desc: 'مناسبة لمسارات الطبيعة والمحميات.', price: 12, unit: 'اليوم', emoji: '🚵', tags: ['جبال', 'دراجات'] },
  { id: 'v7', category: 'vehicles', name: 'كاياك فردي', desc: 'خفيف وسهل التحكم للأنهار الهادئة والسواحل.', price: 14, unit: 'اليوم', emoji: '🛶', tags: ['بحر', 'قوارب'] },
  { id: 'v8', category: 'vehicles', name: 'سكوتر كهربائي للطرق', desc: 'مناسب للتنقل داخل المخيمات والمناطق السياحية.', price: 10, unit: 'اليوم', emoji: '🛴', tags: ['طرق برية'] },
  { id: 'v9', category: 'vehicles', name: 'حافلة صغيرة (ميني باص) 15 راكب', desc: 'مناسبة للمجموعات الكبيرة والرحلات العائلية الجماعية، مع سائق.', price: 90, unit: 'اليوم', emoji: '🚌', tags: ['نقل جماعي', 'عائلي'] },
  { id: 'v10', category: 'vehicles', name: 'فان نقل جماعي كبير 12 راكب', desc: 'فان واسع للعائلات الكبيرة أو المجموعات، مساحة أمتعة إضافية.', price: 70, unit: 'اليوم', emoji: '🚐', tags: ['نقل جماعي', 'عائلي'] },
  { id: 'v11', category: 'vehicles', name: 'قارب سياحي عادي (Boat)', desc: 'قارب رحلات بحرية عادي يتسع لعدة أشخاص، مناسب للتنزه الساحلي.', price: 50, unit: 'اليوم', emoji: '⛵', tags: ['بحر', 'قوارب'] },
  { id: 'v12', category: 'vehicles', name: 'قارب سريع (Speedboat)', desc: 'قارب عالي السرعة للرحلات البحرية القصيرة والمغامرات.', price: 75, unit: 'اليوم', emoji: '🚤', tags: ['بحر', 'قوارب'] },
  { id: 'v13', category: 'vehicles', name: 'يخت فاخر (Yacht)', desc: 'يخت مجهز للرحلات البحرية الفاخرة والمناسبات الخاصة.', price: 180, unit: 'اليوم', emoji: '🛳️', tags: ['بحر', 'قوارب'] },

  // ---- تموين وطعام (food) ----
  { id: 'f1', category: 'food', name: 'وجبة مخيم عشاء فاخر', desc: 'تشمل: لحم مشوي، دجاج مشوي، أرز عماني، سلطة، خبز رقاق، وتمر للتحلية — جاهزة للتقديم بالمخيم.', price: 9, unit: 'الشخص', emoji: '🍖', tags: ['مخيم'] },
  { id: 'f2', category: 'food', name: 'صندوق مؤن رحلة 3 أيام', desc: 'يحتوي: أرز جاهز، معكرونة سريعة، تونة معلبة، فول، تمر، بسكويت، وشاي/قهوة فورية — يكفي لشخصين لمدة 3 أيام.', price: 25, unit: 'الصندوق', emoji: '📦', tags: ['مؤن'] },
  { id: 'f3', category: 'food', name: 'بوفيه إفطار مخيم', desc: 'يشمل: بيض، خبز رقاق، عسل، لبنة، زيتون، رب التمر، وشاهي كرك — إفطار عماني تقليدي كامل يوصّل لموقع المخيم.', price: 7, unit: 'الشخص', emoji: '🥙', tags: ['مخيم', 'إفطار'] },
  { id: 'f4', category: 'food', name: 'صندوق ماء وعصائر', desc: '24 عبوة مياه 330 مل + 12 عبوة عصير طبيعي (برتقال وتفاح) للرحلة.', price: 6, unit: 'الصندوق', emoji: '🧃', tags: ['مؤن'] },
  { id: 'f5', category: 'food', name: 'وجبة غوص خفيفة', desc: 'سناك يشمل: شيبس + عصير + تمر — طاقة سريعة مناسبة بين جلسات الغوص.', price: 5, unit: 'الشخص', emoji: '🥪', tags: ['غوص', 'مؤن'] },
  { id: 'f6', category: 'food', name: 'شواء بحري طازج', desc: 'أسماك طازجة (هامور أو كنعد حسب التوفر) مشوية على الفحم مع أرز وسلطة، تُحضّر عند الطلب.', price: 14, unit: 'الشخص', emoji: '🐟', tags: ['بحر', 'مخيم'] },
  { id: 'f7', category: 'food', name: 'سناك خفيف للرحلة', desc: 'يشمل: شيبس + عصير + تمر — سناك سريع لأي وقت بالرحلة.', price: 3, unit: 'الشخص', emoji: '🍿', tags: ['مؤن'] },
];

const SUPPLIERS = [
  { id: 's1', name: 'مغامرات ظفار', category: 'equipment', initials: 'مظ', rating: 4.8, city: 'صلالة', tags: ['تسلق', 'تخييم'] },
  { id: 's2', name: 'بحّار للمغامرات', category: 'equipment', initials: 'بم', rating: 4.7, city: 'مسقط', tags: ['غوص'] },
  { id: 's3', name: 'مارين رنتال', category: 'vehicles', initials: 'مر', rating: 4.6, city: 'مسقط', tags: ['قوارب', 'بحر'] },
  { id: 's4', name: 'رحلات الرمال', category: 'vehicles', initials: 'رر', rating: 4.9, city: 'الشرقية', tags: ['صحراء', 'دفع رباعي'] },
  { id: 's5', name: 'طاسة للتموين', category: 'food', initials: 'طت', rating: 4.5, city: 'مسقط', tags: ['مخيم', 'مؤن'] },
  { id: 's6', name: 'زاد الرحّالة', category: 'food', initials: 'زر', rating: 4.7, city: 'نزوى', tags: ['مؤن'] },
];

// رحلات مجهزة: كل رحلة عبارة عن حزمة من نفس منتجات المتجر (معدات/مركبات/طعام) لا خدمات جديدة.
// items تشير لمعرّفات PRODUCTS الموجودة أعلاه — العميل يقدر يحذف أو يضيف عناصر من نفس الحزمة قبل الإضافة للسلة (تصفح trips.html).
const TRIPS = [
  {
    id: 't1',
    name: 'رحلة تخييم صحراوية',
    days: 3,
    emoji: '🏜️',
    desc: 'خيمة، مبيت، مركبة دفع رباعي، ومؤن جاهزة لثلاثة أيام في الصحراء.',
    items: [
      { id: 'e4', qty: 1 },
      { id: 'e5', qty: 2 },
      { id: 'e6', qty: 1 },
      { id: 'e10', qty: 1 },
      { id: 'v1', qty: 1 },
      { id: 'f2', qty: 1 },
      { id: 'f4', qty: 1 },
    ],
  },
  {
    id: 't2',
    name: 'رحلة غوص ساحل مسقط',
    days: 1,
    emoji: '🤿',
    desc: 'معدات غوص كاملة لشخصين مع قارب وسناكات طاقة بين الجلسات.',
    items: [
      { id: 'e1', qty: 2 },
      { id: 'e2', qty: 2 },
      { id: 'e3', qty: 2 },
      { id: 'e12', qty: 2 },
      { id: 'v3', qty: 1 },
      { id: 'f5', qty: 2 },
    ],
  },
  {
    id: 't3',
    name: 'رحلة تسلق جبال الحجر',
    days: 2,
    emoji: '🧗',
    desc: 'معدات تسلق آمنة لشخصين مع وجبات عشاء مخيم لليلتين.',
    items: [
      { id: 'e7', qty: 1 },
      { id: 'e8', qty: 2 },
      { id: 'e11', qty: 2 },
      { id: 'e10', qty: 2 },
      { id: 'f1', qty: 2 },
    ],
  },
  {
    id: 't4',
    name: 'رحلة صيد وشواء بحري',
    days: 1,
    emoji: '🎣',
    desc: 'يوم صيد كامل بقارب مع عدة صيد وشواء بحري طازج على الشاطئ.',
    items: [
      { id: 'e9', qty: 2 },
      { id: 'v3', qty: 1 },
      { id: 'f6', qty: 2 },
    ],
  },
];
