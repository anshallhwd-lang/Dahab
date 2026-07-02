import React from "react";
import { X, Award, Shield, User } from "lucide-react";

interface WhoIsDurrahModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
  isRtl: boolean;
}

export default function WhoIsDurrahModal({ isOpen, onClose, dictionary, isRtl }: WhoIsDurrahModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-[#e4562f]" />
            {dictionary.whoIsDurrah}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Champion badging */}
          <div className="flex items-center gap-4 bg-[#e4562f]/5 border border-[#e4562f]/20 rounded-xl p-4">
            <div className="w-12 h-12 bg-[#e4562f]/10 border border-[#e4562f]/20 rounded-full flex items-center justify-center text-[#e4562f] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm uppercase font-display tracking-wider">
                {dictionary.olympianSub}
              </h4>
              <p className="text-xs text-zinc-400 mt-0.5">
                {isRtl ? "سجل بطولات متميز ومنافسات عالمية" : "Distinguished athletic background and worldwide contender"}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm leading-relaxed text-zinc-300">
            <h5 className="text-lg font-bold text-white font-display">{dictionary.whoIsDurrahTitle}</h5>
            <p>{dictionary.whoIsDurrahP1}</p>
            <p>{dictionary.whoIsDurrahP2}</p>

            <div className="pt-4 border-t border-zinc-800 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                  {isRtl ? "الخبرة" : "Experience"}
                </span>
                <span className="text-white font-bold block">15+ Years</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                  {isRtl ? "تأهيل وتدريب" : "Coached"}
                </span>
                <span className="text-[#e4562f] font-bold block">16,000+ Clients</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                  {isRtl ? "التخصص" : "Specialty"}
                </span>
                <span className="text-white font-bold block">Body Recomposition</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold block">
                  {isRtl ? "الفئة الاحترافية" : "Pro Division"}
                </span>
                <span className="text-white font-bold block">IFBB Pro Olympian</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors text-sm"
          >
            {dictionary.close}
          </button>
        </div>
      </div>
    </div>
  );
}
