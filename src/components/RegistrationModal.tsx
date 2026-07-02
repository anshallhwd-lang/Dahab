import React, { useState } from "react";
import { X, Upload, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { Program } from "../types";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProgram: Program | null;
  allPrograms: Program[];
  dictionary: any;
  isRtl: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function RegistrationModal({
  isOpen,
  onClose,
  selectedProgram,
  allPrograms,
  dictionary,
  isRtl,
  showToast,
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  React.useEffect(() => {
    if (selectedProgram) {
      setActiveProgram(selectedProgram);
    }
    if (isOpen) {
      setCurrentStep(1);
      setIsSubmitted(false);
      setUploadedFiles([]);
    }
  }, [selectedProgram, isOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (showToast) {
      const msg = isRtl
        ? `شكرًا لك يا ${formData.name}! تم تأكيد اشتراكك في ${
            activeProgram ? activeProgram.titleAr : "برنامج النخبة المخصص"
          } بنجاح.`
        : `Thank you, ${formData.name}! Your customized order for ${
            activeProgram ? activeProgram.titleEn : "Custom Elite Program"
          } has been placed successfully.`;
      showToast(msg, "success");
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
              <div className="h-[2px] flex-1 bg-zinc-800 mx-4">
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%" }}
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
                  {isRtl ? "المؤشرات الصحية" : "Stats & Goal"}
                </span>
              </div>
              <div className="h-[2px] flex-1 bg-zinc-800 mx-4">
                <div
                  className="h-full bg-[#e4562f] transition-all duration-300"
                  style={{ width: currentStep <= 2 ? "0%" : "100%" }}
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
                        <div className="text-right">
                          <span className="text-[#d3e754] font-bold text-xl font-mono">{p.price}</span>
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

            {/* STEP 2: Stats & Goals */}
            {currentStep === 2 && (
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
                    onClick={() => setCurrentStep(1)}
                    className="flex items-center px-4 py-3 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.email && formData.weight && formData.height && formData.age) {
                        setCurrentStep(3);
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

            {/* STEP 3: Upload Photos */}
            {currentStep === 3 && (
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
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center px-4 py-3 border border-zinc-800 text-zinc-400 font-bold rounded-lg hover:text-white hover:bg-zinc-800 transition-colors gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>{isRtl ? "السابق" : "Back"}</span>
                  </button>
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-[#e4562f] text-white font-bold rounded-lg hover:bg-[#c94522] shadow-lg shadow-brand-primary/25 transition-colors gap-2"
                  >
                    <span>{dictionary.formSubmit}</span>
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
