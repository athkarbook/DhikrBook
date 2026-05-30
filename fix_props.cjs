const fs = require('fs');

let useAppLogicContent = fs.readFileSync('src/hooks/useAppLogic.jsx', 'utf8');

const targetStr = `    tasbeehCount, setTasbeehCount, resetTasbeeh, handleTasbeehClick, dailyTasbeehGoal, todayTasbeehs,
    bestStreak, streak, totalTasbeehsMade, totalAdhkarRead, roadmapDays,
    badges, exportStatsAsImage, exportStoryAsImage, isExporting,
    devData, setDevData,
    currentTabTheme, activeTab, setActiveTab, getTabClass, totalProgressPercentage,
    speechSupported, toggleVoiceTasbeeh, isListening, currentLevel,
    currentTabAdhkar, showConfetti, setShowConfetti, isInteracting, setIsInteracting,
    shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect`;

const replacementStr = `    tasbeehCount, setTasbeehCount, resetTasbeeh, handleTasbeehClick, dailyTasbeehGoal, setDailyTasbeehGoal, todayTasbeehs,
    bestStreak, streak, totalTasbeehsMade, totalAdhkarRead, roadmapDays,
    badges, exportStatsAsImage, exportStoryAsImage, isExporting,
    devData, setDevData, devClickCount, setDevClickCount,
    currentTabTheme, activeTab, setActiveTab, getTabClass, totalProgressPercentage,
    speechSupported, toggleVoiceTasbeeh, isListening, currentLevel,
    currentTabAdhkar, showConfetti, setShowConfetti, isInteracting, setIsInteracting,
    shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect,
    userXP, minXP, maxXP, levelColor, levelBg, levelProgressPercent,
    chartFilter, setChartFilter, graphDays, maxActivity, moodLog`;

// normalize newlines for replace
const normalize = str => str.replace(/\r\n/g, '\n');

if (normalize(useAppLogicContent).includes(normalize(targetStr))) {
    useAppLogicContent = normalize(useAppLogicContent).replace(normalize(targetStr), replacementStr);
    fs.writeFileSync('src/hooks/useAppLogic.jsx', useAppLogicContent, 'utf8');
    console.log("Fixed useAppLogic.jsx");
} else {
    console.log("Could not find target string in useAppLogic.jsx!");
}

let tasbeehContent = fs.readFileSync('src/components/Modals/TasbeehModal.jsx', 'utf8');
if (!tasbeehContent.includes("setDailyTasbeehGoal")) {
    tasbeehContent = normalize(tasbeehContent).replace(
        "    devData, setDevData",
        "    devData, setDevData,\n    speechSupported, toggleVoiceTasbeeh, isListening, setDailyTasbeehGoal"
    );
    fs.writeFileSync('src/components/Modals/TasbeehModal.jsx', tasbeehContent, 'utf8');
    console.log("Fixed TasbeehModal.jsx");
}

let statsContent = fs.readFileSync('src/components/Modals/StatsModal.jsx', 'utf8');
if (!statsContent.includes("devClickCount")) {
    statsContent = normalize(statsContent).replace(
        "    devData, setDevData",
        "    devData, setDevData,\n    devClickCount, setDevClickCount, setShowDevModal,\n    levelColor, currentLevel, userXP, levelBg, levelProgressPercent, minXP, maxXP,\n    setShowRoadmapModal, setChartFilter, chartFilter, graphDays, maxActivity, moodLog, exportStoryAsImage"
    );
    fs.writeFileSync('src/components/Modals/StatsModal.jsx', statsContent, 'utf8');
    console.log("Fixed StatsModal.jsx");
}

let settingsContent = fs.readFileSync('src/components/Modals/SettingsModal.jsx', 'utf8');
if (!settingsContent.includes("activeTab")) {
    settingsContent = normalize(settingsContent).replace(
        "    devData, setDevData",
        "    devData, setDevData,\n    activeTab, getTabClass, getTabLabel"
    );
    fs.writeFileSync('src/components/Modals/SettingsModal.jsx', settingsContent, 'utf8');
    console.log("Fixed SettingsModal.jsx (guessed)");
}

