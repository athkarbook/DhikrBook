const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// The strategy is to find blocks starting with `{show...Modal && (` and ending with `)}`
// and extract them into separate files.

function extractModal(modalStateVar, componentName) {
  const startStr = `{${modalStateVar} && (`;
  let startIndex = content.indexOf(startStr);
  if (startIndex === -1) {
    // maybe there's a comment before it?
    startIndex = content.indexOf(`{${modalStateVar} &&`);
    if (startIndex === -1) return false;
  }

  // Find the matching closing bracket for the Modal condition
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let endIndex = -1;

  for (let i = startIndex + 1; i < content.length; i++) {
    const char = content[i];
    
    if (escape) {
      escape = false;
      continue;
    }
    
    if (char === '\\') {
      escape = true;
      continue;
    }
    
    if (!inString && (char === "'" || char === '"' || char === '`')) {
      inString = true;
      stringChar = char;
      continue;
    }
    
    if (inString && char === stringChar) {
      inString = false;
      continue;
    }
    
    if (!inString) {
      if (char === '{') bracketCount++;
      else if (char === '}') {
        bracketCount--;
        if (bracketCount === -1) { // Found closing `}` for `{showModal && ...}`
          endIndex = i + 1;
          break;
        }
      }
    }
  }

  if (endIndex !== -1) {
    const modalContent = content.substring(startIndex, endIndex);
    
    // We replace the `{showModal && (...)}` with `{showModal && <ComponentName {...props} />}`
    const replacement = `{${modalStateVar} && <${componentName} props={props} />}`;
    content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
    
    const componentCode = `import React from 'react';
import { X, Trophy, Crown, Star, Flame, Award, Target, Sunrise, Sunset, Moon, Edit3, RotateCcw, Trash2, Settings, Volume2, VolumeX, Vibrate, VibrateOff, Clock, Map, RefreshCw, Bell, BellRing, Palette, Type, Plus, Minus, Share2 } from 'lucide-react';
import { colorMap, defaultThemeColors } from '../utils/theme';

export function ${componentName}({ props }) {
  const {
    ${modalStateVar}, set${modalStateVar.substring(0,1).toUpperCase() + modalStateVar.substring(1)},
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
    ${modalContent.substring(modalContent.indexOf('(') + 1, modalContent.lastIndexOf(')'))}
  );
}
`;
    
    if (!fs.existsSync('src/components/Modals')) {
        if (!fs.existsSync('src/components')) fs.mkdirSync('src/components');
        fs.mkdirSync('src/components/Modals');
    }
    fs.writeFileSync(`src/components/Modals/${componentName}.jsx`, componentCode, 'utf8');
    
    // Add import to App.jsx
    content = content.replace("import React", `import { ${componentName} } from './components/Modals/${componentName}';\nimport React`);
    
    return true;
  }
  return false;
}

const extractedSettings = extractModal('showSettingsModal', 'SettingsModal');
const extractedTasbeeh = extractModal('showTasbeehModal', 'TasbeehModal');
const extractedStats = extractModal('showStatsModal', 'StatsModal');
const extractedRoadmap = extractModal('showRoadmapModal', 'RoadmapModal');
const extractedDev = extractModal('showDevModal', 'DevModal');
const extractedFree = extractModal('showFreeAdhkarModal', 'FreeAdhkarModal');

if (extractedSettings || extractedTasbeeh || extractedStats || extractedRoadmap || extractedDev || extractedFree) {
   // Add the props bundle object to App.jsx
   const propsBundle = `
  const props = {
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
  };
`;
   const returnIndex = content.indexOf('return (');
   content = content.substring(0, returnIndex) + propsBundle + content.substring(returnIndex);
   fs.writeFileSync('src/App.jsx', content, 'utf8');
   console.log('Successfully extracted modals');
}
