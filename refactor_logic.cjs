const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

const appComponentStart = appContent.indexOf('export default function App() {');
const returnStartRegex = /return \(\s*<div dir="rtl"/;
const returnMatch = appContent.match(returnStartRegex);

if (appComponentStart !== -1 && returnMatch) {
    const returnStart = returnMatch.index;
    const propsMatch = appContent.lastIndexOf('const props = {', returnStart);

    let logicContent = appContent.substring(appComponentStart + 'export default function App() {'.length, propsMatch);
    
    // We also need to extract `TasbeehIcon`, `fontSizes`, `globalStyles` or keep them in App.jsx. Let's keep them in App.jsx.

    const hookCode = `import { useState, useEffect, useMemo, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { adhkarData, prayerAdhkar } from '../data/adhkar';
import { colorMap, defaultThemeColors } from '../utils/theme';
import html2canvas from 'html2canvas';

export function useAppLogic() {
${logicContent}

  return {
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
  };
}
`;
    
    if (!fs.existsSync('src/hooks')) fs.mkdirSync('src/hooks');
    fs.writeFileSync('src/hooks/useAppLogic.js', hookCode, 'utf8');
    
    // Now replace logic in App.jsx
    const newAppBody = `
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
`;
    
    let newAppContent = appContent.substring(0, appComponentStart + 'export default function App() {\n'.length) + newAppBody + appContent.substring(returnStart);
    
    newAppContent = "import { useAppLogic } from './hooks/useAppLogic';\n" + newAppContent;
    
    fs.writeFileSync('src/App.jsx', newAppContent, 'utf8');
    console.log('Success extracting logic to useAppLogic');
} else {
    console.log('Regex match failed');
}
