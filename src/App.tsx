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

// Image asset imports
import durrahHero from "./assets/images/durrah_hero_1782919258240.jpg";
import dietPlanBg from "./assets/images/diet_plan_bg_1782919273236.jpg";
import workoutBg from "./assets/images/workout_bg_1782919286963.jpg";
import supplementBg from "./assets/images/supplement_bg_1782919300875.jpg";
import gymBgStats from "./assets/images/gym_bg_stats_1782919316774.jpg";

const imageMap: Record<string, string> = {
  "durrah_hero_1782919258240.jpg": durrahHero,
  "diet_plan_bg_1782919273236.jpg": dietPlanBg,
  "workout_bg_1782919286963.jpg": workoutBg,
  "supplement_bg_1782919300875.jpg": supplementBg,
  "gym_bg_stats_1782919316774.jpg": gymBgStats,
};

export default function App() {
  const [lang, setLang] = useState<"en" | "ar">("en");
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

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const dict = DICTIONARY[lang];
  const isRtl = lang === "ar";

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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
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
      className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-[#00B2FE] selection:text-black"
      style={{ direction: isRtl ? "rtl" : "ltr" }}
    >
      {/* HEADER / NAVIGATION BAR */}
      <header
        id="navbar-header"
        className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
          <div
            id="brand-logo"
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => scrollToSection("hero-section")}
          >
            {/* Vector D / Double D Hexagon Logo */}
            <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
              <svg className="w-10 h-10 text-[#00B2FE]" viewBox="0 0 100 100" fill="none">
                <polygon
                  points="50,5 93,30 93,80 50,98 7,80 7,30"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
                <path
                  d="M35 30 H65 C75 30, 75 70, 65 70 H35"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line x1="35" y1="30" x2="35" y2="70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col text-left select-none">
              <span className="font-display font-extrabold tracking-tight text-white text-lg leading-none">
                DURABOLIC
              </span>
              <span className="font-mono text-[9px] tracking-[0.45em] text-[#00B2FE] font-bold leading-none mt-0.5">
                NUTRITION
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => scrollToSection("hero-section")}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.home}
            </button>
            <button
              onClick={() => setIsWhoDurrahOpen(true)}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.whoIsDurrah}
            </button>
            <button
              onClick={() => scrollToSection("transformations-section")}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.transformations}
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.services}
            </button>
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.videoConsultation}
            </button>
            <button
              onClick={() => setIsRecipeOpen(true)}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors text-emerald-400"
            >
              {dict.recipeBook}
            </button>
            <button
              onClick={() => setIsContactOpen(true)}
              className="px-3 py-2 text-xs font-bold text-zinc-400 hover:text-[#00B2FE] transition-colors"
            >
              {dict.contact}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="ml-2 px-3 py-1.5 rounded-full border border-zinc-800 text-xs font-mono font-bold text-white hover:border-[#00B2FE] hover:text-[#00B2FE] bg-zinc-900 transition-all flex items-center gap-1.5"
            >
              <span>{isRtl ? "English" : "عربي"}</span>
            </button>
          </nav>

          {/* Social Icons & Contact Action (Desktop) */}
          <div id="header-socials" className="hidden lg:flex items-center gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav id="mobile-nav" className="lg:hidden border-t border-zinc-900 bg-zinc-950/98 p-5 space-y-3">
            <button
              onClick={() => scrollToSection("hero-section")}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.home}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWhoDurrahOpen(true);
              }}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.whoIsDurrah}
            </button>
            <button
              onClick={() => scrollToSection("transformations-section")}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.transformations}
            </button>
            <button
              onClick={() => scrollToSection("services-section")}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.services}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsConsultationOpen(true);
              }}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.videoConsultation}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsRecipeOpen(true);
              }}
              className="block w-full text-left font-bold text-sm text-emerald-400 py-2"
            >
              {dict.recipeBook}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsContactOpen(true);
              }}
              className="block w-full text-left font-bold text-sm text-zinc-300 py-2 hover:text-[#00B2FE]"
            >
              {dict.contact}
            </button>

            {/* Mobile Lang and Socials */}
            <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-[#00B2FE]"
              >
                {isRtl ? "English" : "عربي"}
              </button>
              <div className="flex gap-3">
                <a href="#" className="text-zinc-400 hover:text-white">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-zinc-400 hover:text-white">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-zinc-400 hover:text-white">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </nav>
        )}
      </header>

      {/* HERO SECTION */}
      <section
        id="hero-section"
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-zinc-950 border-b border-zinc-900"
      >
        {/* Background Image with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src={imageMap["durrah_hero_1782919258240.jpg"]}
            alt="Mahmood Al Durrah flexing side bicep under a dramatic gym spotlight"
            className="w-full h-full object-cover object-center scale-105 filter brightness-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40" />
          <div className="absolute inset-0 bg-zinc-950/20 mix-blend-overlay" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center text-center">
          {/* DURRAH Display Text */}
          <div className="relative mb-6">
            <h1 className="text-7xl sm:text-9xl md:text-[13rem] font-black tracking-widest text-[#00B2FE] leading-none uppercase font-display select-none opacity-90 filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
              DURRAH
            </h1>
          </div>

          {/* Subtitle credentials */}
          <div className="flex flex-col items-center gap-3 max-w-2xl mt-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 shadow-lg shadow-red-950/30 animate-pulse">
              <span className="text-xs sm:text-sm font-extrabold text-red-500 tracking-wider uppercase font-display">
                {dict.olympianSub.split(" ")[0]} {dict.olympianSub.split(" ")[1]}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-xs sm:text-sm font-extrabold text-zinc-100 tracking-wider uppercase">
                {dict.olympianSub.substring(10)}
              </span>
            </div>

            {/* Subtext info */}
            <p className="text-lg sm:text-2xl font-bold text-white tracking-wide mt-4 filter drop-shadow-md">
              {dict.middleEastSelling}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 w-full sm:w-auto">
              <button
                onClick={() => scrollToSection("services-section")}
                className="glow-btn px-8 py-4 bg-[#00B2FE] text-black font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
              >
                {dict.buyNow}
              </button>
              <button
                onClick={() => setIsWhoDurrahOpen(true)}
                className="px-8 py-4 border-2 border-zinc-500 hover:border-white text-white font-bold rounded-full hover:bg-zinc-900 transition-all text-sm uppercase tracking-wider"
              >
                {dict.whoIsDurrah}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom decorative stats layout snippet */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-xs font-mono text-zinc-500">
          <span>IFBB PRO CARD ID: 12059-A</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FE]/30" />
          <span>ESTABLISHED 2013</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00B2FE]/30" />
          <span>WWW.DURRAHNATION.COM</span>
        </div>
      </section>

      {/* THREE CORE PROGRAMS / SERVICES */}
      <section id="services-section" className="py-24 bg-zinc-950 relative border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#00B2FE] uppercase font-display">
              {isRtl ? "برامج تدريب النخبة" : "ELITE COACHING PLANS"}
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
              {isRtl ? "اختر سلاحك للتغيير الكامل لجسمك" : "Select Your Protocol to Rebuild Your Physique"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PROGRAMS_DATA.map((program) => (
              <div
                key={program.id}
                id={`card-${program.id}`}
                className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col h-[480px] transition-all duration-300 hover:border-[#00B2FE]/50 hover:shadow-2xl hover:shadow-[#00B2FE]/5"
              >
                {/* Background image on top half */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={imageMap[program.bgImage]}
                    alt={program.titleEn}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <div className="w-10 h-10 rounded-full bg-zinc-950/80 backdrop-blur-xs border border-zinc-800 flex items-center justify-center text-[#00B2FE]">
                      {renderIcon(program.icon, "w-5 h-5")}
                    </div>
                    <span className="bg-[#00B2FE] text-black font-mono font-bold text-xs px-3 py-1 rounded-full">
                      {program.price}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-white font-display tracking-tight">
                      {isRtl ? program.titleAr : program.titleEn}
                    </h3>
                    <p className="text-xs text-[#00B2FE] font-bold">
                      {isRtl ? program.subtitleAr : program.subtitleEn}
                    </p>
                    <ul className="space-y-2 pt-3">
                      {(isRtl ? program.featuresAr : program.featuresEn).map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                          <Check className="w-4 h-4 text-[#00B2FE] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleOpenProgram(program)}
                    className="w-full py-3 mt-6 bg-[#00B2FE] text-black font-extrabold rounded-lg hover:bg-[#0092d0] transition-colors text-xs uppercase tracking-wider"
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
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#00B2FE] uppercase font-display">
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
                className="bg-zinc-900/80 backdrop-blur-xs border border-zinc-800 rounded-2xl p-5 space-y-4"
              >
                {/* Image Slider Component */}
                <ImageSlider
                  beforeImg={t.beforeImg}
                  afterImg={t.afterImg}
                  beforeLabel={dict.before}
                  afterLabel={dict.after}
                />

                {/* Info and labels underneath */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-white text-base font-display">{t.name}</h4>
                    <span className="bg-yellow-400 text-black font-mono font-bold text-[10px] px-2 py-0.5 rounded-sm">
                      {isRtl ? t.durationAr : t.durationEn}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 font-mono tracking-wider">
                    {isRtl ? t.tagAr : t.tagEn}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {isRtl ? t.descriptionAr : t.descriptionEn}
                  </p>
                  <div className="pt-3 border-t border-zinc-800 flex justify-between items-center text-[8px] text-zinc-600 font-mono">
                    <span>DURABOLIC NUTRITION</span>
                    <span>WWW.DURRAHNATION.COM</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="glow-btn inline-flex items-center justify-center px-10 py-4 bg-[#00B2FE] text-black font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider gap-2"
            >
              <span>{dict.changeLifeNow}</span>
            </button>
          </div>
        </div>
      </section>

      {/* AS SEEN ON TV / MEDIA FEATURE SECTION */}
      <section id="media-section" className="py-24 bg-white text-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-zinc-950 uppercase">
              {dict.changingLivesTV}
            </h2>
            <div className="w-16 h-1 bg-[#00B2FE] mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <p className="text-base text-zinc-700 leading-relaxed font-medium">
                {dict.mediaParagraph1}
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {dict.mediaParagraph2}
              </p>
              <p className="text-sm text-zinc-600 leading-relaxed italic">
                {dict.mediaParagraph3}
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setIsRegModalOpen(true)}
                  className="px-8 py-3.5 bg-[#00B2FE] text-black font-extrabold rounded-lg hover:bg-[#0092d0] transition-colors text-xs uppercase tracking-wider"
                >
                  {dict.buyTheProgram}
                </button>
              </div>
            </div>

            {/* Right Video / Media Column */}
            <div className="lg:col-span-7 space-y-8">
              <div
                id="video-player-container"
                className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-zinc-200 group cursor-pointer"
              >
                {!isVideoPlaying ? (
                  <>
                    <img
                      src={imageMap["durrah_hero_1782919258240.jpg"]}
                      alt="Who is Durrah video placeholder"
                      className="w-full h-full object-cover filter brightness-75 group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/50 bg-black/60 flex items-center justify-center text-white font-bold text-xs shrink-0 font-display">
                          MD
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">Who is Durrah</p>
                          <p className="text-white/70 text-xs">Mahmood Al Durrah</p>
                        </div>
                      </div>

                      {/* Giant Play Icon */}
                      <div
                        onClick={() => setIsVideoPlaying(true)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transform active:scale-95 hover:scale-110 transition-all duration-150"
                      >
                        <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>

                      <div className="bg-black/70 backdrop-blur-xs rounded-lg p-2.5 flex items-center justify-between text-xs text-white">
                        <span className="font-bold">DAD BECOMES BATMAN TO COMBAT BULLIES</span>
                        <span className="text-[#00B2FE] flex items-center gap-1">
                          {dict.watchVideo} <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/PjG8M7X1_tY?autoplay=1"
                    title="Who is Durrah TV news segment"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
              </div>

              {/* News channel logos */}
              <div id="media-logos" className="pt-4 space-y-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest block text-center">
                  {isRtl ? "التغطية الإعلامية للبرنامج:" : "As featured in global networks:"}
                </span>
                <div className="flex flex-wrap items-center justify-center gap-8 filter grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all">
                  <span className="text-lg font-black tracking-tight text-zinc-900 font-display">CBC</span>
                  <span className="text-lg font-black tracking-tight text-[#00B2FE] font-display">CTV News</span>
                  <span className="text-lg font-black tracking-tight text-zinc-900 font-display">TV News</span>
                  <span className="text-lg font-black tracking-tight text-zinc-900 font-display">CityNews</span>
                  <span className="text-lg font-black tracking-tight text-red-600 font-display">OMNI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works-section" className="py-24 bg-zinc-950 relative border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-xs sm:text-sm font-extrabold tracking-widest text-[#00B2FE] uppercase font-display">
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
                  <div className="relative w-24 h-24 rounded-full bg-zinc-900 border-2 border-zinc-800 group-hover:border-[#00B2FE] flex items-center justify-center mx-auto text-zinc-400 hover:text-[#00B2FE] shadow-xl hover:scale-105 transition-all duration-300">
                    <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#00B2FE] text-black font-mono font-bold text-xs flex items-center justify-center">
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
      <section id="faq-section" className="py-24 bg-[#00B2FE] text-white relative">
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
          <div className="absolute inset-0 bg-[#00B2FE]/10 mix-blend-color" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-lg font-bold tracking-widest text-[#00B2FE] uppercase font-display">
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
      <section id="hundreds-transformations" className="py-24 bg-[#00B2FE] text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              {dict.checkHundredsTransformations}
            </h2>
            <div className="w-16 h-1 bg-white mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {TRANSFORMATIONS_DATA.slice(2, 4).map((t) => (
              <div key={t.id} className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-5 space-y-4">
                <ImageSlider
                  beforeImg={t.beforeImg}
                  afterImg={t.afterImg}
                  beforeLabel={dict.before}
                  afterLabel={dict.after}
                />
                <div className="flex justify-between items-center pt-2">
                  <h4 className="font-bold text-white text-base">{t.name}</h4>
                  <span className="bg-yellow-400 text-black font-mono font-bold text-[10px] px-2.5 py-1 rounded-sm">
                    {isRtl ? t.durationAr : t.durationEn}
                  </span>
                </div>
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
            <h2 className="text-xl sm:text-2xl font-black tracking-widest text-[#00B2FE] uppercase font-display">
              {dict.brandName}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-light">
              {dict.mediaParagraph1.split(".")[0]}.
            </p>
          </div>

          {/* Stats metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-b border-zinc-800/80 py-12">
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">2013</span>
              <div className="w-8 h-1 bg-[#00B2FE] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.coachingSince}
              </span>
            </div>
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">16,000+</span>
              <div className="w-8 h-1 bg-[#00B2FE] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.programsMade}
              </span>
            </div>
            <div className="text-center space-y-2">
              <span className="text-5xl sm:text-6xl font-black text-white font-display block">600+</span>
              <div className="w-8 h-1 bg-[#00B2FE] mx-auto my-2" />
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono font-bold block">
                {dict.publishedTransformations}
              </span>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setIsRegModalOpen(true)}
              className="px-10 py-4 bg-[#00B2FE] text-black font-extrabold rounded-full hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-wider"
            >
              {dict.buyNow}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="footer-section" className="bg-black text-zinc-400 py-16 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left follow column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 text-[#00B2FE]" viewBox="0 0 100 100" fill="none">
                  <polygon points="50,5 93,30 93,80 50,98 7,80 7,30" stroke="currentColor" strokeWidth="10" />
                </svg>
              </div>
              <span className="font-display font-extrabold text-white text-base tracking-wider">
                {dict.brandName}
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{dict.followDurrah}</h4>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-[#00B2FE] hover:border-[#00B2FE]/50 transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right quick links column */}
          <div className="space-y-4">
            <h4 className="font-extrabold text-white text-xs uppercase tracking-wider">{dict.quickLinks}</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button onClick={() => setIsWhoDurrahOpen(true)} className="text-left py-1 text-zinc-400 hover:text-[#00B2FE] transition-colors">
                &gt; {dict.whoIsDurrah}
              </button>
              <button onClick={() => scrollToSection("services-section")} className="text-left py-1 text-zinc-400 hover:text-[#00B2FE] transition-colors">
                &gt; {dict.customizedPrograms}
              </button>
              <button onClick={() => setIsContactOpen(true)} className="text-left py-1 text-zinc-400 hover:text-[#00B2FE] transition-colors">
                &gt; {dict.contact}
              </button>
              <button onClick={() => scrollToSection("transformations-section")} className="text-left py-1 text-zinc-400 hover:text-[#00B2FE] transition-colors">
                &gt; {dict.transformations}
              </button>
              <button onClick={() => setIsContactOpen(true)} className="text-left py-1 text-zinc-400 hover:text-[#00B2FE] transition-colors">
                &gt; {dict.terms}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-zinc-900 text-center text-[10px] text-zinc-600 font-mono">
          <p>© {new Date().getFullYear()} {dict.brandName}. ALL RIGHTS RESERVED. POWERED BY DURRAHNATION.</p>
        </div>
      </footer>

      {/* FLOAT SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={() => scrollToSection("navbar-header")}
          className="fixed bottom-6 right-6 z-30 p-3 bg-[#00B2FE] hover:bg-[#0092d0] text-black font-bold rounded-full shadow-xl shadow-black/30 hover:scale-110 active:scale-95 transition-transform"
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
