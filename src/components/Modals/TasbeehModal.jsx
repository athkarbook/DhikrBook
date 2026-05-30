import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2, Mic, MicOff } from 'lucide-react';
import { TasbeehIcon } from '../UI/Icons';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function TasbeehModal({ props }) {
  const {
    showTasbeehModal, setShowTasbeehModal,
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
    
        <div id="tasbeeh-modal-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <button
              onClick={() => {
                setShowTasbeehModal(false);
                if (isListening) toggleVoiceTasbeeh();
              }}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* المسبحة الصوتية */}
            {speechSupported && (
              <button
                onClick={toggleVoiceTasbeeh}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition flex items-center justify-center ${isListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse border border-red-200 dark:border-red-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700'}`}
                title="المسبحة الصوتية (تحدث ليتم العد تلقائياً)"
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            )}

            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-2 mt-4 ${(colorMap[themeColors.free] || colorMap.orange).icon}`}>
              <TasbeehIcon className="w-7 h-7" />
              المسبحة الحرة
            </h3>

            {/* زر خفي للمسبحة الصوتية لاستدعاء الدالة */}
            <button id="hidden-tasbeeh-btn" onClick={handleTasbeehClick} className="hidden"></button>

            {/* زر العداد الضخم مع تأثير النبض */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${(colorMap[themeColors.free] || colorMap.orange).header.replace('bg-', 'bg-')}`}></div>
              <button
                onClick={handleTasbeehClick}
                className={`relative z-10 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br ${(colorMap[themeColors.free] || colorMap.orange).taarBtn} rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-white text-5xl md:text-6xl font-extrabold active:scale-95 transition-all border-4 border-white/20 overflow-hidden group`}
              >
                <span className="relative z-10 group-active:scale-110 transition-transform">{tasbeehCount}</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <button
              onClick={resetTasbeeh}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              تصفير المسبحة
            </button>

            {/* التحدي اليومي للتسبيح */}
            <div className="w-full mt-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-600 w-full max-w-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">التحدي اليومي</span>
                <span className={`text-sm font-bold ${(colorMap[themeColors.free] || colorMap.orange).icon}`}>{todayTasbeehs} / {dailyTasbeehGoal}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className={`${(colorMap[themeColors.free] || colorMap.orange).header} h-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, (todayTasbeehs / dailyTasbeehGoal) * 100)}%` }}
                ></div>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-slate-500 w-16">تعديل الهدف</span>
                <input
                  type="number"
                  value={dailyTasbeehGoal}
                  onChange={(e) => setDailyTasbeehGoal(Math.max(1, parseInt(e.target.value) || 1000))}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200"
                  placeholder="الهدف"
                />
              </div>
            </div>

          </div>
        </div>
      
  );
}
