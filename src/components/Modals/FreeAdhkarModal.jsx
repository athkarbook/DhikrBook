import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2 } from 'lucide-react';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function FreeAdhkarModal({ props }) {
  const {
    showFreeAdhkarModal, setShowFreeAdhkarModal,
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
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFreeAdhkarModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-2 border-b pb-4 dark:border-slate-700">
              <Edit3 className="w-7 h-7" />
              الأذكار الحرة المخصصة
            </h3>

            {/* زر إضافة ذكر حر جديد */}
            <div className="mb-6">
              {!showAddCustom ? (
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-dashed border-orange-300 dark:border-orange-900 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-lg shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  إضافة ذكر أو دعاء مخصص
                </button>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-3 duration-200">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3">ذكر جديد</h4>
                  <textarea
                    value={newCustomText}
                    onChange={(e) => setNewCustomText(e.target.value)}
                    placeholder="اكتب الذكر أو الدعاء هنا..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-h-[80px] mb-4 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  ></textarea>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">التكرار المطلوب:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setNewCustomTarget(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={newCustomTarget}
                        onChange={(e) => setNewCustomTarget(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-center font-bold text-slate-800 dark:text-slate-100"
                      />
                      <button
                        onClick={() => setNewCustomTarget(prev => prev + 1)}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addCustomDhikr}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => { setShowAddCustom(false); setNewCustomText(''); setNewCustomTarget(1); }}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الأذكار الحرة */}
            <div className="space-y-4">
              {customAdhkar.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <Edit3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">لا توجد أذكار حرة مضافة بعد.</p>
                  <p className="text-sm mt-1">أضف أذكارك وأدعيتك المفضلة هنا لقراءتها ومتابعة عدّها بسهولة!</p>
                </div>
              ) : (
                customAdhkar.map(dhikr => {
                  const key = `free-${dhikr.id}`;
                  const currentCount = progress[key] || 0;
                  const isCompleted = currentCount >= dhikr.target;
                  const percentage = Math.min(100, Math.floor((currentCount / dhikr.target) * 100));

                  return (
                    <div
                      key={dhikr.id}
                      className={`p-4 md:p-5 rounded-2xl border transition-all ${isCompleted ? 'bg-orange-50/50 dark:bg-orange-950/5 border-orange-200 dark:border-orange-900/50 opacity-90' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
                    >
                      <div className="flex-1 w-full">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-relaxed whitespace-pre-line mb-3">
                          {dhikr.textMorning}
                        </p>
                        {/* شريط التقدم الصغير */}
                        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-orange-500 h-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                          <span>التقدم: {percentage}%</span>
                          <span>الهدف: {dhikr.target}</span>
                        </div>
                      </div>

                      {/* أزرار التحكم بالعد والحذف */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {/* زر العداد الدائري المميز */}
                        <button
                          onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                          disabled={isCompleted}
                          className={`w-14 h-14 rounded-full font-black text-lg flex items-center justify-center transition-all ${isCompleted
                            ? 'bg-orange-100 dark:bg-orange-950/20 text-orange-600 border-2 border-orange-400 dark:border-orange-800'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95'
                            }`}
                        >
                          {currentCount}
                        </button>

                        {/* إعادة التصفير */}
                        <button
                          onClick={() => resetSingleDhikr(dhikr.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
                          title="تصفير العداد"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>

                        {/* حذف */}
                        <button
                          onClick={() => deleteCustomDhikr(dhikr.id)}
                          className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                          title="حذف الذكر"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      
  );
}
