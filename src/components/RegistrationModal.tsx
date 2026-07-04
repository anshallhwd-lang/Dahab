import React, { useState } from "react";
import { X, Upload, CheckCircle, ChevronRight, ChevronLeft, Copy } from "lucide-react";
import { Program } from "../types";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProgram: Program | null;
  allPrograms: Program[];
  dictionary: any;
  isRtl: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
  country: "USA" | "Egypt";
}

export default function RegistrationModal({
  isOpen,
  onClose,
  selectedProgram,
  allPrograms,
  dictionary,
  isRtl,
  showToast,
  country,
}: RegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [activeProgram, setActiveProgram] = useState<Program | null>(selectedProgram);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    weight: "",
    height: "",
    age: "",
    goal: "shred",
    notes: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "paypal" | "vodafone" | "instapay">("crypto");
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDisplayPrice = (original: string) => {
    const numeric = parseInt(original.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numeric)) return original;
    if (country === "Egypt") {
      return `${numeric * 55} E£`;
    }
    return `${numeric} USDT`;
  };

  const compressImage = (file: File): Promise<{ name: string; data: string }> => {
    return new Promise((resolve) => {
      if (!file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ name: file.name, data: reader.result as string });
        reader.onerror = () => resolve({ name: file.name, data: "" });
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const maxDim = 600; // Sharp but lightweight
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.5); // 50% quality compression
          resolve({ name: file.name, data: dataUrl });
        } else {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ name: file.name, data: reader.result as string });
          reader.onerror = () => resolve({ name: file.name, data: "" });
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve({ name: file.name, data: reader.result as string });
        reader.onerror = () => resolve({ name: file.name, data: "" });
      };
    });
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("TXuHWgNn6xYVCjCdKebDkKk3nvC67KcVSZ");
    setCopied(true);
    if (showToast) {
      showToast(isRtl ? "تم نسخ العنوان!" : "Address copied!", "success");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = (text: string, successMsgAr: string, successMsgEn: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) {
      showToast(isRtl ? successMsgAr : successMsgEn, "success");
    }
    setTimeout(() => setCopied(false), 2000);
  };

  React.useEffect(() => {
    if (selectedProgram) {
      setActiveProgram(selectedProgram);
    }
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitted(false);
      setUploadedFiles([]);
      setPaymentProof(null);
      setPaymentMethod(country === "Egypt" ? "vodafone" : "crypto");
      setCopied(false);
    }
  }, [selectedProgram, isOpen, country]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files);
      setUploadedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let base64Proof = null;
      if (paymentProof) {
        base64Proof = await compressImage(paymentProof);
      }

      const base64Files = [];
      for (const file of uploadedFiles) {
        const b64 = await compressImage(file);
        base64Files.push(b64);
      }

      const payload = {
        name: formData.name,
        email: formData.email,
        weight: formData.weight,
        height: formData.height,
        age: formData.age,
        goal: formData.goal,
        notes: formData.notes,
        programId: activeProgram?.id || "custom-elite",
        programTitleEn: activeProgram?.titleEn || "Custom Elite Program",
        programTitleAr: activeProgram?.titleAr || "برنامج النخبة المخصص",
        paymentMethod,
        paymentProof: base64Proof,
        uploadedFiles: base64Files,
      };

      // Submit to backend API
      try {
        await fetch("/api/submit-registration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("Backend API submission failed:", apiErr);
      }

      // Direct client-side submission to Google Sheets Webhook (essential for Vercel/GitHub Pages static hosting)
      try {
        const courseWebhookUrl = "https://script.google.com/macros/s/AKfycbxJi-2-7noOBRO1HDlUwL8CrTuD15kKVYBicB4ky9KCledfJNa6eSyvey6MTZ9EEUhA/exec";
        await fetch(courseWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({ ...payload, dataType: "course_registration" }),
        });
        console.log("Direct client-side course registration successfully forwarded to Google Sheets!");
      } catch (clientErr) {
        console.error("Direct client-side course registration forwarding failed:", clientErr);
      }

      // Transition to success screen
      setIsSubmitted(true);
      if (showToast) {
        const msg = isRtl
          ? `شكرًا لك يا ${formData.name}! تم تأكيد اشتراكك بنجاح.`
          : `Thank you, ${formData.name}! Your subscription details have been submitted successfully.`;
        showToast(msg, "success");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      if (showToast) {
        showToast(
          isRtl
            ? "حدث خطأ أثناء معالجة الصور. يرجى المحاولة مرة أخرى."
            : "An error occurred while processing pictures. Please try again.",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-xl font-bold font-display text-white tracking-tight">
            {dictionary.orderTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form / Content */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step Indicators */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center space-x-2 space-x-reverse">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 1 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  1
                </span>
                <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
                  {isRtl ? "اختر الخطة" : "Select Plan"}
                </span>
              </div>
              <div className="h-[2px] flex-1 bg-zinc-800 mx-3">
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep > 1 ? "100%" : "0%" }}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 2 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
                  {isRtl ? "الدفع" : "Payment"}
                </span>
              </div>
              <div className="h-[2px] flex-1 bg-zinc-800 mx-3">
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep > 2 ? "100%" : "0%" }}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 3 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  3
                </span>
                <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
                  {isRtl ? "المؤشرات الصحية" : "Stats & Goal"}
                </span>
              </div>
              <div className="h-[2px] flex-1 bg-zinc-800 mx-3">
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep > 3 ? "100%" : "0%" }}
                />
              </div>

              <div className="flex items-center space-x-2 space-x-reverse">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep >= 4 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  4
                </span>
                <span className="text-xs font-bold text-zinc-400 hidden sm:inline">
                  {isRtl ? "رفع الصور" : "Upload Photos"}
                </span>
              </div>
            </div>

            {/* STEP 1: Select Plan */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-zinc-300">{dictionary.selectPlan}</label>
                <div className="grid grid-cols-1 gap-3">
                  {allPrograms.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setActiveProgram(p)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        activeProgram?.id === p.id
                          ? "border-[#e4562f] bg-[#e4562f]/5"
                          : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-bold text-white text-lg">
                            {isRtl ? p.titleAr : p.titleEn}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-1">
                            {isRtl ? p.subtitleAr : p.subtitleEn}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-end justify-center">
                          {p.originalPrice && (
                            <span className="text-xs text-zinc-500 line-through font-mono leading-none mb-1">
                              {getDisplayPrice(p.originalPrice)}
                            </span>
                          )}
                          <span className="text-[#d3e754] font-bold text-xl font-mono leading-none">{getDisplayPrice(p.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center px-6 py-3 bg-[#e4562f] text-white font-bold rounded-lg hover:bg-[#c94522] transition-colors gap-2"
                  >
                    <span>{isRtl ? "التالي" : "Next"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Secure Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
                  <p className="text-sm text-zinc-400">
                    {isRtl ? "أنت تشترك الآن في:" : "You are subscribing to:"}
                  </p>
                  <h4 className="text-lg font-bold text-[#e4562f] mt-1 font-display">
                    {activeProgram ? (isRtl ? activeProgram.titleAr : activeProgram.titleEn) : (isRtl ? "برنامج النخبة المخصص" : "Custom Elite Program")}
                  </h4>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-zinc-500 line-through font-mono text-sm">{getDisplayPrice("$500")}</span>
                    <span className="text-emerald-400 font-extrabold font-mono text-2xl">{getDisplayPrice("$99")}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {isRtl ? "خصم خاص" : "Special Discount"}
                    </span>
                  </div>
                </div>

                {/* Payment Methods Selector Tabs */}
                {country === "Egypt" ? (
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("vodafone")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
                        paymentMethod === "vodafone"
                          ? "bg-[#e4562f] text-white shadow-lg shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      {isRtl ? "Vodafone Cash فودافون كاش" : "Vodafone Cash"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("instapay")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
                        paymentMethod === "instapay"
                          ? "bg-[#e4562f] text-white shadow-lg shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      {isRtl ? "InstaPay انستاباي" : "InstaPay"}
                    </button>
                  </div>
                ) : (
                  <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("crypto")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
                        paymentMethod === "crypto"
                          ? "bg-[#e4562f] text-white shadow-lg shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      {isRtl ? "USDT (TRC20) عملة رقمية" : "USDT (TRC20) Crypto"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-md transition-all ${
                        paymentMethod === "paypal"
                          ? "bg-[#e4562f] text-white shadow-lg shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      {isRtl ? "PayPal بايبال" : "PayPal Payment"}
                    </button>
                  </div>
                )}

                {/* Method Content */}
                {paymentMethod === "vodafone" && (
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-16 h-16 bg-[#e60000]/10 border border-[#e60000]/30 rounded-2xl flex items-center justify-center text-white shrink-0 font-black text-2xl tracking-tighter">
                        Voda
                      </div>
                      <div className="flex-1 space-y-3 text-center sm:text-right w-full">
                        <div>
                          <span className="text-[10px] bg-[#e60000]/20 text-[#ff4d4d] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {isRtl ? "فودافون كاش" : "Vodafone Cash"}
                          </span>
                          <h5 className="font-bold text-white mt-1 text-sm">
                            {isRtl ? "تحويل فودافون كاش إلى الرقم التالي:" : "Send Vodafone Cash to this number:"}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
                          <span className="font-mono text-sm text-white select-all flex-1 text-left font-bold" dir="ltr">
                            01007760673
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText("01007760673", "تم نسخ الرقم 01007760673!", "Number 01007760673 copied!")}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors shrink-0"
                            title="Copy Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {isRtl
                            ? `يرجى إرسال القيمة المحددة (${getDisplayPrice("$99")}) للرقم أعلاه، ثم رفع لقطة الشاشة للتحويل كإثبات بالأسفل.`
                            : `Please send the exact amount (${getDisplayPrice("$99")}) to the number above, then upload the screenshot proof below.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "instapay" && (
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className="w-16 h-16 bg-[#6a1b9a]/10 border border-[#6a1b9a]/30 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold text-lg">
                        Insta
                      </div>
                      <div className="flex-1 space-y-3 text-center sm:text-right w-full">
                        <div>
                          <span className="text-[10px] bg-[#6a1b9a]/20 text-[#e040fb] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {isRtl ? "انستاباي" : "InstaPay"}
                          </span>
                          <h5 className="font-bold text-white mt-1 text-sm">
                            {isRtl ? "الدفع من خلال انستاباي على الرقم التالي:" : "Send via InstaPay to this number:"}
                          </h5>
                        </div>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
                          <span className="font-mono text-sm text-white select-all flex-1 text-left font-bold" dir="ltr">
                            01007760673
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText("01007760673", "تم نسخ الرقم 01007760673!", "Number 01007760673 copied!")}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors shrink-0"
                            title="Copy Number"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {isRtl
                            ? `يرجى تحويل القيمة (${getDisplayPrice("$99")}) للرقم أعلاه عبر تطبيق انستاباي، ثم ارفع لقطة الشاشة للعملية كإثبات بالأسفل.`
                            : `Please transfer the exact amount (${getDisplayPrice("$99")}) to the number above via InstaPay app, then upload the screenshot proof below.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "crypto" && (
                  <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* QR Code */}
                      <div className="w-32 h-32 bg-white p-2 rounded-lg shrink-0 flex items-center justify-center border border-zinc-700">
                        <img
                          src="https://k.top4top.io/p_3835hqc201.png"
                          alt="Crypto QR Code"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      
                      {/* Address info */}
                      <div className="flex-1 space-y-3 text-center sm:text-right w-full">
                        <div>
                          <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase">
                            USDT (TRON / TRC20)
                          </span>
                          <h5 className="font-bold text-white mt-1 text-sm">
                            {isRtl ? "عنوان المحفظة الرقمية (USDT TRC20):" : "USDT TRC20 Wallet Address:"}
                          </h5>
                        </div>

                        {/* Address row */}
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
                          <span className="font-mono text-xs text-zinc-300 break-all select-all flex-1 text-left font-bold" dir="ltr">
                            TXuHWgNn6xYVCjCdKebDkKk3nvC67KcVSZ
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyAddress}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors shrink-0"
                            title="Copy Address"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          {isRtl
                            ? "تأكد من اختيار شبكة TRON (TRC20) لتفادي خسارة الأموال."
                            : "Ensure to use TRON (TRC20) network to avoid loss of funds."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 text-center space-y-4">
                    <div className="w-12 h-12 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto text-xl font-black">
                      P
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">
                        {isRtl ? "الدفع الآمن عبر PayPal" : "Secure PayPal Payment"}
                      </h5>
                      <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
                        {isRtl
                          ? `لإتمام الدفع بقيمة ${getDisplayPrice("$99")}، يرجى إرسال المبلغ عبر البايبال ثم رفع لقطة الشاشة الخاصة بالتحويل أدناه لإثبات العملية.`
                          : `To pay ${getDisplayPrice("$99")} via PayPal, send the amount and then upload your transfer confirmation screenshot below.`}
                      </p>
                    </div>
                    <a
                      href="https://paypal.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors"
                    >
                      <span>{isRtl ? "فتح رابط PayPal" : "Open PayPal"}</span>
                    </a>
                  </div>
                )}

                {/* Proof of Payment Upload */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {isRtl ? "إثبات الدفع (تحميل لقطة شاشة):" : "Payment Proof (Upload Screenshot):"} <span className="text-[#e4562f]">*</span>
                  </label>
                  
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        setPaymentProof(e.dataTransfer.files[0]);
                      }
                    }}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors space-y-2 ${
                      paymentProof ? "border-emerald-500/50 bg-emerald-500/5" : "border-zinc-800 hover:border-[#e4562f] bg-zinc-950/30"
                    }`}
                  >
                    <input
                      type="file"
                      id="proof"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPaymentProof(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="proof" className="cursor-pointer block space-y-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#e4562f]">
                        <Upload className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-bold text-zinc-300">
                        {paymentProof 
                          ? (isRtl ? "تغيير لقطة الشاشة" : "Change screenshot")
                          : (isRtl ? "اسحب لقطة الشاشة هنا أو اضغط للتصفح" : "Drag screenshot here or click to browse")
                        }
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {isRtl 
                          ? `مطلوب إثبات تحويل بقيمة ${getDisplayPrice("$99")} بدلًا من ${getDisplayPrice("$500")}` 
                          : `Required proof of ${getDisplayPrice("$99")} instead of ${getDisplayPrice("$500")}`}
                      </p>
                    </label>
                  </div>

                  {paymentProof && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs text-zinc-200 font-mono truncate max-w-[200px]">
                          {paymentProof.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPaymentProof(null)}
                        className="text-red-500 hover:text-red-400 font-bold text-xs px-2"
                      >
                        {isRtl ? "حذف" : "Remove"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Step navigation buttons */}
                <div className="pt-4 border-t border-zinc-800 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center px-4 py-2.5 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors gap-2 text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!paymentProof) {
                        if (showToast) {
                          showToast(
                            isRtl 
                              ? `يرجى تحميل لقطة شاشة لإثبات الدفع بقيمة ${getDisplayPrice("$99")} للمتابعة.` 
                              : `Please upload a screenshot proving the ${getDisplayPrice("$99")} payment to continue.`,
                            "error"
                          );
                        }
                      } else {
                        setCurrentStep(3);
                      }
                    }}
                    className="flex items-center px-6 py-2.5 bg-[#e4562f] text-white font-bold rounded-lg hover:bg-[#c94522] transition-colors gap-2 text-sm"
                  >
                    <span>{isRtl ? "تأكيد الدفع" : "Confirm Payment"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Stats & Goals */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      {dictionary.formName}
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      {dictionary.formEmail}
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      {dictionary.formWeight}
                    </label>
                    <input
                      required
                      type="number"
                      name="weight"
                      placeholder="e.g. 80"
                      value={formData.weight}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      {dictionary.formHeight}
                    </label>
                    <input
                      required
                      type="number"
                      name="height"
                      placeholder="e.g. 180"
                      value={formData.height}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                      {dictionary.formAge}
                    </label>
                    <input
                      required
                      type="number"
                      name="age"
                      placeholder="e.g. 25"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    {dictionary.formGoal}
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                  >
                    <option value="gain">{dictionary.formGoalGain}</option>
                    <option value="shred">{dictionary.formGoalShred}</option>
                    <option value="health">{dictionary.formGoalHealth}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    {isRtl ? "تفاصيل صحية / إصابات حالية" : "Health details / injuries"}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#e4562f]"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center px-4 py-3 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.email && formData.weight && formData.height && formData.age) {
                        setCurrentStep(4);
                      } else {
                        if (showToast) {
                          showToast(
                            isRtl ? "يرجى تعبئة كافة الحقول المطلوبة" : "Please fill out all required fields.",
                            "error"
                          );
                        }
                      }
                    }}
                    className="flex items-center px-6 py-3 bg-[#e4562f] text-white font-bold rounded-lg hover:bg-[#c94522] transition-colors gap-2"
                  >
                    <span>{isRtl ? "التالي" : "Next"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Upload Photos */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {dictionary.formPhotos}
                </label>

                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-zinc-800 hover:border-[#e4562f] bg-zinc-950/50 rounded-xl p-8 text-center cursor-pointer transition-colors space-y-3"
                >
                  <input
                    type="file"
                    id="photos"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="photos" className="cursor-pointer block space-y-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#e4562f]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold text-zinc-300">
                      {isRtl
                        ? "اسحب الصور وأفلتها هنا أو اضغط للتصفح"
                        : "Drag and drop your pictures here or click to browse"}
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      JPG, PNG | Front, Side, Back poses
                    </p>
                  </label>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                    <span className="text-xs font-bold text-zinc-400 block mb-2">
                      {isRtl ? "الصور المرفوعة:" : "Uploaded files:"}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-xs text-white px-2.5 py-1 rounded-sm"
                        >
                          <span className="truncate max-w-[120px] font-mono">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-400 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center px-4 py-3 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center px-6 py-3 text-white font-bold rounded-lg shadow-lg transition-colors gap-2 ${
                      isSubmitting ? "bg-zinc-700 cursor-not-allowed" : "bg-[#e4562f] hover:bg-[#c94522]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isRtl ? "جاري الإرسال..." : "Submitting..."}</span>
                      </>
                    ) : (
                      <span>{dictionary.formSubmit}</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* SUCCESS PAGE */
          <div className="p-8 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2 max-w-md">
              <h4 className="text-2xl font-bold text-white font-display">
                {isRtl ? "تم استلام طلبك بنجاح!" : "Order Placed Successfully!"}
              </h4>
              <p className="text-sm text-zinc-400">
                {isRtl
                  ? `شكرًا لك يا ${formData.name}. تم تأكيد اشتراكك في ${
                      activeProgram ? (isRtl ? activeProgram.titleAr : activeProgram.titleEn) : ""
                    }. سنقوم بمراجعة صورك وبياناتك البدنية وإرسال خطتك المخصصة بالكامل إلى بريدك الإلكتروني (${
                      formData.email
                    }) في غضون ٥-٧ أيام عمل.`
                  : `Thank you, ${formData.name}. Your customized order for ${
                      activeProgram ? activeProgram.titleEn : ""
                    } has been locked. Our scientific analysis team will review your photos and design your complete tailored protocol. Watch your inbox (${
                      formData.email
                    }) over the next 5-7 business days.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-colors text-sm"
            >
              {dictionary.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
