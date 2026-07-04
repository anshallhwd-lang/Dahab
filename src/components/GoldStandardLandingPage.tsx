import React, { useState } from "react";
import ProductPurchaseModal from "./ProductPurchaseModal";
import {
  Star,
  ShoppingCart,
  Heart,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  CheckCircle,
  Truck,
  HelpCircle,
  Award,
  Sun,
  Moon
} from "lucide-react";

interface GoldStandardLandingPageProps {
  lang: "en" | "ar";
  theme: "dark" | "light";
  onBack: () => void;
  onAddToCart: (productName: string, price: number) => void;
  country: "USA" | "Egypt";
  initialSize?: string;
  onToggleLanguage?: () => void;
  onToggleTheme?: () => void;
  hideHeader?: boolean;
}

export default function GoldStandardLandingPage({
  lang,
  theme,
  onBack,
  onAddToCart,
  country,
  initialSize,
  onToggleLanguage,
  onToggleTheme,
  hideHeader = false
}: GoldStandardLandingPageProps) {
  const isRtl = lang === "ar";

  // State managers
  const [selectedSize, setSelectedSize] = useState<string>(initialSize || "2290g");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);
  const [showFullReviews, setShowFullReviews] = useState<boolean>(false);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [userReviewText, setUserReviewText] = useState<string>("");
  const [userRating, setUserRating] = useState<number>(5);
  const [qSearch, setQSearch] = useState<string>("");
  const [showToast, setShowToast] = useState<string | null>(null);

  // Checkout purchase modal states
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [purchaseProductName, setPurchaseProductName] = useState<string>("");
  const [purchaseProductSize, setPurchaseProductSize] = useState<string>("");
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [purchaseQuantity, setPurchaseQuantity] = useState<number>(1);

  // Gallery items matching iHerb and screenshots dynamically
  const galleryItems = selectedSize === "898g"
    ? [
        {
          type: "image",
          url: "https://h.top4top.io/p_3837u8ctt1.png",
          alt: "Gold Standard Front View"
        },
        {
          type: "image",
          url: "https://i.top4top.io/p_3837uqnnp2.png",
          alt: "Gold Standard Side View"
        },
        {
          type: "image",
          url: "https://j.top4top.io/p_38372hd1p3.png",
          alt: "Gold Standard Back View"
        },
        {
          type: "image",
          url: "https://c.top4top.io/p_3837jlmg73.png",
          alt: "Gold Standard Nutrition Facts"
        },
        {
          type: "image",
          url: "https://d.top4top.io/p_3837kjti34.png",
          alt: "Gold Standard Certifications"
        }
      ]
    : [
        {
          type: "image",
          url: "https://j.top4top.io/p_3837dccf71.png",
          alt: "Gold Standard Front View"
        },
        {
          type: "image",
          url: "https://a.top4top.io/p_3837yq01a1.png",
          alt: "Gold Standard Side View"
        },
        {
          type: "image",
          url: "https://b.top4top.io/p_3837lsh4q2.png",
          alt: "Gold Standard Back View"
        },
        {
          type: "image",
          url: "https://c.top4top.io/p_3837jlmg73.png",
          alt: "Gold Standard Nutrition Facts"
        },
        {
          type: "image",
          url: "https://d.top4top.io/p_3837kjti34.png",
          alt: "Gold Standard Certifications"
        }
      ];

  // Sizes & Price mapping from screenshots
  const sizes = [
    { id: "839g", label: isRtl ? "839 جم" : "839 g", price: 3650, hasPrice: false, inStock: false },
    { id: "898g", label: isRtl ? "898 جم" : "898 g", price: 3887.06, hasPrice: true, inStock: true },
    { id: "907g", label: isRtl ? "907 جم" : "907 g", price: 3950, hasPrice: false, inStock: false },
    { id: "2109g", label: isRtl ? "2109 جم" : "2109 g", price: 5800, hasPrice: false, inStock: false },
    { id: "2240g", label: isRtl ? "2240 جم" : "2240 g", price: 6100, hasPrice: false, inStock: false },
    { id: "2263g", label: isRtl ? "2263 جم" : "2263 g", price: 6150, hasPrice: false, inStock: false },
    { id: "2267g", label: isRtl ? "2267 جم" : "2267 g", price: 6200, hasPrice: false, inStock: false },
    { id: "2290g", label: isRtl ? "2290 جم" : "2290 g", price: 6303.90, hasPrice: true, inStock: true }
  ];

  const formatPrice = (egpVal: number) => {
    if (country === "USA") {
      const usdtVal = egpVal / 55;
      return `${usdtVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
    } else {
      return `${egpVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${isRtl ? "ج.م" : "EGP"}`;
    }
  };

  const formatPriceWithoutSymbol = (egpVal: number) => {
    if (country === "USA") {
      return (egpVal / 55).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
      return egpVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  const getCurrencySymbol = () => {
    if (country === "USA") {
      return "USDT";
    } else {
      return isRtl ? "ج.م" : "EGP";
    }
  };

  const currentSizeObj = sizes.find(s => s.id === selectedSize) || sizes[7];
  const currentPrice = currentSizeObj.price;
  const totalServings = selectedSize === "898g" ? 29 : 74;
  const pricePerPortion = (currentPrice / totalServings).toFixed(2);

  const handleAddToCart = () => {
    setPurchaseProductName(
      isRtl
        ? "أوبتيموم نوتريشن، Gold Standard 100% Whey Protein"
        : "Optimum Nutrition, Gold Standard 100% Whey Protein"
    );
    setPurchaseProductSize(currentSizeObj.label);
    setPurchasePrice(currentPrice);
    setPurchaseQuantity(quantity);
    setIsPurchaseModalOpen(true);
  };

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3000);
  };

  const handleComboAdd = () => {
    setPurchaseProductName(
      isRtl
        ? "مجموعة التوفير: بروتين جولد ستاندرد + بروتين مصل اللبن كاليفورنيا"
        : "Saver Combo: Gold Standard Whey + California Gold Whey Isolate"
    );
    setPurchaseProductSize(isRtl ? "مجموعة التوفير" : "Saver Combo Package");
    setPurchasePrice(7747.84);
    setPurchaseQuantity(1);
    setIsPurchaseModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased pb-24 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0b0909] text-zinc-100" : "bg-[#fdfbf7] text-zinc-900"
      }`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* HEADER / NAVIGATION BAR */}
      {!hideHeader && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
            theme === "dark" ? "bg-zinc-950/90 border-zinc-900" : "bg-white/90 border-zinc-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={onBack}
              className={`flex items-center gap-2 text-xs font-bold uppercase transition-all px-3 py-1.5 rounded-full ${
                theme === "dark"
                  ? "bg-zinc-900 text-zinc-300 hover:text-[#e4562f] hover:bg-zinc-800"
                  : "bg-zinc-100 text-zinc-700 hover:text-[#e4562f] hover:bg-zinc-200"
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
              <span>{isRtl ? "العودة للمتجر الرئيسي" : "Back to Main Site"}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-widest text-[#e4562f] font-mono">
                DAHAB COMPREHENSIVE PROTOCOL
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onToggleLanguage && (
                <button
                  onClick={onToggleLanguage}
                  className={`px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    theme === "dark"
                      ? "border-zinc-800 text-white bg-zinc-900 hover:border-[#e4562f] hover:text-[#e4562f]"
                      : "border-zinc-200 text-zinc-800 bg-zinc-100 hover:border-[#e4562f] hover:text-[#e4562f]"
                  }`}
                >
                  <span>{isRtl ? "English" : "عربي"}</span>
                </button>
              )}

              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:border-amber-400/50 hover:bg-zinc-800"
                      : "bg-zinc-100 border-zinc-200 text-amber-500 hover:border-amber-500/50 hover:bg-zinc-200"
                  }`}
                  aria-label="Toggle Theme"
                >
                  {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST CONTAINER */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          <span>{showToast}</span>
        </div>
      )}

      {/* BREADCRUMB */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <nav className="text-xs text-zinc-500 flex items-center gap-2 font-medium">
          <span className="cursor-pointer hover:underline" onClick={onBack}>
            {isRtl ? "الرئيسية" : "Home"}
          </span>
          <span>/</span>
          <span className="cursor-pointer hover:underline" onClick={onBack}>
            {isRtl ? "المكملات الغذائية" : "Supplements"}
          </span>
          <span>/</span>
          <span className="text-zinc-400 font-bold">
            Gold Standard 100% Whey
          </span>
        </nav>
      </div>

      {/* MAIN LAYOUT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* COLUMN 1: INTERACTIVE IMAGE GALLERY (3/12 wide) - RIGHT ON RTL, LEFT ON LTR */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Image Display Box */}
            <div
              className={`relative aspect-square w-full rounded-2xl overflow-hidden flex items-center justify-center p-6 border transition-all ${
                theme === "dark"
                  ? "bg-zinc-900/60 border-zinc-800/80"
                  : "bg-white border-zinc-200"
              }`}
            >
              {/* iHerb Quality Guarantee Sticker */}
              <div className="absolute top-4 left-4 bg-emerald-600/90 text-white text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-md">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRtl ? "أصلي %100" : "100% Authentic"}</span>
              </div>

              <img
                src={galleryItems[activeGalleryIndex].url}
                alt={galleryItems[activeGalleryIndex].alt}
                className="w-full h-full object-contain max-h-[400px] hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail Navigation Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {galleryItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all p-1.5 flex items-center justify-center ${
                    activeGalleryIndex === idx
                      ? "border-[#e4562f] bg-[#e4562f]/5"
                      : theme === "dark"
                      ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
              
              {/* 360 degree mockup selector */}
              <button
                onClick={() => {
                  setActiveGalleryIndex(0);
                  triggerToast(isRtl ? "تم تفعيل العرض الدائري مجازياً!" : "Virtual 360 viewer activated!");
                }}
                className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-dashed transition-all p-1.5 flex flex-col items-center justify-center text-zinc-500 hover:text-[#e4562f] hover:border-[#e4562f] ${
                  theme === "dark" ? "border-zinc-800 bg-zinc-900/20" : "border-zinc-300 bg-white"
                }`}
              >
                <span className="text-xs font-black">360°</span>
                <span className="text-[8px] font-mono uppercase mt-0.5">{isRtl ? "دوران" : "Rotate"}</span>
              </button>
            </div>

            {/* Shipping & Support Fast Info */}
            <div
              className={`rounded-2xl p-5 border flex flex-col gap-3.5 transition-all text-xs ${
                theme === "dark"
                  ? "bg-zinc-900/30 border-zinc-800/60 text-zinc-400"
                  : "bg-zinc-50 border-zinc-200 text-zinc-600"
              }`}
            >
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[#e4562f] shrink-0" />
                <div>
                  <h4 className="font-bold text-white dark:text-zinc-100 mb-0.5">
                    {isRtl ? "شحن دولي سريع ومضمون" : "Guaranteed Global Fast Shipping"}
                  </h4>
                  <p className="leading-relaxed">
                    {isRtl
                      ? "نحن نوفر الشحن المباشر من مستودعاتنا في الولايات المتحدة والمنطقة العربية مع حماية فائقة للمنتج."
                      : "We provide direct global delivery from certified warehouses to your doorstep with maximum security."}
                  </p>
                </div>
              </div>
              <div className="h-[1px] bg-zinc-800/10 dark:bg-zinc-800/50" />
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#d3e754] shrink-0" />
                <div>
                  <h4 className="font-bold text-white dark:text-zinc-100 mb-0.5">
                    {isRtl ? "ضمان الاسترداد والاستبدال السهل" : "Simple Returns & Exchange Guarantee"}
                  </h4>
                  <p className="leading-relaxed">
                    {isRtl
                      ? "إذا واجهت أي عيب في المنتج أو التعبئة، سنقوم فوراً باستبداله أو رد أموالك بكل سلاسة وبساطة."
                      : "Not satisfied with the container seal or quality? Get direct replacements or easy refunds instantly."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: TITLE, SPECS & OPTIONS SELECTORS (4/12 wide) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="space-y-3">
              {/* Brand & Stars */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-black bg-[#e4562f]/10 text-[#e4562f] px-2.5 py-1 rounded-full uppercase tracking-wider">
                  OPTIMUM NUTRITION
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-zinc-400">4.7</span>
                  <span className="text-zinc-500">•</span>
                  <span className="text-zinc-500 underline hover:text-[#e4562f] cursor-pointer">
                    {isRtl ? "33,310 تقييم" : "33,310 Ratings"}
                  </span>
                </div>
              </div>

              {/* Product Main Title */}
              <h1 className="text-xl sm:text-2xl font-black leading-snug tracking-tight">
                {selectedSize === "898g"
                  ? (isRtl
                      ? "أوبتيموم نوتريشن، Gold Standard® 100% Whey Protein، غني بالشوكولاتة ، 1.98 رطل (899 جم)"
                      : "Optimum Nutrition, Gold Standard® 100% Whey Protein, Double Rich Chocolate, 1.98 lb (899 g)")
                  : (isRtl
                      ? "أوبتيموم نوتريشن، Gold Standard® 100% Whey Protein، غني بالشوكولاتة ، 5.05 رطل (2.29 كجم)"
                      : "Optimum Nutrition, Gold Standard® 100% Whey Protein, Double Rich Chocolate, 5.05 lbs (2.29 kg)")}
              </h1>

              {/* Brand Reference */}
              <div className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                <span>{isRtl ? "عبر" : "By"}</span>
                <span className="text-[#e4562f] hover:underline cursor-pointer font-bold">
                  {isRtl ? "أوبتيموم نوتريشن" : "Optimum Nutrition"}
                </span>
                <span>•</span>
                <span className="text-emerald-500 font-bold">
                  {isRtl ? "متوفر في المخزون" : "In Stock"}
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-zinc-800/10 dark:bg-zinc-800/50" />

            {/* Flavor selection thumbnail card */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold tracking-wider uppercase text-zinc-400 block">
                {isRtl ? "النكهة المختارة:" : "Selected Flavor:"}
              </span>
              <div
                className={`flex items-center gap-3.5 p-3 rounded-xl border ${
                  theme === "dark" ? "bg-zinc-900/50 border-zinc-800" : "bg-white border-zinc-200"
                }`}
              >
                <img
                  src={selectedSize === "898g" ? "https://h.top4top.io/p_3837u8ctt1.png" : "https://j.top4top.io/p_3837dccf71.png"}
                  alt="Flavor thumbnail"
                  className="w-12 h-12 object-contain animate-fadeIn"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-[#e4562f]">
                    {isRtl ? "شوكولاتة غنية مزدوجة" : "Double Rich Chocolate"}
                  </h4>
                  <p className="text-[10px] text-zinc-500">
                    {isRtl ? "النكهة الأكثر طلباً في العالم" : "Top selling flavor worldwide"}
                  </p>
                </div>
              </div>
            </div>

            {/* Size & Weight options grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold tracking-wider text-zinc-400">
                <span>{isRtl ? "كمية العبوة / الوزن:" : "Packaging Volume:"}</span>
                <span className="text-[#e4562f]">{selectedSize === "898g" ? (isRtl ? "898 جم" : "898 g") : (isRtl ? "2290 جم" : "2290 g")}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(size => {
                  const isSelected = selectedSize === size.id;
                  const isAvailable = size.inStock;
                  return (
                    <button
                      key={size.id}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSize(size.id);
                          setActiveGalleryIndex(0);
                        }
                      }}
                      className={`py-2 px-1 rounded-xl border text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 relative ${
                        !isAvailable
                          ? "opacity-45 cursor-not-allowed border-dashed border-zinc-700/40 dark:border-zinc-800/40 bg-zinc-950/5 text-zinc-500"
                          : isSelected
                          ? "border-[#e4562f] bg-[#e4562f]/10 text-white"
                          : theme === "dark"
                          ? "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      <span className={`text-[10px] sm:text-xs font-black ${!isAvailable ? "line-through text-zinc-500/70" : ""}`}>
                        {size.label}
                      </span>
                      {size.hasPrice ? (
                        <span className="text-[8px] font-mono text-zinc-500">
                          {formatPrice(size.price)}
                        </span>
                      ) : (
                        <span className="text-[8px] text-zinc-500 font-light">
                          {isRtl ? "نفذت" : "Sold out"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-[1px] bg-zinc-800/10 dark:bg-zinc-800/50" />

            {/* AI Summary Highlight Panel */}
            <div
              className={`p-5 rounded-2xl border transition-all ${
                theme === "dark" ? "bg-zinc-900/40 border-blue-500/20" : "bg-blue-50/20 border-blue-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-blue-600 text-white p-1 rounded-lg">
                  <Sparkles className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-blue-600 dark:text-blue-400">
                    {isRtl ? "نظرة عامة بالذكاء الاصطناعي" : "AI overview"}
                  </h3>
                  <p className="text-[9px] text-zinc-500">
                    {isRtl ? "تم إنشاؤه بالذكاء الاصطناعي. ليس نصيحة طبية." : "AI generated. Not medical advice."}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3.5 mt-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
                <div>
                  <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                    {isRtl ? "ما الفائدة منه؟" : "What it's for"}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {isRtl
                      ? "دعم العضلات، الاستشفاء بعد التمرين، وتناول البروتين اليومي."
                      : "Muscle support, workout recovery, daily protein intake"}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100">
                    {isRtl ? "من يناسبه؟" : "Who it may fit"}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {isRtl
                      ? "البالغون النشطون الذين يتطلعون إلى زيادة تناول البروتين اليومي والأشخاص الذين لديهم جداول مزدحمة والذين يريدون خيار بروتين سريع بعد التمرين."
                      : "Active adults looking to increase daily protein intake and people with busy schedules who want a quick post-workout protein option."}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-zinc-500 hover:text-blue-500 cursor-pointer transition-colors">
                  <span className="font-extrabold">{isRtl ? "المواد الفعالة الرئيسية لكل حصة" : "Key actives per serving"}</span>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    <span>{isRtl ? "قراءة المزيد" : "Read more"}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Key info panel */}
            <div
              className={`p-5 rounded-2xl border ${
                theme === "dark" ? "bg-zinc-900/20 border-zinc-800/60" : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <h3 className="text-sm font-black mb-4 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Info className="w-4 h-4 text-[#e4562f]" />
                <span>{isRtl ? "معلومات أساسية" : "Key info"}</span>
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block mb-0.5">{isRtl ? "حجم الجرعة/الحصة:" : "Serving size:"}</span>
                  <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{isRtl ? "1 مغرفة (31 جم)" : "1 scoop (31g)"}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block mb-0.5">{isRtl ? "إجمالي الحصص:" : "Total servings:"}</span>
                  <span className="font-extrabold text-[#e4562f] font-mono">{totalServings}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/40">
                  <span className="text-zinc-500 block mb-0.5">{isRtl ? "يفضل استهلاكه قبل:" : "Best by:"}</span>
                  <span className="font-extrabold text-emerald-500">{isRtl ? "أغسطس 2027" : "August 2027"}</span>
                </div>
              </div>
            </div>

            {/* Certifications and diet panel */}
            <div
              className={`p-5 rounded-2xl border ${
                theme === "dark" ? "bg-zinc-900/20 border-zinc-800/60" : "bg-zinc-50 border-zinc-200"
              }`}
            >
              <h3 className="text-sm font-black mb-3 flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Award className="w-4 h-4 text-[#d3e754]" />
                <span>{isRtl ? "الشهادات والأنظمة الغذائية" : "Certifications & diet"}</span>
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isRtl ? "حلال" : "Halal"}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{isRtl ? "خالٍ من الجلوتين" : "Gluten-Free"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: ORDER CHECKOUT & CONFLICT SOLUTIONS (3/12 wide) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Main Buy Box */}
            <div
              className={`p-6 rounded-2xl border flex flex-col gap-4 sticky top-24 ${
                theme === "dark"
                  ? "bg-zinc-950 border-zinc-900 shadow-2xl shadow-black"
                  : "bg-white border-zinc-200 shadow-xl shadow-zinc-100"
              }`}
            >
              {/* Product Price Display */}
              <div className="space-y-1">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">
                  {isRtl ? "إجمالي السعر:" : "TOTAL PRICE:"}
                </span>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-3xl font-black text-white dark:text-white font-mono text-[#e4562f]">
                    {formatPriceWithoutSymbol(currentPrice)}
                  </span>
                  <span className="text-sm font-bold text-zinc-400">
                    {getCurrencySymbol()}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-500 block font-mono">
                  {isRtl
                    ? `${formatPrice(currentPrice / totalServings)} / الجرعة للحصة (${totalServings} حصة)`
                    : `${formatPrice(currentPrice / totalServings)} / portion (${totalServings} servings total)`}
                </span>
              </div>

              <div className="h-[1px] bg-zinc-800/10 dark:bg-zinc-800/50" />

              {/* Quantity Selector */}
              <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
                <span>{isRtl ? "الكمية المطلوبة:" : "Quantity Required:"}</span>
                <div className="flex items-center border border-zinc-800/40 dark:border-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-mono text-sm text-white dark:text-zinc-100 font-bold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-[#e4562f] text-white font-extrabold rounded-xl hover:bg-[#c94522] transition-colors text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#e4562f]/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isRtl ? "اشتري الآن" : "Buy Now"}</span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`w-full py-3 border rounded-xl font-extrabold transition-all text-xs flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "border-rose-500/50 bg-rose-500/10 text-rose-500"
                      : theme === "dark"
                      ? "border-zinc-800 hover:bg-zinc-900 text-zinc-300"
                      : "border-zinc-200 hover:bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500" : ""}`} />
                  <span>
                    {isRtl
                      ? isWishlisted
                        ? "في قائمة الرغبات"
                        : "أضف إلى قائمة الرغبات"
                      : isWishlisted
                      ? "In Wishlist"
                      : "Add to Wishlist"}
                  </span>
                </button>
              </div>

              {/* Quality Guarantee Note */}
              <div className="bg-emerald-600/10 text-emerald-500 dark:text-emerald-400 rounded-xl p-3 border border-emerald-500/10 text-[11px] leading-relaxed flex items-start gap-2">
                <Check className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>
                  {isRtl
                    ? "ضمان الجودة من Dahab: هذا المنتج مضمون كونه أصلياً بالكامل ومحفوظ تحت أعلى درجات الرطوبة والبرودة المطلوبة."
                    : "Dahab Quality Guarantee: Certified 100% authentic, properly stored, and checked with the highest standards."}
                </span>
              </div>
            </div>


          </div>

        </div>

        {/* DETAILS, TAB LIST, & NUTRITIONAL FACTS (image 2, 3, 5, 6) */}
        <div className="mt-16 border-t border-zinc-800/20 pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* COLUMN 1: INFORMATION OVERVIEWS & DESCRIPTION MODULES (8/12 wide) */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Product Ingredients Explanation (Image 2) */}
              <div className="space-y-6">
                <div className="border-b border-zinc-800/30 pb-3 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#e4562f]" />
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    {isRtl ? "شرح وتفصيل المكونات الفعالة" : "Detailed Ingredients Overview"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ingredient Card 1 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      theme === "dark" ? "bg-zinc-900/20 border-zinc-800/80" : "bg-white border-zinc-200"
                    }`}
                  >
                    <h3 className="text-sm font-black text-white dark:text-zinc-100 mb-1">
                      {isRtl ? "بروتين مصل اللبن المعزول (WPI)" : "Whey Protein Isolate (WPI)"}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {isRtl
                        ? "يوفر أحماضاً أمينية كاملة سريعة الامتصاص تدعم تخليق البروتين العضلي مباشرة بعد التمرين."
                        : "Supplies premium fast-absorbing complete amino acids to instantly support muscle protein synthesis post-workout."}
                    </p>
                    <div className="bg-amber-500/10 text-amber-500 text-[10px] rounded-lg p-2 leading-relaxed">
                      <strong>{isRtl ? "تحذير:" : "Warning:"}</strong>{" "}
                      {isRtl
                        ? "قد يحتوي على لاكتوز ضئيل؛ من لديهم حساسية من الحليب أو عدم تحمل اللاكتوز يفضل المراقبة."
                        : "Contains tiny trace lactose; individuals with severe dairy allergies should monitor tolerance."}
                    </div>
                  </div>

                  {/* Ingredient Card 2 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      theme === "dark" ? "bg-zinc-900/20 border-zinc-800/80" : "bg-white border-zinc-200"
                    }`}
                  >
                    <h3 className="text-sm font-black text-white dark:text-zinc-100 mb-1">
                      {isRtl ? "مركز بروتين مصل اللبن (WPC)" : "Whey Protein Concentrate (WPC)"}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {isRtl
                        ? "يمد الجسم بأحماض أمينية أساسية مع جزء من الببتيدات والمغذيات المرافقة التي تدعم تغذية العضلات."
                        : "Provides essential amino acids with custom growth-supporting peptide fractions and micro-nutrients."}
                    </p>
                    <div className="bg-amber-500/10 text-amber-500 text-[10px] rounded-lg p-2 leading-relaxed">
                      <strong>{isRtl ? "تحذير:" : "Warning:"}</strong>{" "}
                      {isRtl
                        ? "قد يسبب انتفاخاً خفيفاً لدى البعض بسبب محتوى اللاكتوز؛ خذه مع الطعام لتقليل الانزعاج."
                        : "May cause minor bloating in sensitive guts due to lactose; consume with a meal to ease."}
                    </div>
                  </div>

                  {/* Ingredient Card 3 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      theme === "dark" ? "bg-zinc-900/20 border-zinc-800/80" : "bg-white border-zinc-200"
                    }`}
                  >
                    <h3 className="text-sm font-black text-white dark:text-zinc-100 mb-1">
                      {isRtl ? "بروتين مصل اللبن المتحلل مائياً" : "Hydrolyzed Whey Protein"}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {isRtl
                        ? "يتكون من ببتيدات أقصر سريعة الامتصاص قد تدعم بدء تعافي العضلات بشكل أسرع وأكثر كفاءة."
                        : "Composed of shorter pre-digested peptide chains for ultra-rapid assimilation and immediate cell delivery."}
                    </p>
                    <div className="bg-amber-500/10 text-amber-500 text-[10px] rounded-lg p-2 leading-relaxed">
                      <strong>{isRtl ? "تحذير:" : "Warning:"}</strong>{" "}
                      {isRtl
                        ? "قد يكون طعمه أقوى للبعض؛ امزجه بسائل كاف لتحسين القبول والمستساغية."
                        : "May carry a slightly bitter edge due to hydrolysis; blend thoroughly with your beverage."}
                    </div>
                  </div>

                  {/* Ingredient Card 4 */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      theme === "dark" ? "bg-zinc-900/20 border-zinc-800/80" : "bg-white border-zinc-200"
                    }`}
                  >
                    <h3 className="text-sm font-black text-white dark:text-zinc-100 mb-1">
                      {isRtl ? "الأحماض الأمينية المتفرعة السلسلة (BCAAs)" : "Branched Chain Amino Acids (BCAAs)"}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                      {isRtl
                        ? "لوسين وإيزولوسين وفالين يشاركون في إشارات تنشيط تخليق البروتين العضلي وتغذية الألياف العضلية."
                        : "Leucine, Isoleucine, and Valine trigger powerful protein synthesis cascades and nourish muscle fibers."}
                    </p>
                    <div className="bg-amber-500/10 text-amber-500 text-[10px] rounded-lg p-2 leading-relaxed">
                      <strong>{isRtl ? "تحذير:" : "Warning:"}</strong>{" "}
                      {isRtl
                        ? "قد يزيد الحمل الكلي من النيتروجين المتاح؛ اشرب ماءً كافياً خلال اليوم لسلامة الكلى."
                        : "Increases dietary nitrogen load; ensure generous water intake throughout active training days."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggested Use & Allergen Instructions (Image 6) */}
              <div className="space-y-4">
                <div className="border-b border-zinc-800/30 pb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#e4562f]" />
                  <h2 className="text-lg font-black uppercase tracking-tight">
                    {isRtl ? "كيفية وطريقة الاستخدام الموصى بها" : "Suggested Use & Directions"}
                  </h2>
                </div>

                <div
                  className={`p-6 rounded-2xl border leading-relaxed text-xs text-zinc-400 space-y-4 ${
                    theme === "dark" ? "bg-zinc-900/20 border-zinc-800/60" : "bg-white border-zinc-200"
                  }`}
                >
                  <p>
                    {isRtl
                      ? "• 31 جرامًا: حوالي مكيال واحد من مسحوق بروتين شرش اللبن."
                      : "• 31 Grams: Approximately 1 scoop of premium Gold Standard whey protein powder."}
                  </p>
                  <p>
                    {isRtl
                      ? "• من 6-8 أونصة سائلة: ماء بارد أو حليب أو مشروب آخر تفضله للتجانس والخلط."
                      : "• 6-8 Fluid Ounces: Cold water, milk, or any custom beverage of choice for blending."}
                  </p>
                  <p>
                    {isRtl
                      ? "• 30 ثانية: قلبه، أو رجه أو امزجه حتى الذوبان التام والاستمتاع بالمذاق."
                      : "• 30 Seconds: Stir, shake, or blend until fully dissolved and smooth."}
                  </p>
                  <p className="text-[11px] bg-rose-500/5 text-rose-500 dark:text-rose-400 p-3 rounded-lg border border-rose-500/10">
                    <strong>{isRtl ? "تحذير الحساسية والسلامة:" : "Allergen Warning & Storage:"}</strong>{" "}
                    {isRtl
                      ? "يحتوي على: الحليب والصويا. يُحفظ في مكان بارد وجاف لمنع التكتل أو تلف المنتج. استخدمه كملحق غذائي فقط."
                      : "Contains: Milk and Soy. Store in a cool, dry environment. Use only as a food supplement, not for body weight reduction."}
                  </p>
                </div>
              </div>
            </div>

            {/* COLUMN 2: FDA NUTRITION FACTS TABLE PANEL (4/12 wide) */}
            <div className="lg:col-span-4">
              <div
                className={`p-6 rounded-2xl border border-2 ${
                  theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-300"
                }`}
              >
                {/* FDA nutrition label layout */}
                <div className="border-b-8 border-black pb-2 text-black dark:text-zinc-100">
                  <h2 className="text-3xl font-black tracking-tighter uppercase font-mono">
                    {isRtl ? "حقائق غذائية" : "Nutrition Facts"}
                  </h2>
                  <div className="text-xs font-mono font-bold mt-1">
                    <span>{isRtl ? "حجم الجرعة / الحصة: 31 جم (حوالي مكيال واحد)" : "Serving Size: 31g (About 1 Scoop)"}</span>
                    <br />
                    <span>{isRtl ? `الجرعات / الحصص بكل عبوة: ${totalServings}` : `Servings Per Container: ${totalServings}`}</span>
                  </div>
                </div>

                <div className="border-b-4 border-black py-1.5 flex justify-between items-baseline font-mono text-xs font-black text-black dark:text-zinc-100">
                  <span>{isRtl ? "السعرات الحرارية" : "Calories"}</span>
                  <span className="text-xl font-bold">120</span>
                </div>

                <div className="text-[10px] font-mono font-bold text-right border-b border-zinc-400 py-1 text-zinc-500">
                  {isRtl ? "النسبة المئوية للقيمة اليومية *" : "% Daily Value *"}
                </div>

                {/* Table rows */}
                {[
                  { labelAr: "إجمالي الدهون", labelEn: "Total Fat", amtAr: "1.5 جرام", amtEn: "1.5 g", pct: "2%" },
                  { labelAr: "الدهون المشبعة", labelEn: "Saturated Fat", amtAr: "1 جرام", amtEn: "1 g", pct: "5%" },
                  { labelAr: "كوليسترول", labelEn: "Cholesterol", amtAr: "55 ملغ", amtEn: "55 mg", pct: "18%" },
                  { labelAr: "صوديوم", labelEn: "Sodium", amtAr: "130 مجم", amtEn: "130 mg", pct: "6%" },
                  { labelAr: "إجمالي الكربوهيدرات", labelEn: "Total Carbohydrate", amtAr: "3 جرام", amtEn: "3 g", pct: "1%" },
                  { labelAr: "الألياف الغذائية", labelEn: "Dietary Fiber", amtAr: "<1 جرام", amtEn: "<1 g", pct: "2%" },
                  { labelAr: "إجمالي السكريات", labelEn: "Total Sugars", amtAr: "1 جرام", amtEn: "1 g", pct: "" },
                  { labelAr: "بروتين", labelEn: "Protein", amtAr: "24 جرام", amtEn: "24 g", pct: "48%" },
                  { labelAr: "كالسيوم", labelEn: "Calcium", amtAr: "130 مجم", amtEn: "130 mg", pct: "10%" },
                  { labelAr: "حديد", labelEn: "Iron", amtAr: "0.7 مجم", amtEn: "0.7 mg", pct: "4%" },
                  { labelAr: "بوتاسيوم", labelEn: "Potassium", amtAr: "200 مجم", amtEn: "200 mg", pct: "4%" }
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="border-b border-zinc-200 dark:border-zinc-800 py-2 flex justify-between items-center font-mono text-xs text-black dark:text-zinc-300"
                  >
                    <span className="font-bold">
                      {isRtl ? row.labelAr : row.labelEn}{" "}
                      <span className="font-light text-[10px] text-zinc-500">({isRtl ? row.amtAr : row.amtEn})</span>
                    </span>
                    <span className="font-bold">{row.pct || "-"}</span>
                  </div>
                ))}

                <div className="pt-3 text-[9px] font-mono leading-relaxed text-zinc-500">
                  {isRtl
                    ? "* توضح النسبة المئوية للقيمة اليومية المقدار الذي يسهم به أحد المغذيات الموجودة في جرعة/حصة غذاء في النظام الغذائي اليومي. يتم استخدام 2,000 سعرة حرارية في اليوم لنصائح التغذية العامة."
                    : "* The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice."}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* CUSTOMER REVIEWS PORTAL WITH HIGH-FIDELITY SUMMARY CHARTS (image 3, 8, 9, 10) */}
        <div className="mt-20 border-t border-zinc-800/20 pt-16 space-y-12">
          
          {/* Header Rating Summaries */}
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black uppercase tracking-tight">
                {isRtl ? "تقييمات وآراء العملاء" : "Customer Reviews & Feedbacks"}
              </h2>
              <p className="text-xs text-zinc-500">
                {isRtl
                  ? "مراجعات حقيقية وموثقة بالكامل من متسوقين قاموا بشراء المنتج واستخدامه فعلياً."
                  : "Verified purchase reviews from real customers who integrated this protein into their routines."}
              </p>
            </div>

            <button
              onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
              className="py-3 px-6 bg-[#e4562f] text-white font-extrabold rounded-xl hover:bg-[#c94522] transition-colors text-xs uppercase tracking-wider"
            >
              {isRtl ? "اكتب مراجعتك وتقييمك" : "Write a Review"}
            </button>
          </div>

          {/* Review form overlay simulated */}
          {isReviewFormOpen && (
            <div
              className={`p-6 rounded-2xl border animate-fadeIn ${
                theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 shadow-xl"
              }`}
            >
              <h3 className="text-sm font-black text-white dark:text-zinc-100 mb-4">
                {isRtl ? "شاركنا تجربتك الحقيقية مع المنتج:" : "Share your authentic experience:"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                  <span>{isRtl ? "تقييمك بالنجوم:" : "Your Rating:"}</span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setUserRating(star)}
                        className="p-1 rounded hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= userRating ? "fill-amber-500 text-amber-500" : "text-zinc-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={userReviewText}
                  onChange={e => setUserReviewText(e.target.value)}
                  placeholder={
                    isRtl
                      ? "اكتب هنا تجربتك مع الطعم، سرعة الذوبان، الهضم والنتائج..."
                      : "Write your feedback about flavor, mixability, digestion and muscle gains..."
                  }
                  rows={4}
                  className={`w-full p-4 rounded-xl border text-xs focus:outline-none focus:border-[#e4562f] ${
                    theme === "dark" ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                  }`}
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsReviewFormOpen(false)}
                    className="py-2.5 px-5 rounded-lg border border-zinc-800/60 hover:bg-zinc-900 text-xs text-zinc-400 font-bold"
                  >
                    {isRtl ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={() => {
                      if (!userReviewText.trim()) return;
                      triggerToast(isRtl ? "شكراً لك! تم إرسال مراجعتك بنجاح للمراجعة والتدقيق." : "Thank you! Your feedback has been sent successfully.");
                      setUserReviewText("");
                      setIsReviewFormOpen(false);
                    }}
                    className="py-2.5 px-6 bg-[#d3e754] text-black font-extrabold rounded-lg hover:bg-[#c2d645] text-xs uppercase"
                  >
                    {isRtl ? "نشر المراجعة" : "Publish Review"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stars breakdown chart & tags row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Big Star Summary */}
            <div className="md:col-span-3 text-center space-y-2">
              <span className="text-5xl font-black font-mono text-[#e4562f] block">4.7</span>
              <div className="flex justify-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-xs text-zinc-500 block">
                {isRtl ? "بناءً على 33,310 تقييم موثق" : "Based on 33,310 verified reviews"}
              </span>
            </div>

            {/* Middle Bar Charts */}
            <div className="md:col-span-5 space-y-2">
              {[
                { star: 5, count: "26,741", pct: "80%" },
                { star: 4, count: "4,487", pct: "13%" },
                { star: 3, count: "1,323", pct: "4%" },
                { star: 2, count: "378", pct: "1%" },
                { star: 1, count: "381", pct: "1%" }
              ].map(row => (
                <div key={row.star} className="flex items-center gap-3.5 text-xs text-zinc-400 font-mono">
                  <span className="w-4 font-bold">{row.star}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: row.pct }} />
                  </div>
                  <span className="w-12 text-right">{row.count}</span>
                </div>
              ))}
            </div>

            {/* Right Tags cloud */}
            <div className="md:col-span-4 space-y-3">
              <span className="text-xs font-extrabold text-zinc-400 uppercase tracking-wider block">
                {isRtl ? "العبارات والكلمات الأكثر تكراراً:" : "High-frequency keywords:"}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { tagAr: "مكمل غذائي رائع", tagEn: "Excellent supplement" },
                  { tagAr: "بناء العضلات", tagEn: "Muscle Building" },
                  { tagAr: "الطعم رائع", tagEn: "Amazing Taste" },
                  { tagAr: "مناسب وممتاز", tagEn: "Very Suitable" },
                  { tagAr: "مضاعف لذيذ", tagEn: "Double Delicious" },
                  { tagAr: "جيدة وطعمه", tagEn: "Good & tasty" },
                  { tagAr: "سعره مرتفع", tagEn: "High Price" },
                  { tagAr: "ملعقة واحدة", tagEn: "Single Scoop" }
                ].map((tag, i) => (
                  <span
                    key={i}
                    className={`text-[10px] font-bold py-1 px-2.5 rounded-full border cursor-pointer hover:border-[#e4562f] hover:text-[#e4562f] transition-colors ${
                      theme === "dark"
                        ? "border-zinc-800 bg-zinc-900/40 text-zinc-400"
                        : "border-zinc-200 bg-zinc-50 text-zinc-600"
                    }`}
                  >
                    {isRtl ? tag.tagAr : tag.tagEn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Customer uploaded photo gallery matching Image 9 */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-wider">
              {isRtl ? "صور التقييمات المرفوعة من العملاء:" : "Customer Shared Product Photos:"}
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { url: "https://h.top4top.io/p_3837kghxb1.png", alt: "Customer tub photo" },
                { url: "https://i.top4top.io/p_3837klssn2.png", alt: "Customer shaker photo" },
                { url: "https://j.top4top.io/p_3837eyy8t3.png", alt: "Customer scoop photo" },
                { url: "https://k.top4top.io/p_3837m8i6y4.png", alt: "Customer texture photo" },
                { url: "https://l.top4top.io/p_3837lirzf5.png", alt: "Customer review photo" }
              ].map((img, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-2 flex items-center justify-center cursor-zoom-in hover:scale-105 transition-transform duration-300"
                  onClick={() => triggerToast(isRtl ? "جاري تكبير الصورة للمعاينة الفائقة!" : "Zooming photo preview!")}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Comments List */}
          <div className="space-y-6">
            {[
              {
                user: "Amna S.",
                country: isRtl ? "المملكة العربية السعودية" : "Saudi Arabia",
                date: "2026-05-12",
                rating: 5,
                titleAr: "ممتاز جداً وحجم هائل!",
                titleEn: "Excellent and huge volume!",
                textAr: "ممتاز! اذا كان ع الكميه كبيره جدا واذا كان ع السعر اقل من المحلات عندنا بكتير طعمه ممتاز ومفيد جداً وبذات الشوكلاته يجنن مع كوب حليب بارد بعد النادي.",
                textEn: "Excellent! The volume is very huge and the pricing is much cheaper than local stores. The chocolate flavor is gorgeous and works perfectly blended in cold milk after physical session.",
                up: 89,
                down: 1
              },
              {
                user: "Khaled M.",
                country: isRtl ? "جمهورية مصر العربية" : "Egypt",
                date: "2026-04-18",
                rating: 4,
                titleAr: "جيد ولكن يوجد بدائل مناسبة",
                titleEn: "Good but there are suitable alternatives",
                textAr: "جيد ويوجد منتجات افضل منه بنسبة لي، ولكن يعتبر الاكثر استقراراً وتأثيره سريع جداً في تعافي العضلات والمفاصل بعد رفع الاثقال الثقيلة.",
                textEn: "Good product, but some alternatives feel better for my stomach. However, it is the most stable and fast acting protein for recovering fatigued muscles and fibers after heavy weights.",
                up: 24,
                down: 2
              },
              {
                user: "Youssef A.",
                country: isRtl ? "الكويت" : "Kuwait",
                date: "2026-03-05",
                rating: 5,
                titleAr: "واي بروتين ممتاز لبناء العضلات",
                titleEn: "Excellent whey protein for muscle gains",
                textAr: "الرائحة ممتازة والمكونات جيدة والعبوة حجمها مناسب جداً والفايدة واضحة جداً في اللياقة وبناء الألياف العضلية خلال فترات التنشيف.",
                textEn: "Aroma is amazing, ingredients list is clean, the tub size is extremely generous, and the results are crystal-clear for fitness and fiber rebuilding during fat cuts.",
                up: 42,
                down: 0
              }
            ].map((rev, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border flex flex-col gap-3 transition-all ${
                  theme === "dark" ? "bg-zinc-900/10 border-zinc-800/60" : "bg-white border-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#e4562f] to-[#d3e754] text-black font-black flex items-center justify-center text-xs">
                      {rev.user.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white dark:text-zinc-100">
                        {rev.user}{" "}
                        <span className="text-[10px] text-zinc-500 font-normal">
                          • {rev.country}
                        </span>
                      </h4>
                      <span className="text-[9px] text-zinc-500 font-mono">{rev.date}</span>
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <h5 className="font-extrabold text-white dark:text-zinc-200">
                    {isRtl ? rev.titleAr : rev.titleEn}
                  </h5>
                  <p className="text-zinc-400 leading-relaxed">
                    {isRtl ? rev.textAr : rev.textEn}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-mono mt-1">
                  <span>{isRtl ? "هل كان ذلك مفيداً؟" : "Was this helpful?"}</span>
                  <button
                    onClick={() => triggerToast(isRtl ? "تم تسجيل تأييدك للتعليق!" : "Support registered!")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>({rev.up})</span>
                  </button>
                  <button
                    onClick={() => triggerToast(isRtl ? "تم تسجيل اعتراضك على التعليق!" : "Dislike registered!")}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>({rev.down})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS PORTAL (Image 7, 8) */}
        <div className="mt-20 border-t border-zinc-800/20 pt-16 space-y-8">
          <div className="border-b border-zinc-800/30 pb-3 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#e4562f]" />
            <h2 className="text-lg font-black uppercase tracking-tight">
              {isRtl ? "مجموعة الأسئلة والأجوبة المتكررة" : "Community Questions & Answers"}
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder={isRtl ? "ابحث عن سؤال أو اطرح سؤالاً خاصاً..." : "Search custom questions..."}
                value={qSearch}
                onChange={e => setQSearch(e.target.value)}
                className={`w-full py-3.5 pl-10 pr-4 rounded-xl text-xs focus:outline-none focus:border-[#e4562f] border ${
                  theme === "dark" ? "bg-zinc-950 border-zinc-850" : "bg-zinc-50 border-zinc-200"
                }`}
              />
              <Search className="w-4.5 h-4.5 text-zinc-500 absolute left-3 top-3.5" />
            </div>

            {[
              {
                qAr: "كيف الطعم ؟ واهم شي حالي بالزيادة ولا لاني جربت الايزو ومرا حالي م ناسبني؟",
                qEn: "How is the taste? Is it overly sweet? I tried Whey Isolate before and it was too sweet for me.",
                aAr: "لا هذا طعمه معتدل جداً وليس به حلاوة مفرطة مثل الأنواع الأخرى المليئة بالمحليات الصناعية؛ طعم الكاكاو طبيعي وممتاز.",
                aEn: "No, this flavor is very moderate and balanced. It doesn't have artificial-tasting oversweetness. Cocoa note is rich and natural."
              },
              {
                qAr: "هل يزيد الوزن إذا تم استخدامه بانتظام؟",
                qEn: "Does it cause body weight gain if consumed daily?",
                aAr: "البروتين بحد ذاته لا يزيد الوزن بل يساعد على تغذية وبناء العضلات؛ زيادة الوزن تعتمد كلياً على فارق السعرات اليومي الإجمالي.",
                aEn: "Protein itself does not increase fat; it builds skeletal mass. Weight gain depends fully on your overall daily caloric surplus or deficit."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className={`p-5 rounded-2xl border transition-all text-xs space-y-2.5 ${
                  theme === "dark" ? "bg-zinc-900/10 border-zinc-800/50" : "bg-white border-zinc-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-2 text-white dark:text-zinc-100 font-extrabold">
                  <span className="text-[#e4562f] font-black">Q:</span>
                  <p>{isRtl ? faq.qAr : faq.qEn}</p>
                </div>
                <div className="flex items-start gap-2 text-zinc-400">
                  <span className="text-[#d3e754] font-black">A:</span>
                  <p>{isRtl ? faq.aAr : faq.aEn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Product Purchase Modal */}
      <ProductPurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        productName={purchaseProductName}
        productSize={purchaseProductSize}
        price={purchasePrice}
        quantity={purchaseQuantity}
        country={country}
        lang={lang}
        theme={theme}
        showToast={(msg) => triggerToast(msg)}
      />
    </div>
  );
}
