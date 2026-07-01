import React, { useState } from "react";
import { X, Check, BookOpen, Download } from "lucide-react";

interface RecipeBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
  isRtl: boolean;
  showToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export default function RecipeBookModal({ isOpen, onClose, dictionary, isRtl, showToast }: RecipeBookModalProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setIsDownloaded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownload = () => {
    setIsDownloaded(true);
    // Simulate downloading a file
    const link = document.createElement("a");
    link.href = "#";
    link.setAttribute("download", "Durrah_Elite_Recipes.pdf");
    document.body.appendChild(link);
    // We don't trigger actual click so it doesn't navigate away in sandboxed iframe
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
    if (showToast) {
      const msg = isRtl
        ? "بدأ تحميل كتاب وصفات كمال الأجسام بنجاح! بالهناء والشفاء."
        : "Your Elite Recipe Book download has started successfully! Bon appétit.";
      showToast(msg, "success");
    }
  };

  const sampleRecipes = [
    {
      titleEn: "Durrah's Post-Workout Beef & Jasmine Rice",
      titleAr: "وجبة لحم البقر والرز الياسمين المفضلة لكوتش درة",
      macros: "65g Protein | 80g Carbs | 12g Fat | 690 kcal",
      ingredientsEn: ["250g Lean Minced Beef (95%)", "1 cup cooked Jasmine Rice", "50g fresh Spinach", "1 tbsp Low-Sodium Soy Sauce"],
      ingredientsAr: ["٢٥٠ جرام لحم بقري مفروم قليل الدسم (٩٥٪)", "كوب أرز ياسمين مطبوخ", "٥٠ جرام سبانخ طازجة", "ملعقة كبيرة صويا صوص قليلة الصوديوم"]
    },
    {
      titleEn: "Anabolic Blueberry Whey Oats",
      titleAr: "شوفان البروتين والتوت البري الضخم",
      macros: "48g Protein | 60g Carbs | 8g Fat | 500 kcal",
      ingredientsEn: ["80g Rolled Oats", "1.5 scoops Whey Isolate", "100g fresh Blueberries", "1 tbsp Chia Seeds", "Cinnamon"],
      ingredientsAr: ["٨٠ جرام شوفان كامل", "١.٥ سكوب واي بروتين معزول", "١٠٠ جرام توت أزرق طازج", "ملعقة كبيرة بذور الشيا", "رشة قرفة"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-950">
          <h3 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#00B2FE]" />
            {dictionary.recipeBook}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-white">{dictionary.recipeBookTitle}</h4>
            <p className="text-xs text-zinc-400">{dictionary.recipeBookSub}</p>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
              {isRtl ? "وجبات عينة من الكتاب:" : "Sample Recipes Included:"}
            </span>

            {sampleRecipes.map((recipe, idx) => (
              <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                  <h5 className="font-bold text-white text-sm">
                    {isRtl ? recipe.titleAr : recipe.titleEn}
                  </h5>
                  <span className="text-[10px] bg-[#00B2FE]/10 border border-[#00B2FE]/20 text-[#00B2FE] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 self-start sm:self-center">
                    {recipe.macros}
                  </span>
                </div>
                <ul className="text-xs text-zinc-400 space-y-1 pl-4 pr-4 list-disc list-inside">
                  {(isRtl ? recipe.ingredientsAr : recipe.ingredientsEn).map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {!isDownloaded ? (
            <button
              onClick={handleDownload}
              className="w-full py-3.5 bg-[#00B2FE] text-black font-bold rounded-lg hover:bg-[#0092d0] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{dictionary.recipeBookDownload}</span>
            </button>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-center gap-3 justify-center">
              <Check className="w-5 h-5" />
              <span className="text-sm font-bold">{dictionary.downloadSuccess}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
