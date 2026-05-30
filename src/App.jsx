import { useAppLogic } from './hooks/useAppLogic';
import { adhkarData, prayerAdhkar } from './data/adhkar';
import { colorMap, defaultThemeColors } from './utils/theme';
import { LiveBackground } from './components/LiveBackground';
import { SettingsModal } from './components/Modals/SettingsModal';
import { TasbeehModal } from './components/Modals/TasbeehModal';
import { StatsModal } from './components/Modals/StatsModal';
import { RoadmapModal } from './components/Modals/RoadmapModal';
import { DevModal } from './components/Modals/DevModal';
import { FreeAdhkarModal } from './components/Modals/FreeAdhkarModal';
import { MoodTracker } from './components/MoodTracker';
import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Sun, Moon, Settings, Info, BookOpen, CheckCircle, RotateCcw, Clock, Star, X, Plus, Minus, Type, Flame, Volume2, VolumeX, Vibrate, VibrateOff, Target, Sunrise, Sunset, MoonStar, ChevronDown, ChevronUp, Palette, Fingerprint, BarChart2, Edit3, Trash2, Award, Trophy, Bell, BellRing, Shield, Crown, RefreshCw, Share2, Map, Mic, MicOff, Leaf, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const Garden3D = lazy(() => import('./Garden3D'));

// مكون أيقونة المسبحة الإسلامية المخصصة والجميلة
const TasbeehIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* خرزات دائرية مرتبة بشكل مسبحة دائري */}
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="16.5" cy="5.5" r="1.5" />
    <circle cx="19.5" cy="9.5" r="1.5" />
    <circle cx="19.5" cy="14.5" r="1.5" />
    <circle cx="16.5" cy="18.5" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="7.5" cy="18.5" r="1.5" />
    <circle cx="4.5" cy="14.5" r="1.5" />
    <circle cx="4.5" cy="9.5" r="1.5" />
    <circle cx="7.5" cy="5.5" r="1.5" />
    {/* الشاهد والشرابة في الأسفل */}
    <line x1="12" y1="20" x2="12" y2="22" strokeWidth="2.5" />
    <path d="M10 22 C 10 24, 14 24, 14 22 Z" fill="currentColor" />
  </svg>
);

// مكون العناصر السماوية (شمس، نجوم، غيوم)
// --- البيانات المستخرجة حصرياً من ملف د. مطلق الجاسر ---




// أحجام الخطوط المتاحة للمتن
const fontSizes = [
  'text-lg md:text-xl',
  'text-xl md:text-2xl',
  'text-2xl md:text-3xl',  // الافتراضي (المنتصف)
  'text-3xl md:text-4xl',
  'text-4xl md:text-5xl'
];

// تعريف الـ Styles خارج المكون يمنع وميض الشاشة ويحافظ على استقرار الخطوط
const globalStyles = {
  __html: `
    .font-cairo { font-family: 'Cairo', sans-serif; }
    .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); }
    body { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
    
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    .ripple-effect {
      position: absolute; border-radius: 50%; transform: scale(0);
      animation: ripple 600ms linear; background-color: rgba(255, 255, 255, 0.4);
    }
    .confetti {
      position: fixed;
      top: -10vh;
      z-index: 9999;
      animation: confettiFall 4s linear forwards;
    }
  `
};

export default function App() {
  const appLogic = useAppLogic();
  const {
    needRefresh, setNeedRefresh, updateServiceWorker,
    showSettingsModal, setShowSettingsModal,
    showTasbeehModal, setShowTasbeehModal,
    showStatsModal, setShowStatsModal,
    showRoadmapModal, setShowRoadmapModal,
    showDevModal, setShowDevModal,
    showFreeAdhkarModal, setShowFreeAdhkarModal,
    soundEnabled, setSoundEnabled,
    vibrationEnabled, setVibrationEnabled,
    prayerTimes, isLocating, autoFetchLocation, setPrayerTimes, setLocation, location,
    testHiddenNotification, notificationsEnabled, setNotificationsEnabled,
    celebrationEnabled, setCelebrationEnabled,
    isDarkMode, toggleDarkMode,
    fontSizeIndex, setFontSizeIndex,
    themeColors, setThemeColors,
    showTakhreej, setShowTakhreej,
    showFadl, setShowFadl,
    showFawaid, setShowFawaid,
    getTabLabel,
    customAdhkar, setCustomAdhkar, progress, setProgress,
    handleDhikrClick, resetSingleDhikr, deleteCustomDhikr,
    showAddCustom, setShowAddCustom, newCustomText, setNewCustomText, newCustomTarget, setNewCustomTarget, addCustomDhikr,
    tasbeehCount, setTasbeehCount, resetTasbeeh, handleTasbeehClick, dailyTasbeehGoal, todayTasbeehs,
    bestStreak, streak, totalTasbeehsMade, totalAdhkarRead, roadmapDays,
    badges, exportStatsAsImage, exportStoryAsImage, isExporting,
    devData, setDevData,
    currentTabTheme, activeTab, setActiveTab, getTabClass, totalProgressPercentage,
    speechSupported, toggleVoiceTasbeeh, isListening, currentLevel,
    currentTabAdhkar, showConfetti, setShowConfetti, isInteracting, setIsInteracting,
    shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect
  } = appLogic;

  // Combine props for modals to keep code clean
  const props = appLogic;
  props.fontSizes = fontSizes; // Since fontSizes is defined globally in App.jsx
return (
    <div dir="rtl" className={`min-h-screen relative font-cairo transition-colors duration-300 ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}>
      <LiveBackground colorTheme={currentTabTheme} isDarkMode={isDarkMode} isInteracting={isInteracting} activeTab={activeTab} />
      <style dangerouslySetInnerHTML={globalStyles} />

      {/* --- إشعار تحديث التطبيق (PWA Update Prompt) --- */}
      {needRefresh && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border-2 ${currentTabTheme.header.replace('bg-', 'border-')} dark:border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${currentTabTheme.cardHeader}`}>
              <RefreshCw className={`w-6 h-6 animate-spin ${currentTabTheme.icon}`} />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">تحديث جديد متاح! ✨</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">انقر لتحديث التطبيق والحصول على أحدث الميزات.</p>
            </div>
          </div>
          <button
            onClick={() => updateServiceWorker(true)}
            className={`shrink-0 ${currentTabTheme.header} hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold transition shadow-md active:scale-95 text-sm md:text-base`}
          >
            تحديث الآن
          </button>
        </div>
      )}

      {/* --- تأثير الاحتفال بالإنجاز والدعاء --- */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="confetti absolute w-2 h-4 sm:w-3 sm:h-6"
                style={{
                  left: `${Math.random() * 100}vw`,
                  backgroundColor: ['#14b8a6', '#facc15', '#a855f7', '#ec4899', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 6)],
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl transform transition-all animate-in zoom-in-75 duration-500 flex flex-col items-center text-center max-w-sm mx-4 border border-yellow-200 dark:border-slate-600 pointer-events-auto">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4">
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">الحمد لله</h2>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              تقبل الله طاعتكم، وجعلها في ميزان حسناتكم، وكتب لكم الأجر العظيم.
            </p>
            <button
              onClick={() => setShowConfetti(false)}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}



      {/* --- شريط التنقل العلوي --- */}
      <header className={`fixed top-0 left-0 right-0 z-40 shadow-md transition-colors duration-500 ${currentTabTheme.header} dark:bg-slate-800 text-white`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">الأذكار</h1>
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

            {/* المسبحة الصوتية العامة */}
            {speechSupported && (
              <button
                onClick={toggleVoiceTasbeeh}
                className={`p-1.5 md:p-2 rounded-full transition relative flex items-center justify-center shadow-sm ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700'}`}
                title="المسبحة الصوتية (العد التلقائي بالصوت)"
              >
                {isListening ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
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

      {/* --- نافذة المسبحة الحرة (Modal) --- */}
      {showTasbeehModal && <TasbeehModal props={props} />}

      {/* --- نافذة الإحصاءات والأوسمة (Modal) --- */}
      {showStatsModal && <StatsModal props={props} />}

      {/* --- خريطة تحدي الـ 40 يوماً --- */}
      {showRoadmapModal && <RoadmapModal props={props} />}

      {/* --- القائمة السرية لاستعادة البيانات --- */}
      {showDevModal && <DevModal props={props} />}

      {/* --- نافذة الأذكار الحرة (Modal) --- */}
      {showFreeAdhkarModal && <FreeAdhkarModal props={props} />}

      {/* --- نافذة الإعدادات --- */}
      {showSettingsModal && <SettingsModal props={props} />}

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pt-[130px] md:pt-[140px]">

        {/* --- تنبيه أوقات الأذكار --- */}
        {activeTab !== 'garden' && (
          <div className="mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <div className="flex items-start gap-3">
              <TabIcon className={`w-6 h-6 ${currentTabTheme.icon} shrink-0 mt-1`} />
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {activeTab === 'sleep' ? 'سنن وآداب النوم' : activeTab === 'wake' ? 'عند الاستيقاظ والتعار من الليل' : activeTab === 'prayer' ? 'أذكار ما بعد الصلاة المفروضة' : 'وقت الأذكار المفضل'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {activeTab === 'sleep' ? (
                    <span>
                      يُستحب للمسلم إذا أتى فراشه أن يكون على <strong className={currentTabTheme.icon}>طهارة</strong>، وأن <strong className={currentTabTheme.icon}>ينفض فراشه</strong> بداخلة إزاره، وأن يضطجع على <strong className={currentTabTheme.icon}>جنبه الأيمن</strong>، وأن يضع يده تحت خده الأيمن، ثم يأتي بالأذكار.
                    </span>
                  ) : activeTab === 'wake' ? (
                    <span>
                      يُستحب للمسلم أول ما يستيقظ من نومه أن <strong className={currentTabTheme.icon}>يمسح النوم عن وجهه</strong> بيده، ثم يأتي بأذكار الاستيقاظ. ولمن استيقظ من الليل وتَقَلَّب أن يأتي بذكر <strong className={currentTabTheme.icon}>التعار من الليل</strong> فدعوته مستجابة.
                    </span>
                  ) : activeTab === 'prayer' ? (
                    <span>
                      تُقرأ هذه الأذكار دبر كل <strong className={currentTabTheme.icon}>صلاة مكتوبة (مفروضة)</strong>، ويُسنّ للمسلم أن لا يبرح مكانه حتى ينهيها لينال أجرها العظيم.
                    </span>
                  ) : activeTab === 'morning' ? (
                    <span>
                      <strong className={currentTabTheme.icon}>وقت الصباح:</strong> يبدأ من طلوع الفجر الصادق، ويمتد إلى شروق الشمس.
                    </span>
                  ) : (
                    <span>
                      <strong className={currentTabTheme.icon}>وقت المساء:</strong> يبدأ من بعد صلاة العصر، ويمتد إلى غروب الشمس.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- زر أذكار التعار - يظهر فقط في نافذة الاستيقاظ --- */}
        {activeTab === 'wake' && (
          <div className="mb-8">
            <button
              onClick={() => setShowTaarSection(!showTaarSection)}
              className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all shadow-lg active:scale-95 ${showTaarSection ? 'bg-slate-800 text-white' : `bg-gradient-to-r ${currentTabTheme.taarBtn} text-white`}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${showTaarSection ? 'bg-slate-700' : 'bg-white/20'}`}>
                  <MoonStar className={showTaarSection ? 'text-yellow-400' : 'text-white'} />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-lg">أذكار التعار من الليل</h3>
                  <p className="text-xs opacity-80">إذا استيقظت أو تقلبت في الليل</p>
                </div>
              </div>
              {showTaarSection ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* --- قسم التعار المنسدل --- */}
            {showTaarSection && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-amber-800 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800 flex gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>هذه الأذكار لها فضل عظيم جداً؛ فمن قالها ثم دعا استُجيب له، وإن توضأ وصلى قُبلت صلاته.</p>
                </div>

                {taarAdhkar.map(dhikr => {
                  const count = progress[`${activeTab}-${dhikr.id}`] || 0;
                  const done = count >= dhikr.target;
                  return (
                    <div key={dhikr.id} id={`dhikr-${dhikr.id}`} className={`dhikr-card ${done ? 'completed' : ''} bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                      <p className={`font-bold leading-relaxed mb-4 ${fontSizes[fontSizeIndex]}`}>
                        {dhikr.textMorning}
                      </p>

                      {showTakhreej && dhikr.takhreej && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                          <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                          <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
                        </div>
                      )}
                      {showFadl && dhikr.fadl && (
                        <div className="flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl mb-6 border border-rose-100 dark:border-rose-900/20">
                          <Star className="w-4 h-4 shrink-0 mt-0.5" />
                          <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                        className={`dhikr-increment-btn w-full py-4 rounded-xl font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 ${done ? currentTabTheme.counterDone + ' cursor-default shadow-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}
                      >
                        {done ? <CheckCircle className="mx-auto" /> : `كرر: ${count} / ${dhikr.target}`}
                      </button>
                    </div>
                  );
                })}
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-4" />
              </div>
            )}
          </div>
        )}

        {/* --- عرض بستان الجنة كـ Tab --- */}
        {activeTab === 'garden' && (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
            <JannahGarden totalTasbeehs={totalTasbeehsMade + totalAdhkarRead} />
          </div>
        )}

        {/* --- عنوان القسم وزر تصفير الكل --- */}
        {activeTab !== 'garden' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                {activeTab === 'morning' && 'أذكار الصباح'}
                {activeTab === 'evening' && 'أذكار المساء'}
                {activeTab === 'sleep' && 'أذكار النوم'}
                {activeTab === 'wake' && 'أذكار الاستيقاظ'}
                {activeTab === 'prayer' && 'أذكار بعد الصلاة'}
              </h2>
              <button
                onClick={resetAllProgress}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-sm md:text-base font-bold shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                تصفير الكل
              </button>
            </div>

            {/* --- التتبع النفسي (Mood Tracker) --- */}
            <MoodTracker 
        shouldShowBeforeMood={shouldShowBeforeMood}
        shouldShowAfterMood={shouldShowAfterMood}
        handleMoodSelect={handleMoodSelect}
      />

            {/* --- قائمة الأذكار الرئيسية (تتغير حسب التبويب) --- */}
            <div className="space-y-6 md:space-y-8">
              {currentTabAdhkar.map((dhikr) => {
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
                    key={dhikr.id}
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
              })}
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-200 dark:bg-slate-950 py-8 text-center text-slate-600 dark:text-slate-400 mt-12 border-t border-slate-300 dark:border-slate-800">
        <p className="font-bold text-lg">تنسيق: قصي مسالمة</p>
        <p className="text-sm mt-2 opacity-80">تم التصميم بناءًا على رسائل د. مطلق الجاسر</p>
      </footer>

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
    </div>
  );
}