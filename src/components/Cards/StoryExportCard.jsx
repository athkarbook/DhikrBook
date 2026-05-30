import React from 'react';
import { Flame, BookOpen, Moon } from 'lucide-react';
import { TasbeehIcon } from '../UI/Icons';

export function StoryExportCard({ streak, totalTasbeehsMade, totalAdhkarRead }) {
  return (
    <>
      {/* بطاقة الإنجاز (مخفية، تستخدم للتصدير فقط) موجودة في جذر التطبيق لتفادي مشاكل القص */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100 }}>
        <div id="story-export-card" className="w-[1080px] h-[1920px] bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-20 text-white relative overflow-hidden" dir="rtl">
          {/* زخرفة خلفية عشوائية */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)' }}></div>

          <div className="z-10 bg-white/10 backdrop-blur-2xl p-16 rounded-[4rem] border-4 border-white/20 shadow-2xl w-full max-w-[900px] flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-10 rounded-full mb-12 shadow-[0_0_80px_rgba(251,191,36,0.6)]">
              <Flame className="w-32 h-32 text-white" />
            </div>

            <h1 className="text-7xl font-black mb-8 text-white">إنجاز عظيم!</h1>
            <p className="text-5xl leading-snug mb-16 text-white/90 font-bold">
              أنا أواظب على أذكاري وتسابيحي لـ
              <br />
              <span className="text-amber-400 text-[12rem] leading-none font-black block my-12 drop-shadow-lg">{streak}</span>
              يوم متتالي بفضل الله
            </p>

            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="bg-black/30 p-10 rounded-[3rem] border border-white/10 shadow-inner">
                <TasbeehIcon className="w-20 h-20 mx-auto mb-6 text-teal-400" />
                <div className="text-5xl font-black mb-2">{totalTasbeehsMade}</div>
                <div className="text-3xl text-white/70 font-bold">تسبيحة</div>
              </div>
              <div className="bg-black/30 p-10 rounded-[3rem] border border-white/10 shadow-inner">
                <BookOpen className="w-20 h-20 mx-auto mb-6 text-indigo-400" />
                <div className="text-5xl font-black mb-2">{totalAdhkarRead}</div>
                <div className="text-3xl text-white/70 font-bold">ذكر مقروء</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 flex items-center gap-6 z-10 bg-black/40 backdrop-blur-md px-12 py-6 rounded-full border border-white/10">
            <div className="bg-teal-500 p-4 rounded-3xl">
              <Moon className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-white tracking-wide">تطبيق حصن المسلم - DhikrBook</div>
          </div>
        </div>
      </div>
    </>
  );
}
