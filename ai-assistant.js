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
    'السيارة': ['سيارة', 'سياره', 'طريق طويل', 'رحلة سيارة', 'مشوار سيارة', 'مشوار', 'سفرة', 'سفره', 'دفع رباعي', 'فورباي', 'برية بالسيارة', 'car', 'road trip'],
    'البر': [
      'البر', 'سيح', 'سيحة', 'سيحه', 'تخييم', 'مخيم', 'خيمة', 'خيمه', 'خيام', 'كشته', 'كشتة', 'كمبينج',
      'شوي', 'شواء', 'منقل', 'فحم', 'فحمة', 'فحمه', 'شاوية', 'شاويه', 'مشاكيك', 'مشكاك', 'اسياخ', 'أسياخ', 'سيخ',
      'ولاعة', 'ولاعه', 'شخط', 'صحراء', 'رمال', 'كثبان',
      'طلعة', 'طلعه', 'نطلع', 'طلعة بر', 'وناسة', 'وناسه',
      'اجلس', 'أجلس', 'جلسة', 'جلسه', 'نجلس',
      // كلمات تصنيف عامة لمعالم — أي مكان اسمه يبدأ فيها يتصنّف تلقائياً حتى لو مو مذكور بالاسم بقائمة PLACES
      'حصن', 'قلعة', 'سوق', 'مغارة', 'كهف',
      'camping', 'bbq'
    ],
    'الشاطئ': ['شاطئ', 'شاطي', 'بحر', 'بحري', 'ساحل', 'ساحلية', 'ساحليه', 'سباحة', 'سباحه', 'خور', 'بلاج', 'نعوم', 'اعوم', 'ميناء', 'كورنيش', 'beach', 'sea'],
    'الوادي': ['وادي', 'ودي', 'ويدان', 'برك', 'بركة', 'بركه', 'شلال', 'شلالات', 'نبع', 'نبعة', 'مويه', 'موية', 'فلج', 'أفلاج', 'افلاج', 'wadi'],
    'الجبال': ['جبل', 'جبال', 'مرتفعات', 'مشي', 'اتمشى', 'أتمشى', 'تمشية', 'تمشيه', 'مشية', 'مشيه', 'ترايكنق', 'trekking', 'مسير', 'هايكنق', 'mountain', 'hiking'],
    'السهول': ['سهول', 'سهل', 'نزهة', 'نزهه', 'بيكنك', 'براحة', 'براحه', 'مرعى', 'منتزه', 'حديقة', 'حديقه', 'بستان', 'picnic', 'plains'],
    'التسلق': ['تسلق', 'تسلّق', 'climbing', 'صخور', 'صخره', 'صخرة'],
    'الغوص': ['غوص', 'قناع', 'سنوركل', 'شنركل', 'زعانف', 'snorkel', 'diving'],
    'عائلي': ['عيال', 'أطفال', 'اطفال', 'عائل', 'اهل', 'أهل', 'اسرة', 'أسرة', 'family', 'ولد', 'بنت', 'اولاد', 'أولاد'],
  };

  const NEG_TRIGGERS = ['بدون', 'بلا', 'ما احتاج', 'ما ابي', 'ما أبي', 'ما ابغى', 'مو محتاج'];

  // فئات الحقائب اللي تناسب رحلة عائلية بشكل عام — 'عائلي' مو نوع حقيبة مستقل بالكتالوج،
  // فنخليه يرفع تقييم هالأنواع بدل ما يكون فلتر صارم يرجّع صفر نتائج
  const FAMILY_FRIENDLY_CATEGORIES = ['السهول', 'الشاطئ', 'البر'];

  // الأسئلة الشائعة وسياسات المنصة — تُفحص قبل منطق ترشيح الحقائب،
  // عشان أسئلة زي "كم العمولة؟" ما تروح لمنطق اقتراح حقيبة بالغلط
  const FAQ = [
    { triggers: ['عمول', 'كم تاخذون', 'نسبة رحال', 'نسبتكم'], answer: 'عمولة رحّال على بيع منتجات الموردين تتراوح بين 15% و25% حسب نوع المنتج. ولو تبيعين حقيبة مستعملة عبر "بيع حقيبتك"، العمولة 20% بس من سعر البيع لما تتباع فعلاً.' },
    { triggers: ['توصيل', 'التوصيل', 'وصول الطلب', 'كم ياخذ التوصيل'], answer: 'تقدرين تختارين توصيل لبيتك أو توصيل مباشر لموقع الرحلة (نقطة تجمع الوادي أو الشاطئ) وقت إتمام الطلب.' },
    { triggers: ['ارجاع', 'إرجاع', 'استرجاع', 'استبدال'], answer: 'الحقائب الجديدة تقدرين ترجعينها خلال 3 أيام بحالتها الأصلية. المستعملة تُباع كما هي بعد الفحص، وما ترجع إلا لو فيه عيب ما تم الإفصاح عنه وقت البيع.' },
    { triggers: ['تخزين', 'خزن حقيبتي', 'اخزن حقيبتي'], answer: 'تقدرين تخزنين حقيبتك عندنا بدل أخذها معك مقابل 1 ر.ع بس شهرياً — فعّليها وقت إتمام طلبك من صفحة الدفع.' },
    { triggers: ['اعادة تجهيز', 'إعادة التجهيز', 'نقص من حقيبتي', 'ناقص'], answer: 'لو ناقصك أي شي من حقيبة عندك، ادخلي صفحة "إعادة التجهيز" واختاري حقيبتك — تدفعين بس على العناصر اللي تحتاجينها، مو سعر الحقيبة كاملة.' },
    { triggers: ['بيع حقيبت', 'بيع الحقيبة', 'حقيبتي المستعملة', 'اعرض حقيبتي'], answer: 'تقدرين تعرضين حقيبتك المستعملة للبيع من صفحة "بيع حقيبتك" — نفحصها ونعرضها بشارة "مفحوصة من رحّال"، ولما تتباع يوصلك سعرها ناقص عمولة رحّال (20%).' },
    { triggers: ['انضم كمورد', 'أبيع منتجاتي', 'ابغى اسوق منتجاتي', 'ابي اسوق منتجاتي', 'مورد جديد'], answer: 'تقدر تنضم كمورد من صفحة "انضم كمورد" — نفحص عيّنة من منتجك، وعمولة رحّال تبدأ من 15% وحتى 25% حسب نوع المنتج.' },
    { triggers: ['خصم جماعي', 'خصم عائلي', 'اكثر من حقيبة', 'حجز جماعي'], answer: 'لو أضفتي حقيبتين أو أكثر بنفس الطلب، خصم الحجز العائلي/الجماعي (10%) يتفعّل تلقائياً على سلتك.' },
    { triggers: ['غوص احترافي', 'مرشد جبلي', 'اسطوانة غوص', 'مركز غوص', 'رخصة غوص'], answer: 'الخدمات اللي تحتاج ترخيص خاص (زي الغوص الاحترافي أو الإرشاد الجبلي التقني) ما تُباع مباشرة عبر رحّال — نعرّفك بمزوّد مرخّص تتواصلين معه مباشرة.' },
    { triggers: ['مفحوص من رحال', 'كيف تفحصون', 'فحص الجودة', 'فحص المنتج'], answer: 'كل مورد ومنتج يمر بفحص جودة قبل قبوله على المنصة — تشوفين اسم المورد وتاريخ آخر فحص جودة تحت كل غرض بالحقيبة، وشارة "✅ مفحوص من رحّال" على كل بطاقة.' },
  ];

  function matchFAQ(rawText) {
    const text = normalize(rawText);
    const hit = FAQ.find(f => f.triggers.some(t => text.includes(normalize(t))));
    return hit ? hit.answer : null;
  }

  // حاجز أمان: أي سؤال فيه شكوى بطلب فعلي أو مشكلة دفع محدّدة (لا فرق بينه وبين سؤال سياسة عام بالـFAQ فوق)
  // لازم يروح لموظف بشري مباشرة — المساعد ما يحاول يحلها أو يخمّن حالة طلب حقيقي أو معاملة دفع.
  const SENSITIVE_TRIGGERS = [
    'شكو', 'اشتكي', 'احتيال', 'نصب', 'خدعوني', 'انسرقت', 'نصبوا علي',
    'ما وصلني', 'ما استلمت', 'ماوصلني', 'ماستلمت', 'طلبي ما وصل', 'الطلب متاخر', 'تاخر طلبي',
    'المنتج تالف', 'المنتج معطوب', 'وصلني تالف', 'وصلني معطوب', 'وصلني خربان',
    'خصموا مني', 'خصم زائد', 'خصم غلط', 'اتخصم مني', 'انخصم مبلغ',
    'استرجاع فلوسي', 'ارجاع فلوسي', 'ابغى فلوسي', 'وين فلوسي', 'المبلغ ما رجع',
    'مشكلة بالدفع', 'الدفع ما اشتغل', 'فشل الدفع', 'بطاقتي', 'فيزا', 'ماستركارد',
    'رقم طلبي', 'حالة طلبي', 'تتبع طلبي', 'وين طلبي',
  ];

  function matchSensitive(rawText) {
    const text = normalize(rawText);
    return SENSITIVE_TRIGGERS.some(t => text.includes(normalize(t)));
  }

  const SENSITIVE_REPLY =
    'هذا يخص طلب أو معاملة دفع فعلية، وأفضل شخص يساعدك فيها فريق رحّال مباشرة مو أنا — تواصل معنا من صفحة "تواصل معنا" وبنرد عليك بأسرع وقت 🙏';

  // معرفة بأماكن عُمان — تغطي كل المحافظات والولايات الـ11 بدون استثناء (مو بس الوجهات السياحية المعروفة)،
  // لربط اسم أي منطقة يذكرها العميل بنوع الحقيبة المناسبة تلقائياً.
  const PLACES = {
    // معالم ووجهات معروفة
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

    // حصون وقلاع (مواقع تراثية معروفة — رحلة يوم بالبر عادة)
    'حصن نزوى': ['البر', 'الجبال'],
    'حصن جبرين': ['البر'],
    'قلعة جبرين': ['البر'],
    'حصن بهلا': ['البر', 'الجبال'],
    'قلعة بهلا': ['البر', 'الجبال'],
    'حصن الرستاق': ['البر', 'الجبال'],
    'قلعة الرستاق': ['البر', 'الجبال'],
    'حصن الحزم': ['البر'],
    'حصن صحار': ['البر', 'الشاطئ'],
    'قلعة صور': ['البر', 'الشاطئ'],
    'حصن مطرح': ['البر', 'الشاطئ'],
    'قلعة الجلالي': ['البر', 'الشاطئ'],
    'قلعة الميراني': ['البر', 'الشاطئ'],
    'حصن مرباط': ['البر', 'الشاطئ'],

    // مغارات وكهوف
    'مغارة الهوتة': ['البر'],
    'مغارة مجلس الجن': ['البر', 'الجبال'],
    'كهف طيق': ['الجبال'],

    // قرى ووديان ومواقع إضافية معروفة وغير مشهورة
    'بلاد سيت': ['الجبال'],
    'المسفاة العبريين': ['الجبال'],
    'مسفاة العبريين': ['الجبال'],
    'وادي بني عوف': ['الوادي'],
    'وادي تنوف': ['الوادي'],
    'شاطئ الجصة': ['الشاطئ'],
    'خور روري': ['الشاطئ', 'الوادي'],
    'عين الكسفة': ['الوادي'],
    'عين هوير': ['الوادي'],

    // أسواق تراثية
    'سوق مطرح': ['البر', 'الشاطئ'],
    'سوق نزوى': ['البر', 'الجبال'],
    'سوق صحار': ['البر'],

    // أسماء المحافظات الـ11
    'مسقط': ['الشاطئ'],
    'ظفار': ['الجبال', 'الشاطئ'],
    'مسندم': ['الغوص', 'الشاطئ'],
    'البريمي': ['البر'],
    'الداخلية': ['الجبال'],
    'الشرقية جنوب': ['البر'],
    'الشرقية شمال': ['البر'],
    'الشرقية': ['البر'],
    'الظاهرة': ['البر'],
    'الباطنة جنوب': ['الشاطئ'],
    'الباطنة شمال': ['الشاطئ'],
    'الباطنة': ['الشاطئ'],
    'الوسطى': ['البر'],

    // ولايات محافظة مسقط
    'مطرح': ['الشاطئ'],
    'بوشر': ['السهول'],
    'السيب': ['الشاطئ'],
    'العامرات': ['البر'],
    'قريات': ['الشاطئ'],

    // ولايات محافظة ظفار
    'صلالة': ['الجبال', 'الشاطئ'],
    'طاقة': ['الشاطئ'],
    'مرباط': ['الشاطئ'],
    'ثمريت': ['البر'],
    'سدح': ['البر'],
    'رخيوت': ['الجبال'],
    'ضلكوت': ['الجبال'],
    'مقشن': ['البر'],
    'شليم وجزر الحلانيات': ['الشاطئ'],

    // ولايات محافظة مسندم
    'خصب': ['الغوص', 'الشاطئ'],
    'بخاء': ['الجبال'],
    'دبا': ['الشاطئ'],
    'مدحاء': ['الجبال'],

    // ولايات محافظة البريمي
    'محضة': ['الجبال'],
    'السنينة': ['البر'],

    // ولايات محافظة الداخلية
    'نزوى': ['الجبال', 'التسلق'],
    'بهلاء': ['الجبال'],
    'منح': ['الجبال'],
    'الحمراء': ['الجبال'],
    'أدم': ['البر'],
    'إزكي': ['الجبال'],
    'سمائل': ['الجبال'],

    // ولايات محافظة الشرقية جنوب
    'صور': ['الشاطئ'],
    'الكامل والوافي': ['الشاطئ'],
    'جعلان بني بو علي': ['البر'],
    'جعلان بني بو حسن': ['البر'],

    // ولايات محافظة الشرقية شمال
    'إبراء': ['البر'],
    'المضيبي': ['البر'],
    'بدية': ['البر'],
    'القابل': ['البر'],
    'دماء والطائيين': ['الجبال'],

    // ولايات محافظة الظاهرة
    'عبري': ['البر', 'الجبال'],
    'ينقل': ['الجبال'],
    'ضنك': ['البر'],

    // ولايات محافظة الباطنة جنوب
    'الرستاق': ['الجبال'],
    'العوابي': ['الجبال'],
    'نخل': ['الوادي'],
    'وادي المعاول': ['الوادي'],
    'بركاء': ['الشاطئ'],

    // ولايات محافظة الباطنة شمال
    'صحار': ['الشاطئ'],
    'شناص': ['الشاطئ'],
    'لوى': ['الشاطئ'],
    'صحم': ['الشاطئ'],
    'الخابورة': ['الشاطئ'],
    'السويق': ['الشاطئ'],

    // ولايات محافظة الوسطى
    'الدقم': ['البر'],
    'هيماء': ['البر'],
    'محوت': ['الشاطئ'],
    'الجازر': ['البر'],
  };

  // إحداثيات لأهم الأماكن اللي المساعد يعرفها — تُستخدم لجلب طقس استرشادي (نصيحة تجهيز فقط، مو نظام تحذير سلامة).
  // الأماكن غير الموجودة هنا ما يظهر لها طقس (بدل تخمين إحداثيات غير دقيقة).
  const PLACE_COORDS = {
    'مسقط': { lat: 23.5880, lon: 58.3829 },
    'مطرح': { lat: 23.6142, lon: 58.5661 },
    'السيب': { lat: 23.6703, lon: 58.1891 },
    'قريات': { lat: 23.2597, lon: 58.9114 },
    'ظفار': { lat: 17.0151, lon: 54.0924 },
    'صلالة': { lat: 17.0151, lon: 54.0924 },
    'طاقة': { lat: 17.0333, lon: 54.4000 },
    'مرباط': { lat: 16.9833, lon: 54.7000 },
    'مسندم': { lat: 26.1799, lon: 56.2477 },
    'خصب': { lat: 26.1799, lon: 56.2477 },
    'البريمي': { lat: 24.2506, lon: 55.7933 },
    'نزوى': { lat: 22.9333, lon: 57.5333 },
    'بهلاء': { lat: 22.9667, lon: 57.3000 },
    'حصن بهلا': { lat: 22.9667, lon: 57.3000 },
    'قلعة بهلا': { lat: 22.9667, lon: 57.3000 },
    'حصن نزوى': { lat: 22.9333, lon: 57.5333 },
    'سوق نزوى': { lat: 22.9333, lon: 57.5333 },
    'إبراء': { lat: 22.6906, lon: 58.5334 },
    'صور': { lat: 22.5667, lon: 59.5289 },
    'قلعة صور': { lat: 22.5667, lon: 59.5289 },
    'عبري': { lat: 23.2238, lon: 56.5127 },
    'الرستاق': { lat: 23.3903, lon: 57.4222 },
    'قلعة الرستاق': { lat: 23.3903, lon: 57.4222 },
    'حصن الرستاق': { lat: 23.3903, lon: 57.4222 },
    'صحار': { lat: 24.3459, lon: 56.7073 },
    'حصن صحار': { lat: 24.3459, lon: 56.7073 },
    'سوق صحار': { lat: 24.3459, lon: 56.7073 },
    'بركاء': { lat: 23.6836, lon: 57.8886 },
    'الدقم': { lat: 19.6664, lon: 57.7057 },
    'هيماء': { lat: 19.9333, lon: 56.2667 },
    'جبل شمس': { lat: 23.0956, lon: 57.2661 },
    'الجبل الأخضر': { lat: 23.0667, lon: 57.6667 },
    'بلاد سيت': { lat: 23.0833, lon: 57.5500 },
    'المسفاة العبريين': { lat: 23.2167, lon: 57.5167 },
    'مسفاة العبريين': { lat: 23.2167, lon: 57.5167 },
    'وادي شاب': { lat: 22.8300, lon: 59.2500 },
    'وادي بني خالد': { lat: 22.5833, lon: 59.1167 },
    'وادي بني عوف': { lat: 23.2333, lon: 57.5833 },
    'رأس الحد': { lat: 22.5333, lon: 59.7833 },
    'رأس الجنز': { lat: 22.5167, lon: 59.8167 },
    'جزيرة مصيرة': { lat: 20.6167, lon: 58.8833 },
    'مغارة الهوتة': { lat: 23.1167, lon: 57.3333 },
  };

  const WEATHER_CODE_LABELS = {
    0: 'صافي', 1: 'صافي غالباً', 2: 'غائم جزئياً', 3: 'غائم',
    45: 'ضباب', 48: 'ضباب كثيف',
    51: 'رذاذ خفيف', 53: 'رذاذ', 55: 'رذاذ كثيف',
    61: 'أمطار خفيفة', 63: 'أمطار', 65: 'أمطار غزيرة',
    80: 'زخات مطر خفيفة', 81: 'زخات مطر', 82: 'زخات مطر غزيرة',
    95: 'رعد وبرق', 96: 'عاصفة رعدية', 99: 'عاصفة رعدية قوية',
  };

  function findPlaceWithCoords(rawText) {
    const text = normalize(rawText);
    const match = Object.keys(PLACE_COORDS).find(place => text.includes(normalize(place)));
    return match || null;
  }

  function weatherTip(tempC, code) {
    if (code >= 51 && code <= 99) return 'متوقع مطر — خذي جاكيت مطر واحترسي من مجاري السيول بالوديان.';
    if (tempC >= 38) return 'الجو حار جداً — خذي مويه كافية وواقي شمس.';
    if (tempC <= 15) return 'الجو بارد — خذي طبقة دافئة خصوصاً بالليل.';
    return 'الجو مناسب للرحلة 🙂';
  }

  async function fetchWeatherLine(placeName) {
    const coords = PLACE_COORDS[placeName];
    if (!coords || typeof AbortController === 'undefined') return null;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code&timezone=auto`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) return null;
      const data = await res.json();
      const temp = data && data.current && data.current.temperature_2m;
      const code = data && data.current && data.current.weather_code;
      if (typeof temp !== 'number') return null;
      const label = WEATHER_CODE_LABELS[code] || '';
      return `🌡️ الجو بـ${placeName} الآن ${Math.round(temp)}°${label ? ' — ' + label : ''}. ${weatherTip(temp, code || 0)}`;
    } catch (e) {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

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

  // يفكّ وسمي #النوع #الحالة بنهاية وصف الحقيبة (نفس اصطلاح trips.html)
  function parseTripMeta(trip) {
    const m = trip.desc.match(/\s*#(\S+)\s*#(\S+)\s*$/);
    if (!m) return { desc: trip.desc, category: null, condition: 'جديد' };
    return { desc: trip.desc.slice(0, m.index).trim(), category: m[1], condition: m[2] };
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
      // 'عائلي' مو نوع حقيبة مستقل — يرفع تقييم الأنواع المناسبة للعائلة بدل ما يكون شرط صارم
      if (include.includes('عائلي') && meta.category && FAMILY_FRIENDLY_CATEGORIES.includes(meta.category) && !exclude.has(meta.category)) {
        score += 2;
      }
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

  async function localAssistantReply(message, session) {
    const faqAnswer = matchFAQ(message);
    if (faqAnswer) return { clarify: faqAnswer };

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

    const notes = [];
    const placeName = findPlaceWithCoords(message);
    if (placeName) {
      const weatherLine = await fetchWeatherLine(placeName);
      if (weatherLine) notes.push(weatherLine);
    }
    if (session.includeTags.includes('عائلي')) {
      notes.push('إذا رحلتكم أكثر من حقيبة بنفس الطلب، خصم الحجز العائلي/الجماعي (10%) يتفعّل تلقائياً 🎉');
    }
    const note = notes.length ? notes : null;

    return {
      items: trips.map(t => ({ trip_id: t.id, reason: buildReason(t, session) })),
      note,
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
    if (matchSensitive(message)) {
      // حاجز الأمان أولوية قبل أي محاولة رد آلي (باك اند أو محلي) — ما نمرر شكاوى/مشاكل دفع فعلية للذكاء الاصطناعي إطلاقاً
      reply = { clarify: SENSITIVE_REPLY };
    } else {
      try {
        reply = (await fetchBackendReply(message, session)) || (await localAssistantReply(message, session));
      } catch (e) {
        reply = { clarify: 'صار خلل بسيط، جرّب تكتبها بطريقة ثانية.' };
      }
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

  function renderCards(items, note) {
    const cards = items
      .map(item => {
        const t = TRIPS.find(x => x.id === item.trip_id);
        if (!t) return '';
        return `
        <div class="assistant-card" data-id="${t.id}">
          <div class="product-media">${t.emoji}</div>
          <div class="product-body">
            <div class="product-cat">${escapeHtml(item.reason || '')}</div>
            <div class="product-name">${t.name}</div>
            <div class="product-foot">
              <div class="price">من ${tripPrice(t)} ر.ع</div>
              <button class="ai-toggle-btn" data-id="${t.id}">أضف الحقيبة</button>
            </div>
          </div>
        </div>`;
      })
      .join('');
    const notes = Array.isArray(note) ? note : (note ? [note] : []);
    const noteHtml = notes.map(n => `<p style="margin-top:10px;font-size:13.5px;color:var(--gold-dark)">${escapeHtml(n)}</p>`).join('');
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
        thread.insertAdjacentHTML('beforeend', renderCards(reply.items, reply.note));
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
