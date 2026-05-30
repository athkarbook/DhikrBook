import React from 'react';
import { Leaf, Settings, Medal, RefreshCw, Target, Map, Flame, Mic, MicOff, Crown } from 'lucide-react';
import { TasbeehIcon } from './Icons';

export function Header({ props }) {
  const {
    currentTabTheme, activeTab, dailyTasbeehGoal, todayTasbeehs, tasbeehCount,
    handleTasbeehClick, resetTasbeeh, setShowSettingsModal, setShowStatsModal,
    setShowTasbeehModal, setShowRoadmapModal, streak, speechSupported,
    toggleVoiceTasbeeh, isListening, currentLevel, setActiveTab, getTabClass,
    totalProgressPercentage
  } = props;
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 shadow-md transition-colors duration-500 ${currentTabTheme.header} dark:bg-slate-800 text-white`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <Leaf className="w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">غِراس</h1>
          </div>
          <div className="flex items-center space-x-1.5 space-x-reverse md:space-x-3">

            {/* مؤشر الهدف اليومي للمسبحة */}
            <div
              className="hidden sm:flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs md:text-base font-bold border border-white/30 cursor-pointer hover:bg-white/30 transition"
              title="الهدف اليومي للتسبيح"
              onClick={() => setShowTasbeehModal(true)}
            >
              <Target className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
              <span>{Math.min(100, Math.floor((todayTasbeehs / dailyTasbeehGoal) * 100))}%</span>
            </div>

            {/* خريطة التحدي */}
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="p-1.5 md:p-2 rounded-full bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition relative group"
              title="خريطة الـ 40 يوماً"
            >
              <Map className="w-4 h-4 md:w-5 md:h-5 text-amber-200" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {/* شعلة المواظبة اليومية */}
            {streak > 0 && (
              <div
                className="flex items-center gap-1 bg-yellow-400/20 text-yellow-100 px-2 py-1 rounded-full text-xs md:text-base font-bold border border-yellow-400/30 cursor-pointer hover:bg-yellow-400/30 transition"
                title="أيام المواظبة المتتالية"
                onClick={() => setShowStatsModal(true)}
              >
                <Flame className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-400" />
                <span>{streak}</span>
              </div>
            )}

            {/* المسبحة الصوتية الذكية */}
            {speechSupported && (
              <button
                onClick={toggleVoiceTasbeeh}
                className={`px-2 md:px-3 py-1.5 md:py-2 rounded-full transition-all relative flex items-center justify-center gap-2 shadow-sm ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700'}`}
                title="المسبحة الصوتية (العد التلقائي بالصوت)"
              >
                {isListening ? (
                  <>
                    <Mic className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-bold animate-pulse">يستمع.. اقرأ لينتقل</span>
                  </>
                ) : (
                  <MicOff className="w-4 h-4 md:w-5 md:h-5" />
                )}
              </button>
            )}

            {/* المستوى الحالي (RPG) */}
            <div
              className="flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-[10px] md:text-sm font-bold border border-white/30 cursor-pointer hover:bg-white/30 transition"
              title={`المستوى الحالي: ${currentLevel}`}
              onClick={() => setShowStatsModal(true)}
            >
              <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-300" />
              <span>{currentLevel}</span>
            </div>

            {/* زر المسبحة الحرة */}
            <button
              onClick={() => setShowTasbeehModal(true)}
              className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 md:px-3 rounded-full md:rounded-xl bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition text-white font-bold shadow-sm"
              title="المسبحة الحرة"
            >
              <TasbeehIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline text-sm">المسبحة</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition"
              aria-label="إعدادات التطبيق"
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* --- التبويبات --- */}
        <div className="flex border-t border-black/10 dark:border-slate-700 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button onClick={() => setActiveTab('wake')} className={getTabClass('wake')}>الاستيقاظ</button>
          <button onClick={() => setActiveTab('morning')} className={getTabClass('morning')}>الصباح</button>
          <button onClick={() => setActiveTab('evening')} className={getTabClass('evening')}>المساء</button>
          <button onClick={() => setActiveTab('sleep')} className={getTabClass('sleep')}>النوم</button>
          <button onClick={() => setActiveTab('prayer')} className={getTabClass('prayer')}>الصلاة</button>
          <button onClick={() => setActiveTab('garden')} className={getTabClass('garden')}>بستاني</button>
        </div>

        {/* --- شريط التقدم --- */}
        <div className="w-full bg-black/20 dark:bg-black/30 h-1.5 shadow-inner">
          <div
            className={`h-full transition-all duration-500 ease-out flex justify-end items-center ${currentTabTheme.progress}`}
            style={{ width: `${totalProgressPercentage}%` }}
          >
            {totalProgressPercentage > 10 && (
              <span className="text-[9px] font-bold text-slate-800 dark:text-slate-900 px-1 select-none">
                {totalProgressPercentage}%
              </span>
            )}
          </div>
        </div>
      </header>
  );
}