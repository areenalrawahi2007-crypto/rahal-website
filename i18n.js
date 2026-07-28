// نظام ثنائي اللغة (عربي/إنجليزي) للواجهة الثابتة — النصوص فقط، البيانات (منتجات/رحلات/موردين) تبقى بالعربي كما هي.
// يعمل بعنصر data-i18n="key" لنص العنصر، وdata-i18n-placeholder="key" للـ placeholder.
(function () {
  const LANG_KEY = 'rahalLang';

  const T = {
    // ---- الهيدر والتنقل (مشترك بكل الصفحات) ----
    'nav.home': { ar: 'الرئيسية', en: 'Home' },
    'nav.trips': { ar: 'الحقيبة الجاهزة', en: 'Ready Bag' },
    'nav.equipment': { ar: 'المعدات', en: 'Equipment' },
    'nav.contact': { ar: 'تواصل معنا', en: 'Contact' },
    'nav.admin': { ar: 'لوحة الإدارة', en: 'Admin' },
    'nav.registerLogin': { ar: 'تسجيل / دخول', en: 'Sign up / Login' },
    'nav.cart': { ar: 'سلتي', en: 'My Cart' },
    'search.placeholder': { ar: 'ابحث: حقيبة الشاطئ، حقيبة البر...', en: 'Search: beach bag, desert bag...' },
    'search.placeholderShort': { ar: 'ابحث...', en: 'Search...' },
    'cart.viewAria': { ar: 'عرض السلة', en: 'View cart' },
    'menu.aria': { ar: 'القائمة', en: 'Menu' },
    'drawer.close': { ar: 'إغلاق', en: 'Close' },
    'lang.toggle': { ar: 'English', en: 'العربية' },

    // ---- الفوتر (مشترك) ----
    'footer.about': { ar: 'متجر رحّال — حقائب رحلات جاهزة من مخزوننا الخاص، تقدر تشتريها جديدة أو مستعملة نظيفة ضمن برنامج إعادة الشراء.', en: 'Rahhal Store — ready trip bags from our own stock, buy them new or clean pre-owned through our buyback program.' },
    'footer.browseHeading': { ar: 'تصفح', en: 'Browse' },
    'footer.trips': { ar: 'الحقيبة الجاهزة', en: 'Ready Bag' },
    'footer.equipment': { ar: 'المعدات', en: 'Equipment' },
    'footer.accountHeading': { ar: 'حسابي', en: 'My Account' },
    'footer.checkout': { ar: 'إتمام الطلب', en: 'Checkout' },
    'footer.supportHeading': { ar: 'الدعم والقانونية', en: 'Support & Legal' },
    'footer.terms': { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
    'footer.privacy': { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
    'footer.copyright': { ar: '© 2026 رحّال — جميع الحقوق محفوظة', en: '© 2026 Rahhal — All rights reserved' },

    // ---- الرئيسية (index.html) ----
    'home.heroEyebrow': { ar: 'متجر حقائب الرحلات الجاهزة', en: 'The ready trip bag store' },
    'home.heroTitle': { ar: 'جهّز رحلتك القادمة بضغطة واحدة', en: 'Prep your next trip in one click' },
    'home.heroLead': { ar: 'حقائب رحلات جاهزة بمحتويات حقيقية من مخزوننا الخاص — جديدة أو مستعملة نظيفة بسعر أقل، لكل أنواع الرحلات.', en: 'Ready trip bags with real contents from our own stock — new or clean pre-owned at a lower price, for every kind of trip.' },
    'home.browseTrips': { ar: 'تصفح الحقائب', en: 'Browse Trip Bags' },
    'assistant.eyebrow': { ar: 'مساعد رحّال الذكي', en: 'Rahhal Smart Assistant' },
    'assistant.title': { ar: 'وش تحتاج لرحلتك؟ اكتبها لي بكلامك العادي', en: 'What do you need for your trip? Just describe it' },
    'assistant.lead': { ar: 'مثال: "بديت اطلع تخييم بالبر" أو "بغيت حقيبة بحر للعائلة"', en: 'Example: "Going camping in the desert" or "I want a beach bag for the family"' },
    'assistant.inputPlaceholder': { ar: 'اكتب وصف رحلتك هنا...', en: 'Describe your trip here...' },
    'assistant.submit': { ar: 'اسأل رحّال', en: 'Ask Rahhal' },
    'home.categoriesEyebrow': { ar: 'اختر نوع رحلتك', en: 'Choose your trip type' },
    'home.categoriesTitle': { ar: 'حقيبة جاهزة لكل نوع رحلة', en: 'A ready bag for every kind of trip' },
    'home.categoriesLead': { ar: 'اضغط على أي بطاقة عشان تشوف الحقائب المناسبة لها', en: 'Tap any card to see the matching bags' },
    'home.refillEyebrow': { ar: 'خدمة إعادة التجهيز', en: 'Refill Service' },
    'home.refillTitle': { ar: 'خلّصت مكونات حقيبتك؟ عبّيها من جديد بس', en: 'Ran out of your bag contents? Just refill it' },
    'home.refillLead': { ar: 'ما تحتاج تشتري حقيبة كاملة من جديد — حدّد وش نقص بس وندفّع لك السعر حسبه.', en: "No need to buy a whole new bag — pick only what's missing and pay accordingly." },
    'home.refillCta': { ar: 'إعادة تجهيز حقيبتي', en: 'Refill My Bag' },
    'home.sellbackEyebrow': { ar: 'برنامج إعادة الشراء', en: 'Buyback Program' },
    'home.sellbackTitle': { ar: 'خلصت من حقيبتك؟ بيعها لنا بنص السعر', en: 'Done with your bag? Sell it back for half price' },
    'home.sellbackLead': { ar: 'ننظّفها ونفحصها ونعيد بيعها بسعر أقل لعميل ثاني — دورة استخدام أذكى وأرخص للجميع.', en: 'We clean it, inspect it, and resell it cheaper to another customer — a smarter, more affordable cycle for everyone.' },
    'home.sellbackCta': { ar: 'بيع حقيبتك المستعملة', en: 'Sell Your Used Bag' },
    'home.browseUsed': { ar: 'تصفح الحقائب المستعملة', en: 'Browse Used Bags' },
    'home.featuredEyebrow': { ar: 'الأكثر طلباً', en: 'Most Popular' },
    'home.featuredTitle': { ar: 'حقائب مقترحة لرحلتك', en: 'Bags suggested for your trip' },

    // ---- الحقائب (trips.html) ----
    'trips.title': { ar: 'الحقيبة الجاهزة', en: 'Ready Bag' },
    'trips.lead': { ar: 'حقائب رحلات جاهزة من مخزون رحّال — تقدر تعدّل عليها وتضيف أو تشيل عناصر قبل ما تشتري.', en: "Ready trip bags from Rahhal's own stock — you can customize by adding or removing items before you buy." },
    'trips.customizeEyebrow': { ar: 'تخصيص الحقيبة', en: 'Customize Bag' },
    'trips.resetPackage': { ar: 'إعادة الحقيبة لوضعها الأصلي', en: 'Reset Bag to Original' },
    'trips.summaryHeading': { ar: 'ملخص الحقيبة', en: 'Bag Summary' },
    'trips.itemCount': { ar: 'عدد العناصر المختارة', en: 'Items Selected' },
    'trips.total': { ar: 'الإجمالي', en: 'Total' },
    'trips.addToCart': { ar: 'أضف الحقيبة للسلة', en: 'Add Bag to Cart' },
    'trips.selectBtn': { ar: 'خصّص واشتري', en: 'Customize & Buy' },
    'trips.categoryLabel': { ar: 'نوع الحقيبة', en: 'Bag Type' },
    'trips.conditionLabel': { ar: 'الحالة', en: 'Condition' },
    'trips.emptyState': { ar: 'ما فيه حقائب مطابقة لهذا الفلتر. جرّب تغيّر النوع أو الحالة.', en: 'No bags match this filter. Try changing the type or condition.' },
    'section.all': { ar: 'الكل', en: 'All' },

    // ---- بيع حقيبتك (sell-back.html) ----
    'nav.refill': { ar: 'إعادة التجهيز', en: 'Refill Service' },
    'footer.refill': { ar: 'إعادة التجهيز', en: 'Refill Service' },
    'nav.sellback': { ar: 'بيع حقيبتك', en: 'Sell Your Bag' },
    'footer.sellback': { ar: 'بيع حقيبتك', en: 'Sell Your Bag' },
    'sellback.title': { ar: 'بيع حقيبتك المستعملة', en: 'Sell Your Used Bag' },
    'sellback.lead': { ar: 'خلصت من حقيبة اشتريتها من رحّال؟ بيعها لنا بنص السعر اللي دفعتيه، وننظّفها ونفحصها ونعيد بيعها لعميل ثاني.', en: "Done with a bag you bought from Rahhal? Sell it back to us for half what you paid — we'll clean, inspect, and resell it." },
    'sellback.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
    'sellback.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'sellback.bagType': { ar: 'نوع الحقيبة', en: 'Bag Type' },
    'sellback.chooseBag': { ar: 'اختر نوع الحقيبة', en: 'Choose bag type' },
    'sellback.purchasePrice': { ar: 'كم دفعت فيها وقت الشراء (ر.ع)؟', en: 'How much did you pay for it (OMR)?' },
    'sellback.condition': { ar: 'حالة الحقيبة الآن', en: "Bag's Current Condition" },
    'sellback.condExcellent': { ar: 'ممتازة — كأنها جديدة', en: 'Excellent — like new' },
    'sellback.condGood': { ar: 'جيدة — استخدام عادي', en: 'Good — normal use' },
    'sellback.condFair': { ar: 'متوسطة — فيها أثر استخدام واضح', en: 'Fair — visible wear' },
    'sellback.notes': { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional Notes (optional)' },
    'sellback.notesPlaceholder': { ar: 'أي تفاصيل عن حالة العناصر داخل الحقيبة', en: 'Any details about the condition of items inside' },
    'sellback.estimateHeading': { ar: 'السعر التقديري لإعادة الشراء', en: 'Estimated Buyback Price' },
    'sellback.estimateLabel': { ar: 'تقريباً (نصف سعر الشراء)', en: 'Approximately (half the purchase price)' },
    'sellback.estimateNote': { ar: 'السعر النهائي يتأكد بعد ما فريقنا يفحص الحقيبة فعلياً.', en: 'The final price is confirmed after our team physically inspects the bag.' },
    'sellback.submit': { ar: 'أرسل طلب البيع', en: 'Submit Sell Request' },
    'sellback.howHeading': { ar: 'كيف تشتغل الخطوات؟', en: 'How does it work?' },
    'sellback.step1': { ar: '١. تعبّي بيانات الحقيبة وسعرها الأصلي', en: '1. Fill in the bag details and original price' },
    'sellback.step2': { ar: '٢. نتواصل معك لتأكيد موعد استلامها', en: '2. We contact you to confirm a pickup time' },
    'sellback.step3': { ar: '٣. نفحصها وننظّفها، ونحوّل لك نصف السعر', en: '3. We inspect and clean it, and transfer half the price to you' },
    'sellback.step4': { ar: '٤. نعيد بيعها لعميل ثاني بسعر أقل من الجديدة', en: '4. We resell it to another customer at a lower price than new' },

    // ---- إعادة التجهيز (refill.html) ----
    'refill.title': { ar: 'إعادة تجهيز الحقيبة', en: 'Bag Refill Service' },
    'refill.lead': { ar: 'خلّصت مكونات حقيبتك؟ اختر حقيبتك وبنعرض لك كل عناصرها الأصلية، وحدّد وش نقص بس — والسعر يتحدّث بالفاتورة على طول حسب اللي تختاره.', en: "Ran out of your bag contents? Pick your bag and we'll show its exact original items — choose only what's missing, and the invoice updates instantly." },
    'refill.chooseBagLabel': { ar: 'الحقيبة اللي عندك', en: 'The Bag You Have' },
    'refill.chooseBag': { ar: 'اختر حقيبتك', en: 'Choose your bag' },
    'refill.originalQty': { ar: 'الكمية الأصلية بالحقيبة', en: 'Original quantity in bag' },
    'refill.summaryHeading': { ar: 'ملخص إعادة التجهيز', en: 'Refill Summary' },
    'refill.submit': { ar: 'أرسل طلب إعادة التجهيز', en: 'Submit Refill Request' },
    'refill.emptyState': { ar: 'اختر حقيبتك فوق عشان تشوف عناصرها الأصلية وتحدّد وش تحتاج تعبّيه من جديد.', en: 'Choose your bag above to see its original items and pick what needs refilling.' },

    // ---- عناصر مشتركة بصفحات القسم (فلترة/فرز) ----
    'section.sortDefault': { ar: 'الترتيب الافتراضي', en: 'Default Order' },
    'section.sortPriceAsc': { ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' },
    'section.sortPriceDesc': { ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' },
    'section.sortName': { ar: 'الاسم (أ-ي)', en: 'Name (A-Z)' },
    'section.emptyState': { ar: 'ما فيه نتائج مطابقة. جرّب كلمة ثانية أو امسح الفلتر.', en: 'No matching results. Try another word or clear the filter.' },
    'section.addBtn': { ar: 'أضف', en: 'Add' },
    'equipment.title': { ar: 'المعدات', en: 'Equipment' },
    'equipment.lead': { ar: 'معدات غوص وتخييم ورحلات براً وبحراً بأفضل الأسعار', en: 'Diving, camping, and land & sea trip gear at the best prices' },

    // ---- السلة (cart.html) ----
    'cart.title': { ar: 'سلة الطلبات', en: 'Cart' },
    'cart.lead': { ar: 'راجع طلبك وعدّل الكميات قبل إتمام الشراء', en: 'Review your order and adjust quantities before completing your purchase' },
    'cart.summaryHeading': { ar: 'ملخص الطلب', en: 'Order Summary' },
    'cart.itemCount': { ar: 'عدد القطع', en: 'Item Count' },
    'cart.subtotal': { ar: 'المجموع الفرعي', en: 'Subtotal' },
    'cart.serviceFee': { ar: 'رسوم الخدمة', en: 'Service Fee' },
    'cart.total': { ar: 'الإجمالي', en: 'Total' },
    'cart.checkoutBtn': { ar: 'إتمام الطلب ←', en: 'Checkout ←' },
    'cart.continueBrowsing': { ar: 'متابعة التصفح', en: 'Continue Browsing' },
    'cart.emptyTitle': { ar: 'سلتك فارغة حالياً', en: 'Your cart is currently empty' },
    'cart.emptyBtn': { ar: 'ابدأ التصفح', en: 'Start Browsing' },
    'cart.removeLink': { ar: 'حذف', en: 'Remove' },

    // ---- إتمام الطلب (checkout.html) ----
    'checkout.title': { ar: 'إتمام الطلب', en: 'Checkout' },
    'checkout.lead': { ar: 'عبّي بياناتك وراجع الفاتورة قبل التأكيد', en: 'Fill in your details and review the invoice before confirming' },
    'checkout.emptyText': { ar: 'سلتك فارغة، ما فيه شي تدفع له.', en: 'Your cart is empty, nothing to pay for.' },
    'checkout.startBrowsing': { ar: 'ابدأ التصفح', en: 'Start Browsing' },
    'checkout.orderEyebrow': { ar: 'فاتورة الطلب', en: 'Order Invoice' },
    'checkout.orderHeading': { ar: 'بيانات التوصيل والدفع', en: 'Delivery & payment details' },
    'checkout.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
    'checkout.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'checkout.address': { ar: 'العنوان / نقطة التسليم', en: 'Address / Delivery Point' },
    'checkout.notes': { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional Notes (optional)' },
    'checkout.notesPlaceholder': { ar: 'أي تفاصيل تساعد فريقنا يجهز طلبك', en: 'Any details to help our team prepare your order' },
    'checkout.paymentMethodHeading': { ar: 'طريقة الدفع', en: 'Payment Method' },
    'checkout.paymentMethodLabel': { ar: 'اختر طريقة الدفع', en: 'Choose Payment Method' },
    'checkout.payCard': { ar: 'بطاقة ائتمانية / مدى', en: 'Credit Card / Mada' },
    'checkout.payCod': { ar: 'الدفع عند الاستلام', en: 'Cash on Delivery' },
    'checkout.payTransfer': { ar: 'تحويل بنكي', en: 'Bank Transfer' },
    'checkout.cardNumber': { ar: 'رقم البطاقة', en: 'Card Number' },
    'checkout.expiry': { ar: 'تاريخ الانتهاء', en: 'Expiry Date' },
    'checkout.storageTitle': { ar: '🗄️ خزّن حقيبتك عندنا', en: '🗄️ Store Your Bag With Us' },
    'checkout.storageDesc': { ar: 'بدل ما تاخذها معك، خلّها بمخزننا لين رحلتك الجاية — 1 ر.ع شهرياً بس.', en: "Instead of taking it home, leave it in our warehouse until your next trip — just 1 OMR/month." },
    'checkout.confirmOrder': { ar: 'تأكيد الطلب', en: 'Confirm Order' },
    'checkout.orderSummary': { ar: 'ملخص الطلب', en: 'Order Summary' },

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
    'terms.lead': { ar: 'يرجى قراءة هذه الشروط بعناية قبل استخدام منصة رحّال أو تأكيد أي طلب', en: 'Please read these terms carefully before using the Rahhal platform or confirming any order' },
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
