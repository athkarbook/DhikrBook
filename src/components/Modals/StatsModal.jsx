import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2 } from 'lucide-react';
import { TasbeehIcon } from '../UI/Icons';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function StatsModal({ props }) {
  const {
    showStatsModal, setShowStatsModal,
    soundEnabled, setSoundEnabled,
    vibrationEnabled, setVibrationEnabled,
    prayerTimes, isLocating, autoFetchLocation, setPrayerTimes, setLocation, location,
    testHiddenNotification, notificationsEnabled, setNotificationsEnabled,
    celebrationEnabled, setCelebrationEnabled,
    isDarkMode, toggleDarkMode,
    fontSizeIndex, setFontSizeIndex, fontSizes,
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
    badges, exportStatsAsImage, isExporting,
    devData, setDevData
  } = props;

  return (
    
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 relative border border-slate-200 dark:border-slate-700 flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowStatsModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3
              onClick={() => {
                const newCount = devClickCount + 1;
                setDevClickCount(newCount);
                if (newCount >= 5) {
                  setDevData({ streak, bestStreak, totalAdhkarRead, totalTasbeehsMade });
                  setShowDevModal(true);
                  setDevClickCount(0);
                }
              }}
              className="text-2xl font-bold mb-8 text-teal-700 dark:text-teal-400 flex items-center gap-2 select-none"
            >
              <BarChart2 className="w-7 h-7" />
              إحصاءات المتابعة والأوسمة
            </h3>

            <div id="stats-export-area" className="w-full bg-white dark:bg-slate-800 p-2 rounded-2xl">

              {/* --- قسم مستوى المستخدم (RPG Leveling) --- */}
              <div className="w-full mb-6 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm ${levelColor} border border-slate-100 dark:border-slate-600`}>
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">المستوى الحالي</p>
                      <h4 className={`text-xl md:text-2xl font-black ${levelColor}`}>{currentLevel}</h4>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">نقاط النور</p>
                    <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{userXP} <span className="text-xs font-bold text-slate-400">XP</span></p>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${levelBg} transition-all duration-1000 ease-out`}
                    style={{ width: `${levelProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                  <span>{minXP} XP</span>
                  <span>الهدف القادم: {maxXP} XP</span>
                </div>

                {/* شرح كيفية حساب النقاط */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600/50">
                  <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Info className="w-4 h-4 shrink-0 text-teal-500" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">كيف أجمع نقاط النور (XP)؟</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>كل تسبيحة بالمسبحة = <strong className="text-teal-600 dark:text-teal-400">1 نقطة</strong></li>
                        <li>كل قراءة لذكر = <strong className="text-teal-600 dark:text-teal-400">2 نقطة</strong></li>
                        <li>المواظبة المستمرة = <strong className="text-teal-600 dark:text-teal-400">50 نقطة</strong> إضافية عن كل يوم في أعلى ستريك لك!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-amber-200 dark:border-slate-600 flex items-center justify-between gap-4 relative overflow-hidden group">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 dark:bg-slate-600 p-3 rounded-full text-amber-600 dark:text-amber-400">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">أيام المواظبة المتتالية</p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100">{streak} يوم</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoadmapModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-2 font-bold"
                    title="خريطة الـ 40 يوماً"
                  >
                    <Map className="w-5 h-5" />
                    <span className="hidden sm:inline">افتح الخريطة</span>
                  </button>
                </div>

                <div className="bg-teal-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-teal-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-teal-100 dark:bg-slate-600 p-3 rounded-full text-teal-600 dark:text-teal-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إجمالي الأذكار المقروءة</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalAdhkarRead}</p>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-indigo-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-slate-600 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                    <TasbeehIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إجمالي التسبيحات</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalTasbeehsMade}</p>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-rose-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-rose-100 dark:bg-slate-600 p-3 rounded-full text-rose-600 dark:text-rose-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">أفضل مواظبة (Best Streak)</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{bestStreak} يوم</p>
                  </div>
                </div>
              </div>

              {/* النشاط الأسبوعي والشهري */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-indigo-500" />
                    النشاط
                  </h4>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setChartFilter('7')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartFilter === '7' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>أسبوعي</button>
                    <button onClick={() => setChartFilter('30')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartFilter === '30' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>شهري</button>
                  </div>
                </div>
                <div className={`flex items-end justify-between ${chartFilter === '7' ? 'gap-1 md:gap-2' : 'gap-[1px] md:gap-[2px]'} h-48 mt-4 px-1 md:px-2`}>
                  {graphDays.map((day, i) => {
                    const total = Object.values(day.data).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
                    const isToday = i === graphDays.length - 1;
                    return (
                      <div key={day.date} className="h-full flex flex-col items-center justify-end gap-2 flex-1 group">
                        <div
                          className="w-full max-w-[2.5rem] flex-1 rounded-t-sm transition-all duration-500 relative flex flex-col justify-end cursor-pointer hover:opacity-80 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          style={{ minHeight: '0' }}
                        >
                          <div className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold z-10 whitespace-nowrap z-20">
                            الإجمالي: {total}
                          </div>

                          {/* Stacked bars */}
                          <div className="w-full h-full flex flex-col justify-end">
                            {['free', 'prayer', 'sleep', 'evening', 'morning', 'wake', 'tasbeeh'].map(cat => {
                              const val = Number(day.data[cat]) || 0;
                              if (val === 0) return null;
                              const heightPercent = (val / maxActivity) * 100;
                              const colors = {
                                tasbeeh: '#14b8a6', // teal
                                morning: '#f59e0b', // amber
                                evening: '#f43f5e', // rose
                                sleep: '#6366f1', // indigo
                                wake: '#0ea5e9', // sky
                                prayer: '#3b82f6', // blue
                                free: '#8b5cf6' // violet
                              };
                              return <div key={cat} style={{ height: `${heightPercent}%`, backgroundColor: colors[cat] }} className="w-full shrink-0" title={cat} />
                            })}
                          </div>
                        </div>
                        {chartFilter === '7' ? (
                          <span className={`text-[10px] md:text-xs font-bold ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {day.dayName}
                          </span>
                        ) : (
                          <span className={`text-[8px] md:text-[10px] font-bold ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {day.dayOfMonth}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] md:text-xs font-bold">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>تسابيح</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>صباح</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div>مساء</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>نوم</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>استيقاظ</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>صلاة</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>حر</div>
                </div>
              </div>
              {/* التتبع النفسي للذكر */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-emerald-500" />
                  أثر الذكر على قلبك
                </h4>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 md:p-6 border border-emerald-200 dark:border-emerald-800/50 shadow-sm relative overflow-hidden">
                  <Heart className="absolute -left-4 -top-4 w-24 h-24 text-emerald-500 opacity-5" />
                  <p className="text-center font-bold text-emerald-700 dark:text-emerald-400 text-sm md:text-base mb-6 leading-relaxed">
                    «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
                  </p>
                  {(() => {
                    let totalLogged = 0;
                    let improvedCount = 0;
                    const negativeMoods = ['sad', 'anxious', 'tired'];
                    const positiveMoods = ['calm', 'peaceful'];

                    Object.values(moodLog).forEach(day => {
                      Object.values(day).forEach(session => {
                        if (session.before && session.after) {
                          totalLogged++;
                          if (negativeMoods.includes(session.before) && positiveMoods.includes(session.after)) {
                            improvedCount++;
                          } else if (session.before === 'calm' && session.after === 'peaceful') {
                            improvedCount++;
                          } else if (positiveMoods.includes(session.before) && positiveMoods.includes(session.after)) {
                            improvedCount++; // Maintained good mood
                          }
                        }
                      });
                    });

                    if (totalLogged === 0) {
                      return <p className="text-center text-slate-500 dark:text-slate-400 text-xs font-bold">سجل شعورك قبل وبعد الأذكار لترى أثرها الطاهر على قلبك هنا.</p>;
                    }

                    const improvementRate = Math.round((improvedCount / totalLogged) * 100);

                    return (
                      <div className="text-center relative z-10">
                        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mb-3 font-bold">
                          بناءً على تتبع مشاعرك، تحسنت واطمأنت حالتك النفسية بعد الذكر بنسبة:
                        </p>
                        <div className="flex justify-center items-end gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                          <span className="text-5xl md:text-6xl font-black drop-shadow-sm">{improvementRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden mt-4 max-w-[250px] mx-auto shadow-inner">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-1000 relative" style={{ width: `${improvementRate}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>
                        {improvementRate > 70 && (
                          <p className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400">
                            ما شاء الله! هذا مصداق وعد الله للمستغفرين والذاكرين.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* قسم الأوسمة */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  الأوسمة والإنجازات
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      className={`p-3 md:p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${badge.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700/50 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 grayscale'
                        }`}
                    >
                      <div className={`p-2 rounded-full mb-2 ${badge.unlocked ? 'bg-yellow-200 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300' : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                        {badge.icon}
                      </div>
                      <p className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {badge.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                        {badge.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* إغلاق مساحة التصدير */}
            </div>

            {/* أزرار الإجراءات */}
            <div className="w-full mt-6 flex flex-col gap-3">
              <button
                onClick={exportStoryAsImage}
                disabled={isExporting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-lg transition shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Flame className="w-6 h-6" />}
                شارك إنجازك (Story)
              </button>

              <button
                onClick={exportStatsAsImage}
                disabled={isExporting}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5" />
                حفظ الإحصائيات الكاملة
              </button>
            </div>
          </div>
        </div>
      
  );
}
