import React, { useState, useEffect } from "react";
import {
  Dumbbell,
  UtensilsCrossed,
  Zap,
  ChevronDown,
  ChevronUp,
  SquarePen,
  FileText,
  MailOpen,
  Trophy,
  Facebook,
  Instagram,
  Youtube,
  Menu,
  X,
  Video,
  BookOpen,
  Download,
  Check,
  Shield,
  Award,
  ArrowUp,
  ExternalLink,
  Sun,
  Moon,
  Globe,
} from "lucide-react";

import { Program } from "./types";
import { PROGRAMS_DATA, TRANSFORMATIONS_DATA, STEPS_DATA, FAQS_DATA, DICTIONARY } from "./data";

// Component imports
import ImageSlider from "./components/ImageSlider";
import RegistrationModal from "./components/RegistrationModal";
import ContactModal from "./components/ContactModal";
import ConsultationModal from "./components/ConsultationModal";
import RecipeBookModal from "./components/RecipeBookModal";
import WhoIsDurrahModal from "./components/WhoIsDurrahModal";
import ToastContainer, { ToastMessage } from "./components/Toast";
import SupplementSlider from "./components/SupplementSlider";
import GoldStandardLandingPage from "./components/GoldStandardLandingPage";

// Image asset imports
import durrahHero from "./assets/images/durrah_hero_1782919258240.jpg";
import dietPlanBg from "./assets/images/diet_plan_bg_1782919273236.jpg";
import workoutBg from "./assets/images/workout_bg_1782919286963.jpg";
import coachBodybuilders from "./assets/images/coach_bodybuilders_1782979048013.jpg";
import supplementBg from "./assets/images/supplement_bg_1782919300875.jpg";
import gymBgStats from "./assets/images/gym_bg_stats_1782919316774.jpg";

const imageMap: Record<string, string> = {
  "durrah_hero_1782919258240.jpg": durrahHero,
  "diet_plan_bg_1782919273236.jpg": dietPlanBg,
  "workout_bg_1782919286963.jpg": workoutBg,
  "coach_bodybuilders_1782979048013.jpg": coachBodybuilders,
  "supplement_bg_1782919300875.jpg": supplementBg,
  "gym_bg_stats_1782919316774.jpg": gymBgStats,
};

export default function App() {
  const [lang, setLang] = useState<"en" | "ar">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("lang");
      if (saved === "en" || saved === "ar") return saved;
    }
    return "en";
  });
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "dark";
  });
  const [country, setCountry] = useState<"USA" | "Egypt">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("country");
      if (saved === "USA" || saved === "Egypt") return saved;
    }
    return "USA";
  });

  useEffect(() => {
    localStorage.setItem("lang", lang);
    if (typeof window !== "undefined") {
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("country", country);
  }, [country]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>("faq-1");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Modals state
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isRecipeOpen, setIsRecipeOpen] = useState(false);
  const [isWhoDurrahOpen, setIsWhoDurrahOpen] = useState(false);

  // Toast notification state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [detailedProductId, setDetailedProductId] = useState<number | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dict = DICTIONARY[lang];
  const isRtl = lang === "ar";
  const navLinkClass = `px-3 py-2 text-xs font-bold transition-colors ${
    theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
  }`;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const handleOpenProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsRegModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (detailedProductId !== null) {
      setDetailedProductId(null);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderIcon = (name: string, className = "w-6 h-6") => {
    switch (name) {
      case "UtensilsCrossed":
        return <UtensilsCrossed className={className} />;
      case "Dumbbell":
        return <Dumbbell className={className} />;
      case "Zap":
        return <Zap className={className} />;
      case "SquarePen":
        return <SquarePen className={className} />;
      case "FileText":
        return <FileText className={className} />;
      case "MailOpen":
        return <MailOpen className={className} />;
      case "Trophy":
        return <Trophy className={className} />;
      default:
        return <Dumbbell className={className} />;
    }
  };

  return (
    <div
      className={`min-h-screen font-sans antialiased selection:bg-[#e4562f] selection:text-white transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0b0909] text-zinc-100" : "bg-[#fdfbf7] text-zinc-900"
      }`}
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* HEADER / NAVIGATION BAR */}
      <header
        id="navbar-header"
        className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
          theme === "dark" ? "bg-zinc-950/90 border-zinc-900" : "bg-white/90 border-zinc-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            id="brand-logo"
            className="flex items-center cursor-pointer"
            onClick={() => scrollToSection("hero-section")}
          >
            <img
              src={theme === "dark" ? "https://j.top4top.io/p_38351xej82.png" : "https://k.top4top.io/p_3835p9t733.png"}
              alt="Dahab Fit Logo"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain transition-all duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToSection("hero-section")}
              className={navLinkClass}
            >
              {dict.home}
            </button>
            <button
              onClick={() => setIsWhoDurrahOpen(true)}
              className={navLinkClass}
            >
              {dict.whoIsDurrah}
            </button>
            <button
              onClick={() => scrollToSection("transformations-section")}
              className={navLinkClass}
            >
              {dict.transformations}
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className={navLinkClass}
            >
              {dict.services}
            </button>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className={navLinkClass}
            >
              {dict.videoConsultation}
            </button>
            <button
              onClick={() => setIsRecipeOpen(true)}
              className="px-3 py-2 text-xs font-bold hover:text-[#e4562f] transition-colors text-[#ddf154]"
            >
              {dict.recipeBook}
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className={navLinkClass}
            >
              {dict.contact}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className={`ml-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                theme === "dark"
                  ? "border-zinc-800 text-white bg-zinc-900 hover:border-[#e4562f] hover:text-[#e4562f]"
                  : "border-zinc-200 text-zinc-800 bg-zinc-100 hover:border-[#e4562f] hover:text-[#e4562f]"
              }`}
            >
              <span>{isRtl ? "English" : "عربي"}</span>
            </button>

            {/* Country/Currency Switcher */}
            <button
              onClick={() => setCountry((prev) => (prev === "USA" ? "Egypt" : "USA"))}
              className={`ml-2 px-3 py-1.5 rounded-full border text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                theme === "dark"
                  ? "border-zinc-800 text-white bg-zinc-900 hover:border-[#e4562f] hover:text-[#e4562f]"
                  : "border-zinc-200 text-zinc-800 bg-zinc-100 hover:border-[#e4562f] hover:text-[#e4562f]"
              }`}
              title={isRtl ? "تغيير العملة والدولة" : "Switch Country & Currency"}
            >
              <Globe className="w-3.5 h-3.5 text-[#e4562f]" />
              <span>{country === "USA" ? (isRtl ? "أمريكا USDT" : "USA USDT") : (isRtl ? "مصر E£" : "Egypt E£")}</span>
            </button>
          </nav>

          {/* Theme Toggle Button (Desktop) replacing social icons */}
          <div id="header-theme-toggle" className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                theme === "dark"
                  ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:border-amber-400/50 hover:bg-zinc-800"
                  : "bg-zinc-100 border-zinc-200 text-amber-500 hover:border-amber-500/50 hover:bg-zinc-200"
              }`}
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-zinc-400 hover:text-white hover:bg-zinc-900"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav
            id="mobile-nav"
            className={`lg:hidden border-t p-5 space-y-3 transition-colors duration-300 ${
              theme === "dark" ? "border-zinc-900 bg-zinc-950/98" : "border-zinc-200 bg-white/98"
            }`}
          >
            <button
              onClick={() => scrollToSection("hero-section")}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.home}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWhoDurrahOpen(true);
              }}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.whoIsDurrah}
            </button>
            <button
              onClick={() => scrollToSection("transformations-section")}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.transformations}
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.services}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsConsultationOpen(true);
              }}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.videoConsultation}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRecipeOpen(true);
              }}
              className={`block w-full font-bold text-sm py-2 text-emerald-500 transition-colors ${
                isRtl ? "text-right" : "text-left"
              }`}
            >
              {dict.recipeBook}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className={`block w-full font-bold text-sm py-2 hover:text-[#e4562f] transition-colors ${
                isRtl ? "text-right" : "text-left"
              } ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}
            >
              {dict.contact}
            </button>

            {/* Mobile Lang, Theme, and Country Switcher */}
            <div
              className={`pt-4 border-t flex items-center justify-between gap-2 transition-colors duration-300 ${
                theme === "dark" ? "border-zinc-900" : "border-zinc-200"
              }`}
            >
              <button
                onClick={toggleLanguage}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                  theme === "dark"
                    ? "bg-zinc-900 border-zinc-800 text-[#e4562f] hover:border-zinc-700"
                    : "bg-zinc-100 border-zinc-200 text-[#e4562f] hover:bg-zinc-200"
                }`}
              >
                {isRtl ? "English" : "عربي"}
              </button>

              <button
                onClick={() => setCountry((prev) => (prev === "USA" ? "Egypt" : "USA"))}
                className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                  theme === "dark"
                    ? "bg-zinc-900 border-zinc-800 text-white hover:border-zinc-700"
                    : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200"
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-[#e4562f]" />
                <span>{country === "USA" ? (isRtl ? "أمريكا" : "USA") : (isRtl ? "مصر" : "Egypt")}</span>
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800"
                    : "bg-zinc-100 border-zinc-200 text-amber-500 hover:bg-zinc-200"
                }`}
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </nav>
        )}
      </header>

      {detailedProductId !== null ? (
        <GoldStandardLandingPage
          lang={lang}
          theme={theme}
          country={country}
          initialSize={detailedProductId === 5 ? "898g" : "2290g"}
          onBack={() => setDetailedProductId(null)}
          onToggleLanguage={toggleLanguage}
          onToggleTheme={toggleTheme}
          onAddToCart={(name, price) => {
            const displayPrice = country === "USA" 
              ? `${(price / 55).toFixed(2)} USDT` 
              : `${price.toLocaleString()} ${lang === "ar" ? "ج.م" : "EGP"}`;
            showToast(
              lang === "ar"
                ? `تم إضافة ${name} بقيمة ${displayPrice} بنجاح!`
                : `Added ${name} for ${displayPrice} successfully!`,
              "success"
            );
          }}
          hideHeader={true}
        />
      ) : (
        <>
          {/* HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 border-b border-zinc-900 pt-20"
      >
        {/* Background Image with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://a.top4top.io/p_3835kvqg71.png"
            alt="Coach Dahab under a dramatic gym spotlight"
            className="w-full h-full object-cover object-center scale-105 filter brightness-85 transition-all duration-300"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/45 via-zinc-950/20 to-transparent" />
          <div className="absolute inset-0 bg-zinc-950/5 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center text-center">
          {/* DURRAH Display Text */}
          <div className="relative mb-6">
            <h1 className="text-7xl sm:text-9xl md:text-[11rem] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#e4562f] to-[#d3e754] leading-none uppercase font-display select-none opacity-95 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              {isRtl ? "دهب فيت" : "DAHAB FIT"}
            </h1>
          </div>
        </div>


      </section>

      {/* THREE CORE PROGRAMS / SERVICES */}
      <section id="services-section" className="py-24 bg-zinc-950 relative border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#e4562f] uppercase font-display">
              {isRtl ? "برامج تدريب النخبة" : "ELITE COACHING PLANS"}
            </h2>
            <p className="text-xl sm:text-2xl font-semibold text-zinc-300 max-w-3xl mx-auto font-display">
              {isRtl 
                ? "كيف استخلصت أسرار أفضل 10 في عالم الرياضات الاحترافية لأصنع نظاماً يناسب حياتك اليومية" 
                : "How I extracted the secrets of the top 10 in the world of professional sports to create a system that suits your daily life."}
            </p>
          </div>

          <div className={`grid grid-cols-1 ${PROGRAMS_DATA.length > 1 ? "md:grid-cols-3" : "max-w-md mx-auto"} gap-8`}>
            {PROGRAMS_DATA.map((program) => (
              <div
                key={program.id}
                id={`card-${program.id}`}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col h-[480px] transition-all duration-300 hover:border-[#e4562f]/50 hover:shadow-2xl hover:shadow-[#e4562f]/5"
              >
                {/* Background image on top half */}
                <div className="relative h-56 w-full overflow-hidden">
                  <img
                    src={program.bgImage.startsWith("http") ? program.bgImage : imageMap[program.bgImage]}
                    alt={program.titleEn}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  {/* Price and icon container removed as requested */}
                </div>

                {/* Card Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white font-display tracking-tight">
                      {isRtl ? program.titleAr : program.titleEn}
                    </h3>
                    <p className="text-xs text-[#e4562f] font-bold">
                      {isRtl ? program.subtitleAr : program.subtitleEn}
                    </p>
                    <ul className="space-y-2 pt-3">
                      {(isRtl ? program.featuresAr : program.featuresEn).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                          <Check className="w-4 h-4 text-[#d3e754] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenProgram(program)}
                    className="w-full py-3 mt-6 bg-[#e4562f] text-white font-extrabold rounded-lg hover:bg-[#c94522] transition-colors text-xs uppercase tracking-wider shadow-md shadow-brand-primary/10"
                  >
                    {dict.buyNow}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOP TRANSFORMATIONS SECTION */}
      <section
        id="transformations-section"
        className="py-24 bg-zinc-950 grid-bg-pattern relative border-b border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#e4562f] uppercase font-display">
              {dict.topTransformations}
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              {isRtl ? "نتائج حقيقية لمتدربين حقيقيين دون تزييف" : "Proven Results, Hardcore Commitment"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TRANSFORMATIONS_DATA.slice(0, 3).map((t) => (
              <div
                key={t.id}
                id={`transformation-${t.id}`}
                className="bg-zinc-900/80 backdrop-blur-xs border border-zinc-800 rounded-2xl p-2"
              >
                {/* Image Slider Component */}
                <ImageSlider
                  beforeImg={t.beforeImg}
                  afterImg={t.afterImg}
                  beforeLabel={dict.before}
                  afterLabel={dict.after}
                  compareLabel={dict.compareText}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="glow-btn inline-flex items-center justify-center px-10 py-4 bg-[#e4562f] text-white font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider gap-2 shadow-lg shadow-brand-primary/20"
            >
              <span>{dict.changeLifeNow}</span>
            </button>
          </div>
        </div>
      </section>

      {/* AS SEEN ON TV / MEDIA FEATURE SECTION */}
      <section
        id="media-section"
        className={`py-24 relative transition-colors duration-300 ${
          theme === "dark" ? "bg-zinc-950 text-zinc-100 border-b border-zinc-900" : "bg-white text-zinc-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl sm:text-4xl font-black font-display tracking-tight uppercase ${
              theme === "dark" ? "text-white" : "text-zinc-950"
            }`}>
              {dict.changingLivesTV}
            </h2>
            <div className="w-16 h-1 bg-[#e4562f] mx-auto mt-4" />
          </div>

          <div className="flex justify-center items-center">
            <img
              src="https://d.top4top.io/p_3835p63s91.png"
              alt="Coach Dahab Media"
              className="w-full max-w-5xl h-auto rounded-3xl shadow-2xl border border-zinc-800/10 hover:scale-[1.01] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Supplement Slider Integration */}
          <div className="mt-16 pt-12 border-t border-zinc-800/20">
            <SupplementSlider
              lang={lang}
              theme={theme}
              onSelectSupplement={(id) => {
                if (id === 53 || id === 2 || id === 5) {
                  setDetailedProductId(id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works-section" className="py-24 bg-zinc-950 relative border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#e4562f] uppercase font-display">
              {dict.howItWorks}
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              {isRtl ? "خمس خطوات بسيطة لجسمك الجديد" : "5 Scientific Steps to Ultimate Transformation"}
            </p>
          </div>

          {/* Connected Steps Diagram */}
          <div className="relative">
            {/* Horizontal Connecting Line (Desktop) */}
            <div className="absolute top-12 left-10 right-10 h-[2px] bg-zinc-800 hidden lg:block z-0" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 relative z-10">
              {STEPS_DATA.map((step) => (
                <div key={step.number} className="text-center space-y-4">
                  {/* Circle Icon */}
                  <div className="relative w-24 h-24 rounded-full bg-zinc-900 border-2 border-zinc-800 group-hover:border-[#e4562f] flex items-center justify-center mx-auto text-zinc-400 hover:text-[#e4562f] shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#e4562f] text-white font-mono font-bold text-xs flex items-center justify-center">
                      {step.number}
                    </div>
                    {renderIcon(step.icon, "w-10 h-10 text-white")}
                  </div>

                  {/* Step copy */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-sm tracking-wide">
                      {isRtl ? step.titleAr : step.titleEn}
                    </h4>
                    <p className="text-xs text-zinc-400 max-w-[180px] mx-auto leading-relaxed">
                      {isRtl ? step.descAr : step.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section id="faq-section" className="py-24 bg-[#e4562f] text-white relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-black font-display tracking-tight text-white uppercase">
              {dict.faqTitle}
            </h2>
            <div className="w-16 h-1 bg-white mx-auto" />
          </div>

          {/* Accordion container */}
          <div className="space-y-4">
            {FAQS_DATA.map((faq) => {
              const isOpen = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-xl overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                    className="w-full p-5 flex items-center justify-between text-left gap-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="font-bold text-white tracking-wide text-sm sm:text-base text-right">
                      {isRtl ? faq.questionAr : faq.questionEn}
                    </span>
                    <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center text-white shrink-0 font-bold">
                      {isOpen ? "-" : "+"}
                    </div>
                  </button>

                  {/* Accordion Answer */}
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-100 leading-relaxed border-t border-white/5 bg-white/5">
                      {isRtl ? faq.answerAr : faq.answerEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-10 py-4 bg-white text-black font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg shadow-black/10"
            >
              {dict.changeLifeToday}
            </button>
          </div>
        </div>
      </section>

      {/* START YOUR PROGRAM TODAY BANNER SECTION */}
      <section id="start-today-section" className="relative py-32 overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src={imageMap["gym_bg_stats_1782919316774.jpg"]}
            alt="Gym background"
            className="w-full h-full object-cover filter brightness-35"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#e4562f]/10 mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-lg font-bold tracking-widest text-[#d3e754] uppercase font-display">
            {dict.startTodaySub}
          </h3>
          <h2 className="text-5xl sm:text-7xl font-black text-white font-display uppercase tracking-tight">
            {dict.startTodayMain}
          </h2>
          <div className="pt-6">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-10 py-4 border-2 border-white hover:bg-white hover:text-black text-white font-extrabold rounded-md transition-all text-sm uppercase tracking-wider"
            >
              {dict.buyNow}
            </button>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION SWIPER SECTION (CHECK OUT HUNDREDS) */}
      <section id="hundreds-transformations" className="py-24 bg-[#e4562f] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              {dict.checkHundredsTransformations}
            </h2>
            <div className="w-16 h-1 bg-white mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TRANSFORMATIONS_DATA.slice(2, 4).map((t) => (
              <div key={t.id} className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-2">
                <ImageSlider
                  beforeImg={t.beforeImg}
                  afterImg={t.afterImg}
                  beforeLabel={dict.before}
                  afterLabel={dict.after}
                  compareLabel={dict.compareText}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-10 py-4 bg-white text-black font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg"
            >
              {dict.transformBodyNow}
            </button>
          </div>
        </div>
      </section>

      {/* DETAILED STATS COUNTER GRID SECTION */}
      <section id="stats-grid-section" className="relative py-24 bg-zinc-950">
        <div className="absolute inset-0 z-0">
          <img
            src={imageMap["gym_bg_stats_1782919316774.jpg"]}
            alt="Gym grid background"
            className="w-full h-full object-cover filter brightness-15"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-[#e4562f] uppercase font-display">
              {dict.brandName}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light whitespace-pre-line">
              {dict.statsDescription}
            </p>
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-b border-zinc-800/80 py-12">
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">1</span>
              <div className="w-8 h-1 bg-[#d3e754] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.coachingSince}
              </span>
            </div>
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">10+</span>
              <div className="w-8 h-1 bg-[#d3e754] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.programsMade}
              </span>
            </div>
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">90+</span>
              <div className="w-8 h-1 bg-[#d3e754] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.publishedTransformations}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-10 py-4 bg-[#e4562f] text-white font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider shadow-lg shadow-brand-primary/20"
            >
              {dict.buyNow}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer-section" className={`py-16 border-t transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-zinc-400 border-zinc-900" : "bg-zinc-100 text-zinc-600 border-zinc-200"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left follow column */}
          <div className="space-y-6">
            <div className="flex items-center">
              <img
                src="https://i.top4top.io/p_3835jn7av1.png"
                alt="Dahab Fit Logo"
                className="h-12 w-auto object-contain transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-3">
              <h4 className={`font-extrabold text-xs uppercase tracking-wider transition-colors duration-300 ${
                theme === "dark" ? "text-white" : "text-zinc-800"
              }`}>{dict.followDurrah}</h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#e4562f] hover:border-[#e4562f]/50"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:text-[#e4562f] hover:border-[#e4562f]/50 shadow-sm"
                  }`}
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#e4562f] hover:border-[#e4562f]/50"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:text-[#e4562f] hover:border-[#e4562f]/50 shadow-sm"
                  }`}
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-[#e4562f] hover:border-[#e4562f]/50"
                      : "bg-white border border-zinc-200 text-zinc-600 hover:text-[#e4562f] hover:border-[#e4562f]/50 shadow-sm"
                  }`}
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right quick links column */}
          <div className="space-y-4">
            <h4 className={`font-extrabold text-xs uppercase tracking-wider transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-zinc-800"
            }`}>{dict.quickLinks}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setIsWhoDurrahOpen(true)}
                className={`text-left py-1 transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
                }`}
              >
                &gt; {dict.whoIsDurrah}
              </button>
              <button
                onClick={() => scrollToSection("services-section")}
                className={`text-left py-1 transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
                }`}
              >
                &gt; {dict.customizedPrograms}
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className={`text-left py-1 transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
                }`}
              >
                &gt; {dict.contact}
              </button>
              <button
                onClick={() => scrollToSection("transformations-section")}
                className={`text-left py-1 transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
                }`}
              >
                &gt; {dict.transformations}
              </button>
              <button
                onClick={() => setIsContactOpen(true)}
                className={`text-left py-1 transition-colors ${
                  theme === "dark" ? "text-zinc-400 hover:text-[#e4562f]" : "text-zinc-600 hover:text-[#e4562f]"
                }`}
              >
                &gt; {dict.terms}
              </button>
            </div>
          </div>
        </div>

        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t text-center text-[10px] font-mono ${
          theme === "dark" ? "border-zinc-900 text-zinc-600" : "border-zinc-200 text-zinc-500"
        }`}>
          <p className="flex items-center justify-center gap-2">
            <span>© {new Date().getFullYear()} {dict.brandName}. ALL RIGHTS RESERVED. POWERED BY DAHAB FIT.</span>
          </p>
        </div>
      </footer>
      </>)}

      {/* FLOAT SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-30 p-3 bg-[#e4562f] hover:bg-[#c94522] text-white font-bold rounded-full shadow-xl shadow-black/30 hover:scale-110 active:scale-95 transition-transform"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* MODALS */}
      <RegistrationModal
        isOpen={isRegModalOpen}
        onClose={() => setIsRegModalOpen(false)}
        selectedProgram={selectedProgram}
        allPrograms={PROGRAMS_DATA}
        dictionary={dict}
        isRtl={isRtl}
        showToast={showToast}
        country={country}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        dictionary={dict}
        isRtl={isRtl}
        showToast={showToast}
      />

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        dictionary={dict}
        isRtl={isRtl}
        showToast={showToast}
      />

      <RecipeBookModal
        isOpen={isRecipeOpen}
        onClose={() => setIsRecipeOpen(false)}
        dictionary={dict}
        isRtl={isRtl}
        showToast={showToast}
      />

      <WhoIsDurrahModal
        isOpen={isWhoDurrahOpen}
        onClose={() => setIsWhoDurrahOpen(false)}
        dictionary={dict}
        isRtl={isRtl}
      />

      {/* TOAST CONTAINER */}
      <ToastContainer toasts={toasts} removeToast={removeToast} isRtl={isRtl} />
    </div>
  );
}
