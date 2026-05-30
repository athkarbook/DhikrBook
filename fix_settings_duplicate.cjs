const fs = require('fs');
let settingsContent = fs.readFileSync('src/components/Modals/SettingsModal.jsx', 'utf8');
settingsContent = settingsContent.replace("activeTab, getTabClass, getTabLabel", "activeTab, getTabClass");
fs.writeFileSync('src/components/Modals/SettingsModal.jsx', settingsContent, 'utf8');
console.log("Fixed SettingsModal duplicate getTabLabel");
