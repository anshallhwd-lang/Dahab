import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SupplementItem {
  id: number;
  imgAr: string;
  imgEn: string;
}

const SUPPLEMENTS: SupplementItem[] = [
  {
    id: 1,
    imgAr: "https://g.top4top.io/p_3836fj50n1.png",
    imgEn: "https://h.top4top.io/p_38361r17z2.png"
  },
  {
    id: 2,
    imgAr: "https://i.top4top.io/p_38362uc8h3.png",
    imgEn: "https://j.top4top.io/p_383652bfr4.png"
  },
  {
    id: 3,
    imgAr: "https://k.top4top.io/p_3836xwyvc5.png",
    imgEn: "https://l.top4top.io/p_3836hy0lf6.png"
  },
  {
    id: 4,
    imgAr: "https://a.top4top.io/p_3836pnckz7.png",
    imgEn: "https://b.top4top.io/p_3836x7zze8.png"
  },
  {
    id: 5,
    imgAr: "https://c.top4top.io/p_3836cg35h9.png",
    imgEn: "https://d.top4top.io/p_3836ycl7410.png"
  },
  {
    id: 6,
    imgAr: "https://c.top4top.io/p_3836rms0u1.png",
    imgEn: "https://d.top4top.io/p_3836homef2.png"
  },
  {
    id: 7,
    imgAr: "https://e.top4top.io/p_38369a6yv3.png",
    imgEn: "https://f.top4top.io/p_3836tckar4.png"
  },
  {
    id: 8,
    imgAr: "https://g.top4top.io/p_383691oob5.png",
    imgEn: "https://h.top4top.io/p_38367qc166.png"
  },
  {
    id: 9,
    imgAr: "https://i.top4top.io/p_3836jgrwc7.png",
    imgEn: "https://j.top4top.io/p_38364r73h8.png"
  },
  {
    id: 10,
    imgAr: "https://k.top4top.io/p_3836fmsuo9.png",
    imgEn: "https://l.top4top.io/p_3836ppnm210.png"
  },
  {
    id: 11,
    imgAr: "https://b.top4top.io/p_3836cuxgy1.png",
    imgEn: "https://c.top4top.io/p_3836w3jth2.png"
  },
  {
    id: 12,
    imgAr: "https://d.top4top.io/p_3836tgsj93.png",
    imgEn: "https://e.top4top.io/p_3836ry3m84.png"
  },
  {
    id: 13,
    imgAr: "https://f.top4top.io/p_3836jbeld5.png",
    imgEn: "https://g.top4top.io/p_3836flv9j6.png"
  },
  {
    id: 14,
    imgAr: "https://h.top4top.io/p_3836d5jna7.png",
    imgEn: "https://i.top4top.io/p_3836u3o1j8.png"
  },
  {
    id: 15,
    imgAr: "https://j.top4top.io/p_383684ms29.png",
    imgEn: "https://k.top4top.io/p_3836lzv8910.png"
  },
  {
    id: 16,
    imgAr: "https://iili.io/CYi5YVR.png",
    imgEn: "https://iili.io/CYi5WDG.png"
  },
  {
    id: 17,
    imgAr: "https://h.top4top.io/p_3836o4zbo1.png",
    imgEn: "https://i.top4top.io/p_3836rfl7v2.png"
  },
  {
    id: 18,
    imgAr: "https://k.top4top.io/p_3836mu3l41.png",
    imgEn: "https://l.top4top.io/p_383695yn12.png"
  },
  {
    id: 19,
    imgAr: "https://a.top4top.io/p_3836hudnp3.png",
    imgEn: "https://b.top4top.io/p_3836v78fy4.png"
  },
  {
    id: 20,
    imgAr: "https://c.top4top.io/p_3836mkjlm5.png",
    imgEn: "https://d.top4top.io/p_3836ml4ln6.png"
  },
  {
    id: 21,
    imgAr: "https://e.top4top.io/p_3836ev3vg7.png",
    imgEn: "https://f.top4top.io/p_3836qzztd8.png"
  },
  {
    id: 22,
    imgAr: "https://g.top4top.io/p_38369xj6e9.png",
    imgEn: "https://h.top4top.io/p_3836jgsil10.png"
  },
  {
    id: 23,
    imgAr: "https://d.top4top.io/p_3836fczns1.png",
    imgEn: "https://e.top4top.io/p_3836mwmr72.png"
  },
  {
    id: 24,
    imgAr: "https://f.top4top.io/p_383688gxj3.png",
    imgEn: "https://g.top4top.io/p_38366f7ie4.png"
  },
  {
    id: 25,
    imgAr: "https://h.top4top.io/p_3836osqjl5.png",
    imgEn: "https://i.top4top.io/p_38369nvxf6.png"
  },
  {
    id: 26,
    imgAr: "https://j.top4top.io/p_3836ozalf7.png",
    imgEn: "https://k.top4top.io/p_383652wir8.png"
  },
  {
    id: 27,
    imgAr: "https://l.top4top.io/p_383639v039.png",
    imgEn: "https://l.top4top.io/p_3836cj9ng1.png"
  },
  {
    id: 28,
    imgAr: "https://c.top4top.io/p_3836izcbm1.png",
    imgEn: "https://d.top4top.io/p_3836e6d8j2.png"
  },
  {
    id: 29,
    imgAr: "https://e.top4top.io/p_3836il7gt3.png",
    imgEn: "https://f.top4top.io/p_3836dk1xk4.png"
  },
  {
    id: 30,
    imgAr: "https://g.top4top.io/p_38363az785.png",
    imgEn: "https://h.top4top.io/p_3836e6wmn6.png"
  },
  {
    id: 31,
    imgAr: "https://i.top4top.io/p_3836jhxba7.png",
    imgEn: "https://j.top4top.io/p_38360f5t78.png"
  },
  {
    id: 32,
    imgAr: "https://j.top4top.io/p_3836z7ag21.png",
    imgEn: "https://k.top4top.io/p_3836bk0g52.png"
  },
  {
    id: 33,
    imgAr: "https://l.top4top.io/p_3836z1xwr3.png",
    imgEn: "https://a.top4top.io/p_3836sl49u4.png"
  },
  {
    id: 34,
    imgAr: "https://b.top4top.io/p_3836k9ddt5.png",
    imgEn: "https://c.top4top.io/p_3836vu22z6.png"
  },
  {
    id: 35,
    imgAr: "https://d.top4top.io/p_38363si2t7.png",
    imgEn: "https://e.top4top.io/p_3836qi7zo8.png"
  },
  {
    id: 36,
    imgAr: "https://f.top4top.io/p_3836ug9li1.png",
    imgEn: "https://g.top4top.io/p_3836g7eg12.png"
  },
  {
    id: 37,
    imgAr: "https://h.top4top.io/p_3836lqorl3.png",
    imgEn: "https://i.top4top.io/p_3836lrfy74.png"
  },
  {
    id: 38,
    imgAr: "https://j.top4top.io/p_3836x5vhg5.png",
    imgEn: "https://k.top4top.io/p_3836vu56g6.png"
  },
  {
    id: 39,
    imgAr: "https://l.top4top.io/p_3836tqmg57.png",
    imgEn: "https://a.top4top.io/p_3836w8fao8.png"
  },
  {
    id: 40,
    imgAr: "https://b.top4top.io/p_3836pcw729.png",
    imgEn: "https://c.top4top.io/p_3836kjzke10.png"
  },
  {
    id: 41,
    imgAr: "https://h.top4top.io/p_38360rzsb1.png",
    imgEn: "https://i.top4top.io/p_38365rhru2.png"
  },
  {
    id: 42,
    imgAr: "https://j.top4top.io/p_3836b7hl63.png",
    imgEn: "https://k.top4top.io/p_3836vuj504.png"
  },
  {
    id: 43,
    imgAr: "https://l.top4top.io/p_3836vauu35.png",
    imgEn: "https://a.top4top.io/p_3836wdy2r6.png"
  },
  {
    id: 44,
    imgAr: "https://b.top4top.io/p_3836s2nnu7.png",
    imgEn: "https://c.top4top.io/p_3836t78yk8.png"
  },
  {
    id: 45,
    imgAr: "https://d.top4top.io/p_3836vz5149.png",
    imgEn: "https://e.top4top.io/p_38367wppg10.png"
  },
  {
    id: 46,
    imgAr: "https://l.top4top.io/p_38368h3d21.png",
    imgEn: "https://a.top4top.io/p_3836s4wjk2.png"
  },
  {
    id: 47,
    imgAr: "https://b.top4top.io/p_3836m16xg3.png",
    imgEn: "https://c.top4top.io/p_38363bocy4.png"
  },
  {
    id: 48,
    imgAr: "https://d.top4top.io/p_3836n8v9c5.png",
    imgEn: "https://e.top4top.io/p_3836sqhlz6.png"
  },
  {
    id: 49,
    imgAr: "https://f.top4top.io/p_3836gvgnj1.png",
    imgEn: "https://g.top4top.io/p_3836tq6y42.png"
  },
  {
    id: 50,
    imgAr: "https://h.top4top.io/p_3836urw7s3.png",
    imgEn: "https://i.top4top.io/p_38367t7qu4.png"
  },
  {
    id: 51,
    imgAr: "https://j.top4top.io/p_38366nwmu5.png",
    imgEn: "https://k.top4top.io/p_3836l8l9d6.png"
  },
  {
    id: 52,
    imgAr: "https://l.top4top.io/p_3836gcy807.png",
    imgEn: "https://a.top4top.io/p_383648r5r8.png"
  }
];

interface SupplementSliderProps {
  lang: "en" | "ar";
  theme: "dark" | "light";
  onSelectSupplement: (id: number) => void;
}

export default function SupplementSlider({ lang, theme, onSelectSupplement }: SupplementSliderProps) {
  const isRtl = lang === "ar";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDrag, setIsDrag] = useState(false);
  
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const initialized = useRef(false);
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset initialization flag when language changes so that the slider can re-center with the new images
  useEffect(() => {
    initialized.current = false;
  }, [lang]);

  // Clean up any pending timeouts on unmount
  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) {
        clearTimeout(pauseTimeoutRef.current);
      }
    };
  }, []);

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

    // Temporarily pause automatic scrolling to let the smooth manual scroll complete cleanly
    setIsPaused(true);
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
    }
    pauseTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 2500); // Resume auto-scrolling after 2.5 seconds of user inactivity

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
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-4 sm:mt-0">
          <span className="hidden sm:inline">{isRtl ? "اسحب للتمرير أو استخدم الأسهم" : "Drag to scroll or use arrows"}</span>
          <div className="flex gap-1.5 ml-2" dir="ltr">
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
          dir="ltr"
        >
          {items.map((supp, index) => {
            const imgSrc = isRtl ? supp.imgAr : supp.imgEn;

            return (
              <div
                key={`${supp.id}-${index}`}
                onClick={() => onSelectSupplement(supp.id)}
                className="w-[280px] sm:w-[320px] aspect-[3/4] sm:aspect-[4/5] shrink-0 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#e4562f]/15 cursor-pointer bg-black/10 dark:bg-black/40 flex items-center justify-center p-1"
              >
                <img
                  src={imgSrc}
                  alt="Supplement Product"
                  className="w-full h-full object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
