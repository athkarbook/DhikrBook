const fs = require('fs');

const normalize = str => str.replace(/\r\n/g, '\n');

let tasbeehContent = fs.readFileSync('src/components/Modals/TasbeehModal.jsx', 'utf8');
tasbeehContent = normalize(tasbeehContent).replace(
    /devData,\s*setDevData/,
    "devData, setDevData,\n    speechSupported, toggleVoiceTasbeeh, isListening, setDailyTasbeehGoal"
);
fs.writeFileSync('src/components/Modals/TasbeehModal.jsx', tasbeehContent, 'utf8');
console.log("Fixed TasbeehModal.jsx");

let statsContent = fs.readFileSync('src/components/Modals/StatsModal.jsx', 'utf8');
statsContent = normalize(statsContent).replace(
    /devData,\s*setDevData/,
    "devData, setDevData,\n    devClickCount, setDevClickCount, setShowDevModal,\n    levelColor, currentLevel, userXP, levelBg, levelProgressPercent, minXP, maxXP,\n    setShowRoadmapModal, setChartFilter, chartFilter, graphDays, maxActivity, moodLog, exportStoryAsImage"
);
fs.writeFileSync('src/components/Modals/StatsModal.jsx', statsContent, 'utf8');
console.log("Fixed StatsModal.jsx");

