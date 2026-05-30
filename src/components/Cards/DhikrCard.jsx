import React from 'react';
import { BookOpen, Star, Info, RotateCcw, CheckCircle } from 'lucide-react';

export function DhikrCard({
  dhikr,
  activeTab,
  progress,
  currentTabTheme,
  fontSizes,
  fontSizeIndex,
  showTakhreej,
  showFadl,
  showFawaid,
  resetSingleDhikr,
  handleDhikrClick
}) {
  const currentCount = progress[`${activeTab}-${dhikr.id}`] || 0;
  const isCompleted = currentCount >= dhikr.target;
  const percentage = dhikr.target > 1 ? (currentCount / dhikr.target) : (currentCount > 0 ? 1 : 0);

  const displayText = (activeTab === 'evening' && dhikr.textEvening) ? dhikr.textEvening : dhikr.textMorning;

  let counterBgClass = isCompleted
    ? currentTabTheme.counterDone + " cursor-default shadow-none"
    : percentage > 0.6 ? `${currentTabTheme.counterHigh} text-white shadow-lg dark:shadow-none`
      : percentage > 0.3 ? `${currentTabTheme.counterMed} text-white shadow-lg dark:shadow-none`
        : `${currentTabTheme.counterLow} text-white shadow-lg dark:shadow-none`;

  return (
    <div
      id={`dhikr-${dhikr.id}`}
      className={`dhikr-card ${isCompleted ? 'completed' : ''} card-hover group relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${isCompleted ? 'border-slate-200 dark:border-slate-700 opacity-90' : 'border-slate-200 dark:border-slate-700'} overflow-hidden scroll-mt-24`}
    >
      <div className={`py-3 px-6 text-sm md:text-base font-bold border-b border-slate-200 dark:border-slate-700 flex justify-between items-center ${currentTabTheme.cardHeader}`}>
        <span>{dhikr.category}</span>
      </div>

      <div className="p-6 md:p-8">
        <p className={`font-cairo font-semibold leading-[2.4] md:leading-[2.6] text-slate-800 dark:text-slate-100 mb-8 whitespace-pre-line text-justify md:text-right ${fontSizes[fontSizeIndex]}`}>
          {displayText}
        </p>

        <div className="space-y-3 mb-8">
          {showTakhreej && dhikr.takhreej && (
            <div className="flex items-start gap-3 text-sm md:text-base text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <BookOpen className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
              <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
            </div>
          )}
          {showFadl && dhikr.fadl && (
            <div className="flex items-start gap-3 text-sm md:text-base text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/20">
              <Star className="w-5 h-5 shrink-0 mt-0.5" />
              <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
            </div>
          )}
          {showFawaid && dhikr.fawaid && (
            <div className="flex items-start gap-3 text-sm md:text-base text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <span><strong>فائدة:</strong> {dhikr.fawaid}</span>
            </div>
          )}
        </div>

        <div className="flex flex-row-reverse gap-3 items-stretch justify-center w-full md:w-5/6 mx-auto">
          <button
            onClick={() => resetSingleDhikr(dhikr.id)}
            className="px-5 md:px-8 rounded-3xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-all flex justify-center items-center active:scale-95 border border-slate-200 dark:border-slate-600"
            title="إعادة تصفير هذا الذكر"
          >
            <RotateCcw className="w-7 h-7 md:w-8 md:h-8" />
          </button>

          <button
            onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
            disabled={isCompleted}
            className={`dhikr-increment-btn flex-1 relative overflow-hidden h-[120px] md:h-[140px] rounded-3xl font-bold text-2xl md:text-4xl transition-all duration-300 flex justify-center items-center gap-4 active:scale-95 ${counterBgClass}`}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                <span>تم الانتهاء</span>
              </>
            ) : (
              <>
                <span className="bg-black/10 dark:bg-white/10 px-5 py-2 rounded-2xl text-3xl md:text-5xl font-extrabold tracking-wider z-10">
                  {currentCount} <span className="text-xl md:text-2xl text-white/70">/ {dhikr.target}</span>
                </span>
                <span className="hidden md:inline text-white/90 z-10 font-semibold">اضغط للعد</span>
              </>
            )}

            {!isCompleted && dhikr.target > 1 && currentCount > 0 && (
              <div
                className="absolute top-0 right-0 h-full bg-black/10 z-0 transition-all duration-300"
                style={{ width: `${percentage * 100}%` }}
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
