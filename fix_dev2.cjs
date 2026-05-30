const fs = require('fs');

let devContent = fs.readFileSync('src/components/Modals/DevModal.jsx', 'utf8');
devContent = devContent.replace(
    /devData,\s*setDevData/,
    "devData, setDevData, setStreak, setBestStreak, setTotalAdhkarRead, setTotalTasbeehsMade"
);
fs.writeFileSync('src/components/Modals/DevModal.jsx', devContent, 'utf8');
console.log("Fixed DevModal.jsx");
