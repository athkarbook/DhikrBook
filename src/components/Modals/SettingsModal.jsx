import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2, Sun } from 'lucide-react';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function SettingsModal({ props }) {
  const {
    showSettingsModal, setShowSettingsModal,
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
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-700 dark:text-teal-400 border-b pb-4 dark:border-slate-700">
              <Settings className="w-6 h-6" />
              إعدادات التطبيق
            </h3>

            <div className="space-y-4">

              {/* أزرار الصوت والاهتزاز */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${soundEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6 mb-2" /> : <VolumeX className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الصوت</span>
                </button>
                <button
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${vibrationEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {vibrationEnabled ? <Vibrate className="w-6 h-6 mb-2" /> : <VibrateOff className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الاهتزاز</span>
                </button>
              </div>

              {/* إعدادات الموقع وأوقات الصلاة */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-slate-600 pb-3">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onDoubleClick={testHiddenNotification}
                    title="انقر نقراً مزدوجاً لاختبار التنبيهات المخفية"
                  >
                    <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg text-slate-700 dark:text-slate-200 select-none">الأوقات الذكية</span>
                  </div>
                  {!prayerTimes ? (
                    <button
                      onClick={autoFetchLocation}
                      disabled={isLocating}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-full transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLocating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                      تفعيل
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPrayerTimes(null);
                        setLocation(null);
                        localStorage.removeItem('prayerTimes');
                        localStorage.removeItem('userLocation');
                      }}
                      className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-full hover:bg-red-200 transition"
                    >
                      إيقاف
                    </button>
                  )}
                </div>

                {!prayerTimes ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center py-2">
                    قم بتفعيل الأوقات الذكية ليقوم التطبيق بتحديد موقعك <span className="font-bold text-teal-600">عبر الـ GPS</span> لتذكيرك بأذكار الصباح والمساء والصلوات في وقتها الدقيق.
                    <br /><br />
                    <button onClick={() => {
                      const city = window.prompt("الرجاء إدخال مدينتك (مثال: Amman، مكة):");
                      if (!city) return;
                      const country = window.prompt("الرجاء إدخال دولتك (مثال: Jordan، السعودية):");
                      if (!country) return;
                      autoFetchLocation(city, country);
                    }} className="text-teal-600 hover:underline font-bold cursor-pointer">أو أدخل مدينتك يدوياً بالضغط هنا</button>
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-5 gap-1 text-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      {[
                        { n: 'الفجر', t: prayerTimes.Fajr },
                        { n: 'الظهر', t: prayerTimes.Dhuhr },
                        { n: 'العصر', t: prayerTimes.Asr },
                        { n: 'المغرب', t: prayerTimes.Maghrib },
                        { n: 'العشاء', t: prayerTimes.Isha }
                      ].map(p => (
                        <div key={p.n} className="flex flex-col items-center">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{p.n}</span>
                          <span className="text-[11px] md:text-sm font-black text-teal-700 dark:text-teal-400">{p.t?.split(' ')[0] || '--'}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center">
                      موقعك الحالي: <span className="text-teal-600 dark:text-teal-400">{location?.city ? `${location.city}، ${location.country}` : 'تحديد تلقائي (GPS)'}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* أزرار الإشعارات والاحتفال */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  onClick={() => {
                    if (!notificationsEnabled && Notification.permission !== "granted") {
                      Notification.requestPermission().then(perm => {
                        if (perm === "granted") setNotificationsEnabled(true);
                      });
                    } else {
                      setNotificationsEnabled(!notificationsEnabled);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${notificationsEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {notificationsEnabled ? <BellRing className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400" /> : <Bell className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">التنبيهات</span>
                  <span className="text-[10px] opacity-70 mt-1">(في المتصفح)</span>
                </button>
                <button
                  onClick={() => setCelebrationEnabled(!celebrationEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${celebrationEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  <Star className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">الاحتفال بالنهاية</span>
                  <span className="text-[10px] opacity-70 mt-1">(عند إتمام 100%)</span>
                </button>
              </div>

              {/* إعداد المظهر (ليلي / نهاري) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">مظهر التطبيق</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 font-bold transition shadow-sm active:scale-95"
                >
                  {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <span>{isDarkMode ? 'ليلي' : 'نهاري'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">حجم الخط</span>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => setFontSizeIndex(p => Math.min(p + 1, fontSizes.length - 1))}
                    disabled={fontSizeIndex === fontSizes.length - 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg min-w-[20px] text-center">{fontSizeIndex + 1}</span>
                  <button
                    onClick={() => setFontSizeIndex(p => Math.max(p - 1, 0))}
                    disabled={fontSizeIndex === 0}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* قسم اختيار الألوان */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-slate-600 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">تخصيص الألوان</span>
                  </div>
                  <button
                    onClick={() => setThemeColors(defaultThemeColors)}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    title="العودة للألوان الأصلية"
                  >
                    <RotateCcw className="w-3 h-3" /> الافتراضي
                  </button>
                </div>

                {Object.keys(defaultThemeColors).map(tab => (
                  <div key={tab} className="flex items-center justify-between py-1">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-20 shrink-0">
                      {getTabLabel(tab)}
                    </span>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {Object.keys(colorMap).map(color => (
                        <button
                          key={color}
                          onClick={() => setThemeColors({ ...themeColors, [tab]: color })}
                          className={`w-6 h-6 rounded-full transition-all ${themeColors[tab] === color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-400 scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
                          style={{ backgroundColor: colorMap[color].hex }}
                          title={colorMap[color].name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={celebrationEnabled} onChange={(e) => setCelebrationEnabled(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">الاحتفال والدعاء عند الإنجاز</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showTakhreej} onChange={(e) => setShowTakhreej(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض تخريج الأحاديث</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFadl} onChange={(e) => setShowFadl(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض فضل الذكر</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFawaid} onChange={(e) => setShowFawaid(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض الفوائد اللغوية</span>
              </label>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition shadow-md"
            >
              حفظ وإغلاق
            </button>
          </div>
        </div>
      
  );
}
