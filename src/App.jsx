import { useAppLogic } from './hooks/useAppLogic';
import { adhkarData, prayerAdhkar } from './data/adhkar';
import { colorMap, defaultThemeColors } from './utils/theme';
import { LiveBackground } from './components/UI/LiveBackground';
import { SettingsModal } from './components/Modals/SettingsModal';
import { TasbeehModal } from './components/Modals/TasbeehModal';
import { StatsModal } from './components/Modals/StatsModal';
import { RoadmapModal } from './components/Modals/RoadmapModal';
import { DevModal } from './components/Modals/DevModal';
import { FreeAdhkarModal } from './components/Modals/FreeAdhkarModal';
import { MoodTracker } from './components/UI/MoodTracker';
import { Header } from './components/UI/Header';
import { DhikrCard } from './components/Cards/DhikrCard';
import { StoryExportCard } from './components/Cards/StoryExportCard';
import React, { useState, Suspense, lazy } from 'react';
import { BookOpen, Star, Info, CheckCircle, RotateCcw, Clock, Target, ChevronDown, ChevronUp, MoonStar, RefreshCw, Flame, Moon } from 'lucide-react';

const Garden3D = lazy(() => import('./components/Garden/Garden3D'));

const fontSizes = [
  'text-lg md:text-xl',
  'text-xl md:text-2xl',
  'text-2xl md:text-3xl',
  'text-3xl md:text-4xl',
  'text-4xl md:text-5xl'
];

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
    isDarkMode, fontSizeIndex, showTakhreej, showFadl, showFawaid,
    progress, handleDhikrClick, resetSingleDhikr, resetAllProgress,
    totalTasbeehsMade, totalAdhkarRead, streak, currentTabTheme, activeTab,
    currentTabAdhkar, showConfetti, setShowConfetti, isInteracting,
    shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect
  } = appLogic;

  const props = appLogic;
  props.fontSizes = fontSizes;

  const [showTaarSection, setShowTaarSection] = useState(false);
  const taarAdhkar = adhkarData.filter(d => d.category === 'الذكر الوارد إذا تعار من الليل (التقلب والانتباه)');

  const TabIcon = activeTab === 'morning' ? Flame : activeTab === 'evening' ? Moon : activeTab === 'sleep' ? MoonStar : activeTab === 'wake' ? Flame : Clock;

  return (
    <div dir="rtl" className={`min-h-screen relative font-cairo transition-colors duration-300 ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}>
      <LiveBackground colorTheme={currentTabTheme} isDarkMode={isDarkMode} isInteracting={isInteracting} activeTab={activeTab} />
      <style dangerouslySetInnerHTML={globalStyles} />

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

      <Header props={props} />

      {showTasbeehModal && <TasbeehModal props={props} />}
      {showStatsModal && <StatsModal props={props} />}
      {showRoadmapModal && <RoadmapModal props={props} />}
      {showDevModal && <DevModal props={props} />}
      {showFreeAdhkarModal && <FreeAdhkarModal props={props} />}
      {showSettingsModal && <SettingsModal props={props} />}

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pt-[130px] md:pt-[140px]">
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

            {showTaarSection && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-amber-800 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800 flex gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>هذه الأذكار لها فضل عظيم جداً؛ فمن قالها ثم دعا استُجيب له، وإن توضأ وصلى قُبلت صلاته.</p>
                </div>

                {taarAdhkar.map(dhikr => (
                  <DhikrCard
                    key={dhikr.id}
                    dhikr={dhikr}
                    activeTab={activeTab}
                    progress={progress}
                    currentTabTheme={currentTabTheme}
                    fontSizes={fontSizes}
                    fontSizeIndex={fontSizeIndex}
                    showTakhreej={showTakhreej}
                    showFadl={showFadl}
                    showFawaid={showFawaid}
                    resetSingleDhikr={resetSingleDhikr}
                    handleDhikrClick={handleDhikrClick}
                  />
                ))}
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-4" />
              </div>
            )}
          </div>
        )}

        {activeTab === 'garden' && (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
            <Suspense fallback={<div className="text-center p-20 text-slate-500 font-bold">جاري تحميل البستان...</div>}>
              <Garden3D totalTasbeehs={totalTasbeehsMade + totalAdhkarRead} />
            </Suspense>
          </div>
        )}

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

            <MoodTracker 
              shouldShowBeforeMood={shouldShowBeforeMood}
              shouldShowAfterMood={shouldShowAfterMood}
              handleMoodSelect={handleMoodSelect}
            />

            <div className="space-y-6 md:space-y-8">
              {currentTabAdhkar.map((dhikr) => (
                <DhikrCard
                  key={dhikr.id}
                  dhikr={dhikr}
                  activeTab={activeTab}
                  progress={progress}
                  currentTabTheme={currentTabTheme}
                  fontSizes={fontSizes}
                  fontSizeIndex={fontSizeIndex}
                  showTakhreej={showTakhreej}
                  showFadl={showFadl}
                  showFawaid={showFawaid}
                  resetSingleDhikr={resetSingleDhikr}
                  handleDhikrClick={handleDhikrClick}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-200 dark:bg-slate-950 py-8 text-center text-slate-600 dark:text-slate-400 mt-12 border-t border-slate-300 dark:border-slate-800">
        <p className="font-bold text-lg">تنسيق: قصي مسالمة</p>
        <p className="text-sm mt-2 opacity-80">تم التصميم بناءًا على رسائل د. مطلق الجاسر</p>
      </footer>

      <StoryExportCard streak={streak} totalTasbeehsMade={totalTasbeehsMade} totalAdhkarRead={totalAdhkarRead} />
    </div>
  );
}