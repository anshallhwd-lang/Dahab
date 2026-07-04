import React, { useState, useEffect } from "react";
import { X, Upload, CheckCircle, ChevronRight, ChevronLeft, Copy, ShoppingBag, MapPin, Phone, Mail, User, CreditCard } from "lucide-react";

interface ProductPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productSize: string;
  price: number; // base price in EGP
  quantity: number;
  country: "USA" | "Egypt";
  lang: "en" | "ar";
  theme: "dark" | "light";
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function ProductPurchaseModal({
  isOpen,
  onClose,
  productName,
  productSize,
  price,
  quantity,
  country,
  lang,
  theme,
  showToast,
}: ProductPurchaseModalProps) {
  const isRtl = lang === "ar";
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryCountry: country === "USA" ? "United States" : "Egypt",
    address: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "paypal" | "vodafone" | "instapay">("crypto");
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default payment method based on country on mount/change
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitted(false);
      setPaymentProof(null);
      setCopied(false);
      setPaymentMethod(country === "Egypt" ? "vodafone" : "crypto");
      setFormData({
        name: "",
        email: "",
        phone: "",
        deliveryCountry: country === "USA" ? "United States" : "Egypt",
        address: "",
      });
    }
  }, [isOpen, country]);

  if (!isOpen) return null;

  // Price calculations
  const singlePrice = price;
  const totalPriceEgp = singlePrice * quantity;
  
  const getDisplayPrice = (egpAmount: number) => {
    if (country === "USA") {
      const usdtAmount = egpAmount / 55;
      return `${usdtAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`;
    }
    return `${egpAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${isRtl ? "ج.م" : "EGP"}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopyText = (text: string, successMsgAr: string, successMsgEn: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (showToast) {
      showToast(isRtl ? successMsgAr : successMsgEn, "success");
    }
    setTimeout(() => setCopied(false), 2000);
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
        const maxDim = 600;
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
          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentProof) {
      if (showToast) {
        showToast(
          isRtl ? "يرجى تحميل لقطة شاشة لإثبات الدفع أولاً." : "Please upload a screenshot of payment proof first.",
          "error"
        );
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const base64Proof = await compressImage(paymentProof);
      
      const payload = {
        type: "product_purchase",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        country: formData.deliveryCountry,
        address: formData.address,
        productName: productName,
        productSize: productSize,
        quantity: quantity,
        totalPrice: getDisplayPrice(totalPriceEgp),
        paymentMethod: paymentMethod,
        paymentProof: base64Proof,
        submittedAt: new Date().toISOString(),
      };

      // Submit to Backend API
      await fetch("/api/submit-purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setIsSubmitted(true);
      if (showToast) {
        showToast(
          isRtl 
            ? `شكرًا لك يا ${formData.name}! تم تأكيد طلبك بنجاح وسنتواصل معك قريبًا.` 
            : `Thank you, ${formData.name}! Your order was placed successfully and we will contact you shortly.`,
          "success"
        );
      }
    } catch (err) {
      console.error("Purchase submission error:", err);
      if (showToast) {
        showToast(
          isRtl ? "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى." : "An error occurred during submission. Please try again.",
          "error"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className={`relative w-full max-w-2xl border rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
          theme === "dark" ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200 text-zinc-800"
        }`}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b ${
          theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
        }`}>
          <div>
            <span className="text-[10px] font-bold text-[#e4562f] uppercase tracking-wider block mb-0.5">
              {isRtl ? "إتمام الشراء والدفع الآمن" : "SECURE CHECKOUT & PAYMENT"}
            </span>
            <h3 className={`text-lg font-bold font-display ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
              {isRtl ? "طلب شراء المكمل الغذائي" : "Purchase Dietary Supplement"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              theme === "dark" ? "text-zinc-400 hover:text-white hover:bg-zinc-800" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Step indicators */}
            <div className={`flex items-center justify-between pb-4 border-b ${theme === "dark" ? "border-zinc-800" : "border-zinc-100"}`}>
              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 1 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  1
                </span>
                <span className={`text-xs font-bold ${currentStep === 1 ? "text-[#e4562f]" : "text-zinc-400"} hidden sm:inline`}>
                  {isRtl ? "بيانات الشحن والتوصيل" : "Shipping Details"}
                </span>
              </div>
              <div className={`h-[1px] flex-1 mx-3 ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-200"}`}>
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep > 1 ? "100%" : "0%" }}
                />
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep >= 2 ? "bg-[#e4562f] text-white" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  2
                </span>
                <span className={`text-xs font-bold ${currentStep === 2 ? "text-[#e4562f]" : "text-zinc-400"} hidden sm:inline`}>
                  {isRtl ? "الدفع وإثبات التحويل" : "Payment & Receipt"}
                </span>
              </div>
            </div>

            {/* ORDER RECAP BUBBLE */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#e4562f]/10 border border-[#e4562f]/20 flex items-center justify-center text-[#e4562f]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                    {productName}
                  </h4>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                    {isRtl ? "الحجم:" : "Size:"} {productSize} | {isRtl ? "الكمية:" : "Qty:"} {quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-zinc-400 block mb-0.5">{isRtl ? "الإجمالي المستحق" : "Total Due"}</span>
                <span className="text-[#d3e754] font-extrabold text-base font-mono">
                  {getDisplayPrice(totalPriceEgp)}
                </span>
              </div>
            </div>

            {/* STEP 1: SHIPPING & CONTACT INFO */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      {isRtl ? "الاسم الكامل" : "Full Name"} <span className="text-[#e4562f]">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        required
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={isRtl ? "ادخل اسمك الكامل" : "e.g. John Doe"}
                        className={`w-full rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#e4562f] ${
                          theme === "dark" 
                            ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#e4562f]" 
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#e4562f]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      {isRtl ? "البريد الإلكتروني" : "Email Address"} <span className="text-[#e4562f]">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        required
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@email.com"
                        className={`w-full rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#e4562f] ${
                          theme === "dark" 
                            ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#e4562f]" 
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#e4562f]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      {isRtl ? "رقم الهاتف (واتساب)" : "Phone / WhatsApp"} <span className="text-[#e4562f]">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={isRtl ? "رقم الهاتف مع كود الدولة" : "e.g. +1 555-0199"}
                        className={`w-full rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#e4562f] ${
                          theme === "dark" 
                            ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#e4562f]" 
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#e4562f]"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                      {isRtl ? "البلد" : "Country"} <span className="text-[#e4562f]">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        required
                        type="text"
                        name="deliveryCountry"
                        value={formData.deliveryCountry}
                        onChange={handleInputChange}
                        placeholder={isRtl ? "البلد الحالي للمستلم" : "e.g. United States"}
                        className={`w-full rounded-xl p-3 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#e4562f] ${
                          theme === "dark" 
                            ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#e4562f]" 
                            : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#e4562f]"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                    {isRtl ? "عنوان الشحن والتسليم بالتفصيل" : "Detailed Delivery Address"} <span className="text-[#e4562f]">*</span>
                  </label>
                  <textarea
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder={isRtl ? "اكتب المحافظة، المدينة، اسم الشارع، رقم المبنى والشقة" : "House/Apartment number, Street name, City, State, ZIP code"}
                    className={`w-full rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#e4562f] ${
                      theme === "dark" 
                        ? "bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 focus:border-[#e4562f]" 
                        : "bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-[#e4562f]"
                    }`}
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.email && formData.phone && formData.address && formData.deliveryCountry) {
                        setCurrentStep(2);
                      } else {
                        if (showToast) {
                          showToast(
                            isRtl ? "يرجى تعبئة كافة الحقول المطلوبة للمتابعة" : "Please fill in all required fields to proceed.",
                            "error"
                          );
                        }
                      }
                    }}
                    className="flex items-center px-6 py-3 bg-[#e4562f] text-white font-extrabold rounded-xl hover:bg-[#c94522] transition-colors gap-2 text-xs uppercase tracking-wider"
                  >
                    <span>{isRtl ? "متابعة للدفع" : "Continue to Payment"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SECURE PAYMENT OPTIONS */}
            {currentStep === 2 && (
              <div className="space-y-6">
                
                {/* Method selector tabs */}
                {country === "Egypt" ? (
                  <div className={`flex p-1 rounded-xl border ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("vodafone")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        paymentMethod === "vodafone"
                          ? "bg-[#e4562f] text-white shadow-md shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isRtl ? "Vodafone Cash فودافون كاش" : "Vodafone Cash"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("instapay")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        paymentMethod === "instapay"
                          ? "bg-[#e4562f] text-white shadow-md shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isRtl ? "InstaPay انستاباي" : "InstaPay"}
                    </button>
                  </div>
                ) : (
                  <div className={`flex p-1 rounded-xl border ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("crypto")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        paymentMethod === "crypto"
                          ? "bg-[#e4562f] text-white shadow-md shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isRtl ? "USDT (TRC20) عملة رقمية" : "USDT (TRC20)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("paypal")}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
                        paymentMethod === "paypal"
                          ? "bg-[#e4562f] text-white shadow-md shadow-[#e4562f]/20"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {isRtl ? "PayPal بايبال" : "PayPal"}
                    </button>
                  </div>
                )}

                {/* VODAFONE CASH DETAIL BOX */}
                {paymentMethod === "vodafone" && (
                  <div className={`p-5 rounded-xl border ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-12 h-12 bg-red-600/10 border border-red-500/20 rounded-xl flex items-center justify-center text-red-500 font-extrabold text-sm shrink-0">
                        Voda
                      </div>
                      <div className="flex-1 w-full space-y-2 text-center sm:text-right">
                        <span className="text-[10px] bg-red-600/10 text-red-500 font-bold px-2 py-0.5 rounded-full uppercase">
                          {isRtl ? "محفظة فودافون كاش" : "Vodafone Cash"}
                        </span>
                        <h5 className={`font-bold text-xs ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                          {isRtl ? "قم بالتحويل إلى رقم فودافون كاش التالي:" : "Send Vodafone Cash to this number:"}
                        </h5>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 max-w-sm mx-auto sm:mx-0">
                          <span className="font-mono text-xs text-white select-all flex-1 text-left font-bold" dir="ltr">
                            01007760673
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText("01007760673", "تم نسخ رقم فودافون كاش!", "Copied number!")}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          {isRtl
                            ? `يرجى إرسال القيمة الإجمالية (${getDisplayPrice(totalPriceEgp)}) ثم رفع لقطة الشاشة للتحويل أدناه.`
                            : `Please transfer (${getDisplayPrice(totalPriceEgp)}) to the number above, then upload receipt photo.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* INSTAPAY DETAIL BOX */}
                {paymentMethod === "instapay" && (
                  <div className={`p-5 rounded-xl border ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 font-extrabold text-xs shrink-0">
                        Insta
                      </div>
                      <div className="flex-1 w-full space-y-2 text-center sm:text-right">
                        <span className="text-[10px] bg-purple-600/10 text-purple-400 font-bold px-2 py-0.5 rounded-full uppercase">
                          {isRtl ? "تطبيق انستاباي" : "InstaPay Application"}
                        </span>
                        <h5 className={`font-bold text-xs ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                          {isRtl ? "قم بالتحويل عبر انستاباي للرقم التالي:" : "Send via InstaPay to this number:"}
                        </h5>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 max-w-sm mx-auto sm:mx-0">
                          <span className="font-mono text-xs text-white select-all flex-1 text-left font-bold" dir="ltr">
                            01007760673
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText("01007760673", "تم نسخ رقم انستاباي!", "Copied number!")}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          {isRtl
                            ? `يرجى إرسال القيمة الإجمالية (${getDisplayPrice(totalPriceEgp)}) عبر التطبيق ثم ارفع لقطة الشاشة لتأكيد التحويل.`
                            : `Please transfer (${getDisplayPrice(totalPriceEgp)}) using InstaPay app and upload screenshot proof below.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* CRYPTO USDT DETAIL BOX */}
                {paymentMethod === "crypto" && (
                  <div className={`p-5 rounded-xl border ${theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-24 h-24 bg-white p-1 rounded-lg border border-zinc-700 shrink-0 flex items-center justify-center">
                        <img
                          src="https://k.top4top.io/p_3835hqc201.png"
                          alt="Crypto QR Code"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 w-full space-y-2 text-center sm:text-right">
                        <span className="text-[10px] bg-amber-500/15 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase font-mono">
                          USDT (TRON / TRC20)
                        </span>
                        <h5 className={`font-bold text-xs ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                          {isRtl ? "عنوان المحفظة الرقمية (USDT TRC20):" : "USDT TRC20 Wallet Address:"}
                        </h5>
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg p-2 max-w-sm mx-auto sm:mx-0">
                          <span className="font-mono text-[10px] text-zinc-300 break-all select-all flex-1 text-left font-bold" dir="ltr">
                            TXuHWgNn6xYVCjCdKebDkKk3nvC67KcVSZ
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyText("TXuHWgNn6xYVCjCdKebDkKk3nvC67KcVSZ", "تم نسخ عنوان المحفظة!", "Wallet address copied!")}
                            className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-[10px] text-red-400 font-bold">
                          {isRtl
                            ? "تنبيه: أرسل عبر شبكة TRON TRC20 فقط لتفادي ضياع التحويل."
                            : "WARNING: Send via TRON TRC20 network only."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* PAYPAL DETAIL BOX */}
                {paymentMethod === "paypal" && (
                  <div className={`p-5 rounded-xl border text-center space-y-3 ${
                    theme === "dark" ? "bg-zinc-950 border-zinc-800" : "bg-zinc-50 border-zinc-200"
                  }`}>
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto text-base font-black">
                      P
                    </div>
                    <div>
                      <h5 className={`font-bold text-xs ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                        {isRtl ? "إرسال المبلغ عبر PayPal" : "Send payment via PayPal"}
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-1 max-w-md mx-auto">
                        {isRtl
                          ? `يرجى إرسال القيمة المستحقة (${getDisplayPrice(totalPriceEgp)}) لحساب بايبال، ثم رفع صورة التأكيد بالأسفل كإثبات.`
                          : `Please transfer (${getDisplayPrice(totalPriceEgp)}) to the PayPal account and upload screenshot below.`}
                      </p>
                    </div>
                    <a
                      href="https://paypal.me"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-[#0070ba] hover:bg-[#005ea6] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <span>{isRtl ? "فتح رابط PayPal" : "Open PayPal link"}</span>
                    </a>
                  </div>
                )}

                {/* SCREENSHOT PROOF OF PAYMENT UPLOAD */}
                <div className="space-y-2">
                  <label className={`block text-[11px] font-bold uppercase tracking-wider ${theme === "dark" ? "text-zinc-400" : "text-zinc-600"}`}>
                    {isRtl ? "تحميل صورة إثبات التحويل (لقطة شاشة):" : "Upload Receipt / Transfer Screenshot:"} <span className="text-[#e4562f]">*</span>
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
                      paymentProof
                        ? "border-emerald-500/50 bg-emerald-500/5"
                        : theme === "dark"
                        ? "border-zinc-800 hover:border-[#e4562f] bg-zinc-950/30"
                        : "border-zinc-300 hover:border-[#e4562f] bg-zinc-50"
                    }`}
                  >
                    <input
                      required
                      type="file"
                      id="purchase-proof"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setPaymentProof(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <label htmlFor="purchase-proof" className="cursor-pointer block space-y-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-[#e4562f]">
                        <Upload className="w-3.5 h-3.5" />
                      </div>
                      <div className={`text-xs font-bold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                        {paymentProof
                          ? (isRtl ? "تغيير لقطة شاشة الإثبات" : "Change screenshot")
                          : (isRtl ? "اسحب لقطة الشاشة هنا أو اضغط للتصفح" : "Drag screenshot here or click to browse")
                        }
                      </div>
                    </label>
                  </div>

                  {paymentProof && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs text-zinc-300 font-mono truncate max-w-[250px]">
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

                {/* Footer buttons */}
                <div className={`pt-4 border-t flex justify-between ${theme === "dark" ? "border-zinc-800" : "border-zinc-100"}`}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`flex items-center px-4 py-2 border rounded-xl font-bold transition-colors gap-1.5 text-xs ${
                      theme === "dark" 
                        ? "border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800" 
                        : "border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !paymentProof}
                    className={`flex items-center px-6 py-2.5 text-white font-extrabold rounded-xl shadow-lg transition-all gap-1.5 text-xs uppercase tracking-wider ${
                      isSubmitting || !paymentProof
                        ? "bg-zinc-700 cursor-not-allowed opacity-50"
                        : "bg-[#e4562f] hover:bg-[#c94522]"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isRtl ? "جاري إرسال الطلب..." : "Submitting Order..."}</span>
                      </>
                    ) : (
                      <>
                        <span>{isRtl ? "تأكيد وإرسال الطلب" : "Confirm & Send Order"}</span>
                        <CheckCircle className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* SUCCESS SCREEN */
          <div className="p-8 text-center space-y-5 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 animate-bounce">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h4 className={`text-xl font-black font-display ${theme === "dark" ? "text-white" : "text-zinc-900"}`}>
                {isRtl ? "تم إرسال طلب الشراء بنجاح!" : "Order Placed Successfully!"}
              </h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                {isRtl
                  ? `شكرًا لك، لقد استلمنا إثبات الدفع والبيانات لطلبك الخاص بـ (${productName}). سيقوم فريق الدعم بمراجعة التحويل فوراً والبدء في تجهيز شحن منتجك وتزويدك برقم التتبع على هاتف أو إيميل العميل في أسرع وقت!`
                  : `Thank you! We received your payment proof and details for (${productName}). Our support team will review the transfer and dispatch your package shortly, providing a tracking number directly via phone or email.`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#e4562f] text-white font-extrabold rounded-xl hover:bg-[#c94522] transition-colors text-xs uppercase tracking-wider"
            >
              {isRtl ? "إغلاق النافذة" : "Close"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
