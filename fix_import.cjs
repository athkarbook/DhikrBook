const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAppLogic.jsx', 'utf8');
if (!content.includes("import { usePrayerTimes }")) {
  content = "import { usePrayerTimes } from './usePrayerTimes';\n" + content;
  fs.writeFileSync('src/hooks/useAppLogic.jsx', content, 'utf8');
  console.log('Fixed usePrayerTimes import');
}
