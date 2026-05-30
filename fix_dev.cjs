const fs = require('fs');
const normalize = str => str.replace(/\r\n/g, '\n');

// 1. Update useAppLogic.jsx
let useAppLogicContent = fs.readFileSync('src/hooks/useAppLogic.jsx', 'utf8');
const targetStr = `    bestStreak, streak, totalTasbeehsMade, totalAdhkarRead, roadmapDays,`;
const replacementStr = `    bestStreak, setBestStreak, streak, setStreak, totalTasbeehsMade, setTotalTasbeehsMade, totalAdhkarRead, setTotalAdhkarRead, roadmapDays,`;

if (normalize(useAppLogicContent).includes(targetStr)) {
    useAppLogicContent = normalize(useAppLogicContent).replace(targetStr, replacementStr);
    fs.writeFileSync('src/hooks/useAppLogic.jsx', useAppLogicContent, 'utf8');
    console.log("Added setters to useAppLogic.jsx");
}

// 2. Update DevModal.jsx
let devContent = fs.readFileSync('src/components/Modals/DevModal.jsx', 'utf8');
if (!devContent.includes("setStreak")) {
    devContent = normalize(devContent).replace(
        "    devData, setDevData",
        "    devData, setDevData,\n    setStreak, setBestStreak, setTotalAdhkarRead, setTotalTasbeehsMade"
    );
    fs.writeFileSync('src/components/Modals/DevModal.jsx', devContent, 'utf8');
    console.log("Fixed DevModal.jsx");
}
