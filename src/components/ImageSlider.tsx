import React, { useState, useRef, useEffect } from "react";

interface ImageSliderProps {
  beforeImg: string;
  afterImg: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ImageSlider({
  beforeImg,
  afterImg,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
}: ImageSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let position = (x / rect.width) * 100;
    if (position < 0) position = 0;
    if (position > 100) position = 100;
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square rounded-2xl overflow-hidden select-none border-2 border-zinc-800 bg-zinc-950 group cursor-ew-resize"
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      {/* After Image (Background) */}
      <img
        src={afterImg}
        alt="After transformation"
        className="absolute inset-0 w-full h-full object-cover"
        referrerPolicy="no-referrer"
        draggable={false}
      />
      <div className="absolute right-4 bottom-4 bg-zinc-950/80 backdrop-blur-xs text-[10px] tracking-wider font-bold text-[#00B2FE] px-2 py-1 rounded-sm border border-[#00B2FE]/30">
        {afterLabel}
      </div>

      {/* Before Image (Foreground, clipped) */}
      <div
        className="absolute inset-0 w-full h-full overflow-hidden"
        style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
      >
        <img
          src={beforeImg}
          alt="Before transformation"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
          draggable={false}
        />
        <div className="absolute left-4 bottom-4 bg-zinc-950/80 backdrop-blur-xs text-[10px] tracking-wider font-bold text-red-500 px-2 py-1 rounded-sm border border-red-500/30">
          {beforeLabel}
        </div>
      </div>

      {/* Slider Bar & Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-[#00B2FE] cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-950 border-2 border-[#00B2FE] flex items-center justify-center shadow-lg shadow-black/50 hover:scale-110 active:scale-95 transition-transform duration-100">
          <svg
            className="w-4 h-4 text-[#00B2FE]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 9l-4 4 4 4m8 0l4-4-4-4"
            />
          </svg>
        </div>
      </div>

      {/* Overlay guide helper shown briefly/on hover */}
      <div className="absolute inset-x-0 top-4 flex justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span className="bg-zinc-950/80 backdrop-blur-xs text-[10px] text-zinc-400 font-mono px-3 py-1 rounded-full border border-zinc-800">
          Drag slider to compare
        </span>
      </div>
    </div>
  );
}
