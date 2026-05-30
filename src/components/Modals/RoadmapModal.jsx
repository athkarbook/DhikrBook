import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2 } from 'lucide-react';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function RoadmapModal({ props }) {
  const {
    showRoadmapModal, setShowRoadmapModal,
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
    
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in-95 duration-300">
          <div className="bg-[#0f172a] rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative border-2 border-indigo-500/50 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button
              onClick={() => setShowRoadmapModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8 pt-2">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-2xl mb-4 text-indigo-400">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">رحلة الـ 40 يوماً</h3>
              <p className="text-slate-400 text-sm">أكمل مسيرتك اليومية لتصل إلى الكنز!</p>
            </div>

            <div className="flex flex-col gap-3 relative px-1">
              {roadmapDays.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-between relative z-10">
                  {row.map((day) => {
                    const isCompleted = day <= bestStreak;
                    const isCurrent = day === bestStreak + 1;

                    let bgClass = "bg-slate-800 border-slate-700 text-slate-500";
                    if (isCompleted) bgClass = "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]";
                    if (isCurrent) bgClass = "bg-amber-400 border-amber-300 text-amber-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse scale-110 z-20";

                    return (
                      <div
                        key={day}
                        className={`w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border-2 font-black text-sm md:text-lg transition-all duration-500 ${bgClass}`}
                      >
                        {day === 40 ? <Trophy className={`w-5 h-5 md:w-6 md:h-6 ${isCompleted ? "text-yellow-200" : "text-slate-500"}`} /> : day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-white font-bold mb-1">تقدمك الحالي: {bestStreak} / 40</p>
              {bestStreak >= 40 ? (
                <p className="text-amber-400 text-sm font-bold">🎉 مبروك! لقد أتممت التحدي العظيم!</p>
              ) : (
                <p className="text-slate-400 text-xs">حافظ على وردك اليومي لتتقدم في الخريطة.</p>
              )}
            </div>
          </div>
        </div>
      
  );
}
