import React from 'react';
import { Heart } from 'lucide-react';

export function MoodTracker({ shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect }) {
  return (
    <>
      {shouldShowBeforeMood && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Heart className="w-6 h-6 animate-[pulse_2s_ease-in-out_infinite]" />
                  كيف حال قلبك الآن؟
                </h3>
                <p className="text-center text-slate-500 dark:text-slate-400 text-sm md:text-base mb-6">قبل أن تبدأ بذكر الله، سجل شعورك الحالي.</p>

                <div className="flex justify-center gap-3 md:gap-8 flex-wrap">
                  {[
                    { id: 'sad', icon: '😔', label: 'حزين' },
                    { id: 'anxious', icon: '😟', label: 'قلق' },
                    { id: 'tired', icon: '😩', label: 'متعب' },
                    { id: 'calm', icon: '😌', label: 'هادئ' },
                    { id: 'peaceful', icon: '🤍', label: 'مطمئن' }
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id, 'before')}
                      className="flex flex-col items-center gap-2 p-3 md:p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all hover:scale-110 active:scale-95"
                    >
                      <span className="text-4xl md:text-5xl">{mood.icon}</span>
                      <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shouldShowAfterMood && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-emerald-200 dark:border-emerald-800/50 shadow-2xl animate-in zoom-in duration-500">
                <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Heart className="w-6 h-6 animate-[pulse_2s_ease-in-out_infinite]" />
                  كيف حال قلبك الآن بعد الذكر؟
                </h3>
                <p className="text-center text-emerald-600/80 dark:text-emerald-400/80 text-sm md:text-lg mb-6 font-bold">«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»</p>

                <div className="flex justify-center gap-3 md:gap-8 flex-wrap">
                  {[
                    { id: 'sad', icon: '😔', label: 'حزين' },
                    { id: 'anxious', icon: '😟', label: 'قلق' },
                    { id: 'tired', icon: '😩', label: 'متعب' },
                    { id: 'calm', icon: '😌', label: 'هادئ' },
                    { id: 'peaceful', icon: '🤍', label: 'مطمئن' }
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id, 'after')}
                      className="flex flex-col items-center gap-2 p-3 md:p-4 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <span className="text-4xl md:text-5xl">{mood.icon}</span>
                      <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
    </>
  );
}