import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2 } from 'lucide-react';
import { colorMap, defaultThemeColors } from '../../utils/theme';

export function DevModal({ props }) {
  const {
    showDevModal, setShowDevModal,
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
    
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-200">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 border-2 border-green-500 text-green-400 font-mono">
            <h3 className="text-xl font-bold mb-6 text-center border-b border-green-800 pb-2 flex items-center justify-center gap-2">
              <Settings className="w-5 h-5 animate-spin" />
              Developer Override
            </h3>

            <div className="space-y-4 mb-6">
              {[
                { key: 'streak', label: 'Current Streak' },
                { key: 'bestStreak', label: 'Best Streak' },
                { key: 'totalAdhkarRead', label: 'Total Adhkar' },
                { key: 'totalTasbeehsMade', label: 'Total Tasbeeh' }
              ].map(field => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-xs uppercase">{field.label}:</label>
                  <input
                    type="number"
                    value={devData[field.key]}
                    onChange={e => setDevData({ ...devData, [field.key]: parseInt(e.target.value) || 0 })}
                    className="bg-black border border-green-700 text-green-300 p-2 rounded focus:outline-none focus:border-green-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStreak(devData.streak);
                  setBestStreak(devData.bestStreak);
                  setTotalAdhkarRead(devData.totalAdhkarRead);
                  setTotalTasbeehsMade(devData.totalTasbeehsMade);

                  localStorage.setItem('streakCount', devData.streak);
                  localStorage.setItem('bestStreak', devData.bestStreak);
                  localStorage.setItem('totalAdhkarRead', devData.totalAdhkarRead);
                  localStorage.setItem('totalTasbeehsMade', devData.totalTasbeehsMade);

                  setShowDevModal(false);
                }}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded transition"
              >
                SAVE DATA
              </button>
              <button
                onClick={() => setShowDevModal(false)}
                className="px-4 border border-green-700 text-green-500 hover:bg-green-900/50 py-2 rounded transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      
  );
}
