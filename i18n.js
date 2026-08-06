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
    'footer.about': { ar: 'منصة رحّال — تجمّع موردين موثوقين لمعدات الرحلات وتنظّمهم بحقائب جاهزة مفحوصة حسب نوع الرحلة.', en: 'Rahhal platform — brings together vetted suppliers of trip gear and organizes them into inspected, ready-made bags by trip type.' },
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
    'home.heroEyebrow': { ar: 'منصة حقائب الرحلات الجاهزة', en: 'The ready trip bag platform' },
    'home.heroTitle': { ar: 'جهّز رحلتك القادمة بضغطة واحدة', en: 'Prep your next trip in one click' },
    'home.heroLead': { ar: 'حقائب رحلات جاهزة بمحتويات حقيقية من موردين فحصناهم بأنفسنا — جديدة أو مستعملة نظيفة بسعر أقل، لكل أنواع الرحلات.', en: 'Ready trip bags with real contents from suppliers we vet ourselves — new or clean pre-owned at a lower price, for every kind of trip.' },
    'home.browseTrips': { ar: 'تصفح الحقائب', en: 'Browse Trip Bags' },
    'assistant.eyebrow': { ar: 'مساعد رحّال الذكي', en: 'Rahhal Smart Assistant' },
    'assistant.title': { ar: 'وش تحتاج لرحلتك؟ اكتبها لي بكلامك العادي', en: 'What do you need for your trip? Just describe it' },
    'assistant.lead': { ar: 'مثال: "بديت اطلع تخييم بالبر" أو "بغيت حقيبة بحر للعائلة"', en: 'Example: "Going camping in the desert" or "I want a beach bag for the family"' },
    'assistant.inputPlaceholder': { ar: 'اكتب وصف رحلتك هنا...', en: 'Describe your trip here...' },
    'assistant.submit': { ar: 'اسأل رحّال', en: 'Ask Rahhal' },
    'home.categoriesEyebrow': { ar: 'اختر نوع رحلتك', en: 'Choose your trip type' },
    'home.vettingEyebrow': { ar: 'كيف نفحص الموردين', en: 'How we vet suppliers' },
    'home.vettingTitle': { ar: 'كل منتج على رحّال يمر بأربع خطوات فحص قبل ما توصلك', en: 'Every product on Rahhal passes four checks before it reaches you' },
    'home.vettingLead': { ar: 'رحّال ما يبيع بضاعته — يتحقق من جودة كل مورد ومنتج قبل قبوله على المنصة، عشان تشتري بثقة من مكان واحد.', en: "Rahhal doesn't sell its own goods — it verifies every supplier and product before accepting them, so you can buy with confidence from one place." },
    'home.vettingStep1Title': { ar: 'تقديم المورد', en: 'Supplier application' },
    'home.vettingStep1Desc': { ar: 'المورد يقدّم طلب انضمام ويعرض عينة فعلية من منتجاته.', en: 'The supplier applies to join and shows an actual sample of their products.' },
    'home.vettingStep2Title': { ar: 'فحص الجودة', en: 'Quality check' },
    'home.vettingStep2Desc': { ar: 'فريق رحّال يراجع كل منتج على قائمة فحص واضحة قبل قبوله.', en: 'The Rahhal team reviews every product against a clear checklist before approval.' },
    'home.vettingStep3Title': { ar: 'شارة "مفحوص من رحّال"', en: '"Verified by Rahhal" badge' },
    'home.vettingStep3Desc': { ar: 'المنتجات المعتمدة توسم بشارة الفحص وتظهر باسم موردها.', en: 'Approved products get a verified badge and show their supplier name.' },
    'home.vettingStep4Title': { ar: 'متابعة دورية', en: 'Ongoing follow-up' },
    'home.vettingStep4Desc': { ar: 'جرد وفحص دوري لكل منتج بالمخزن الموحّد، وتقييمات موثقة بعد كل عملية شراء.', en: 'Regular inventory checks at the shared warehouse, plus verified reviews after every purchase.' },
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
    'trips.lead': { ar: 'حقائب رحلات جاهزة من موردين فحصهم رحّال — تقدر تعدّل عليها وتضيف أو تشيل عناصر قبل ما تشتري.', en: 'Ready trip bags from suppliers Rahhal has vetted — you can customize by adding or removing items before you buy.' },
    'trips.customizeEyebrow': { ar: 'تخصيص الحقيبة', en: 'Customize Bag' },
    'trips.resetPackage': { ar: 'إعادة الحقيبة لوضعها الأصلي', en: 'Reset Bag to Original' },
    'trips.catalogHeading': { ar: 'إضافة عناصر أخرى من الكتالوج', en: 'Add more items from the catalog' },
    'trips.catalogLead': { ar: 'منتجات إضافية مناسبة لنوع رحلتك من موردين مفحوصين — أضيفي أي شي تحتاجينه فوق محتوى الحقيبة الأصلي.', en: "Extra products that fit your trip type, from vetted suppliers — add anything you need on top of the bag's original contents." },
    'trips.addExtra': { ar: '+ إضافة', en: '+ Add' },
    'trips.itemSearchHeading': { ar: 'ناقصك شي أو تبين بديل أرخص؟', en: 'Missing something or want a cheaper option?' },
    'trips.itemSearchLead': { ar: 'اكتب اسم أي غرض — النتائج تطلع مرتبة من الأرخص للأغلى من كامل الكتالوج.', en: 'Type any item name — results are sorted cheapest first across the whole catalog.' },
    'trips.itemSearchPlaceholder': { ar: 'مثال: كرسي، ولاعة، حذاء...', en: 'e.g. chair, lighter, shoes...' },
    'trips.itemSearchEmpty': { ar: 'ما لقينا نتائج مطابقة — جرّبي كلمة ثانية', en: "No matches found — try a different word" },
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
    'nav.joinSupplier': { ar: 'انضم كمورد', en: 'Join as Supplier' },
    'nav.joinPartner': { ar: 'انضم كشريك نشاط', en: 'Join as Activity Partner' },
    'footer.joinSupplier': { ar: 'انضم كمورد', en: 'Join as Supplier' },
    'footer.joinPartner': { ar: 'انضم كشريك نشاط', en: 'Join as Activity Partner' },
    'sellback.title': { ar: 'اعرضي حقيبتك المستعملة للبيع', en: 'List Your Used Bag for Sale' },
    'sellback.lead': { ar: 'خلصتِ من حقيبة اشتريتها من رحّال؟ اعرضيها للبيع بعد الفحص — رحّال يفحصها ويعرضها بشارة "مفحوصة من رحّال"، وياخذ عمولة 20% بس من سعر البيع لما تتباع فعلاً.', en: 'Done with a bag you bought from Rahhal? List it for sale after inspection — Rahhal inspects it, lists it with a "verified" badge, and only takes a 20% commission once it actually sells.' },
    'sellback.fullName': { ar: 'الاسم الكامل', en: 'Full Name' },
    'sellback.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'sellback.bagType': { ar: 'نوع الحقيبة', en: 'Bag Type' },
    'sellback.chooseBag': { ar: 'اختر نوع الحقيبة', en: 'Choose bag type' },
    'sellback.purchasePrice': { ar: 'بأي سعر تبين تعرضينها للبيع (ر.ع)؟', en: 'What price do you want to list it for (OMR)?' },
    'sellback.condition': { ar: 'حالة الحقيبة الآن', en: "Bag's Current Condition" },
    'sellback.condExcellent': { ar: 'ممتازة — كأنها جديدة', en: 'Excellent — like new' },
    'sellback.condGood': { ar: 'جيدة — استخدام عادي', en: 'Good — normal use' },
    'sellback.condFair': { ar: 'متوسطة — فيها أثر استخدام واضح', en: 'Fair — visible wear' },
    'sellback.notes': { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional Notes (optional)' },
    'sellback.notesPlaceholder': { ar: 'أي تفاصيل عن حالة العناصر داخل الحقيبة', en: 'Any details about the condition of items inside' },
    'sellback.estimateHeading': { ar: 'لما تتباع، بتستلمين تقريباً', en: "Once it sells, you'll receive approximately" },
    'sellback.commissionLabel': { ar: 'عمولة رحّال (20%)', en: 'Rahhal commission (20%)' },
    'sellback.estimateLabel': { ar: 'صافي المبلغ لك', en: 'Your net amount' },
    'sellback.estimateNote': { ar: 'السعر النهائي يتأكد بعد ما فريقنا يفحص الحقيبة فعلياً، والمبلغ يوصلك بعد إتمام عملية البيع.', en: 'The final price is confirmed after our team physically inspects the bag, and the amount is paid out once the sale completes.' },
    'sellback.submit': { ar: 'أرسل طلب العرض', en: 'Submit Listing Request' },
    'sellback.howHeading': { ar: 'كيف تشتغل الخطوات؟', en: 'How does it work?' },
    'sellback.step1': { ar: '١. تعبّي بيانات الحقيبة والسعر اللي تبين تعرضينها فيه', en: '1. Fill in the bag details and your listing price' },
    'sellback.step2': { ar: '٢. فريقنا يتواصل معك ويفحص الحقيبة', en: '2. Our team contacts you and inspects the bag' },
    'sellback.step3': { ar: '٣. نعرضها للبيع بشارة "مفحوصة من رحّال"', en: '3. We list it for sale with a "verified by Rahhal" badge' },
    'sellback.step4': { ar: '٤. لما تنباع، يوصلك سعرها ناقص عمولة رحّال (20%)', en: "4. Once it sells, you get the price minus Rahhal's 20% commission" },

    // ---- انضم كمورد (join-supplier.html) ----
    'joinSupplier.title': { ar: 'وسّع مبيعاتك عبر رحّال', en: 'Grow your sales through Rahhal' },
    'joinSupplier.lead': { ar: 'قناة بيع جاهزة بدون تعب تسويق أو تعامل مباشر مع كل عميل — رحّال يفحص منتجك، يعرضه ضمن حقائب جاهزة موثوقة، وياخذ عمولة على البيع فقط.', en: 'A ready sales channel with no marketing hassle or direct customer handling — Rahhal inspects your product, features it in trusted ready-made bags, and only takes a commission on sales.' },
    'joinSupplier.shopName': { ar: 'اسم المتجر أو المورد', en: 'Shop / Supplier Name' },
    'joinSupplier.contactName': { ar: 'اسم المسؤول', en: 'Contact Person' },
    'joinSupplier.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'joinSupplier.city': { ar: 'المدينة', en: 'City' },
    'joinSupplier.category': { ar: 'نوع المنتجات اللي تقدّمها', en: 'Product Category You Supply' },
    'joinSupplier.chooseCategory': { ar: 'اختر النوع', en: 'Choose a category' },
    'joinSupplier.notes': { ar: 'وصف مختصر لمنتجاتك (اختياري)', en: 'Brief description of your products (optional)' },
    'joinSupplier.notesPlaceholder': { ar: 'مثال: خيام وكراسي تخييم، تصنيع محلي', en: 'e.g. Tents and camping chairs, locally made' },
    'joinSupplier.submit': { ar: 'أرسل طلب الانضمام', en: 'Submit Application' },
    'joinSupplier.termsHeading': { ar: 'شروط الانضمام والعمولة', en: 'Joining Terms & Commission' },
    'joinSupplier.term1': { ar: '✅ عينة فعلية من منتجك تمر بفحص جودة قبل القبول', en: '✅ An actual sample of your product goes through a quality check before approval' },
    'joinSupplier.term2': { ar: '✅ عمولة رحّال تبدأ من 15% وحتى 25% حسب نوع المنتج', en: "✅ Rahhal's commission ranges from 15% to 25% depending on product type" },
    'joinSupplier.term3': { ar: '✅ تسوية مالية دورية بعد خصم العمولة — بدون تعقيد', en: '✅ Periodic payouts after commission is deducted — no hassle' },
    'joinSupplier.term4': { ar: '✅ المنتجات المرخّصة (غوص، إرشاد جبلي) تُدار كإحالة عمولة فقط', en: '✅ Licensed categories (diving, mountain guiding) are handled as referral-only, commission on referral' },
    'joinSupplier.stepsHeading': { ar: 'كيف تشتغل الخطوات؟', en: 'How does it work?' },
    'joinSupplier.step1': { ar: '١. تعبّي بيانات متجرك ونوع منتجاتك', en: '1. Fill in your shop details and product category' },
    'joinSupplier.step2': { ar: '٢. فريقنا يتواصل معك ويراجع عينة فعلية', en: '2. Our team contacts you and reviews an actual sample' },
    'joinSupplier.step3': { ar: '٣. توقّعون عقد مورد يوضّح العمولة والتسوية', en: '3. You sign a supplier agreement covering commission and payouts' },
    'joinSupplier.step4': { ar: '٤. منتجاتك تظهر على المنصة بشارة "مفحوص من رحّال"', en: '4. Your products go live on the platform with a "verified by Rahhal" badge' },

    'joinPartner.title': { ar: 'قدّم نشاطك المرخّص لعملاء رحّال', en: 'Offer your licensed activity to Rahhal customers' },
    'joinPartner.lead': { ar: 'غوص، إرشاد جبلي، جولات سياحية — رحّال تعرّف عملاءها بك كمزوّد مرخّص وتاخذ عمولة إحالة فقط. الحجز والدفع وتنفيذ النشاط كله مباشرة بينك وبين العميل.', en: 'Diving, mountain guiding, tours — Rahhal introduces customers to you as a licensed provider and only takes a referral commission. Booking, payment, and running the activity all happen directly between you and the customer.' },
    'joinPartner.businessName': { ar: 'اسم النشاط أو الشركة', en: 'Business / Activity Name' },
    'joinPartner.contactName': { ar: 'اسم المسؤول', en: 'Contact Person' },
    'joinPartner.phone': { ar: 'رقم الجوال', en: 'Phone Number' },
    'joinPartner.activityCategory': { ar: 'نوع النشاط', en: 'Activity Type' },
    'joinPartner.chooseActivity': { ar: 'اختر النوع', en: 'Choose a type' },
    'joinPartner.activityDiving': { ar: 'غوص', en: 'Diving' },
    'joinPartner.activityMountainGuide': { ar: 'إرشاد جبلي', en: 'Mountain Guiding' },
    'joinPartner.activityTours': { ar: 'جولات سياحية', en: 'Tours' },
    'joinPartner.activityCampingGuide': { ar: 'إرشاد تخييم/رحلات برية', en: 'Camping / Off-road Guiding' },
    'joinPartner.activityOther': { ar: 'أخرى', en: 'Other' },
    'joinPartner.licenseNumber': { ar: 'رقم الترخيص (اختياري)', en: 'License Number (optional)' },
    'joinPartner.licenseExpiry': { ar: 'تاريخ انتهاء الترخيص (اختياري)', en: 'License Expiry Date (optional)' },
    'joinPartner.licenseFile': { ar: 'صورة أو PDF لمستند الترخيص (إجباري)', en: 'License document image or PDF (required)' },
    'joinPartner.licenseFileNote': { ar: 'يفحصه نظام ذكاء اصطناعي أولاً استرشادياً، والقرار النهائي دايماً بمراجعة بشرية من فريق رحّال.', en: 'An AI system reviews it first as guidance only — the final decision is always a human review by the Rahhal team.' },
    'joinPartner.notes': { ar: 'ملاحظات إضافية (اختياري)', en: 'Additional notes (optional)' },
    'joinPartner.notesPlaceholder': { ar: 'أي تفاصيل تحبّ تشاركها معنا', en: 'Any details you would like to share' },
    'joinPartner.submit': { ar: 'أرسل طلب الانضمام', en: 'Submit Application' },
    'joinPartner.disclaimerHeading': { ar: 'رحّال وسيط إحالة فقط', en: 'Rahhal is a referral intermediary only' },
    'joinPartner.disclaimer1': { ar: '✅ رحّال لا تبيع ولا تخزّن ولا توصّل هذا النشاط — تعريف وإحالة فقط', en: '✅ Rahhal does not sell, store, or deliver this activity — introduction and referral only' },
    'joinPartner.disclaimer2': { ar: '✅ الحجز والدفع مباشرة بينك وبين العميل، خارج منصة رحّال', en: '✅ Booking and payment happen directly between you and the customer, outside Rahhal' },
    'joinPartner.disclaimer3': { ar: '✅ أنت المسؤول القانوني الوحيد عن ترخيصك وتنفيذ النشاط بأمان', en: '✅ You are solely legally responsible for your license and running the activity safely' },
    'joinPartner.disclaimer4': { ar: '✅ عمولة إحالة على كل عميل يوصلك عن طريق رحّال فقط', en: '✅ A referral commission only on customers who reach you through Rahhal' },
    'joinPartner.stepsHeading': { ar: 'كيف تشتغل الخطوات؟', en: 'How does it work?' },
    'joinPartner.step1': { ar: '١. تعبّي بيانات نشاطك وترفع مستند الترخيص', en: '1. Fill in your activity details and upload your license document' },
    'joinPartner.step2': { ar: '٢. ذكاء اصطناعي يفحص المستند فوراً (استخراج بيانات + ملاحظات)', en: '2. AI reviews the document instantly (data extraction + notes)' },
    'joinPartner.step3': { ar: '٣. فريق رحّال يراجع الطلب ويتخذ القرار النهائي', en: '3. The Rahhal team reviews the application and makes the final decision' },
    'joinPartner.step4': { ar: '٤. نشاطك يظهر على المنصة بشارة "مفحوص من رحّال"', en: '4. Your activity goes live on the platform with a "verified by Rahhal" badge' },

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
    'cart.groupDiscount': { ar: '🎉 خصم الحجز العائلي/الجماعي (10%)', en: '🎉 Family/Group Booking Discount (10%)' },
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
    'checkout.deliveryType': { ar: 'نوع التوصيل', en: 'Delivery Type' },
    'checkout.deliveryHome': { ar: 'توصيل للبيت', en: 'Home Delivery' },
    'checkout.deliveryTrip': { ar: 'توصيل مباشر لموقع الرحلة', en: 'Direct Delivery to Trip Location' },
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
