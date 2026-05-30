const fs = require('fs');

// 1. Fix App.jsx taarAdhkar filter category
let appContent = fs.readFileSync('src/App.jsx', 'utf8');
appContent = appContent.replace(
  "d.category === 'أذكار التعار من الليل'",
  "d.category === 'الذكر الوارد إذا تعار من الليل (التقلب والانتباه)'"
);
fs.writeFileSync('src/App.jsx', appContent, 'utf8');

// 2. Fix TasbeehModal.jsx missing import
let tasbeehContent = fs.readFileSync('src/components/Modals/TasbeehModal.jsx', 'utf8');
if (!tasbeehContent.includes("import { TasbeehIcon }")) {
  tasbeehContent = tasbeehContent.replace(
    "import { colorMap",
    "import { TasbeehIcon } from '../UI/Icons';\nimport { colorMap"
  );
  fs.writeFileSync('src/components/Modals/TasbeehModal.jsx', tasbeehContent, 'utf8');
}

// 3. Fix StatsModal.jsx missing import
let statsContent = fs.readFileSync('src/components/Modals/StatsModal.jsx', 'utf8');
if (!statsContent.includes("import { TasbeehIcon }")) {
  statsContent = statsContent.replace(
    "import { colorMap",
    "import { TasbeehIcon } from '../UI/Icons';\nimport { colorMap"
  );
  fs.writeFileSync('src/components/Modals/StatsModal.jsx', statsContent, 'utf8');
}

console.log("Fixed App, TasbeehModal, StatsModal");
