import React, { useState } from 'react';
import { X, Mic, Flame, Map, Crown, Leaf, ChevronRight, ChevronLeft, Target } from 'lucide-react';
import { colorMap } from '../../utils/theme';

export function TutorialModal({ props, onClose }) {
  const { currentTabTheme } = props;
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "أهلاً بك في غِراس 🌿",
      icon: <Leaf className="w-12 h-12 text-emerald-500 mb-4" />,
      content: "تطبيق الأذكار الذي ينمو معك! ليس مجرد نصوص تقرأها، بل عالم حي يتفاعل مع كل تسبيحة وكل ذكر تنطقه لتغرس بستانك في الجنة.",
    },
    {
      title: "التلاوة الذكية 🎙️",
      icon: <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4 animate-pulse"><Mic className="w-10 h-10 text-red-500" /></div>,
      content: "هل يديك مشغولتان؟ اضغط على أيقونة المايكروفون في الأعلى وانطق الذكر. سيستمع لك التطبيق ويحسب العدد وينتقل للذكر التالي تلقائياً!",
    },
    {
      title: "إحصاءات تفاعلية 📊",
      icon: (
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-600 dark:text-yellow-400 px-3 py-1.5 rounded-full font-bold">
            <Flame className="w-5 h-5" /> 12
          </div>
          <div className="flex items-center gap-1 bg-teal-500/20 text-teal-600 dark:text-teal-400 px-3 py-1.5 rounded-full font-bold">
            <Target className="w-5 h-5" /> 100%
          </div>
        </div>
      ),
      content: "هل تلاحظ هذه الشارات بالأعلى؟ إنها ليست للزينة! اضغط عليها في أي وقت لتفتح نافذة الإحصاءات الشاملة ومتابعة تطور مستواك الروحي.",
    },
    {
      title: "بستان الجنة 🌳",
      icon: <Crown className="w-12 h-12 text-amber-500 mb-4" />,
      content: "كل تسبيحة وكل ذكر يعطيك نقاط خبرة (XP). مع الوقت، سينمو بستانك، وتظهر أشجار وثمار جديدة. ابدأ الآن واغرس شجرتك الأولى!",
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm relative border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
        
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 flex">
          {steps.map((_, i) => (
            <div key={i} className={`h-full flex-1 transition-colors duration-300 ${i <= step ? 'bg-teal-500' : ''}`} />
          ))}
        </div>

        <div className="p-8 flex flex-col items-center text-center min-h-[320px] justify-center relative">
          <div className="animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col items-center" key={step}>
            {steps[step].icon}
            <h3 className="text-2xl font-black mb-3 text-slate-800 dark:text-slate-100">
              {steps[step].title}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {steps[step].content}
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center"
          >
            {step === 0 ? 'تخطي' : <ChevronRight className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => step < steps.length - 1 ? setStep(step + 1) : onClose()}
            className="flex-1 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-bold transition shadow-md active:scale-95 flex justify-center items-center gap-2"
          >
            {step < steps.length - 1 ? (
              <>التالي <ChevronLeft className="w-5 h-5" /></>
            ) : (
              'ابدأ الغرس الآن!'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
