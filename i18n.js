// نظام ثنائي اللغة (عربي/إنجليزي) للواجهة الثابتة — النصوص فقط، البيانات (منتجات/رحلات/موردين) تبقى بالعربي كما هي.
// يعمل بعنصر data-i18n="key" لنص العنصر، وdata-i18n-placeholder="key" للـ placeholder.
(function () {
  const LANG_KEY = 'rahalLang';

  const T = {
    // ---- الهيدر والتنقل (مشترك بكل الصفحات) ----
    'nav.home': { ar: 'الرئيسية', en: 'Home' },
    'nav.trips': { ar: 'الرحلات', en: 'Trips' },
    'nav.equipment': { ar: 'المعدات', en: 'Equipment' },
    'nav.vehicles': { ar: 'المركبات', en: 'Vehicles' },
    'nav.food': { ar: 'التموين', en: 'Food' },
    'nav.suppliers': { ar: 'الموردين', en: 'Suppliers' },
    'nav.contact': { ar: 'تواصل معنا', en: 'Contact' },
    'nav.admin': { ar: 'لوحة الإدارة', en: 'Admin' },
    'nav.registerLogin': { ar: 'تسجيل / دخول', en: 'Sign up / Login' },
    'nav.cart': { ar: 'سلتي', en: 'My Cart' },
    'search.placeholder': { ar: 'ابحث: قناع غوص، دفع رباعي، مؤن...', en: 'Search: dive mask, 4x4, supplies...' },
    'search.placeholderShort': { ar: 'ابحث...', en: 'Search...' },
    'cart.viewAria': { ar: 'عرض السلة', en: 'View cart' },
    'menu.aria': { ar: 'القائمة', en: 'Menu' },
    'drawer.close': { ar: 'إغلاق', en: 'Close' },
    'lang.toggle': { ar: 'English', en: 'العربية' },

    // ---- الفوتر (مشترك) ----
    'footer.about': { ar: 'منصتك لشراء معدات وتموين رحلتك البرية والبحرية، واستئجار المركبات، من موردين موثوقين في كل ربوع عُمان.', en: 'Your platform for buying land & sea trip gear and supplies, and renting vehicles, from trusted suppliers across Oman.' },
    'footer.browseHeading': { ar: 'تصفح', en: 'Browse' },
    'footer.trips': { ar: 'الرحلات المجهزة', en: 'Ready-made Trips' },
    'footer.equipment': { ar: 'المعدات', en: 'Equipment' },
    'footer.vehicles': { ar: 'المركبات', en: 'Vehicles' },
    'footer.food': { ar: 'التموين والطعام', en: 'Food & Supplies' },
    'footer.accountHeading': { ar: 'حسابي', en: 'My Account' },
    'footer.checkout': { ar: 'إتمام الطلب', en: 'Checkout' },
    'footer.suppliersLink': { ar: 'الموردون', en: 'Suppliers' },
    'footer.supportHeading': { ar: 'الدعم والقانونية', en: 'Support & Legal' },
    'footer.terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    'footer.copyright': { ar: '© 2026 رحّال — جميع الحقوق محفوظة', en: '© 2026 Rahhal — All rights reserved' },

    // ---- الرئيسية (index.html) ----
    'home.heroEyebrow': { ar: 'منصّة رحلاتك البرية والبحرية', en: 'Your land & sea trip platform' },
    'home.heroTitle': { ar: 'جهّز رحلتك القادمة بضغطة واحدة', en: 'Prep your next trip in one click' },
    'home.heroLead': { ar: 'معدات غوص، مركبات دفع رباعي وقوارب، وتموين جاهز — كل شي تحتاجه لرحلتك من موردين موثوقين، بمكان واحد.', en: 'Diving gear, 4x4s and boats, and ready supplies — everything your trip needs from trusted suppliers, in one place.' },
    'home.browseTrips': { ar: 'تصفح الحقائب', en: 'Browse Trip Bags' },
    'home.suppliersPage': { ar: 'صفحة الموردين', en: 'Suppliers Page' },
    'assistant.eyebrow': { ar: 'مساعد رحّال الذكي', en: 'Rahhal Smart Assistant' },
    'assistant.title': { ar: 'وش تحتاج لرحلتك؟ اكتبها لي بكلامك العادي', en: 'What do you need for your trip? Just describe it' },
    'assistant.lead': { ar: 'مثال: "رايح جبل شمس نهاية الأسبوع مع العيال" أو "بديت اطلع تخييم اول مرة وش احتاج"', en: 'Example: "Heading to Jebel Shams this weekend with the kids" or "First time camping, what do I need?"' },
    'assistant.inputPlaceholder': { ar: 'اكتب وصف رحلتك هنا...', en: 'Describe your trip here...' },
    'assistant.submit': { ar: 'اسأل رحّال', en: 'Ask Rahhal' },
    'home.categoriesEyebrow': { ar: 'اختر وجهتك', en: 'Choose your destination' },
    'home.categoriesTitle': { ar: 'حقيبة رحلة جاهزة لكل نوع وجهة', en: 'A ready trip bag for every destination type' },
    'home.categoriesLead': { ar: 'اضغط على أي بطاقة عشان تشوف الحقائب المناسبة لها', en: 'Tap any card to see the matching bags' },
    'home.regionsEyebrow': { ar: 'تصفّح حسب المحافظة', en: 'Browse by Governorate' },
    'home.regionsTitle': { ar: 'حقائب من كل ربوع عُمان', en: 'Bags from every corner of Oman' },
    'home.featuredEyebrow': { ar: 'الأكثر طلباً', en: 'Most Popular' },
    'home.featuredTitle': { ar: 'حقائب مقترحة لرحلتك', en: 'Bags suggested for your trip' },

    // ---- الرحلات (trips.html) ----
    'trips.title': { ar: 'الرحلات المجهزة', en: 'Ready-made Trips' },
    'trips.lead': { ar: 'حزم جاهزة تجمع لك المعدات والمركبة والمؤن المناسبة — واختر تعدّل عليها وتشيل أو تضيف قبل ما تحجز.', en: 'Ready packages bundling the right gear, vehicle, and supplies — customize by adding or removing before you book.' },
    'trips.customizeEyebrow': { ar: 'تخصيص الرحلة', en: 'Customize Trip' },
    'trips.resetPackage': { ar: 'إعادة الحزمة لوضعها الأصلي', en: 'Reset Package to Original' },
    'trips.summaryHeading': { ar: 'ملخص الحزمة', en: 'Package Summary' },
    'trips.itemCount': { ar: 'عدد العناصر المختارة', en: 'Items Selected' },
    'trips.total': { ar: 'الإجمالي', en: 'Total' },
    'trips.addToCart': { ar: 'أضف الحزمة للسلة', en: 'Add Package to Cart' },
    'trips.selectBtn': { ar: 'خصّص واحجز', en: 'Customize & Book' },
    'trips.regionLabel': { ar: 'المحافظة', en: 'Governorate' },
    'trips.terrainLabel': { ar: 'نوع الوجهة', en: 'Destination Type' },
    'trips.emptyState': { ar: 'ما فيه حقائب مطابقة لهذا الفلتر. جرّب تغيّر المحافظة أو نوع الوجهة.', en: 'No bags match this filter. Try changing the governorate or destination type.' },
    'section.all': { ar: 'الكل', en: 'All' },

    // ---- المعدات/المركبات/الطعام (صفحات القسم) ----
    'section.sortDefault': { ar: 'الترتيب الافتراضي', en: 'Default Order' },
    'section.sortPriceAsc': { ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' },
    'section.sortPriceDesc': { ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' },
    'section.sortName': { ar: 'الاسم (أ-ي)', en: 'Name (A-Z)' },
    'section.emptyState': { ar: 'ما فيه نتائج مطابقة. جرّب كلمة ثانية أو امسح الفلتر.', en: 'No matching results. Try another word or clear the filter.' },
    'section.addBtn': { ar: 'أضف', en: 'Add' },
    'equipment.title': { ar: 'المعدات', en: 'Equipment' },
    'equipment.lead': { ar: 'معدات غوص وتخييم ورحلات براً وبحراً بأفضل الأسعار', en: 'Diving, camping, and land & sea trip gear at the best prices' },
    'vehicles.title': { ar: 'المركبات', en: 'Vehicles' },
    'vehicles.lead': { ar: 'سيارات دفع رباعي، دراجات، وقوارب للإيجار', en: '4x4 cars, bikes, and boats for rent' },
    'food.title': { ar: 'التموين والطعام', en: 'Food & Supplies' },
    'food.lead': { ar: 'وجبات ومؤن جاهزة لرحلات الغوص والبر', en: 'Ready meals and supplies for diving and land trips' },

    // ---- السلة (cart.html) ----
    'cart.title': { ar: 'سلة الطلبات', en: 'Cart' },
    'cart.lead': { ar: 'راجع طلبك وعدّل الكميات قبل إتمام الحجز', en: 'Review your order and adjust quantities before booking' },
    'cart.summaryHeading': { ar: 'ملخص الطلب', en: 'Order Summary' },
    'cart.itemCount': { ar: 'عدد القطع', en: 'Item Count' },
    'cart.subtotal': { ar: 'المجموع الفرعي', en: 'Subtotal' },
    'cart.serviceFee': { ar: 'رسوم الخدمة', en: 'Service Fee' },
    'cart.total': { ar: 'الإجمالي', en: 'Total' },
    'cart.checkoutBtn': { ar: 'إتمام الطلب ←', en: 'Checkout ←' },
    'cart.continueBrowsing': { ar: 'متابعة التصفح', en: 'Continue Browsing' },
    'cart.emptyTitle': { ar: 'سلتك فارغة حالياً', en: 'Your cart is currently empty' },
    'cart.emptyBtn': { ar: 'ابدأ التصفح', en: 'Start Browsing' },
    'cart.notePlaceholder': { ar: 'أي طلب خاص أو حساسية غذائية؟ مثال: بدون مكسرات', en: 'Special request or food allergy? e.g. no nuts' },
    'cart.removeLink': { ar: 'حذف', en: 'Remove' },

    // ---- إتمام الطلب (checkout.html) ----
    'checkout.title': { ar: 'إتمام الطلب', en: 'Checkout' },
    'checkout.lead': { ar: 'عبّي بياناتك وراجع الفاتورة قبل التأكيد', en: 'Fill in your details and review the invoice before confirming' },
    'checkout.emptyText': { ar: 'سلتك فارغة، ما فيه شي تدفع له.', en: 'Your cart is empty, nothing to pay for.' },
    'checkout.startBrowsing': { ar: 'ابدأ التصفح', en: 'Start Browsing' },
    'checkout.purchaseEyebrow': { ar: 'فاتورة الشراء', en: 'Purchase Invoice' },
    'checkout.purchaseHeading': { ar: 'معدات وتموين — بيانات التوصيل والدفع', en: 'Equipment & supplies — delivery & payment details' },
    'checkout.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
    'checkout.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'checkout.address': { ar: 'العنوان / نقطة التسليم', en: 'Address / Delivery Point' },
    'checkout.notes': { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional Notes (optional)' },
    'checkout.notesPlaceholder': { ar: 'أي تفاصيل تساعد المورد يجهز طلبك', en: 'Any details to help the supplier prepare your order' },
    'checkout.paymentMethodHeading': { ar: 'طريقة الدفع', en: 'Payment Method' },
    'checkout.paymentMethodLabel': { ar: 'اختر طريقة الدفع', en: 'Choose Payment Method' },
    'checkout.payCard': { ar: 'بطاقة ائتمانية / مدى', en: 'Credit Card / Mada' },
    'checkout.payCod': { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
    'checkout.payTransfer': { ar: 'تحويل بنكي', en: 'Bank Transfer' },
    'checkout.cardNumber': { ar: 'رقم البطاقة', en: 'Card Number' },
    'checkout.expiry': { ar: 'تاريخ الانتهاء', en: 'Expiry Date' },
    'checkout.confirmPurchase': { ar: 'تأكيد فاتورة الشراء', en: 'Confirm Purchase Invoice' },
    'checkout.purchaseSummary': { ar: 'ملخص الشراء', en: 'Purchase Summary' },
    'checkout.rentalEyebrow': { ar: 'فاتورة الإيجار', en: 'Rental Invoice' },
    'checkout.rentalHeading': { ar: 'مركبات — بيانات الحجز والاستلام', en: 'Vehicles — booking & pickup details' },
    'checkout.disclaimerTitle': { ar: 'تنويه مهم قبل تأكيد الإيجار:', en: 'Important notice before confirming rental:' },
    'checkout.disclaimerText': { ar: 'رحّال منصة حجز وتنسيق إلكترونية فقط تربطك بمورد مركبات مرخّص، وليست مالكة أو مشغّلة لأي مركبة معروضة. المسؤولية الكاملة عن سلامة المركبة وصيانتها وأي ضرر أو حادث يحصل أثناء فترة الاستئجار تقع على عاتق المورّد المؤجّر والمستأجر بحسب اتفاقهما، ولا تتحمّل رحّال أي مسؤولية قانونية أو مادية عن ذلك. مبلغ التأمين القابل للاسترداد بند منفصل تمامًا عن أجرة التأجير.', en: 'Rahhal is only an electronic booking and coordination platform connecting you to a licensed vehicle supplier, and does not own or operate any listed vehicle. Full responsibility for the vehicle\'s safety, maintenance, and any damage or accident during the rental period lies with the supplier and renter per their agreement; Rahhal bears no legal or financial liability. The refundable deposit is a separate line item from the rental fee.' },
    'checkout.licenseNumber': { ar: 'رقم رخصة القيادة', en: 'Driving License Number' },
    'checkout.licensePlaceholder': { ar: 'رقم الرخصة سارية المفعول', en: 'Valid license number' },
    'checkout.pickupLocation': { ar: 'موقع الاستلام', en: 'Pickup Location' },
    'checkout.pickupDate': { ar: 'تاريخ الاستلام', en: 'Pickup Date' },
    'checkout.returnDate': { ar: 'تاريخ الإرجاع', en: 'Return Date' },
    'checkout.rentalAgree': { ar: 'أقرّ بأنني اطّلعت على شروط التأجير أعلاه، وأن رحّال منصة تنسيق فقط وغير مسؤولة عن أي ضرر أو حادث يحصل أثناء استخدام المركبة.', en: 'I acknowledge I have read the rental terms above, and that Rahhal is only a coordination platform and is not liable for any damage or accident during vehicle use.' },
    'checkout.confirmRental': { ar: 'تأكيد فاتورة الإيجار', en: 'Confirm Rental Invoice' },
    'checkout.rentalSummary': { ar: 'ملخص الإيجار', en: 'Rental Summary' },
    'checkout.depositLabel': { ar: 'تأمين قابل للاسترداد', en: 'Refundable Deposit' },
    'checkout.totalNow': { ar: 'الإجمالي المدفوع الآن', en: 'Total Due Now' },

    // ---- تواصل معنا (contact.html) ----
    'contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
    'contact.lead': { ar: 'عندك استفسار أو مشكلة بطلب؟ فريقنا جاهز يساعدك', en: 'Have a question or an issue with an order? Our team is ready to help' },
    'contact.callUs': { ar: 'اتصل بنا', en: 'Call Us' },
    'contact.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'contact.hq': { ar: 'المقر الرئيسي', en: 'Headquarters' },
    'contact.hqLocation': { ar: 'مسقط، سلطنة عُمان', en: 'Muscat, Sultanate of Oman' },
    'contact.supportHours': { ar: 'ساعات الدعم', en: 'Support Hours' },
    'contact.supportHoursValue': { ar: 'يومياً من 8 صباحاً حتى 10 مساءً', en: 'Daily from 8 AM to 10 PM' },
    'contact.sendMessage': { ar: 'أرسل لنا رسالة', en: 'Send Us a Message' },
    'contact.name': { ar: 'الاسم', en: 'Name' },
    'contact.email2': { ar: 'البريد الإلكتروني', en: 'Email' },
    'contact.subject': { ar: 'الموضوع', en: 'Subject' },
    'contact.subjectGeneral': { ar: 'استفسار عام', en: 'General Inquiry' },
    'contact.subjectOrderIssue': { ar: 'مشكلة بطلب', en: 'Order Issue' },
    'contact.subjectSupplier': { ar: 'التسجيل كمورد', en: 'Register as a Supplier' },
    'contact.subjectComplaint': { ar: 'شكوى', en: 'Complaint' },
    'contact.messageLabel': { ar: 'رسالتك', en: 'Your Message' },
    'contact.messagePlaceholder': { ar: 'اكتب تفاصيل استفسارك هنا...', en: 'Write the details of your inquiry here...' },
    'contact.sendBtn': { ar: 'إرسال الرسالة', en: 'Send Message' },

    // ---- الشروط والخصوصية ----
    'terms.title': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    'terms.lead': { ar: 'يرجى قراءة هذه الشروط بعناية قبل استخدام منصة رحّال أو تأكيد أي حجز', en: 'Please read these terms carefully before using the Rahhal platform or confirming any booking' },
    'privacy.title': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    'privacy.lead': { ar: 'كيف نجمع بياناتك، نستخدمها، ونحميها عند استخدامك لمنصة رحّال', en: 'How we collect, use, and protect your data when you use the Rahhal platform' },

    // ---- الموردون (suppliers.html) ----
    'suppliers.title': { ar: 'انضم كمورد', en: 'Join as a Supplier' },
    'suppliers.lead': { ar: 'سجّل موردك الخاص وابدأ استقبال الطلبات على منصة رحّال', en: 'Register your business and start receiving orders on the Rahhal platform' },
    'suppliers.formHeading': { ar: 'سجّل بياناتك كمورد', en: 'Register your supplier details' },
    'suppliers.formLead': { ar: 'بعد المراجعة راح نتواصل معك لتفعيل حسابك ونشر منتجاتك على المنصة', en: 'After review, we\'ll contact you to activate your account and list your products' },
    'suppliers.businessName': { ar: 'اسم المؤسسة / المورد', en: 'Business / Supplier Name' },
    'suppliers.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'suppliers.email': { ar: 'البريد الإلكتروني', en: 'Email Address' },
    'suppliers.field': { ar: 'مجال التوريد', en: 'Supply Category' },
    'suppliers.bio': { ar: 'نبذة عن الخدمات المقدمة', en: 'About Your Services' },
    'suppliers.bioPlaceholder': { ar: 'اكتب وصف مختصر عن منتجاتك وخدماتك', en: 'Briefly describe your products and services' },
    'suppliers.submit': { ar: 'إرسال الطلب', en: 'Submit Request' },
    'suppliers.catEquipment': { ar: 'معدات', en: 'Equipment' },
    'suppliers.catVehicles': { ar: 'مركبات', en: 'Vehicles' },
    'suppliers.catFood': { ar: 'تموين وطعام', en: 'Food & Supplies' },

    // ---- التسجيل (register.html) ----
    'register.pageTitle': { ar: 'تسجيل حساب جديد', en: 'Create a New Account' },
    'register.pageLead': { ar: 'ندخل رقم جوالك ونرسل لك كود تحقق مباشرة على واتساب', en: 'Enter your phone number and we\'ll send a verification code via WhatsApp' },
    'register.dataHeading': { ar: 'بياناتك', en: 'Your Details' },
    'register.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
    'register.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'register.sendOtp': { ar: 'إرسال كود التحقق عبر واتساب', en: 'Send verification code via WhatsApp' },
    'register.codeHeading': { ar: 'أدخل كود التحقق', en: 'Enter Verification Code' },
    'register.codeLabel': { ar: 'كود التحقق', en: 'Verification Code' },
    'register.verifyBtn': { ar: 'تأكيد وإنشاء الحساب', en: 'Confirm & Create Account' },
    'register.resendBtn': { ar: 'إعادة إرسال الكود', en: 'Resend Code' },
    'register.footerNote': { ar: 'هذا النموذج يتصل بخادم رحال المباشر عبر واتساب — قد يستغرق الكود لحظات ليصلك.', en: 'This form connects to the live Rahhal server via WhatsApp — the code may take a moment to arrive.' },
  };

  function getLang() {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
  }

  function t(key) {
    const entry = T[key];
    if (!entry) return key;
    return entry[getLang()] || entry.ar;
  }

  function applyDirection() {
    const lang = getLang();
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');
  }

  function applyI18n() {
    applyDirection();
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('.js-lang-toggle').forEach(btn => {
      btn.textContent = t('lang.toggle');
    });
  }

  function setupLangToggle() {
    document.querySelectorAll('.js-lang-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        setLang(getLang() === 'en' ? 'ar' : 'en');
        location.reload();
      });
    });
  }

  // تطبيق الاتجاه فوراً قبل أي رسم لتفادي وميض الاتجاه الخاطئ
  applyDirection();

  document.addEventListener('DOMContentLoaded', () => {
    applyI18n();
    setupLangToggle();
  });

  window.RahalI18n = { t, getLang, setLang, applyI18n };
})();
