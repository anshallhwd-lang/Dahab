import { Program, Transformation, FAQItem, Step } from "./types";

export const PROGRAMS_DATA: Program[] = [
  {
    id: "diet-plan",
    titleEn: "DIET PLAN",
    titleAr: "خطة النظام الغذائي",
    subtitleEn: "Customized Diet Plan + Basic Supplement Plan",
    subtitleAr: "خطة غذائية مخصصة + خطة مكملات أساسية",
    icon: "UtensilsCrossed",
    bgImage: "diet_plan_bg_1782919273236.jpg",
    price: "$199",
    featuresEn: [
      "12-Week Customized Meal Plan",
      "Exact macronutrients and calorie breakdown",
      "Basic Supplement Guidance",
      "Bi-weekly check-ins and adjustments",
      "Email and chat support"
    ],
    featuresAr: [
      "خطة وجبات مخصصة لمدة 12 أسبوعًا",
      "تقسيم دقيق للماكروز والسعرات الحرارية",
      "إرشادات المكملات الأساسية",
      "متابعة وتعديلات كل أسبوعين",
      "دعم عبر البريد الإلكتروني والدردشة"
    ]
  },
  {
    id: "workout-program",
    titleEn: "WORKOUT PROGRAM",
    titleAr: "برنامج التدريب",
    subtitleEn: "Detailed Workout Program. Get to the Next Level",
    subtitleAr: "برنامج تدريبي مفصل. انتقل إلى المستوى التالي",
    icon: "Dumbbell",
    bgImage: "workout_bg_1782919286963.jpg",
    price: "$249",
    featuresEn: [
      "12-Week Customized Workout Split",
      "Custom sets, reps, and rest instructions",
      "Exercise tutorial videos",
      "Cardio & core program integrated",
      "Bi-weekly progress audits"
    ],
    featuresAr: [
      "تقسيم تمارين مخصص لمدة 12 أسبوعًا",
      "تعليمات مخصصة للمجموعات والتكرارات والراحة",
      "فيديوهات تعليمية للتمارين",
      "برنامج مدمج للكارديو وتمارين البطن",
      "تدقيق التقدم كل أسبوعين"
    ]
  },
  {
    id: "supplement-plan",
    titleEn: "ADVANCED SUPPLEMENT PLAN",
    titleAr: "خطة المكملات المتقدمة",
    subtitleEn: "Bodybuilding Game Changer",
    subtitleAr: "مغير اللعبة في كمال الأجسام",
    icon: "Zap",
    bgImage: "supplement_bg_1782919300875.jpg",
    price: "$149",
    featuresEn: [
      "Advanced anabolic & health supplement protocol",
      "Strategic dosing, timing, and cycle length",
      "Bloat prevention & digestion support",
      "Performance optimization tips",
      "Direct Q&A regarding supplement brands"
    ],
    featuresAr: [
      "بروتوكول متقدم للمكملات الغذائية والصحة",
      "الجرعات الاستراتيجية والتوقيت ومدة الدورة",
      "الوقاية من الانتفاخ ودعم الهضم",
      "نصائح تحسين الأداء الرياضي",
      "أسئلة وأجوبة مباشرة حول ماركات المكملات"
    ]
  }
];

export const TRANSFORMATIONS_DATA: Transformation[] = [
  {
    id: "t1",
    name: "KMPRANKS",
    beforeImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=60&w=500",
    afterImg: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=60&w=500",
    durationEn: "12 Weeks",
    durationAr: "١٢ أسبوعًا",
    tagEn: "ALL NATURAL - FAMOUS YOUTUBER",
    tagAr: "طبيعي بالكامل - يوتيوبر شهير",
    descriptionEn: "1 Program - All Natural transformation, gaining lean muscle mass while shredding body fat.",
    descriptionAr: "برنامج واحد - تحول طبيعي بالكامل، واكتساب كتلة عضلية صافية أثناء حرق دهون الجسم."
  },
  {
    id: "t2",
    name: "VEGAN ATHLETE",
    beforeImg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=60&w=500",
    afterImg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=60&w=500",
    durationEn: "12 Weeks",
    durationAr: "١٢ أسبوعًا",
    tagEn: "100% VEGAN - ALL NATURAL",
    tagAr: "نباتي ١٠٠٪ - طبيعي بالكامل",
    descriptionEn: "Incredible lean mass building on a fully plant-based customized nutrition protocol.",
    descriptionAr: "بناء كتلة عضلية مذهل بناءً على بروتوكول تغذية نباتي بالكامل ومخصص."
  },
  {
    id: "t3",
    name: "YOUSEF SABRY",
    beforeImg: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=60&w=500",
    afterImg: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=60&w=500",
    durationEn: "10 Weeks",
    durationAr: "١٠ أسابيع",
    tagEn: "10 WEEKS TRANSFORM",
    tagAr: "تحول في ١٠ أسابيع",
    descriptionEn: "Massive conditioning and muscle density improvements with strict carbohydrate cycling.",
    descriptionAr: "تحسن هائل في التنشيف وكثافة العضلات مع تدوير الكربوهيدرات الصارم."
  },
  {
    id: "t4",
    name: "MOHAMAD MAKARI",
    beforeImg: "https://images.unsplash.com/photo-1505230408221-3fc62d57507d?auto=format&fit=crop&q=60&w=500",
    afterImg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=60&w=500",
    durationEn: "24 Weeks",
    durationAr: "٢٤ أسبوعًا",
    tagEn: "2 Programs - Ultimate Shred",
    tagAr: "برنامجان - التنشيف النهائي",
    descriptionEn: "Complete lifestyle and body recomposition over two consecutive programs.",
    descriptionAr: "إعادة تركيب الجسم بالكامل وتغيير نمط الحياة عبر برنامجين متتاليين."
  }
];

export const STEPS_DATA: Step[] = [
  {
    number: 1,
    titleEn: "SUBMISSION",
    titleAr: "تقديم الطلب",
    descEn: "Fill the form and upload Your pictures.",
    descAr: "املأ النموذج وارفع صورك القياسية.",
    icon: "SquarePen"
  },
  {
    number: 2,
    titleEn: "RECEIVE PROGRAM",
    titleAr: "استلام البرنامج",
    descEn: "Wait the duration needed to have Dahab Fit customize your entire program.",
    descAr: "انتظر المدة اللازمة ليقوم كوتش دهب بتخصيص برنامجك بالكامل.",
    icon: "FileText"
  },
  {
    number: 3,
    titleEn: "FOLLOW PROGRAM",
    titleAr: "اتباع البرنامج",
    descEn: "Follow your diet and workout plan.",
    descAr: "اتبع خطتك الغذائية والتدريبية بدقة.",
    icon: "Dumbbell"
  },
  {
    number: 4,
    titleEn: "FOLLOW UP",
    titleAr: "المتابعة",
    descEn: "Send Dahab Fit any concerns or questions you might have regarding the plan.",
    descAr: "أرسل لكوتش دهب أي مخاوف أو استفسارات قد تكون لديك بشأن الخطة.",
    icon: "MailOpen"
  },
  {
    number: 5,
    titleEn: "RESULTS",
    titleAr: "النتائج والتميز",
    descEn: "Look better within 12 weeks!",
    descAr: "احصل على أفضل شكل لجسمك في غضون ١٢ أسبوعًا!",
    icon: "Trophy"
  }
];

export const FAQS_DATA: FAQItem[] = [
  {
    id: "faq-1",
    questionEn: "WHO NEEDS THIS PROGRAM?",
    questionAr: "من يحتاج إلى هذا البرنامج؟",
    answerEn: "Anyone trying to improve his lifestyle, get healthier, lose weight, or gain muscle. No matter your starting level, everything is customized specifically for you.",
    answerAr: "أي شخص يحاول تحسين نمط حياته، أو التمتع بصحة أفضل، أو إنقاص الوزن، أو اكتساب العضلات. بغض النظر عن مستواك البدني الحالي، يتم تفصيل كل شيء خصيصًا لك."
  },
  {
    id: "faq-2",
    questionEn: "IS THIS ONLY FOR BODYBUILDERS?",
    questionAr: "هل هذا البرنامج للاعبي كمال الأجسام فقط؟",
    answerEn: "No, this program is designed for everyone—from corporate professionals and busy parents to competitive athletes and fitness models who want elite-level results.",
    answerAr: "لا، هذا البرنامج مصمم للجميع — من موظفي الشركات والآباء المشغولين إلى الرياضيين المحترفين وعارضي اللياقة البدنية الذين يبحثون عن نتائج ممتازة."
  },
  {
    id: "faq-3",
    questionEn: "IS THE PROGRAM HARD TO FOLLOW? I HAVE A ROUGH WORK/SCHOOL SCHEDULE!",
    questionAr: "هل يصعب اتباع البرنامج؟ لدي جدول عمل/دراسة مزدحم وجدول صعب!",
    answerEn: "All meal plans and workout splits are formulated around your daily lifestyle, profession, and schedule. We work together to ensure it is highly sustainable.",
    answerAr: "يتم صياغة جميع خطط الوجبات وتقسيمات التمارين حول نمط حياتك اليومي ومهنتك وجدولك الزمني. نحن نعمل معًا لضمان استدامته العالية وسهولته."
  },
  {
    id: "faq-4",
    questionEn: "HOW LONG DOES IT TAKE TO MAKE THE PROGRAM?",
    questionAr: "كم من الوقت يستغرق إعداد وتصميم البرنامج المخصص لي؟",
    answerEn: "It takes approximately 5 to 7 business days to complete the physical, scientific analysis of your questionnaire and pictures, and draft your tailored plan.",
    answerAr: "يستغرق الأمر ما يقرب من ٥ إلى ٧ أيام عمل لإكمال التحليل العلمي والبدني للاستبيان الخاص بك والصور، وصياغة خطتك المخصصة."
  },
  {
    id: "faq-5",
    questionEn: "WHAT IF I HAVE QUESTIONS WHEN I RECEIVE THE PLAN?",
    questionAr: "ماذا لو كانت لدي أسئلة أو استفسارات فور استلامي للخطة؟",
    answerEn: "You will have direct messaging/email access to check-ins. You can write your questions, and you will receive clarifications and modifications directly.",
    answerAr: "سيكون لديك وصول مباشر للدردشة/البريد الإلكتروني لإرسال تحديثاتك. يمكنك كتابة أسئلتك، وستتلقى التوضيحات والتعديلات اللازمة مباشرة."
  }
];

export const DICTIONARY = {
  en: {
    brandName: "DAHAB FIT",
    home: "HOME",
    whoIsDurrah: "ABOUT DAHAB FIT",
    transformations: "TRANSFORMATIONS",
    services: "SERVICES",
    videoConsultation: "VIDEO CONSULTATION",
    recipeBook: "RECIPE BOOK",
    contact: "CONTACT",
    olympianSub: "ELITE PERFORMANCE COACHING",
    middleEastSelling: "The Middle East's #1 Selling Online Coach",
    buyNow: "BUY NOW",
    topTransformations: "TOP TRANSFORMATION CLIENTS",
    changeLifeNow: "CHANGE YOUR LIFE NOW!",
    changingLivesTV: "CHANGING LIVES AS SEEN ON TV!",
    mediaParagraph1: "Being a worldwide top professional contender in the fitness industry, with 15 years of experience, and a record of over 12,000 *customized programs* made in the last three years alone, it's time you make a change, because your wellness deserves the best.",
    mediaParagraph2: "The program will consist of a 12 week diet plan, along with a complete workout and supplement program to follow to achieve the physique and shape you have always wanted.",
    mediaParagraph3: "Have doubts? Click below and check out the transformations, the testimonials, and what some top celebrities had to say.",
    buyTheProgram: "BUY THE PROGRAM",
    howItWorks: "HOW IT WORKS",
    faqTitle: "FREQUENTLY ASKED QUESTIONS",
    changeLifeToday: "CHANGE YOUR LIFE TODAY!",
    startTodaySub: "START YOUR",
    startTodayMain: "PROGRAM TODAY",
    checkHundredsTransformations: "CHECK OUT HUNDREDS OF TRANSFORMATIONS",
    transformBodyNow: "TRANSFORM YOUR BODY NOW!",
    coachingSince: "Coaching since",
    programsMade: "Over 16,000 programs made",
    publishedTransformations: "Over 600 published transformations",
    followDurrah: "FOLLOW DAHAB FIT",
    quickLinks: "QUICK LINKS",
    terms: "Terms and Conditions",
    customizedPrograms: "Customized Programs",
    arabicToggle: "عربي",
    englishToggle: "English",
    watchVideo: "Watch on YouTube",
    before: "BEFORE",
    after: "AFTER",
    formName: "Full Name",
    formEmail: "Email Address",
    formWeight: "Current Weight (kg)",
    formHeight: "Height (cm)",
    formAge: "Age",
    formGoal: "Fitness Goal",
    formGoalGain: "Build Muscle",
    formGoalShred: "Lose Fat / Shred",
    formGoalHealth: "Improve General Health",
    formPhotos: "Upload Current Photos (Front / Back / Side)",
    formSubmit: "SUBMIT APPLICATION & ORDER",
    selectPlan: "Select Your Plan",
    orderTitle: "Start Your Custom Elite Program",
    close: "Close",
    contactTitle: "Get In Touch",
    contactSub: "Have questions about our programs? Contact our support team.",
    contactSuccess: "Thank you! Your message has been received. Our team will get back to you within 24 hours.",
    sendMessage: "Send Message",
    bookConsultation: "Book VIP Video Consultation",
    consultationSub: "Schedule a private 30-minute 1-on-1 video call directly with Dahab Fit.",
    consultationSuccess: "Success! Your video consultation slot is reserved. We will email you the secure link.",
    recipeBookTitle: "Elite Bodybuilding Recipe Book",
    recipeBookSub: "High-protein, delicious, and easy-to-cook fitness meals tailored for muscle growth.",
    recipeBookDownload: "Download Recipe Book (PDF)",
    downloadSuccess: "Download started! Enjoy the recipes.",
    whoIsDurrahTitle: "Who is Coach Dahab?",
    whoIsDurrahP1: "Coach Dahab is a world-renowned fitness expert, professional coach, and the Middle East's most successful online fitness and bodybuilding coach.",
    whoIsDurrahP2: "With over 15 years of elite training, Coach Dahab combines science-based nutrition with high-performance training methods to deliver undeniable results. He has helped over 16,000 clients worldwide break boundaries and transform their physiques.",
  },
  ar: {
    brandName: "دهب فيت",
    home: "الرئيسية",
    whoIsDurrah: "عن دهب فيت",
    transformations: "التحولات",
    services: "الخدمات",
    videoConsultation: "استشارة فيديو",
    recipeBook: "كتاب الوصفات",
    contact: "اتصل بنا",
    olympianSub: "تدريب لياقة بدنية احترافي",
    middleEastSelling: "المدرب الإلكتروني الأول مبيعًا في الشرق الأوسط",
    buyNow: "اشترِ الآن",
    topTransformations: "أبرز تحولات المتدربين",
    changeLifeNow: "غير حياتك الآن!",
    changingLivesTV: "تغيير الحياة كما ظهر على شاشات التلفزيون!",
    mediaParagraph1: "بصفتي منافسًا محترفًا رائدًا عالميًا في صناعة اللياقة البدنية، مع خبرة ١٥ عامًا، وسجل حافل بأكثر من ١٢,٠٠٠ برنامج مخصص تم إعداده في السنوات الثلاث الأخيرة وحدها، فقد حان الوقت لإحداث التغيير، لأن صحتك تستحق الأفضل.",
    mediaParagraph2: "سيتكون البرنامج من خطة غذائية لمدة ١٢ أسبوعًا، إلى جانب برنامج تدريب ومكملات كامل لمساعدتك في تحقيق الشكل الذي طالما رغبت فيه.",
    mediaParagraph3: "لديك شكوك؟ انقر أدناه واطلع على التحولات، وشهادات المتدربين، وما قاله كبار المشاهير.",
    buyTheProgram: "اشترِ البرنامج",
    howItWorks: "كيف يعمل البرنامج",
    faqTitle: "الأسئلة الشائعة ومخاوف المتدربين",
    changeLifeToday: "ابدأ بتغيير حياتك اليوم!",
    startTodaySub: "ابدأ برنامجك",
    startTodayMain: "المخصص اليوم",
    checkHundredsTransformations: "شاهد مئات التحولات المذهلة",
    transformBodyNow: "حول جسمك الآن!",
    coachingSince: "خبرة تدريبية منذ عام",
    programsMade: "أكثر من ١٦,٠٠٠ برنامج تم تصميمه",
    publishedTransformations: "أكثر من ٦٠٠ تحول تم نشره بالصور",
    followDurrah: "تابع كوتش دهب فيت",
    quickLinks: "روابط سريعة",
    terms: "الشروط والأحكام",
    customizedPrograms: "البرامج المخصصة",
    arabicToggle: "عربي",
    englishToggle: "English",
    watchVideo: "شاهد على يوتيوب",
    before: "قبل",
    after: "بعد",
    formName: "الاسم الكامل",
    formEmail: "البريد الإلكتروني",
    formWeight: "الوزن الحالي (كجم)",
    formHeight: "الطول (سم)",
    formAge: "العمر",
    formGoal: "هدفك الرياضي",
    formGoalGain: "بناء وتضخيم العضلات",
    formGoalShred: "حرق الدهون والتنشيف",
    formGoalHealth: "تحسين اللياقة والصحة العامة",
    formPhotos: "ارفع صورك الحالية (أمامية / خلفية / جانبية)",
    formSubmit: "تقديم الطلب والاشتراك",
    selectPlan: "اختر خطتك التدريبية",
    orderTitle: "ابدأ برنامج النخبة المخصص لك",
    close: "إغلاق",
    contactTitle: "تواصل معنا",
    contactSub: "لديك استفسار بخصوص البرامج؟ تواصل مع فريق الدعم الفني.",
    contactSuccess: "شكرًا لك! تم استلام رسالتك بنجاح. وسيقوم فريق الدعم بالرد عليك في غضون ٢٤ ساعة.",
    sendMessage: "إرسال الرسالة",
    bookConsultation: "احجز استشارة فيديو VIP",
    consultationSub: "احجز مكالمة فيديو خاصة 1-on-1 لمدة ٣٠ دقيقة مباشرة مع كوتش دهب فيت.",
    consultationSuccess: "تم الحجز بنجاح! تم حجز موعد استشارتك الخاصة، وسنرسل لك الرابط الآمن عبر البريد الإلكتروني.",
    recipeBookTitle: "كتاب وصفات النخبة لكمال الأجسام",
    recipeBookSub: "وجبات لياقة بدنية غنية بالبروتين، لذيذة، وسهلة الطهي ومصممة خصيصًا لنمو العضلات.",
    recipeBookDownload: "تحميل كتاب الوصفات (PDF)",
    downloadSuccess: "بدأ التحميل الآن! بالهناء والشفاء.",
    whoIsDurrahTitle: "من هو كوتش دهب؟",
    whoIsDurrahP1: "كوتش دهب هو خبير لياقة بدنية وبطل ذو شهرة واسعة، وأحد أنجح مدربي اللياقة البدنية والكمال الأجسام عبر الإنترنت في الشرق الأوسط.",
    whoIsDurrahP2: "مع أكثر من ١٥ عامًا من التدريب الاحترافي، يجمع كوتش دهب بين التغذية القائمة على العلم وأساليب التدريب الشاقة لتقديم نتائج مضمونة لا تقبل الشك. ساعد أكثر من ١٦,٠٠٠ متدرب حول العالم في تحطيم القيود وتحقيق أجسام أحلامهم."
  }
};
