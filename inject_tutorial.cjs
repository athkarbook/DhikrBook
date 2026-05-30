const fs = require('fs');

let app = fs.readFileSync('src/App.jsx', 'utf8');

// 1. Add import
app = app.replace(
  "import { SplashScreen } from './components/UI/SplashScreen';",
  "import { SplashScreen } from './components/UI/SplashScreen';\nimport { TutorialModal } from './components/Modals/TutorialModal';"
);

// 2. Add React useEffect and state
app = app.replace(
  "const [showSplash, setShowSplash] = useState(true);",
  `const [showSplash, setShowSplash] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  React.useEffect(() => {
    if (!localStorage.getItem('tutorialSeen_v2')) {
      // Delay showing tutorial slightly after splash
      setTimeout(() => setShowTutorial(true), 3500);
    }
  }, []);

  const closeTutorial = () => {
    localStorage.setItem('tutorialSeen_v2', 'true');
    setShowTutorial(false);
  };`
);

// 3. Render Modal
app = app.replace(
  "{showSettingsModal && <SettingsModal props={props} />}",
  `{showSettingsModal && <SettingsModal props={props} />}
        {showTutorial && <TutorialModal props={props} onClose={closeTutorial} />}`
);

fs.writeFileSync('src/App.jsx', app, 'utf8');
console.log("Injected TutorialModal into App.jsx");
