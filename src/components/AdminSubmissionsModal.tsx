import React, { useState, useEffect } from "react";
import { X, Lock, Eye, Trash2, Calendar, ShieldCheck, Dumbbell, User, Mail, Sparkles, Scale, MoveUp, HelpCircle } from "lucide-react";

interface Submission {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  weight: string;
  height: string;
  age: string;
  goal: string;
  notes: string;
  programId: string;
  programTitleEn: string;
  programTitleAr: string;
  paymentMethod: string;
  paymentProofUrl: string | null;
  photos: Array<{ name: string; url: string }>;
  status: string;
}

interface AdminSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isRtl: boolean;
}

export default function AdminSubmissionsModal({ isOpen, onClose, isRtl }: AdminSubmissionsModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchSubmissions();
    }
  }, [isOpen, isAuthenticated]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        // Sort newest first
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSubmissions(data);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Secure passcode specifically requested by the coach
    if (password === "961281//**/DCFHGD573r734hfv$#@thth55236+-*8") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError(isRtl ? "رمز المرور غير صحيح!" : "Invalid Passcode!");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(isRtl ? "هل أنت متأكد من حذف هذا المشترك؟" : "Are you sure you want to delete this registrant?")) {
      return;
    }

    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null);
        }
      }
    } catch (err) {
      console.error("Failed to delete submission:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div 
        className="relative w-full max-w-6xl bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh]"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#e4562f]" />
            <h3 className="text-lg font-bold font-display text-white tracking-tight">
              {isRtl ? "لوحة تحكم إدارة المشتركين" : "Elite Program Submissions Admin"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Login Screen if not authenticated */}
        {!isAuthenticated ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center text-[#e4562f]">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">
                {isRtl ? "رمز دخول لوحة التحكم" : "Admin Authentication Required"}
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                {isRtl 
                  ? "الرجاء إدخال رمز المرور لعرض بيانات العملاء وملفات إثبات الدفع." 
                  : "Enter your coach access passcode to view client submissions, progress photos and payment proofs."}
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <input
                type="password"
                placeholder={isRtl ? "أدخل رمز المرور..." : "Enter Passcode..."}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-center text-white focus:outline-none focus:border-[#e4562f] font-mono text-lg font-bold"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
              <button
                type="submit"
                className="w-full py-3 bg-[#e4562f] hover:bg-[#c94522] text-white font-bold rounded-xl transition-colors"
              >
                {isRtl ? "تسجيل الدخول" : "Unlock Dashboard"}
              </button>
            </form>
          </div>
        ) : (
          /* Main Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Submissions List Side */}
            <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col overflow-y-auto bg-zinc-950/30">
              <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center shrink-0">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  {isRtl ? `قائمة المشتركين (${submissions.length})` : `Registrants List (${submissions.length})`}
                </span>
                <button 
                  onClick={fetchSubmissions}
                  className="text-[10px] text-zinc-400 hover:text-white font-bold bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded"
                >
                  {isRtl ? "تحديث" : "Refresh"}
                </button>
              </div>

              {loading ? (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="w-6 h-6 border-2 border-[#e4562f] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : submissions.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-zinc-500">
                  <HelpCircle className="w-8 h-8 mb-2" />
                  <p className="text-xs font-bold">{isRtl ? "لا توجد طلبات حالياً" : "No submissions found"}</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-800">
                  {submissions.map((sub) => {
                    const isSelected = selectedSubmission?.id === sub.id;
                    const dateStr = new Date(sub.createdAt).toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSubmission(sub)}
                        className={`p-4 hover:bg-zinc-800/40 cursor-pointer transition-colors relative flex justify-between items-start ${
                          isSelected ? "bg-zinc-800/80 border-l-2 border-[#e4562f]" : ""
                        }`}
                      >
                        <div className="space-y-1.5 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm truncate">{sub.name}</span>
                            <span className="bg-[#e4562f]/10 text-[#e4562f] text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono">
                              ${sub.weight}kg
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 truncate">{sub.email}</p>
                          <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                            <Calendar className="w-3 h-3" />
                            <span>{dateStr}</span>
                            <span>•</span>
                            <span className="font-bold text-[#e4562f]">
                              {isRtl ? sub.programTitleAr : sub.programTitleEn}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={(e) => handleDelete(sub.id, e)}
                          className="p-1.5 text-zinc-600 hover:text-red-500 rounded hover:bg-zinc-900 transition-colors shrink-0"
                          title="Delete Submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Submission Detail View Side */}
            <div className="flex-1 flex flex-col overflow-y-auto bg-zinc-900">
              {selectedSubmission ? (
                <div className="p-6 space-y-6">
                  {/* Summary card header */}
                  <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-5 h-5 text-[#e4562f]" />
                        <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                          {isRtl ? "المشترك الحالي" : "Selected Client"}
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-white mt-1 font-display">
                        {selectedSubmission.name}
                      </h4>
                      <p className="text-sm text-zinc-400 mt-0.5">{selectedSubmission.email}</p>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="bg-[#e4562f]/10 text-[#e4562f] border border-[#e4562f]/20 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider font-display">
                        {isRtl ? selectedSubmission.programTitleAr : selectedSubmission.programTitleEn}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono mt-1">
                        ID: {selectedSubmission.id}
                      </span>
                    </div>
                  </div>

                  {/* Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Body metrics & stats */}
                    <div className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-xl space-y-4">
                      <h5 className="font-bold text-white text-sm border-b border-zinc-800 pb-2 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[#e4562f]" />
                        {isRtl ? "المؤشرات الصحية والقياسات" : "Body Metrics & Measurements"}
                      </h5>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                            {isRtl ? "الوزن" : "Weight"}
                          </span>
                          <span className="text-lg font-extrabold text-white font-mono">{selectedSubmission.weight} kg</span>
                        </div>
                        <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                            {isRtl ? "الطول" : "Height"}
                          </span>
                          <span className="text-lg font-extrabold text-white font-mono">{selectedSubmission.height} cm</span>
                        </div>
                        <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                          <span className="text-[10px] text-zinc-500 uppercase font-bold block">
                            {isRtl ? "العمر" : "Age"}
                          </span>
                          <span className="text-lg font-extrabold text-white font-mono">{selectedSubmission.age} yrs</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-zinc-500 block font-bold uppercase">{isRtl ? "الهدف الرئيسي:" : "Core Fitness Goal:"}</span>
                        <div className="bg-zinc-900/60 px-3 py-2 rounded-lg border border-zinc-800 text-sm font-bold text-white">
                          {selectedSubmission.goal === "gain" && (isRtl ? "تضخيم وبناء عضلات" : "Bulk / Muscle Gain")}
                          {selectedSubmission.goal === "shred" && (isRtl ? "تنشيف وتخسيس دهون" : "Cut / Fat Loss")}
                          {selectedSubmission.goal === "health" && (isRtl ? "تحسين الصحة العامة واللياقة" : "General Health")}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-zinc-500 block font-bold uppercase">{isRtl ? "تفاصيل صحية / إصابات:" : "Health Details & Injuries:"}</span>
                        <div className="bg-zinc-900/60 px-3 py-2 rounded-lg border border-zinc-800 text-sm italic text-zinc-300 min-h-[48px]">
                          {selectedSubmission.notes || (isRtl ? "لا توجد تفاصيل صحية أو إصابات مسجلة" : "No health issues or injuries specified.")}
                        </div>
                      </div>
                    </div>

                    {/* Payment Proof Card */}
                    <div className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-xl flex flex-col justify-between">
                      <div>
                        <h5 className="font-bold text-white text-sm border-b border-zinc-800 pb-2 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#e4562f]" />
                            {isRtl ? "إثبات وتأكيد الدفع" : "Payment Details & Proof"}
                          </span>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded-full uppercase">
                            $99 Paid
                          </span>
                        </h5>
                        <div className="mt-3 space-y-1">
                          <span className="text-xs text-zinc-500 font-bold uppercase">{isRtl ? "طريقة الدفع المختارة:" : "Chosen Payment Method:"}</span>
                          <p className="text-sm font-extrabold text-white uppercase">
                            {(() => {
                              const method = selectedSubmission.paymentMethod;
                              if (method === "vodafone") return isRtl ? "فودافون كاش (Vodafone Cash)" : "Vodafone Cash";
                              if (method === "instapay") return isRtl ? "انستاباي (InstaPay)" : "InstaPay";
                              if (method === "crypto") return isRtl ? "عملة رقمية (USDT TRC20)" : "USDT Crypto";
                              if (method === "paypal") return "PayPal";
                              return method;
                            })()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        {selectedSubmission.paymentProofUrl ? (
                          <div className="relative group rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 h-32 flex items-center justify-center">
                            <img
                              src={selectedSubmission.paymentProofUrl}
                              alt="Payment Proof"
                              className="max-h-full max-w-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-105"
                              onClick={() => setPreviewImage(selectedSubmission.paymentProofUrl)}
                              referrerPolicy="no-referrer"
                            />
                            <div 
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer gap-2 text-xs font-bold text-white"
                              onClick={() => setPreviewImage(selectedSubmission.paymentProofUrl)}
                            >
                              <Eye className="w-4 h-4 text-[#e4562f]" />
                              <span>{isRtl ? "عرض بالحجم الكامل" : "View Full Size"}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center text-zinc-500 text-xs italic">
                            {isRtl ? "لم يتم رفع إثبات دفع" : "No payment proof uploaded."}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress / Poses Photos Uploaded */}
                  <div className="bg-zinc-950/40 border border-zinc-800 p-5 rounded-xl space-y-4">
                    <h5 className="font-bold text-white text-sm border-b border-zinc-800 pb-2 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-[#e4562f]" />
                      {isRtl ? "صور القوام والوضعيات البدنية المرفوعة" : "Client Body Poses & Progress Photos"}
                    </h5>

                    {selectedSubmission.photos && selectedSubmission.photos.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedSubmission.photos.map((photo, idx) => (
                          <div key={idx} className="group relative rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900 aspect-[3/4] flex items-center justify-center">
                            <img
                              src={photo.url}
                              alt={photo.name}
                              className="max-h-full max-w-full object-contain cursor-pointer transition-all duration-300 group-hover:scale-105"
                              onClick={() => setPreviewImage(photo.url)}
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 text-[10px] font-mono text-zinc-400 truncate text-center">
                              {photo.name}
                            </div>
                            <div 
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-bold gap-1"
                              onClick={() => setPreviewImage(photo.url)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{isRtl ? "تكبير" : "Zoom"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-8 text-center text-zinc-500 text-xs italic">
                        {isRtl ? "لم يتم رفع أي صور للوضعيات البدنية" : "No progress photos uploaded."}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-8">
                  <User className="w-12 h-12 mb-2 text-zinc-700" />
                  <p className="font-bold">{isRtl ? "اختر مشتركاً من القائمة لعرض بياناته بالتفصيل" : "Select a client from the left list to inspect details"}</p>
                  <p className="text-xs text-zinc-600 mt-1">
                    {isRtl 
                      ? "ستظهر هنا كافة القياسات، الأهداف، إثبات الدفع والوضعيات البدنية." 
                      : "Measurements, program details, health stats, proof of payment and poses will load here."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FULL SCREEN IMAGE PREVIEW MODAL */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={previewImage}
            alt="Full-size preview"
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
            referrerPolicy="no-referrer"
          />
          <p className="text-zinc-500 text-xs mt-4 font-mono">
            {isRtl ? "انقر في أي مكان للإغلاق" : "Click anywhere to close"}
          </p>
        </div>
      )}
    </div>
  );
}
