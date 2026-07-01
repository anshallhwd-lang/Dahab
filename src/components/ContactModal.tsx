import React, { useState } from "react";
import { X, CheckCircle, Mail } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
  isRtl: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ContactModal({ isOpen, onClose, dictionary, isRtl, showToast }: ContactModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (showToast) {
      const msg = isRtl
        ? `شكرًا لك يا ${formData.name}! تم إرسال رسالتك بنجاح. وسنقوم بالرد عليك قريبًا.`
        : `Thank you, ${formData.name}! Your message has been sent successfully. Our support team will get back to you shortly.`;
      showToast(msg, "success");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#00B2FE]" />
            {dictionary.contactTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <p className="text-sm text-zinc-400">{dictionary.contactSub}</p>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                {dictionary.formName}
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#00B2FE]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                {dictionary.formEmail}
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#00B2FE]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                {isRtl ? "رسالتك" : "Message"}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#00B2FE]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00B2FE] text-black font-bold rounded-lg hover:bg-[#0092d0] transition-colors"
            >
              {dictionary.sendMessage}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-zinc-300">{dictionary.contactSuccess}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-zinc-850 hover:bg-zinc-800 text-white rounded-lg transition-colors text-xs font-bold"
            >
              {dictionary.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
