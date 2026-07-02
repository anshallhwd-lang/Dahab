import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

interface SupplementItem {
  id: number;
  nameEn: string;
  nameAr: string;
  tagEn: string;
  tagAr: string;
  rating: string;
  img: string;
  descEn: string;
  descAr: string;
}

const SUPPLEMENTS: SupplementItem[] = [
  {
    id: 1,
    nameEn: "Whey Isolate Pro",
    nameAr: "واي بروتين معزول برو",
    tagEn: "MUSCLE BUILD",
    tagAr: "بناء العضلات",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=400",
    descEn: "Pure fast-absorbing protein for optimal post-workout muscle recovery.",
    descAr: "بروتين نقي سريع الامتصاص لضمان أفضل استشفاء عضلي بعد التمرين."
  },
  {
    id: 2,
    nameEn: "Pre-Workout Nitro",
    nameAr: "مكمل الطاقة نيترو",
    tagEn: "EXPLOSIVE ENERGY",
    tagAr: "طاقة متفجرة",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1611536326696-b52be8ea45f6?auto=format&fit=crop&q=80&w=400",
    descEn: "Formulated for intense energy, skin-splitting pumps, and laser focus.",
    descAr: "تركيبة مصممة لمنحك طاقة هائلة، ضخ دم ممتاز، وتركيزًا حادًا."
  },
  {
    id: 3,
    nameEn: "Creatine Micronized",
    nameAr: "كرياتين مايكرونايزد",
    tagEn: "STRENGTH & POWER",
    tagAr: "القوة والباور",
    rating: "5.0",
    img: "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?auto=format&fit=crop&q=80&w=400",
    descEn: "100% pure micronized creatine to increase strength and performance.",
    descAr: "كرياتين نقي ١٠٠٪ لزيادة مستويات القوة البدنية والتحمل في النادي."
  },
  {
    id: 4,
    nameEn: "BCAA Amino Recovery",
    nameAr: "أمينو بي سي آيه آيه",
    tagEn: "INTRA-WORKOUT",
    tagAr: "أثناء التمرين",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
    descEn: "Essential amino acids to support active recovery and prevent muscle breakdown.",
    descAr: "الأحماض الأمينية الأساسية لدعم الاستشفاء السريع ومنع الهدم العضلي."
  },
  {
    id: 5,
    nameEn: "Multi-Vitamin Elite",
    nameAr: "مالتي فيتامين إيليت",
    tagEn: "DAILY VITAMINS",
    tagAr: "فيتامينات يومية",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400",
    descEn: "Comprehensive spectrum of daily essential vitamins, minerals, and defense boosters.",
    descAr: "مجموعة شاملة ومتكاملة من الفيتامينات والمعادن اليومية لتقوية المناعة."
  },
  {
    id: 6,
    nameEn: "Omega-3 Ultra Fish Oil",
    nameAr: "أوميجا ٣ زيت السمك",
    tagEn: "JOINT & HEART",
    tagAr: "المفاصل والقلب",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1622484211148-716598e04041?auto=format&fit=crop&q=80&w=400",
    descEn: "Premium high-potency EPA/DHA softgels for cardiovascular health and joint mobility.",
    descAr: "كبسولات أوميجا ٣ غنية بالأحماض الدهنية لدعم صحة المفاصل والقلب."
  },
  {
    id: 7,
    nameEn: "Micellar Casein Night",
    nameAr: "ميسيلار كازين الليلي",
    tagEn: "SLOW RECOVERY",
    tagAr: "استشفاء بطيء",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=400",
    descEn: "Sustained-release protein perfect for bedtime or fasting periods to feed muscles.",
    descAr: "بروتين بطيء الامتصاص مثالي قبل النوم أو فترات الصيام لتغذية العضلات."
  },
  {
    id: 8,
    nameEn: "Glutamine Pure",
    nameAr: "جلوتامين نقي وبودر",
    tagEn: "GUT & IMMUNE",
    tagAr: "المناعة والهضم",
    rating: "4.6",
    img: "https://images.unsplash.com/photo-1550572017-edd951b55104?auto=format&fit=crop&q=80&w=400",
    descEn: "Supports gut lining health, metabolic immune defenses, and muscle recovery.",
    descAr: "يساعد على صحة الجهاز الهضمي، تقوية المناعة، وإصلاح الأنسجة العضلية."
  },
  {
    id: 9,
    nameEn: "L-Carnitine Liquid",
    nameAr: "إل-كارنتين سائل",
    tagEn: "FAT METABOLIZER",
    tagAr: "حرق الدهون",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400",
    descEn: "Converts dietary fat into active energy for enhanced athletic output.",
    descAr: "يساعد في نقل الأحماض الدهنية وتحويلها إلى طاقة حركية ونشاط بدني."
  },
  {
    id: 10,
    nameEn: "ZMA Recovery Formula",
    nameAr: "زد إم آيه للاستشفاء",
    tagEn: "DEEP SLEEP",
    tagAr: "النوم العميق",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400",
    descEn: "Zinc, Magnesium, and B6 blend to maximize natural hormone release during sleep.",
    descAr: "الزنك والمغنيسيوم وفيتامين ب٦ لتحسين جودة النوم العميق وزيادة الهرمونات."
  },
  {
    id: 11,
    nameEn: "Superfood Organic Greens",
    nameAr: "سوبرفود الخضار العضوي",
    tagEn: "ORGANIC ALKALINE",
    tagAr: "الصحة العضوية",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1546483875-5f01450a83d4?auto=format&fit=crop&q=80&w=400",
    descEn: "Concentrated blend of essential raw organic greens and antioxidants.",
    descAr: "مزيج رائع من الخضار العضوي المركز لتغذية الجسم ومحاربة الأكسدة."
  },
  {
    id: 12,
    nameEn: "Beta-Alanine Strength",
    nameAr: "بيتا-ألانين للأداء",
    tagEn: "ENDURANCE",
    tagAr: "قوة التحمل",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1616671285410-534720934e8d?auto=format&fit=crop&q=80&w=400",
    descEn: "Increases intracellular muscle carnosine to buffer lactic fatigue.",
    descAr: "يؤخر حمض اللاكتيك في العضلات لتستطيع التمرن بكفاءة لوقت أطول."
  },
  {
    id: 13,
    nameEn: "Isotonic Minerals",
    nameAr: "إلكترولايتس ترطيب",
    tagEn: "HYDRATION PRO",
    tagAr: "الترطيب والنشاط",
    rating: "4.9",
    img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400",
    descEn: "Restores vital mineral levels, avoiding muscle cramps and fatigue.",
    descAr: "يعوض المعادن الأساسية التي يفقدها الجسم في العرق لمنع التشنج."
  },
  {
    id: 14,
    nameEn: "Collagen Skin & Joint",
    nameAr: "كولاجين المفاصل والجلد",
    tagEn: "JOINT HEALTH",
    tagAr: "صحة المفاصل",
    rating: "4.8",
    img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=400",
    descEn: "Strengthens connectivity tissues, tendons, bone density, and skin.",
    descAr: "يقوي الأوتار والأنسجة الضامة لزيادة صلابة المفاصل وحماية الجلد."
  },
  {
    id: 15,
    nameEn: "Mass Gainer Pro",
    nameAr: "ماس جينر برو للضخامة",
    tagEn: "MASS BULK",
    tagAr: "ضخامة عضلية",
    rating: "4.7",
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
    descEn: "Calorie-dense high-quality formula for rapid size and power increase.",
    descAr: "مغذي عالي السعرات مصمم خصيصاً للتضخيم السريع وزيادة الوزن."
  }
];

interface SupplementSliderProps {
  lang: "en" | "ar";
  theme: "dark" | "light";
  onSelectSupplement: () => void;
}

export default function SupplementSlider({ lang, theme, onSelectSupplement }: SupplementSliderProps) {
  const isRtl = lang === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const initialized = useRef(false);

  // Triple-duplicate the array for perfectly seamless infinite scroll
  const items = [...SUPPLEMENTS, ...SUPPLEMENTS, ...SUPPLEMENTS];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animationFrameId: number;

    const step = () => {
      const singleWidth = el.scrollWidth / 3;
      if (singleWidth > 0) {
        if (!initialized.current) {
          // Put the viewport right in the middle copy initially
          el.scrollLeft = singleWidth;
          initialized.current = true;
        }

        if (!isPaused && !isDrag) {
          // "بيتحركو يمين" -> Items move right visually.
          // This means scrollLeft is DECREASING (scrolling towards 0).
          el.scrollLeft -= 0.8; // fine-tuned, ultra-premium speed

          // If it gets too close to the left boundary, jump to the middle copy
          if (el.scrollLeft <= 10) {
            el.scrollLeft = singleWidth;
          }
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, isDrag]);

  // Adjust scroll if dragged too far right/left
  const handleScrollCheck = () => {
    const el = scrollRef.current;
    if (!el) return;
    const singleWidth = el.scrollWidth / 3;
    if (singleWidth > 0) {
      if (el.scrollLeft <= 10) {
        el.scrollLeft = singleWidth;
      } else if (el.scrollLeft >= singleWidth * 2 - 10) {
        el.scrollLeft = singleWidth;
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDrag(true);
    startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrag) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDrag(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDrag(true);
    startX.current = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftStart.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrag) return;
    const x = e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
    }
  };

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 320; // single card width + gap
    const target = scrollRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
    
    scrollRef.current.scrollTo({
      left: target,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative py-8 select-none w-full group/slider">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 px-2">
        <div className={isRtl ? "text-right" : "text-left"}>
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#e4562f] font-mono block mb-1">
            {isRtl ? "المكملات الغذائية المختارة" : "ELITE SELECTED SUPPLEMENTS"}
          </span>
          <h3 className={`text-xl sm:text-2xl font-black uppercase font-display ${theme === "dark" ? "text-white" : "text-zinc-950"}`}>
            {isRtl ? "المخطط الرياضي المتكامل" : "DAHAB COMPREHENSIVE PROTOCOL"}
          </h3>
        </div>
        
        {/* Navigation Info */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-mono mt-4 sm:mt-0">
          <span>{isRtl ? "اسحب للتمرير أو استخدم الأسهم" : "Drag to scroll or use arrows"}</span>
          <div className="flex gap-1.5 ml-2">
            <button
              onClick={() => scrollByAmount("left")}
              className={`p-1.5 rounded-full border transition-all ${
                theme === "dark"
                  ? "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-[#e4562f]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-[#e4562f]"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollByAmount("right")}
              className={`p-1.5 rounded-full border transition-all ${
                theme === "dark"
                  ? "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:text-white hover:border-[#e4562f]"
                  : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:border-[#e4562f]"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slider Container with touch indicators */}
      <div className="relative">
        {/* Left Arrow Button Overlay */}
        <button
          onClick={() => scrollByAmount("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#e4562f] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 opacity-0 group-hover/slider:opacity-100 duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Right Arrow Button Overlay */}
        <button
          onClick={() => scrollByAmount("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-[#e4562f] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 opacity-0 group-hover/slider:opacity-100 duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll Row */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={() => {
            handleMouseUpOrLeave();
            setIsPaused(false);
          }}
          onMouseEnter={() => setIsPaused(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          onScroll={handleScrollCheck}
          className="flex gap-6 overflow-x-hidden py-4 select-none cursor-grab active:cursor-grabbing scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((supp, index) => {
            const name = isRtl ? supp.nameAr : supp.nameEn;
            const tag = isRtl ? supp.tagAr : supp.tagEn;
            const desc = isRtl ? supp.descAr : supp.descEn;

            return (
              <div
                key={`${supp.id}-${index}`}
                onClick={onSelectSupplement}
                className={`w-[280px] sm:w-[310px] shrink-0 rounded-2xl p-5 border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-zinc-900/40 border-zinc-800/80 hover:border-[#e4562f]/50 hover:bg-zinc-900/90 hover:shadow-xl hover:shadow-[#e4562f]/5"
                    : "bg-white border-zinc-100 hover:border-[#e4562f]/40 hover:bg-zinc-50/80 hover:shadow-xl hover:shadow-zinc-200/50"
                } group/card`}
              >
                {/* Product Image */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-zinc-950">
                  <img
                    src={supp.img}
                    alt={name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-zinc-900/85 backdrop-blur-xs px-2 py-1 rounded-md border border-zinc-800 flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-current" />
                    <span className="text-[11px] font-bold text-white">{supp.rating}</span>
                  </div>

                  {/* Category Tag */}
                  <div className="absolute bottom-2.5 left-2.5 bg-[#e4562f] text-white text-[10px] tracking-wider font-extrabold uppercase px-2.5 py-1 rounded-sm">
                    {tag}
                  </div>
                </div>

                {/* Info block */}
                <div className="space-y-2">
                  <h4 className={`text-base sm:text-lg font-extrabold tracking-tight ${
                    theme === "dark" ? "text-white group-hover/card:text-[#e4562f]" : "text-zinc-950 group-hover/card:text-[#e4562f]"
                  } transition-colors`}>
                    {name}
                  </h4>
                  <p className={`text-xs sm:text-sm leading-relaxed line-clamp-2 h-10 ${
                    theme === "dark" ? "text-zinc-400" : "text-zinc-600"
                  }`}>
                    {desc}
                  </p>
                  
                  {/* Card CTA */}
                  <div className="pt-3 border-t border-zinc-800/20 flex items-center justify-between text-xs font-extrabold tracking-wider">
                    <span className="text-[#e4562f] uppercase group-hover/card:translate-x-1 transition-transform">
                      {isRtl ? "اطلب برنامج المكملات ←" : "GET PROTOCOL →"}
                    </span>
                    <span className="text-zinc-500 font-mono">DAHAB FIT</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
