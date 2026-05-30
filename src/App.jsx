import { adhkarData, prayerAdhkar } from './data/adhkar';
import { colorMap, defaultThemeColors } from './utils/theme';
import { LiveBackground } from './components/LiveBackground';
import React, { useState, useEffect, useMemo, useRef, Suspense, lazy } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Sun, Moon, Settings, Info, BookOpen, CheckCircle, RotateCcw, Clock, Star, X, Plus, Minus, Type, Flame, Volume2, VolumeX, Vibrate, VibrateOff, Target, Sunrise, Sunset, MoonStar, ChevronDown, ChevronUp, Palette, Fingerprint, BarChart2, Edit3, Trash2, Award, Trophy, Bell, BellRing, Shield, Crown, RefreshCw, Share2, Map, Mic, MicOff, Leaf, Heart } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

const Garden3D = lazy(() => import('./Garden3D'));

// مكون أيقونة المسبحة الإسلامية المخصصة والجميلة
const TasbeehIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {/* خرزات دائرية مرتبة بشكل مسبحة دائري */}
    <circle cx="12" cy="4" r="1.5" />
    <circle cx="16.5" cy="5.5" r="1.5" />
    <circle cx="19.5" cy="9.5" r="1.5" />
    <circle cx="19.5" cy="14.5" r="1.5" />
    <circle cx="16.5" cy="18.5" r="1.5" />
    <circle cx="12" cy="20" r="1.5" />
    <circle cx="7.5" cy="18.5" r="1.5" />
    <circle cx="4.5" cy="14.5" r="1.5" />
    <circle cx="4.5" cy="9.5" r="1.5" />
    <circle cx="7.5" cy="5.5" r="1.5" />
    {/* الشاهد والشرابة في الأسفل */}
    <line x1="12" y1="20" x2="12" y2="22" strokeWidth="2.5" />
    <path d="M10 22 C 10 24, 14 24, 14 22 Z" fill="currentColor" />
  </svg>
);

// مكون العناصر السماوية (شمس، نجوم، غيوم)
// --- البيانات المستخرجة حصرياً من ملف د. مطلق الجاسر ---




// أحجام الخطوط المتاحة للمتن
const fontSizes = [
  'text-lg md:text-xl',
  'text-xl md:text-2xl',
  'text-2xl md:text-3xl',  // الافتراضي (المنتصف)
  'text-3xl md:text-4xl',
  'text-4xl md:text-5xl'
];

// تعريف الـ Styles خارج المكون يمنع وميض الشاشة ويحافظ على استقرار الخطوط
const globalStyles = {
  __html: `
    .font-cairo { font-family: 'Cairo', sans-serif; }
    .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-hover:hover { transform: translateY(-2px); }
    body { -webkit-tap-highlight-color: transparent; scroll-behavior: smooth; }
    
    @keyframes confettiFall {
      0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
      100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
    }
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    .ripple-effect {
      position: absolute; border-radius: 50%; transform: scale(0);
      animation: ripple 600ms linear; background-color: rgba(255, 255, 255, 0.4);
    }
    .confetti {
      position: fixed;
      top: -10vh;
      z-index: 9999;
      animation: confettiFall 4s linear forwards;
    }
  `
};

export default function App() {
  // -- نظام التحديثات (PWA Update) --
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // فحص وجود تحديثات كل ساعة
      r && setInterval(() => { r.update() }, 60 * 60 * 1000);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved !== null ? saved === 'true' : true; // الافتراضي ليلي
  });
  const [activeTab, setActiveTab] = useState('morning');
  const [chartFilter, setChartFilter] = useState('7');
  const [showTakhreej, setShowTakhreej] = useState(true);
  const [showFadl, setShowFadl] = useState(true);
  const [showFawaid, setShowFawaid] = useState(true);

  // خلفيات تفاعلية
  const [isInteracting, setIsInteracting] = useState(false);
  const triggerInteraction = () => {
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 300);
  };
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [fontSizeIndex, setFontSizeIndex] = useState(() => {
    const saved = localStorage.getItem('fontSizeIndex');
    return saved !== null ? parseInt(saved) : 2;
  });
  const [progress, setProgress] = useState({});
  const [themeColors, setThemeColors] = useState(() => {
    const saved = localStorage.getItem('themeColors');
    if (saved !== null) {
      try {
        return { ...defaultThemeColors, ...JSON.parse(saved) };
      } catch (e) {
        return defaultThemeColors;
      }
    }
    return defaultThemeColors;
  });

  // -- الحالات الجديدة للصوت والاهتزاز والمواظبة والاحتفال والإشعارات --
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [vibrationEnabled, setVibrationEnabled] = useState(() => {
    const saved = localStorage.getItem('vibrationEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [celebrationEnabled, setCelebrationEnabled] = useState(() => {
    const saved = localStorage.getItem('celebrationEnabled');
    return saved !== null ? saved === 'true' : true;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('notificationsEnabled');
    return saved !== null ? saved === 'true' : false;
  });
  const [streak, setStreak] = useState(0);

  // -- الموقع وأوقات الصلاة --
  const [location, setLocation] = useState(() => {
    const saved = localStorage.getItem('userLocation');
    return saved ? JSON.parse(saved) : null;
  });

  const [prayerTimes, setPrayerTimes] = useState(() => {
    const saved = localStorage.getItem('prayerTimes');
    const savedDate = localStorage.getItem('prayerTimesDate');
    if (saved && savedDate === new Date().toDateString()) {
      return JSON.parse(saved);
    }
    return null;
  });

  const testHiddenNotification = async () => {
    if (Notification.permission !== "granted") {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        alert("التنبيهات غير مفعلة في المتصفح!");
        return;
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      if ('showTrigger' in Notification.prototype && 'TimestampTrigger' in window) {
        const triggerTime = Date.now() + 10 * 1000;
        await registration.showNotification("تنبيه تجريبي سري 🤫", {
          body: "التطبيق يعمل بالخلفية بكفاءة! 🚀",
          icon: "/icon-192x192.png",
          vibrate: [200, 100, 200],
          showTrigger: new window.TimestampTrigger(triggerTime)
        });
        alert("✅ تريك مخفية: تم جدولة تنبيه سيظهر بعد 10 ثوانٍ! أغلق التطبيق وتوجه للشاشة الرئيسية لتتأكد أنه يعمل بالخلفية.");
      } else {
        registration.showNotification("تنبيه تجريبي مباشر 🤫", {
          body: "متصفحك لا يدعم الجدولة في الخلفية وهو مغلق تماماً، لكن التنبيهات الفورية تعمل!",
          icon: "/icon-192x192.png",
        });
        alert("✅ تريك مخفية: التنبيهات تعمل! (لكن متصفحك يفتقد لخاصية PWA Offline Background Scheduling).");
      }
    } catch (e) {
      alert("حدث خطأ في خدمة التنبيهات: " + e.message);
    }
  };

  const [isLocating, setIsLocating] = useState(false);

  const calculatePrayerTimesLocally = (lat, lng) => {
    const coordinates = new Coordinates(lat, lng);
    // التوقيت المصري معتمد بشكل واسع لبلاد الشام وفلسطين في حال عدم وجود توقيت محلي مخصص
    const params = CalculationMethod.Egyptian();
    const date = new Date();
    const times = new PrayerTimes(coordinates, date, params);

    const formatTime = (dateObj) => {
      return dateObj.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    };

    return {
      Fajr: formatTime(times.fajr),
      Dhuhr: formatTime(times.dhuhr),
      Asr: formatTime(times.asr),
      Maghrib: formatTime(times.maghrib),
      Isha: formatTime(times.isha)
    };
  };

  const autoFetchLocation = async (manualCity = null, manualCountry = null) => {
    setIsLocating(true);

    if (manualCity && manualCountry) {
      try {
        const query = `${manualCity}, ${manualCountry}`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`);
        const data = await res.json();

        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lng = parseFloat(data[0].lon);
          const times = calculatePrayerTimesLocally(lat, lng);
          const loc = { city: manualCity, country: manualCountry, lat, lng };

          setPrayerTimes(times);
          setLocation(loc);
          localStorage.setItem('userLocation', JSON.stringify(loc));
          localStorage.setItem('prayerTimes', JSON.stringify(times));
          localStorage.setItem('prayerTimesDate', new Date().toDateString());
        } else {
          alert('لم نتمكن من العثور على أوقات الصلاة لهذه المدينة. تأكد من التهجئة (مثال: Amman).');
        }
      } catch (e) {
        alert('حدث خطأ في الاتصال بخادم الخرائط. يرجى التأكد من اتصالك بالإنترنت.');
      } finally {
        setIsLocating(false);
      }
      return;
    }

    if (!navigator.geolocation) {
      alert('عذراً، متصفحك لا يدعم تحديد الموقع.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const times = calculatePrayerTimesLocally(lat, lng);
        const loc = { lat, lng };

        setPrayerTimes(times);
        setLocation(loc);
        localStorage.setItem('userLocation', JSON.stringify(loc));
        localStorage.setItem('prayerTimes', JSON.stringify(times));
        localStorage.setItem('prayerTimesDate', new Date().toDateString());
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('يرجى السماح للتطبيق بالوصول إلى الموقع (GPS) من إعدادات المتصفح لنتمكن من تحديد أوقات الصلاة بدقة.');
        } else {
          alert('لم نتمكن من تحديد موقعك. يرجى التأكد من تفعيل خدمة الموقع (GPS) في هاتفك.');
        }
      },
      { timeout: 15000, enableHighAccuracy: false }
    );
  };

  const notifsEnabledRef = useRef(notificationsEnabled);
  useEffect(() => {
    notifsEnabledRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  useEffect(() => {
    if (location && !prayerTimes) {
      if (location.lat && location.lng) {
        const times = calculatePrayerTimesLocally(location.lat, location.lng);
        setPrayerTimes(times);
        localStorage.setItem('prayerTimes', JSON.stringify(times));
        localStorage.setItem('prayerTimesDate', new Date().toDateString());
      }
    }
  }, [location, prayerTimes]);

  useEffect(() => {
    if (!prayerTimes) return;

    // اقتراح التبويب بناءً على الوقت الحالي وأوقات الصلاة
    const now = new Date();
    const h = now.getHours();
    const currentMins = h * 60 + now.getMinutes();

    const parseTime = (t) => {
      if (!t) return 0;
      const [hours, mins] = t.split(':').map(Number);
      return hours * 60 + mins;
    };

    const fajr = parseTime(prayerTimes.Fajr);
    const sunrise = parseTime(prayerTimes.Sunrise);
    const dhuhr = parseTime(prayerTimes.Dhuhr);
    const asr = parseTime(prayerTimes.Asr);
    const maghrib = parseTime(prayerTimes.Maghrib);
    const isha = parseTime(prayerTimes.Isha);

    let suggestedTab = 'morning';

    if (currentMins >= fajr - 60 && currentMins < fajr) suggestedTab = 'wake';
    else if (currentMins >= fajr && currentMins < sunrise + 120) suggestedTab = 'morning';
    else if (currentMins >= asr && currentMins < maghrib + 60) suggestedTab = 'evening';
    else if (
      (currentMins >= fajr && currentMins <= fajr + 30) ||
      (currentMins >= dhuhr && currentMins <= dhuhr + 30) ||
      (currentMins >= asr && currentMins <= asr + 30) ||
      (currentMins >= maghrib && currentMins <= maghrib + 30) ||
      (currentMins >= isha && currentMins <= isha + 30)
    ) {
      suggestedTab = 'prayer';
    }
    else if (currentMins >= isha + 120 || currentMins < fajr - 60) suggestedTab = 'sleep';

    setActiveTab(suggestedTab);

    // فحص التنبيهات كل ثانية لمطابقة أوقات الصلاة
    const intervalId = setInterval(() => {
      const nowTime = new Date();
      const timeStr = `${nowTime.getHours().toString().padStart(2, '0')}:${nowTime.getMinutes().toString().padStart(2, '0')}`;

      const prayers = [
        { name: 'الفجر', time: prayerTimes.Fajr },
        { name: 'الظهر', time: prayerTimes.Dhuhr },
        { name: 'العصر', time: prayerTimes.Asr },
        { name: 'المغرب', time: prayerTimes.Maghrib },
        { name: 'العشاء', time: prayerTimes.Isha }
      ];

      for (const p of prayers) {
        if (p.time && p.time === timeStr && nowTime.getSeconds() === 0) {
          // حان وقت الصلاة!
          if (notifsEnabledRef.current && Notification.permission === 'granted') {
            new Notification(`حان الآن موعد صلاة ${p.name}`, {
              body: 'لا تنس أذكار ما بعد الصلاة!',
              icon: '/dhikr-book/pwa-192x192.png'
            });
          }
          // التحويل التلقائي لتبويب أذكار الصلاة
          setActiveTab('prayer');
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [prayerTimes]);

  // -- جدولة التنبيهات في الخلفية للمتصفحات المدعومة (بدون الحاجة لفتح المتصفح) --
  useEffect(() => {
    if (!prayerTimes || !notificationsEnabled) return;

    const scheduleOfflineNotifications = async () => {
      // فحص دعم الميزة التجريبية (تعمل غالباً على أندرويد/كروم)
      if (!('showTrigger' in Notification.prototype) || !('TimestampTrigger' in window)) return;
      if (Notification.permission !== 'granted') return;

      try {
        const registration = await navigator.serviceWorker.ready;
        const now = new Date();

        const prayers = [
          { name: 'الفجر', time: prayerTimes.Fajr },
          { name: 'الظهر', time: prayerTimes.Dhuhr },
          { name: 'العصر', time: prayerTimes.Asr },
          { name: 'المغرب', time: prayerTimes.Maghrib },
          { name: 'العشاء', time: prayerTimes.Isha }
        ];

        for (const p of prayers) {
          if (!p.time) continue;
          const [hours, mins] = p.time.split(':').map(Number);
          const prayerTime = new Date();
          prayerTime.setHours(hours, mins, 0, 0);

          // جدولة الإشعارات للمستقبل اليوم فقط
          if (prayerTime.getTime() > now.getTime()) {
            registration.showNotification(`حان الآن موعد صلاة ${p.name}`, {
              body: 'لا تنس أذكار ما بعد الصلاة!',
              icon: '/dhikr-book/pwa-192x192.png',
              tag: `prayer-${p.name}-${prayerTime.getDate()}`,
              showTrigger: new window.TimestampTrigger(prayerTime.getTime())
            });
          }
        }
      } catch (e) {
        console.log('Error scheduling offline notifications:', e);
      }
    };

    scheduleOfflineNotifications();
  }, [prayerTimes, notificationsEnabled]);

  // -- القائمة السرية للمطور (لاستعادة البيانات) --
  const [devClickCount, setDevClickCount] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);
  const [devData, setDevData] = useState({ streak: 0, bestStreak: 0, totalAdhkarRead: 0, totalTasbeehsMade: 0 });

  // -- حالة الاحتفال (Confetti) --
  const [showConfetti, setShowConfetti] = useState(false);

  // -- المسبحة الحرة --
  const [showTasbeehModal, setShowTasbeehModal] = useState(false);
  const [tasbeehCount, setTasbeehCount] = useState(0);

  // -- الإحصاءات والأذكار الحرة --
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [totalAdhkarRead, setTotalAdhkarRead] = useState(0);
  const [totalTasbeehsMade, setTotalTasbeehsMade] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // -- نظام التحدي اليومي للتسبيح --
  const [todayTasbeehs, setTodayTasbeehs] = useState(0);
  const [dailyTasbeehGoal, setDailyTasbeehGoal] = useState(1000);

  // -- تصدير الصورة --
  const [isExporting, setIsExporting] = useState(false);

  // -- حساب نقاط النور (XP) والمستوى (RPG Leveling) --
  const [activityHistory, setActivityHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('activityHistory')) || {};
      // تحويل البيانات القديمة (أرقام أو نصوص) إلى كائنات
      for (const date in saved) {
        if (typeof saved[date] !== 'object' || saved[date] === null) {
          saved[date] = { tasbeeh: Number(saved[date]) || 0 };
        }
      }
      return saved;
    } catch (e) {
      return {};
    }
  });

  const recordActivity = (type, amount = 1) => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dayNum = String(d.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${dayNum}`;

    setActivityHistory(prev => {
      const todayData = prev[todayStr] || {};
      const updatedData = { ...todayData, [type]: (Number(todayData[type]) || 0) + amount };
      const updated = { ...prev, [todayStr]: updatedData };
      localStorage.setItem('activityHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const userXP = (totalTasbeehsMade * 1) + (totalAdhkarRead * 2) + (bestStreak * 50);

  const getLevelInfo = (xp) => {
    if (xp < 500) return { title: 'مبتدئ', minXP: 0, maxXP: 500, color: 'text-slate-400', bg: 'bg-slate-400' };
    if (xp < 2000) return { title: 'طالب علم', minXP: 500, maxXP: 2000, color: 'text-emerald-500', bg: 'bg-emerald-500' };
    if (xp < 5000) return { title: 'ذاكر', minXP: 2000, maxXP: 5000, color: 'text-blue-500', bg: 'bg-blue-500' };
    if (xp < 10000) return { title: 'أواب', minXP: 5000, maxXP: 10000, color: 'text-purple-500', bg: 'bg-purple-500' };
    if (xp < 25000) return { title: 'خاشع', minXP: 10000, maxXP: 25000, color: 'text-rose-500', bg: 'bg-rose-500' };
    return { title: 'نبراس', minXP: 25000, maxXP: 100000, color: 'text-amber-500', bg: 'bg-amber-500' };
  };

  const { title: currentLevel, minXP, maxXP, color: levelColor, bg: levelBg } = getLevelInfo(userXP);
  const levelProgressPercent = Math.min(100, ((userXP - minXP) / (maxXP - minXP)) * 100);

  const [customAdhkar, setCustomAdhkar] = useState([]);
  const [newCustomText, setNewCustomText] = useState('');
  const [newCustomTarget, setNewCustomTarget] = useState(1);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [showFreeAdhkarModal, setShowFreeAdhkarModal] = useState(false);

  // -- حالة إظهار قسم التعار --
  const [showTaarSection, setShowTaarSection] = useState(false);

  // -- التتبع النفسي (Mood Tracker) --
  const [moodLog, setMoodLog] = useState(() => {
    try { return JSON.parse(localStorage.getItem('moodLog')) || {}; } catch (e) { return {}; }
  });

  const [pendingMoods, setPendingMoods] = useState({});

  useEffect(() => {
    localStorage.setItem('moodLog', JSON.stringify(moodLog));
  }, [moodLog]);

  const handleMoodSelect = (mood, type) => {
    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    if (type === 'before') {
      setPendingMoods(prev => ({ ...prev, [activeTab]: mood }));
    } else {
      setMoodLog(prev => {
        const todayData = prev[todayStr] || {};
        const tabData = todayData[activeTab] || {};
        const beforeMood = pendingMoods[activeTab] || 'unknown';
        return {
          ...prev,
          [todayStr]: {
            ...todayData,
            [activeTab]: { ...tabData, before: beforeMood, after: mood }
          }
        };
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  // -- المسبحة الصوتية --
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      setSpeechSupported(true);
    }

    return () => {
      window.isIntentionallyListening = false;
      if (window.recognition) {
        window.recognition.stop();
      }
    };
  }, []);

  const toggleVoiceTasbeeh = () => {
    if (!speechSupported) return;

    if (isListening) {
      window.isIntentionallyListening = false;
      setIsListening(false);
      if (window.recognition) window.recognition.stop();
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.recognition) {
      window.recognition = new SpeechRecognition();
      window.recognition.lang = 'ar-SA';
      window.recognition.continuous = true;
      window.recognition.interimResults = false;

      window.recognition.onstart = () => setIsListening(true);

      window.recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.trim();

        if (transcript.length === 0) return;

        const tasbeehBtn = document.getElementById('hidden-tasbeeh-btn');
        const isTasbeehModalOpen = !!document.getElementById('tasbeeh-modal-container');

        // الكلمات المفتاحية الشائعة للأذكار لتجنب عد الكلام العادي أو الضجيج
        const dhikrKeywords = ['الله', 'سبحان', 'حمد', 'إله', 'اله', 'اكبر', 'أكبر', 'استغفر', 'أستغفر', 'اللهم', 'رب', 'نبي', 'رسول', 'حول', 'قوة', 'بسم', 'أعوذ', 'اعوذ', 'تبارك', 'تعالى', 'عز', 'كريم', 'عظيم'];

        const transcriptWords = transcript.split(' ');
        const containsDhikr = transcriptWords.some(tw =>
          tw.length >= 2 && dhikrKeywords.some(keyword => tw.includes(keyword))
        );

        if (isTasbeehModalOpen) {
          if (containsDhikr || transcript.length > 5) {
            tasbeehBtn?.click();
          }
          return;
        }

        // جميع الأذكار غير المكتملة
        const uncompletedCards = Array.from(document.querySelectorAll('.dhikr-card:not(.completed)'));
        if (uncompletedCards.length === 0) {
          // إذا اكتملت كل الأذكار في الصفحة، اجعلها مسبحة حرة عامة كخيار احتياطي
          if (containsDhikr) tasbeehBtn?.click();
          return;
        }

        // تحديد البطاقة المستهدفة (أول بطاقة ظاهرة أمامه)
        const visibleCards = uncompletedCards.filter(card => {
          const rect = card.getBoundingClientRect();
          return rect.top < window.innerHeight - 100 && rect.bottom > 100;
        });
        const targetCard = visibleCards.length > 0 ? visibleCards[0] : uncompletedCards[0];

        // تهيئة أو استعادة السجل التراكمي للبطاقة الحالية لمنع المسح العشوائي عند التمرير
        window.voiceState = window.voiceState || {};
        if (!window.voiceState[targetCard.id]) {
          window.voiceState[targetCard.id] = [];
        }

        // دالة لتنظيف النصوص العربية (إزالة التشكيل وتوحيد الهمزات والتاء) لتصبح المطابقة دقيقة
        const normalizeArabic = (text) => {
          return text
            .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل
            .replace(/[أإآ]/g, 'ا') // توحيد الألف
            .replace(/ة/g, 'ه') // توحيد التاء المربوطة
            .replace(/ى/g, 'ي') // توحيد الألف المقصورة
            .replace(/[^\u0621-\u064A\s]/g, '') // الإبقاء على الحروف العربية والمسافات فقط
            .trim();
        };

        const spokenWords = normalizeArabic(transcript).split(/\s+/).filter(w => w.length >= 2);
        window.voiceState[targetCard.id].push(...spokenWords);

        // جلب نص الذكر الفعلي (من داخل أول paragraph لتجنب قراءة نصوص التخريج والفوائد)
        const pElem = targetCard.querySelector('p');
        const cardText = pElem ? pElem.innerText : '';
        const cardWords = normalizeArabic(cardText).split(/\s+/).filter(w => w.length >= 2);

        if (cardWords.length === 0) return;

        let shouldIncrement = false;

        // قائمة بالكلمات العامة التي قد تتكرر في أي كلام، نتجاهلها في التطابق الدقيق للأذكار الطويلة
        const stopWords = ['الله', 'اللهم', 'لا', 'الا', 'هو', 'في', 'من', 'على', 'ما', 'وما', 'له', 'ان', 'انا', 'يا', 'ولا', 'الذي', 'التي', 'بين', 'عنده', 'بما', 'هذا', 'هذه', 'كان', 'كنت', 'وان'];

        // إذا كان الذكر قصيراً (مثل: سبحان الله، الحمد لله)
        if (cardWords.length <= 6) {
          // نطلب أن يتطابق نصف كلمات الذكر على الأقل (لتجنب التساهل المفرط باحتساب كلمة واحدة)
          const requiredShort = Math.ceil(cardWords.length * 0.5);
          let matches = 0;
          for (const w of cardWords) {
            // نتحقق من الكلمات المنطوقة مؤخراً فقط
            if (spokenWords.includes(w)) matches++;
          }
          if (matches >= requiredShort) {
            shouldIncrement = true;
          }
        } else {
          // الأذكار الطويلة (مثل آية الكرسي، سيد الاستغفار)
          const uniqueCardWords = [...new Set(cardWords)];
          const uniqueSpoken = [...new Set(window.voiceState[targetCard.id])];

          // تصفية الكلمات العامة
          const specificCardWords = uniqueCardWords.filter(w => !stopWords.includes(w));

          let distinctMatches = 0;
          for (const w of specificCardWords) {
            if (uniqueSpoken.includes(w)) {
              distinctMatches++;
            }
          }

          // الشرط الأول (أكثر صرامة): قراءة 25% من الكلمات المميزة للذكر (أو 3 كلمات كحد أدنى)
          const requiredMatches = Math.max(3, Math.floor(specificCardWords.length * 0.25));

          // الشرط الثاني (صارم جداً للنهاية): يجب أن يلتقط 40% من الكلمات المميزة الموجودة في آخر 30% من الذكر!
          // يجب التأكد أن هذه الكلمات الختامية لم تظهر أبداً في الجزء الأول من الذكر لضمان عدم الخداع!
          const endIndex = Math.floor(cardWords.length * 0.70);
          const startWords = cardWords.slice(0, endIndex);
          const endWords = cardWords.slice(endIndex);

          const specificEndWords = [...new Set(endWords)].filter(w =>
            !stopWords.includes(w) && !startWords.includes(w)
          );

          // نطلب 40% من الكلمات الختامية المميزة (بحد أدنى 1 إن وجدت)
          const requiredEndMatches = specificEndWords.length > 0 ? Math.max(1, Math.ceil(specificEndWords.length * 0.40)) : 0;
          const endMatches = specificEndWords.filter(w => uniqueSpoken.includes(w)).length;

          const hasReachedEnd = specificEndWords.length === 0 || endMatches >= requiredEndMatches;

          if (distinctMatches >= Math.min(requiredMatches, specificCardWords.length) && hasReachedEnd) {
            shouldIncrement = true;
          }
        }

        if (shouldIncrement) {
          const btn = targetCard.querySelector('button.dhikr-increment-btn');
          if (btn) {
            btn.click();
            window.voiceState[targetCard.id] = []; // تصفير الذاكرة لهذا الذكر استعداداً لتكراره

            // تمرير سلس بعد زيادة العداد لتجنب القفز المفاجئ
            setTimeout(() => {
              // بعد 200 مللي ثانية، نتأكد هل اكتمل هذا الذكر أم لا يزال يحتاج تكرار؟
              const isCompletedNow = targetCard.classList.contains('completed');

              let elementToScroll = targetCard;

              if (isCompletedNow) {
                // إذا اكتمل، نبحث عن الذكر الذي يليه (أول ذكر غير مكتمل في الصفحة)
                const nextUncompleted = document.querySelector('.dhikr-card:not(.completed)');
                if (nextUncompleted) {
                  elementToScroll = nextUncompleted;
                }
              }

              const rect = elementToScroll.getBoundingClientRect();
              const isFullyVisible = (rect.top >= 100) && (rect.bottom <= window.innerHeight - 50);

              // إذا لم يكن الذكر المقصود ظاهراً بالكامل، نمرر الشاشة إليه
              if (!isFullyVisible) {
                elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 200);
          }
        }
      };

      window.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          setIsListening(false);
          window.isIntentionallyListening = false;
        }
      };

      window.recognition.onend = () => {
        if (window.isIntentionallyListening) {
          try { window.recognition.start(); } catch (e) { }
        } else {
          setIsListening(false);
        }
      };
    }

    window.isIntentionallyListening = true;
    try {
      window.recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // -- خريطة التحدي --
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const roadmapDays = useMemo(() => {
    const days = [];
    for (let row = 0; row < 8; row++) {
      let rowDays = [];
      for (let col = 0; col < 5; col++) {
        rowDays.push(row * 5 + col + 1);
      }
      if (row % 2 !== 0) rowDays.reverse();
      days.push(rowDays);
    }
    return days;
  }, []);

  // دالة المؤثرات الصوتية
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!window.audioCtx) window.audioCtx = new AudioContext();
      if (window.audioCtx.state === 'suspended') window.audioCtx.resume();

      const now = window.audioCtx.currentTime;

      if (type === 'click') {
        const osc = window.audioCtx.createOscillator();
        const gain = window.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(window.audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);

      } else if (type === 'success') {
        const frequencies = [523.25, 659.25, 783.99];
        frequencies.forEach((freq, index) => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();

          osc.connect(gain);
          gain.connect(window.audioCtx.destination);

          osc.type = 'sine';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, now);
          const attackTime = now + (index * 0.05) + 0.02;
          gain.gain.linearRampToValueAtTime(0.05, attackTime);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

          osc.start(now);
          osc.stop(now + 1.5);
        });
      } else if (type === 'celebration') {
        const popTimes = [0, 0.08, 0.15, 0.2, 0.28, 0.35, 0.4];
        popTimes.forEach(delay => {
          const osc = window.audioCtx.createOscillator();
          const gain = window.audioCtx.createGain();
          osc.connect(gain);
          gain.connect(window.audioCtx.destination);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(400, now + delay);
          osc.frequency.exponentialRampToValueAtTime(100, now + delay + 0.05);

          gain.gain.setValueAtTime(0, now + delay);
          gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.05);

          osc.start(now + delay);
          osc.stop(now + delay + 0.05);
        });
      }
    } catch (e) {
      // تجاهل إذا كان المتصفح لا يدعم
    }
  };

  // دالة تشغيل الاهتزاز المحدثة
  const triggerVibration = (pattern) => {
    if (!vibrationEnabled) return;
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } catch (e) {
      // تجاهل الخطأ لو كان المتصفح لا يدعم الاهتزاز
    }
  };

  // استرجاع البيانات وتحديد الوقت تلقائياً
  useEffect(() => {
    // 1. تحديد الوقت المبدئي (في حال فشل جلب أوقات الصلاة)
    const hour = new Date().getHours();
    let initialPeriod = 'sleep';

    // الخوارزمية القديمة كبديل
    if (hour >= 3 && hour < 6) {
      initialPeriod = 'wake'; // من 3 الفجر إلى 6 صباحاً استيقاظ
    } else if (hour >= 6 && hour < 15) {
      initialPeriod = 'morning'; // من 6 صباحاً إلى 3 عصراً صباح
    } else if (hour >= 15 && hour < 22) {
      initialPeriod = 'evening'; // من 3 عصراً إلى 10 مساءً مساء (تمديد المساء)
    } else {
      initialPeriod = 'sleep'; // من 10 مساءً فصاعداً نوم
    }

    // دالة لتطبيق الفترة وتصفير التقدم إذا لزم الأمر
    const applyPeriod = (period) => {
      setActiveTab(period);
      const lastPeriod = localStorage.getItem('lastSavedPeriod');
      if (lastPeriod && lastPeriod !== period) {
        localStorage.removeItem('adhkarProgress');
        setProgress({});
      }
      localStorage.setItem('lastSavedPeriod', period);

      try {
        const savedProgress = localStorage.getItem('adhkarProgress');
        if (savedProgress && (!lastPeriod || lastPeriod === period)) {
          setProgress(JSON.parse(savedProgress));
        }
      } catch (e) {
        setProgress({});
      }
    };

    applyPeriod(initialPeriod);

    // 2. محاولة جلب أوقات الصلاة الحقيقية للمستخدم لتحديد الفترة بدقة أكبر وبدون إشعار المستخدم
    const fetchAccuratePeriod = async () => {
      try {
        const ipRes = await fetch('https://freeipapi.com/api/json');
        if (!ipRes.ok) return;
        const ipData = await ipRes.json();
        const { latitude, longitude } = ipData;
        if (!latitude || !longitude) return;

        const today = new Date();
        const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
        // استخدام طريقة 4 (أم القرى) كافتراضي مناسب
        const prayerRes = await fetch(`https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=4`);
        if (!prayerRes.ok) return;

        const prayerData = await prayerRes.json();
        const timings = prayerData.data.timings;

        const timeToMins = (timeStr) => {
          const [h, m] = timeStr.split(':').map(Number);
          return h * 60 + m;
        };

        const nowMins = today.getHours() * 60 + today.getMinutes();
        const fajrMins = timeToMins(timings.Fajr);
        const asrMins = timeToMins(timings.Asr);
        const ishaMins = timeToMins(timings.Isha);

        // حفظ مواقيت الفجر والعصر في الـ State لاستخدامها في الإشعارات
        const [fajrH, fajrM] = timings.Fajr.split(':').map(Number);
        const [asrH, asrM] = timings.Asr.split(':').map(Number);
        setPrayerTimes({
          fajr: { h: fajrH, m: fajrM },
          asr: { h: asrH, m: asrM }
        });

        let accuratePeriod = 'sleep';

        // تقسيم الفترات بناءً على أوقات الصلاة:
        // الاستيقاظ: من منتصف الليل إلى الفجر
        // الصباح: من الفجر إلى العصر
        // المساء: من العصر إلى ما بعد العشاء بساعة ونصف
        // النوم: بعد العشاء بساعة ونصف إلى منتصف الليل
        if (nowMins >= 0 && nowMins < fajrMins) {
          accuratePeriod = 'wake';
        } else if (nowMins >= fajrMins && nowMins < asrMins) {
          accuratePeriod = 'morning';
        } else if (nowMins >= asrMins && nowMins < (ishaMins + 90)) {
          accuratePeriod = 'evening';
        } else {
          accuratePeriod = 'sleep';
        }

        if (accuratePeriod !== initialPeriod) {
          applyPeriod(accuratePeriod);
        }
      } catch (e) {
        // فشل صامت، نعتمد على الوقت المبدئي
      }
    };

    fetchAccuratePeriod();

    // تم نقل استرجاع الإعدادات لتكون متزامنة مع تهيئة الـ State لتجنب مسحها بالغلط

    // حساب المواظبة اليومية (Streaks)
    const todayStr = new Date().toLocaleDateString('en-CA');
    const lastActive = localStorage.getItem('lastActiveDate');
    let currentStreak = parseInt(localStorage.getItem('streakCount') || '0', 10);

    if (lastActive !== todayStr) {
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) currentStreak += 1;
        else currentStreak = 1;
      } else {
        currentStreak = 1;
      }
      localStorage.setItem('lastActiveDate', todayStr);
      localStorage.setItem('streakCount', currentStreak.toString());
      localStorage.setItem('todayTasbeehs', '0');
      setTodayTasbeehs(0);
    }
    setStreak(currentStreak);

    // تحديث أفضل مواظبة
    let cBestStreak = parseInt(localStorage.getItem('bestStreak') || '0', 10);
    if (currentStreak > cBestStreak) {
      cBestStreak = currentStreak;
      localStorage.setItem('bestStreak', cBestStreak.toString());
    }
    setBestStreak(cBestStreak);

    // استرجاع الإحصاءات والمسبحة والأذكار الحرة
    const savedTasbeehCount = localStorage.getItem('tasbeehCount');
    if (savedTasbeehCount) setTasbeehCount(parseInt(savedTasbeehCount, 10));

    const savedTodayTasbeehs = localStorage.getItem('todayTasbeehs');
    if (savedTodayTasbeehs && lastActive === todayStr) {
      setTodayTasbeehs(parseInt(savedTodayTasbeehs, 10));
    }

    const savedDailyGoal = localStorage.getItem('dailyTasbeehGoal');
    if (savedDailyGoal) setDailyTasbeehGoal(parseInt(savedDailyGoal, 10));

    const savedTotalAdhkar = localStorage.getItem('totalAdhkarRead');
    if (savedTotalAdhkar) setTotalAdhkarRead(parseInt(savedTotalAdhkar, 10));

    const savedTotalTasbeehs = localStorage.getItem('totalTasbeehsMade');
    if (savedTotalTasbeehs) setTotalTasbeehsMade(parseInt(savedTotalTasbeehs, 10));

    const savedCustomAdhkar = localStorage.getItem('customAdhkar');
    if (savedCustomAdhkar) setCustomAdhkar(JSON.parse(savedCustomAdhkar));

  }, []);

  // حفظ التغييرات 
  useEffect(() => {
    localStorage.setItem('adhkarProgress', JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem('themeColors', JSON.stringify(themeColors));
  }, [themeColors]);

  useEffect(() => {
    localStorage.setItem('soundEnabled', soundEnabled.toString());
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('vibrationEnabled', vibrationEnabled.toString());
  }, [vibrationEnabled]);

  useEffect(() => {
    localStorage.setItem('celebrationEnabled', celebrationEnabled.toString());
  }, [celebrationEnabled]);

  useEffect(() => {
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem('tasbeehCount', tasbeehCount.toString());
  }, [tasbeehCount]);

  useEffect(() => {
    localStorage.setItem('todayTasbeehs', todayTasbeehs.toString());
  }, [todayTasbeehs]);

  useEffect(() => {
    localStorage.setItem('dailyTasbeehGoal', dailyTasbeehGoal.toString());
  }, [dailyTasbeehGoal]);

  useEffect(() => {
    localStorage.setItem('totalAdhkarRead', totalAdhkarRead.toString());
  }, [totalAdhkarRead]);

  useEffect(() => {
    localStorage.setItem('totalTasbeehsMade', totalTasbeehsMade.toString());
  }, [totalTasbeehsMade]);

  useEffect(() => {
    localStorage.setItem('customAdhkar', JSON.stringify(customAdhkar));
  }, [customAdhkar]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('fontSizeIndex', fontSizeIndex.toString());
  }, [fontSizeIndex]);

  // إشعارات التذكير اليومية المرتبطة بأوقات الصلاة
  useEffect(() => {
    if (!notificationsEnabled) return;
    if (!("Notification" in window)) return;

    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkTimeForNotification = () => {
      if (Notification.permission === "granted") {
        const now = new Date();
        const h = now.getHours();
        const m = now.getMinutes();

        // استخدام أوقات الصلاة الدقيقة لو تم جلبها، وإلا 5 الفجر و4 العصر كافتراضي
        let fajrH = 5, fajrM = 0;
        let asrH = 16, asrM = 0;

        if (prayerTimes) {
          fajrH = prayerTimes.fajr.h;
          fajrM = prayerTimes.fajr.m;
          asrH = prayerTimes.asr.h;
          asrM = prayerTimes.asr.m;
        }

        // إشعار الصباح وقت الفجر
        if (h === fajrH && m === fajrM) {
          new Notification("أذكار الصباح", {
            body: "حان الآن موعد قراءة أذكار الصباح، ابدأ يومك بذكر الله وحصّن نفسك.",
            icon: "/icon-192x192.png"
          });
        }
        // إشعار المساء وقت العصر
        else if (h === asrH && m === asrM) {
          new Notification("أذكار المساء", {
            body: "حان الآن موعد قراءة أذكار المساء، اختم نهارك بذكر الله وطمأنينته.",
            icon: "/icon-192x192.png"
          });
        }
        // إشعار النوم (في الساعة 10:00 مساءً)
        else if (h === 22 && m === 0) {
          new Notification("أذكار النوم", {
            body: "هل تستعد للنوم؟ لا تنسَ قراءة أذكار النوم لتكن في حفظ الله حتى تصبح.",
            icon: "/icon-192x192.png"
          });
        }
      }
    };

    // التحقق كل دقيقة
    const intervalId = setInterval(checkTimeForNotification, 60000);
    return () => clearInterval(intervalId);
  }, [notificationsEnabled, prayerTimes]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // تعريف قائمة الأوسمة والإنجازات الشاملة (Gamification)
  const badges = [
    // أوسمة المواظبة (Streaks)
    { id: 's1', title: 'بداية النور', desc: 'مواظبة ليوم واحد', unlocked: bestStreak >= 1, icon: <Flame className="w-6 h-6" /> },
    { id: 's2', title: 'المواظب المبتدئ', desc: 'مواظبة لـ 3 أيام', unlocked: bestStreak >= 3, icon: <Flame className="w-6 h-6" /> },
    { id: 's3', title: 'نجم الأسبوع', desc: 'مواظبة لـ 7 أيام', unlocked: bestStreak >= 7, icon: <Star className="w-6 h-6" /> },
    { id: 's4', title: 'نصف الشهر', desc: 'مواظبة لـ 15 يوم', unlocked: bestStreak >= 15, icon: <MoonStar className="w-6 h-6" /> },
    { id: 's5', title: 'الذاكر الدائم', desc: 'مواظبة لـ 30 يوم', unlocked: bestStreak >= 30, icon: <Trophy className="w-6 h-6" /> },
    { id: 's6', title: 'أسطورة المواظبة', desc: 'مواظبة لـ 100 يوم!', unlocked: bestStreak >= 100, icon: <Crown className="w-6 h-6" /> },

    // أوسمة التسبيح
    { id: 't1', title: 'بذرة الذاكرين', desc: 'إتمام 100 تسبيحة', unlocked: totalTasbeehsMade >= 100, icon: <TasbeehIcon className="w-6 h-6" /> },
    { id: 't2', title: 'ألفية التسبيح', desc: 'إتمام 1,000 تسبيحة', unlocked: totalTasbeehsMade >= 1000, icon: <Award className="w-6 h-6" /> },
    { id: 't3', title: 'بحر التسبيح', desc: 'إتمام 5,000 تسبيحة', unlocked: totalTasbeehsMade >= 5000, icon: <Target className="w-6 h-6" /> },
    { id: 't4', title: 'جبل الحسنات', desc: 'إتمام 10,000 تسبيحة', unlocked: totalTasbeehsMade >= 10000, icon: <Sunrise className="w-6 h-6" /> },

    // أوسمة قراءة الأذكار
    { id: 'a1', title: 'خطوة البداية', desc: 'قراءة 50 ذكر', unlocked: totalAdhkarRead >= 50, icon: <BookOpen className="w-6 h-6" /> },
    { id: 'a2', title: 'قارئ الأذكار', desc: 'قراءة 500 ذكر', unlocked: totalAdhkarRead >= 500, icon: <BookOpen className="w-6 h-6" /> },
    { id: 'a3', title: 'حصن المسلم', desc: 'قراءة 1,000 ذكر', unlocked: totalAdhkarRead >= 1000, icon: <Shield className="w-6 h-6" /> },
    { id: 'a4', title: 'نور على نور', desc: 'قراءة 5,000 ذكر', unlocked: totalAdhkarRead >= 5000, icon: <Sun className="w-6 h-6" /> },

    // أوسمة خاصة
    { id: 'c1', title: 'أدعية خاصة', desc: 'إضافة ذكر حر واحد', unlocked: customAdhkar.length > 0, icon: <Edit3 className="w-6 h-6" /> },
  ];

  // فلترة الأذكار حسب التبويب النشط (بدون أذكار التعار)
  const currentTabAdhkar = useMemo(() => {
    if (activeTab === 'free') return customAdhkar;
    if (activeTab === 'prayer') return prayerAdhkar;
    return adhkarData.filter(dhikr => {
      if (activeTab === 'wake') return dhikr.wakeOnly && !dhikr.isTaar;
      if (activeTab === 'morning') return !dhikr.eveningOnly && !dhikr.sleepOnly && !dhikr.wakeOnly;
      if (activeTab === 'evening') return !dhikr.morningOnly && !dhikr.sleepOnly && !dhikr.wakeOnly;
      if (activeTab === 'sleep') return dhikr.sleepOnly;
      return true;
    });
  }, [activeTab, customAdhkar]);

  // أذكار التعار مفصولة
  const taarAdhkar = useMemo(() => {
    return adhkarData.filter(dhikr => dhikr.isTaar);
  }, []);

  // حساب النسبة المئوية للتقدم الكلي في التبويب الحالي بطريقة نفسية (كل بطاقة لها وزن متساوٍ)
  const totalProgressPercentage = useMemo(() => {
    if (currentTabAdhkar.length === 0) return 0;

    const totalCards = currentTabAdhkar.length;
    let isAllCompleted = true;

    const currentProgress = currentTabAdhkar.reduce((acc, curr) => {
      const count = progress[`${activeTab}-${curr.id}`] || 0;
      if (count < curr.target) {
        isAllCompleted = false;
      }
      // نسبة إنجاز هذه البطاقة تحديداً (من 0 إلى 1)
      const cardCompletion = Math.min(count, curr.target) / curr.target;
      return acc + cardCompletion;
    }, 0);

    if (isAllCompleted) return 100;

    // النسبة النهائية هي مجموع إنجاز البطاقات مقسوماً على عددها واستخدام floor لتجنب التقريب لـ 100
    return Math.floor((currentProgress / totalCards) * 100);
  }, [currentTabAdhkar, progress, activeTab]);

  // مراقبة الوصول لنسبة 100% لتشغيل الاحتفال البصري
  useEffect(() => {
    if (totalProgressPercentage === 100 && currentTabAdhkar.length > 0 && celebrationEnabled) {
      setShowConfetti(true);
      playSound('celebration');
      // اهتزاز مميز للاحتفال
      triggerVibration([100, 50, 100, 50, 100, 50, 200]);

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 7000); // إخفاء التأثير والنافذة بعد 7 ثوانٍ

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [totalProgressPercentage, currentTabAdhkar.length, celebrationEnabled]);

  // تحديث العداد المحدث بالصوت
  const handleDhikrClick = (id, target) => {
    const key = `${activeTab}-${id}`;
    setProgress((prev) => {
      const current = prev[key] || 0;
      if (current < target) {
        setTotalAdhkarRead(p => p + 1);
        recordActivity(activeTab); // تسجيل نوع الذكر
        const newCount = current + 1;
        if (newCount === target) {
          triggerVibration([100, 50, 100]);
          playSound('success');
        } else {
          triggerVibration(50);
          playSound('click');
        }
        triggerInteraction();
        return { ...prev, [key]: newCount };
      }
      return prev;
    });
  };

  // تصفير ذكر واحد
  const resetSingleDhikr = (id) => {
    const key = `${activeTab}-${id}`;
    setProgress((prev) => {
      const newProgress = { ...prev };
      delete newProgress[key];
      return newProgress;
    });
  };

  // تصفير كل الأذكار في التبويب الحالي
  const resetAllProgress = () => {
    setProgress(prev => {
      const newProgress = { ...prev };
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${activeTab}-`)) {
          delete newProgress[key];
        }
      });
      return newProgress;
    });
  };

  // دوال المسبحة الحرة
  const handleTasbeehClick = () => {
    setTasbeehCount(prev => prev + 1);
    setTotalTasbeehsMade(prev => prev + 1);
    setTodayTasbeehs(prev => prev + 1);
    recordActivity('tasbeeh');
    triggerVibration(50);
    playSound('click');
    triggerInteraction();
  };

  const resetTasbeeh = () => {
    setTasbeehCount(0);
  };

  // إضافة ذكر حر
  const addCustomDhikr = () => {
    if (!newCustomText.trim()) return;
    const newDhikr = {
      id: Date.now(),
      textMorning: newCustomText,
      target: newCustomTarget,
      category: 'ذكر مخصص',
    };
    setCustomAdhkar([...customAdhkar, newDhikr]);
    setNewCustomText('');
    setNewCustomTarget(1);
    setShowAddCustom(false);
  };

  // حذف ذكر حر
  const deleteCustomDhikr = (id) => {
    setCustomAdhkar(customAdhkar.filter(d => d.id !== id));
    resetSingleDhikr(id);
  };

  // جلب إعدادات الألوان للتبويب النشط
  const currentTabTheme = colorMap[themeColors[activeTab]] || colorMap.teal;

  // تحديث لون شريط حالة الجهاز (Status Bar theme-color) ديناميكياً ليطابق التبويب النشط أو الوضع الليلي
  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const hexColor = isDarkMode ? '#1e293b' : (currentTabTheme?.hex || '#0d9488');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', hexColor);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = hexColor;
      document.head.appendChild(meta);
    }
  }, [currentTabTheme, isDarkMode]);

  const getTabClass = (tabId) => {
    const isActive = activeTab === tabId;
    const tabTheme = colorMap[themeColors[tabId]] || colorMap.teal;

    return `flex-1 py-3 text-center font-bold text-xs sm:text-sm md:text-xl transition-colors ${isActive
      ? `${tabTheme.tabActive} dark:bg-slate-700 text-white border-b-4 ${tabTheme.tabBorder}`
      : 'text-white/70 hover:bg-white/10 dark:hover:bg-slate-600'
      }`;
  };

  const getTabLabel = (tabId) => {
    if (tabId === 'wake') return 'الاستيقاظ';
    if (tabId === 'morning') return 'الصباح';
    if (tabId === 'evening') return 'المساء';
    if (tabId === 'prayer') return 'الصلاة';
    if (tabId === 'free') return 'المسبحة';
    if (tabId === 'garden') return 'بستاني';
    return 'النوم';
  };

  const TabIcon = activeTab === 'sleep' ? Moon : activeTab === 'wake' ? Sunrise : activeTab === 'morning' ? Sun : activeTab === 'prayer' ? Clock : activeTab === 'garden' ? Leaf : Sunset;

  // توليد بيانات الرسم البياني
  const graphDays = useMemo(() => {
    const numDays = parseInt(chartFilter, 10);
    return Array.from({ length: numDays }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (numDays - 1 - i));

      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dayNum = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${dayNum}`;

      const dayName = d.toLocaleDateString('ar-SA', { weekday: 'short' });
      return {
        date: dateStr,
        dayName: dayName,
        dayOfMonth: d.getDate(),
        data: activityHistory[dateStr] || {}
      };
    });
  }, [activityHistory, chartFilter]);

  const maxActivity = Math.max(
    ...graphDays.map(d =>
      Object.values(d.data).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0)
    ),
    5
  );

  const exportStatsAsImage = async () => {
    setIsExporting(true);
    setTimeout(async () => {
      const element = document.getElementById('stats-export-area');
      if (!element) return setIsExporting(false);
      try {
        const canvas = await html2canvas(element, {
          backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
          scale: 2
        });
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `DhikrBook-Stats-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = dataURL;
        link.click();
      } catch (e) {
        console.error("Export failed:", e);
      } finally {
        setIsExporting(false);
      }
    }, 200);
  };

  const exportStoryAsImage = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('story-export-card');
      const parent = element.parentElement;
      if (!element || !parent) return setIsExporting(false);

      // إظهار العنصر مؤقتاً للتصوير
      parent.style.left = '0';

      const canvas = await html2canvas(element, {
        backgroundColor: '#0f172a',
        scale: 1,
        useCORS: true
      });

      // إعادة إخفاء العنصر
      parent.style.left = '-9999px';

      const dataURL = canvas.toDataURL('image/jpeg', 0.9);
      const link = document.createElement('a');
      link.download = `DhikrBook-Story-${new Date().toISOString().slice(0, 10)}.jpg`;
      link.href = dataURL;
      link.click();
    } catch (e) {
      console.error('Story export failed:', e);
      alert('حدث خطأ أثناء تصدير الصورة.');
    } finally {
      setIsExporting(false);
    }
  };

  // --- منطق التتبع النفسي (Mood Tracker) ---
  const isTabCompleted = currentTabAdhkar.length > 0 && currentTabAdhkar.every(dhikr => (progress[`${activeTab}-${dhikr.id}`] || 0) >= dhikr.target);

  const moodDateObj = new Date();
  const todayStr = `${moodDateObj.getFullYear()}-${String(moodDateObj.getMonth() + 1).padStart(2, '0')}-${String(moodDateObj.getDate()).padStart(2, '0')}`;
  const todayMoodData = moodLog[todayStr]?.[activeTab] || {};
  const hasAnsweredBefore = !!pendingMoods[activeTab] || !!todayMoodData.before;
  const hasAnsweredAfter = !!todayMoodData.after;
  const shouldShowBeforeMood = ['morning', 'evening', 'sleep', 'wake', 'prayer'].includes(activeTab) && !hasAnsweredBefore;
  const shouldShowAfterMood = ['morning', 'evening', 'sleep', 'wake', 'prayer'].includes(activeTab) && isTabCompleted && hasAnsweredBefore && !hasAnsweredAfter;

  return (
    <div dir="rtl" className={`min-h-screen relative font-cairo transition-colors duration-300 ${isDarkMode ? 'dark text-slate-100' : 'text-slate-900'}`}>
      <LiveBackground colorTheme={currentTabTheme} isDarkMode={isDarkMode} isInteracting={isInteracting} activeTab={activeTab} />
      <style dangerouslySetInnerHTML={globalStyles} />

      {/* --- إشعار تحديث التطبيق (PWA Update Prompt) --- */}
      {needRefresh && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-2xl border-2 ${currentTabTheme.header.replace('bg-', 'border-')} dark:border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-8`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${currentTabTheme.cardHeader}`}>
              <RefreshCw className={`w-6 h-6 animate-spin ${currentTabTheme.icon}`} />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base">تحديث جديد متاح! ✨</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">انقر لتحديث التطبيق والحصول على أحدث الميزات.</p>
            </div>
          </div>
          <button
            onClick={() => updateServiceWorker(true)}
            className={`shrink-0 ${currentTabTheme.header} hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold transition shadow-md active:scale-95 text-sm md:text-base`}
          >
            تحديث الآن
          </button>
        </div>
      )}

      {/* --- تأثير الاحتفال بالإنجاز والدعاء --- */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(60)].map((_, i) => (
              <div
                key={i}
                className="confetti absolute w-2 h-4 sm:w-3 sm:h-6"
                style={{
                  left: `${Math.random() * 100}vw`,
                  backgroundColor: ['#14b8a6', '#facc15', '#a855f7', '#ec4899', '#3b82f6', '#ef4444'][Math.floor(Math.random() * 6)],
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
          <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl transform transition-all animate-in zoom-in-75 duration-500 flex flex-col items-center text-center max-w-sm mx-4 border border-yellow-200 dark:border-slate-600 pointer-events-auto">
            <div className="bg-yellow-100 dark:bg-yellow-900/50 p-4 rounded-full mb-4">
              <Star className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">الحمد لله</h2>
            <p className="text-lg font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
              تقبل الله طاعتكم، وجعلها في ميزان حسناتكم، وكتب لكم الأجر العظيم.
            </p>
            <button
              onClick={() => setShowConfetti(false)}
              className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-full font-bold transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}



      {/* --- شريط التنقل العلوي --- */}
      <header className={`fixed top-0 left-0 right-0 z-40 shadow-md transition-colors duration-500 ${currentTabTheme.header} dark:bg-slate-800 text-white`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 space-x-reverse">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
            <h1 className="text-xl md:text-2xl font-bold tracking-wide">الأذكار</h1>
          </div>
          <div className="flex items-center space-x-1.5 space-x-reverse md:space-x-3">

            {/* مؤشر الهدف اليومي للمسبحة */}
            <div
              className="hidden sm:flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs md:text-base font-bold border border-white/30 cursor-pointer hover:bg-white/30 transition"
              title="الهدف اليومي للتسبيح"
              onClick={() => setShowTasbeehModal(true)}
            >
              <Target className="w-4 h-4 md:w-5 md:h-5 text-teal-200" />
              <span>{Math.min(100, Math.floor((todayTasbeehs / dailyTasbeehGoal) * 100))}%</span>
            </div>

            {/* خريطة التحدي */}
            <button
              onClick={() => setShowRoadmapModal(true)}
              className="p-1.5 md:p-2 rounded-full bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition relative group"
              title="خريطة الـ 40 يوماً"
            >
              <Map className="w-4 h-4 md:w-5 md:h-5 text-amber-200" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>

            {/* شعلة المواظبة اليومية */}
            {streak > 0 && (
              <div
                className="flex items-center gap-1 bg-yellow-400/20 text-yellow-100 px-2 py-1 rounded-full text-xs md:text-base font-bold border border-yellow-400/30 cursor-pointer hover:bg-yellow-400/30 transition"
                title="أيام المواظبة المتتالية"
                onClick={() => setShowStatsModal(true)}
              >
                <Flame className="w-3.5 h-3.5 md:w-5 md:h-5 text-yellow-400" />
                <span>{streak}</span>
              </div>
            )}

            {/* المسبحة الصوتية العامة */}
            {speechSupported && (
              <button
                onClick={toggleVoiceTasbeeh}
                className={`p-1.5 md:p-2 rounded-full transition relative flex items-center justify-center shadow-sm ${isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700'}`}
                title="المسبحة الصوتية (العد التلقائي بالصوت)"
              >
                {isListening ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
              </button>
            )}

            {/* المستوى الحالي (RPG) */}
            <div
              className="flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-[10px] md:text-sm font-bold border border-white/30 cursor-pointer hover:bg-white/30 transition"
              title={`المستوى الحالي: ${currentLevel}`}
              onClick={() => setShowStatsModal(true)}
            >
              <Crown className="w-3 h-3 md:w-4 md:h-4 text-amber-300" />
              <span>{currentLevel}</span>
            </div>

            {/* زر المسبحة الحرة */}
            <button
              onClick={() => setShowTasbeehModal(true)}
              className="flex items-center gap-1 md:gap-2 p-1.5 md:p-2 md:px-3 rounded-full md:rounded-xl bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition text-white font-bold shadow-sm"
              title="المسبحة الحرة"
            >
              <TasbeehIcon className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden md:inline text-sm">المسبحة</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 rounded-full bg-black/20 hover:bg-black/30 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition"
              aria-label="إعدادات التطبيق"
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        {/* --- التبويبات --- */}
        <div className="flex border-t border-black/10 dark:border-slate-700 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button onClick={() => setActiveTab('wake')} className={getTabClass('wake')}>الاستيقاظ</button>
          <button onClick={() => setActiveTab('morning')} className={getTabClass('morning')}>الصباح</button>
          <button onClick={() => setActiveTab('evening')} className={getTabClass('evening')}>المساء</button>
          <button onClick={() => setActiveTab('sleep')} className={getTabClass('sleep')}>النوم</button>
          <button onClick={() => setActiveTab('prayer')} className={getTabClass('prayer')}>الصلاة</button>
          <button onClick={() => setActiveTab('garden')} className={getTabClass('garden')}>بستاني</button>
        </div>

        {/* --- شريط التقدم --- */}
        <div className="w-full bg-black/20 dark:bg-black/30 h-1.5 shadow-inner">
          <div
            className={`h-full transition-all duration-500 ease-out flex justify-end items-center ${currentTabTheme.progress}`}
            style={{ width: `${totalProgressPercentage}%` }}
          >
            {totalProgressPercentage > 10 && (
              <span className="text-[9px] font-bold text-slate-800 dark:text-slate-900 px-1 select-none">
                {totalProgressPercentage}%
              </span>
            )}
          </div>
        </div>
      </header>

      {/* --- نافذة المسبحة الحرة (Modal) --- */}
      {showTasbeehModal && (
        <div id="tasbeeh-modal-container" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative border border-slate-200 dark:border-slate-700 flex flex-col items-center">
            <button
              onClick={() => {
                setShowTasbeehModal(false);
                if (isListening) toggleVoiceTasbeeh();
              }}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* المسبحة الصوتية */}
            {speechSupported && (
              <button
                onClick={toggleVoiceTasbeeh}
                className={`absolute top-4 right-4 p-2.5 rounded-full transition flex items-center justify-center ${isListening ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse border border-red-200 dark:border-red-800' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700'}`}
                title="المسبحة الصوتية (تحدث ليتم العد تلقائياً)"
              >
                {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </button>
            )}

            <h3 className={`text-2xl font-bold mb-8 flex items-center gap-2 mt-4 ${(colorMap[themeColors.free] || colorMap.orange).icon}`}>
              <TasbeehIcon className="w-7 h-7" />
              المسبحة الحرة
            </h3>

            {/* زر خفي للمسبحة الصوتية لاستدعاء الدالة */}
            <button id="hidden-tasbeeh-btn" onClick={handleTasbeehClick} className="hidden"></button>

            {/* زر العداد الضخم مع تأثير النبض */}
            <div className="relative mb-8">
              <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${(colorMap[themeColors.free] || colorMap.orange).header.replace('bg-', 'bg-')}`}></div>
              <button
                onClick={handleTasbeehClick}
                className={`relative z-10 w-48 h-48 md:w-56 md:h-56 bg-gradient-to-br ${(colorMap[themeColors.free] || colorMap.orange).taarBtn} rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex items-center justify-center text-white text-5xl md:text-6xl font-extrabold active:scale-95 transition-all border-4 border-white/20 overflow-hidden group`}
              >
                <span className="relative z-10 group-active:scale-110 transition-transform">{tasbeehCount}</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
              </button>
            </div>

            <button
              onClick={resetTasbeeh}
              className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition font-bold text-lg"
            >
              <RotateCcw className="w-5 h-5" />
              تصفير المسبحة
            </button>

            {/* التحدي اليومي للتسبيح */}
            <div className="w-full mt-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-600 w-full max-w-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 dark:text-slate-200">التحدي اليومي</span>
                <span className={`text-sm font-bold ${(colorMap[themeColors.free] || colorMap.orange).icon}`}>{todayTasbeehs} / {dailyTasbeehGoal}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 h-2.5 rounded-full overflow-hidden mb-4">
                <div
                  className={`${(colorMap[themeColors.free] || colorMap.orange).header} h-full transition-all duration-500`}
                  style={{ width: `${Math.min(100, (todayTasbeehs / dailyTasbeehGoal) * 100)}%` }}
                ></div>
              </div>

              <div className="flex gap-2 items-center">
                <span className="text-xs text-slate-500 w-16">تعديل الهدف</span>
                <input
                  type="number"
                  value={dailyTasbeehGoal}
                  onChange={(e) => setDailyTasbeehGoal(Math.max(1, parseInt(e.target.value) || 1000))}
                  className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 text-sm text-center outline-none focus:border-teal-500 text-slate-800 dark:text-slate-200"
                  placeholder="الهدف"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- نافذة الإحصاءات والأوسمة (Modal) --- */}
      {showStatsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-lg p-6 md:p-8 relative border border-slate-200 dark:border-slate-700 flex flex-col items-center max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowStatsModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3
              onClick={() => {
                const newCount = devClickCount + 1;
                setDevClickCount(newCount);
                if (newCount >= 5) {
                  setDevData({ streak, bestStreak, totalAdhkarRead, totalTasbeehsMade });
                  setShowDevModal(true);
                  setDevClickCount(0);
                }
              }}
              className="text-2xl font-bold mb-8 text-teal-700 dark:text-teal-400 flex items-center gap-2 select-none"
            >
              <BarChart2 className="w-7 h-7" />
              إحصاءات المتابعة والأوسمة
            </h3>

            <div id="stats-export-area" className="w-full bg-white dark:bg-slate-800 p-2 rounded-2xl">

              {/* --- قسم مستوى المستخدم (RPG Leveling) --- */}
              <div className="w-full mb-6 relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 p-5 bg-slate-50 dark:bg-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white dark:bg-slate-700 shadow-sm ${levelColor} border border-slate-100 dark:border-slate-600`}>
                      <Crown className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">المستوى الحالي</p>
                      <h4 className={`text-xl md:text-2xl font-black ${levelColor}`}>{currentLevel}</h4>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">نقاط النور</p>
                    <p className="text-xl md:text-2xl font-black text-slate-800 dark:text-slate-100">{userXP} <span className="text-xs font-bold text-slate-400">XP</span></p>
                  </div>
                </div>

                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <div
                    className={`h-full ${levelBg} transition-all duration-1000 ease-out`}
                    style={{ width: `${levelProgressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                  <span>{minXP} XP</span>
                  <span>الهدف القادم: {maxXP} XP</span>
                </div>

                {/* شرح كيفية حساب النقاط */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600/50">
                  <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                    <Info className="w-4 h-4 shrink-0 text-teal-500" />
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">كيف أجمع نقاط النور (XP)؟</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>كل تسبيحة بالمسبحة = <strong className="text-teal-600 dark:text-teal-400">1 نقطة</strong></li>
                        <li>كل قراءة لذكر = <strong className="text-teal-600 dark:text-teal-400">2 نقطة</strong></li>
                        <li>المواظبة المستمرة = <strong className="text-teal-600 dark:text-teal-400">50 نقطة</strong> إضافية عن كل يوم في أعلى ستريك لك!</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-4">
                <div className="bg-amber-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-amber-200 dark:border-slate-600 flex items-center justify-between gap-4 relative overflow-hidden group">
                  <div className="flex items-center gap-4">
                    <div className="bg-amber-100 dark:bg-slate-600 p-3 rounded-full text-amber-600 dark:text-amber-400">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">أيام المواظبة المتتالية</p>
                      <p className="text-xl font-black text-slate-800 dark:text-slate-100">{streak} يوم</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowRoadmapModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 flex items-center gap-2 font-bold"
                    title="خريطة الـ 40 يوماً"
                  >
                    <Map className="w-5 h-5" />
                    <span className="hidden sm:inline">افتح الخريطة</span>
                  </button>
                </div>

                <div className="bg-teal-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-teal-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-teal-100 dark:bg-slate-600 p-3 rounded-full text-teal-600 dark:text-teal-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إجمالي الأذكار المقروءة</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalAdhkarRead}</p>
                  </div>
                </div>

                <div className="bg-indigo-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-indigo-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-indigo-100 dark:bg-slate-600 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
                    <TasbeehIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">إجمالي التسبيحات</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{totalTasbeehsMade}</p>
                  </div>
                </div>

                <div className="bg-rose-50 dark:bg-slate-700/50 p-4 rounded-2xl border border-rose-200 dark:border-slate-600 flex items-center gap-4">
                  <div className="bg-rose-100 dark:bg-slate-600 p-3 rounded-full text-rose-600 dark:text-rose-400">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">أفضل مواظبة (Best Streak)</p>
                    <p className="text-xl font-black text-slate-800 dark:text-slate-100">{bestStreak} يوم</p>
                  </div>
                </div>
              </div>

              {/* النشاط الأسبوعي والشهري */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-indigo-500" />
                    النشاط
                  </h4>
                  <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button onClick={() => setChartFilter('7')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartFilter === '7' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>أسبوعي</button>
                    <button onClick={() => setChartFilter('30')} className={`px-3 py-1 text-xs font-bold rounded-md transition ${chartFilter === '30' ? 'bg-white dark:bg-slate-700 shadow text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>شهري</button>
                  </div>
                </div>
                <div className={`flex items-end justify-between ${chartFilter === '7' ? 'gap-1 md:gap-2' : 'gap-[1px] md:gap-[2px]'} h-48 mt-4 px-1 md:px-2`}>
                  {graphDays.map((day, i) => {
                    const total = Object.values(day.data).reduce((a, b) => (Number(a) || 0) + (Number(b) || 0), 0);
                    const isToday = i === graphDays.length - 1;
                    return (
                      <div key={day.date} className="h-full flex flex-col items-center justify-end gap-2 flex-1 group">
                        <div
                          className="w-full max-w-[2.5rem] flex-1 rounded-t-sm transition-all duration-500 relative flex flex-col justify-end cursor-pointer hover:opacity-80 overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                          style={{ minHeight: '0' }}
                        >
                          <div className="absolute -top-8 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold z-10 whitespace-nowrap z-20">
                            الإجمالي: {total}
                          </div>

                          {/* Stacked bars */}
                          <div className="w-full h-full flex flex-col justify-end">
                            {['free', 'prayer', 'sleep', 'evening', 'morning', 'wake', 'tasbeeh'].map(cat => {
                              const val = Number(day.data[cat]) || 0;
                              if (val === 0) return null;
                              const heightPercent = (val / maxActivity) * 100;
                              const colors = {
                                tasbeeh: '#14b8a6', // teal
                                morning: '#f59e0b', // amber
                                evening: '#f43f5e', // rose
                                sleep: '#6366f1', // indigo
                                wake: '#0ea5e9', // sky
                                prayer: '#3b82f6', // blue
                                free: '#8b5cf6' // violet
                              };
                              return <div key={cat} style={{ height: `${heightPercent}%`, backgroundColor: colors[cat] }} className="w-full shrink-0" title={cat} />
                            })}
                          </div>
                        </div>
                        {chartFilter === '7' ? (
                          <span className={`text-[10px] md:text-xs font-bold ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400'}`}>
                            {day.dayName}
                          </span>
                        ) : (
                          <span className={`text-[8px] md:text-[10px] font-bold ${isToday ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            {day.dayOfMonth}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 text-[10px] md:text-xs font-bold">
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#14b8a6]"></div>تسابيح</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>صباح</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#f43f5e]"></div>مساء</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>نوم</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>استيقاظ</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div>صلاة</div>
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>حر</div>
                </div>
              </div>
              {/* التتبع النفسي للذكر */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-emerald-500" />
                  أثر الذكر على قلبك
                </h4>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-4 md:p-6 border border-emerald-200 dark:border-emerald-800/50 shadow-sm relative overflow-hidden">
                  <Heart className="absolute -left-4 -top-4 w-24 h-24 text-emerald-500 opacity-5" />
                  <p className="text-center font-bold text-emerald-700 dark:text-emerald-400 text-sm md:text-base mb-6 leading-relaxed">
                    «أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»
                  </p>
                  {(() => {
                    let totalLogged = 0;
                    let improvedCount = 0;
                    const negativeMoods = ['sad', 'anxious', 'tired'];
                    const positiveMoods = ['calm', 'peaceful'];

                    Object.values(moodLog).forEach(day => {
                      Object.values(day).forEach(session => {
                        if (session.before && session.after) {
                          totalLogged++;
                          if (negativeMoods.includes(session.before) && positiveMoods.includes(session.after)) {
                            improvedCount++;
                          } else if (session.before === 'calm' && session.after === 'peaceful') {
                            improvedCount++;
                          } else if (positiveMoods.includes(session.before) && positiveMoods.includes(session.after)) {
                            improvedCount++; // Maintained good mood
                          }
                        }
                      });
                    });

                    if (totalLogged === 0) {
                      return <p className="text-center text-slate-500 dark:text-slate-400 text-xs font-bold">سجل شعورك قبل وبعد الأذكار لترى أثرها الطاهر على قلبك هنا.</p>;
                    }

                    const improvementRate = Math.round((improvedCount / totalLogged) * 100);

                    return (
                      <div className="text-center relative z-10">
                        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mb-3 font-bold">
                          بناءً على تتبع مشاعرك، تحسنت واطمأنت حالتك النفسية بعد الذكر بنسبة:
                        </p>
                        <div className="flex justify-center items-end gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                          <span className="text-5xl md:text-6xl font-black drop-shadow-sm">{improvementRate}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden mt-4 max-w-[250px] mx-auto shadow-inner">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full transition-all duration-1000 relative" style={{ width: `${improvementRate}%` }}>
                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 animate-pulse"></div>
                          </div>
                        </div>
                        {improvementRate > 70 && (
                          <p className="mt-4 text-xs font-bold text-teal-600 dark:text-teal-400">
                            ما شاء الله! هذا مصداق وعد الله للمستغفرين والذاكرين.
                          </p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* قسم الأوسمة */}
              <div className="w-full mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <h4 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                  الأوسمة والإنجازات
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                  {badges.map(badge => (
                    <div
                      key={badge.id}
                      className={`p-3 md:p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${badge.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/30 border-yellow-200 dark:border-yellow-700/50 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 opacity-60 grayscale'
                        }`}
                    >
                      <div className={`p-2 rounded-full mb-2 ${badge.unlocked ? 'bg-yellow-200 text-yellow-600 dark:bg-yellow-800 dark:text-yellow-300' : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'}`}>
                        {badge.icon}
                      </div>
                      <p className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        {badge.title}
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400">
                        {badge.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* إغلاق مساحة التصدير */}
            </div>

            {/* أزرار الإجراءات */}
            <div className="w-full mt-6 flex flex-col gap-3">
              <button
                onClick={exportStoryAsImage}
                disabled={isExporting}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-black text-lg transition shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isExporting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Flame className="w-6 h-6" />}
                شارك إنجازك (Story)
              </button>

              <button
                onClick={exportStatsAsImage}
                disabled={isExporting}
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5" />
                حفظ الإحصائيات الكاملة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- خريطة تحدي الـ 40 يوماً --- */}
      {showRoadmapModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in-95 duration-300">
          <div className="bg-[#0f172a] rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative border-2 border-indigo-500/50 max-h-[90vh] overflow-y-auto hide-scrollbar">
            <button
              onClick={() => setShowRoadmapModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-8 pt-2">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-2xl mb-4 text-indigo-400">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">رحلة الـ 40 يوماً</h3>
              <p className="text-slate-400 text-sm">أكمل مسيرتك اليومية لتصل إلى الكنز!</p>
            </div>

            <div className="flex flex-col gap-3 relative px-1">
              {roadmapDays.map((row, rowIndex) => (
                <div key={rowIndex} className="flex justify-between relative z-10">
                  {row.map((day) => {
                    const isCompleted = day <= bestStreak;
                    const isCurrent = day === bestStreak + 1;

                    let bgClass = "bg-slate-800 border-slate-700 text-slate-500";
                    if (isCompleted) bgClass = "bg-indigo-500 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]";
                    if (isCurrent) bgClass = "bg-amber-400 border-amber-300 text-amber-900 shadow-[0_0_20px_rgba(251,191,36,0.6)] animate-pulse scale-110 z-20";

                    return (
                      <div
                        key={day}
                        className={`w-11 h-11 md:w-14 md:h-14 flex items-center justify-center rounded-2xl border-2 font-black text-sm md:text-lg transition-all duration-500 ${bgClass}`}
                      >
                        {day === 40 ? <Trophy className={`w-5 h-5 md:w-6 md:h-6 ${isCompleted ? "text-yellow-200" : "text-slate-500"}`} /> : day}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
              <p className="text-white font-bold mb-1">تقدمك الحالي: {bestStreak} / 40</p>
              {bestStreak >= 40 ? (
                <p className="text-amber-400 text-sm font-bold">🎉 مبروك! لقد أتممت التحدي العظيم!</p>
              ) : (
                <p className="text-slate-400 text-xs">حافظ على وردك اليومي لتتقدم في الخريطة.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- القائمة السرية لاستعادة البيانات --- */}
      {showDevModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in zoom-in duration-200">
          <div className="bg-slate-900 rounded-3xl shadow-2xl w-full max-w-sm p-6 border-2 border-green-500 text-green-400 font-mono">
            <h3 className="text-xl font-bold mb-6 text-center border-b border-green-800 pb-2 flex items-center justify-center gap-2">
              <Settings className="w-5 h-5 animate-spin" />
              Developer Override
            </h3>

            <div className="space-y-4 mb-6">
              {[
                { key: 'streak', label: 'Current Streak' },
                { key: 'bestStreak', label: 'Best Streak' },
                { key: 'totalAdhkarRead', label: 'Total Adhkar' },
                { key: 'totalTasbeehsMade', label: 'Total Tasbeeh' }
              ].map(field => (
                <div key={field.key} className="flex flex-col gap-1">
                  <label className="text-xs uppercase">{field.label}:</label>
                  <input
                    type="number"
                    value={devData[field.key]}
                    onChange={e => setDevData({ ...devData, [field.key]: parseInt(e.target.value) || 0 })}
                    className="bg-black border border-green-700 text-green-300 p-2 rounded focus:outline-none focus:border-green-400"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStreak(devData.streak);
                  setBestStreak(devData.bestStreak);
                  setTotalAdhkarRead(devData.totalAdhkarRead);
                  setTotalTasbeehsMade(devData.totalTasbeehsMade);

                  localStorage.setItem('streakCount', devData.streak);
                  localStorage.setItem('bestStreak', devData.bestStreak);
                  localStorage.setItem('totalAdhkarRead', devData.totalAdhkarRead);
                  localStorage.setItem('totalTasbeehsMade', devData.totalTasbeehsMade);

                  setShowDevModal(false);
                }}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white font-bold py-2 rounded transition"
              >
                SAVE DATA
              </button>
              <button
                onClick={() => setShowDevModal(false)}
                className="px-4 border border-green-700 text-green-500 hover:bg-green-900/50 py-2 rounded transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- نافذة الأذكار الحرة (Modal) --- */}
      {showFreeAdhkarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl p-6 md:p-8 relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFreeAdhkarModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-orange-600 dark:text-orange-400 flex items-center gap-2 border-b pb-4 dark:border-slate-700">
              <Edit3 className="w-7 h-7" />
              الأذكار الحرة المخصصة
            </h3>

            {/* زر إضافة ذكر حر جديد */}
            <div className="mb-6">
              {!showAddCustom ? (
                <button
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-3 bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/20 dark:hover:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-dashed border-orange-300 dark:border-orange-900 rounded-2xl font-bold transition flex items-center justify-center gap-2 text-lg shadow-sm"
                >
                  <Plus className="w-5 h-5" />
                  إضافة ذكر أو دعاء مخصص
                </button>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-3 duration-200">
                  <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3">ذكر جديد</h4>
                  <textarea
                    value={newCustomText}
                    onChange={(e) => setNewCustomText(e.target.value)}
                    placeholder="اكتب الذكر أو الدعاء هنا..."
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-h-[80px] mb-4 text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  ></textarea>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-600 dark:text-slate-300 text-sm">التكرار المطلوب:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setNewCustomTarget(prev => Math.max(1, prev - 1))}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <input
                        type="number"
                        value={newCustomTarget}
                        onChange={(e) => setNewCustomTarget(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-center font-bold text-slate-800 dark:text-slate-100"
                      />
                      <button
                        onClick={() => setNewCustomTarget(prev => prev + 1)}
                        className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addCustomDhikr}
                      className="flex-1 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition shadow-md"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => { setShowAddCustom(false); setNewCustomText(''); setNewCustomTarget(1); }}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* قائمة الأذكار الحرة */}
            <div className="space-y-4">
              {customAdhkar.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-slate-500">
                  <Edit3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-bold">لا توجد أذكار حرة مضافة بعد.</p>
                  <p className="text-sm mt-1">أضف أذكارك وأدعيتك المفضلة هنا لقراءتها ومتابعة عدّها بسهولة!</p>
                </div>
              ) : (
                customAdhkar.map(dhikr => {
                  const key = `free-${dhikr.id}`;
                  const currentCount = progress[key] || 0;
                  const isCompleted = currentCount >= dhikr.target;
                  const percentage = Math.min(100, Math.floor((currentCount / dhikr.target) * 100));

                  return (
                    <div
                      key={dhikr.id}
                      className={`p-4 md:p-5 rounded-2xl border transition-all ${isCompleted ? 'bg-orange-50/50 dark:bg-orange-950/5 border-orange-200 dark:border-orange-900/50 opacity-90' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'} shadow-sm hover:shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}
                    >
                      <div className="flex-1 w-full">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-relaxed whitespace-pre-line mb-3">
                          {dhikr.textMorning}
                        </p>
                        {/* شريط التقدم الصغير */}
                        <div className="w-full bg-slate-100 dark:bg-slate-900 h-2 rounded-full overflow-hidden mb-2">
                          <div
                            className="bg-orange-500 h-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                          <span>التقدم: {percentage}%</span>
                          <span>الهدف: {dhikr.target}</span>
                        </div>
                      </div>

                      {/* أزرار التحكم بالعد والحذف */}
                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        {/* زر العداد الدائري المميز */}
                        <button
                          onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                          disabled={isCompleted}
                          className={`w-14 h-14 rounded-full font-black text-lg flex items-center justify-center transition-all ${isCompleted
                            ? 'bg-orange-100 dark:bg-orange-950/20 text-orange-600 border-2 border-orange-400 dark:border-orange-800'
                            : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95'
                            }`}
                        >
                          {currentCount}
                        </button>

                        {/* إعادة التصفير */}
                        <button
                          onClick={() => resetSingleDhikr(dhikr.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
                          title="تصفير العداد"
                        >
                          <RotateCcw className="w-5 h-5" />
                        </button>

                        {/* حذف */}
                        <button
                          onClick={() => deleteCustomDhikr(dhikr.id)}
                          className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition"
                          title="حذف الذكر"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- نافذة الإعدادات --- */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-teal-700 dark:text-teal-400 border-b pb-4 dark:border-slate-700">
              <Settings className="w-6 h-6" />
              إعدادات التطبيق
            </h3>

            <div className="space-y-4">

              {/* أزرار الصوت والاهتزاز */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${soundEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {soundEnabled ? <Volume2 className="w-6 h-6 mb-2" /> : <VolumeX className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الصوت</span>
                </button>
                <button
                  onClick={() => setVibrationEnabled(!vibrationEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${vibrationEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {vibrationEnabled ? <Vibrate className="w-6 h-6 mb-2" /> : <VibrateOff className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">الاهتزاز</span>
                </button>
              </div>

              {/* إعدادات الموقع وأوقات الصلاة */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-slate-600 pb-3">
                  <div
                    className="flex items-center gap-2 cursor-pointer"
                    onDoubleClick={testHiddenNotification}
                    title="انقر نقراً مزدوجاً لاختبار التنبيهات المخفية"
                  >
                    <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg text-slate-700 dark:text-slate-200 select-none">الأوقات الذكية</span>
                  </div>
                  {!prayerTimes ? (
                    <button
                      onClick={autoFetchLocation}
                      disabled={isLocating}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-full transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLocating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
                      تفعيل
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setPrayerTimes(null);
                        setLocation(null);
                        localStorage.removeItem('prayerTimes');
                        localStorage.removeItem('userLocation');
                      }}
                      className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded-full hover:bg-red-200 transition"
                    >
                      إيقاف
                    </button>
                  )}
                </div>

                {!prayerTimes ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center py-2">
                    قم بتفعيل الأوقات الذكية ليقوم التطبيق بتحديد موقعك <span className="font-bold text-teal-600">عبر الـ GPS</span> لتذكيرك بأذكار الصباح والمساء والصلوات في وقتها الدقيق.
                    <br /><br />
                    <button onClick={() => {
                      const city = window.prompt("الرجاء إدخال مدينتك (مثال: Amman، مكة):");
                      if (!city) return;
                      const country = window.prompt("الرجاء إدخال دولتك (مثال: Jordan، السعودية):");
                      if (!country) return;
                      autoFetchLocation(city, country);
                    }} className="text-teal-600 hover:underline font-bold cursor-pointer">أو أدخل مدينتك يدوياً بالضغط هنا</button>
                  </p>
                ) : (
                  <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="grid grid-cols-5 gap-1 text-center bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      {[
                        { n: 'الفجر', t: prayerTimes.Fajr },
                        { n: 'الظهر', t: prayerTimes.Dhuhr },
                        { n: 'العصر', t: prayerTimes.Asr },
                        { n: 'المغرب', t: prayerTimes.Maghrib },
                        { n: 'العشاء', t: prayerTimes.Isha }
                      ].map(p => (
                        <div key={p.n} className="flex flex-col items-center">
                          <span className="text-[10px] md:text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{p.n}</span>
                          <span className="text-[11px] md:text-sm font-black text-teal-700 dark:text-teal-400">{p.t?.split(' ')[0] || '--'}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 text-center">
                      موقعك الحالي: <span className="text-teal-600 dark:text-teal-400">{location?.city ? `${location.city}، ${location.country}` : 'تحديد تلقائي (GPS)'}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* أزرار الإشعارات والاحتفال */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                <button
                  onClick={() => {
                    if (!notificationsEnabled && Notification.permission !== "granted") {
                      Notification.requestPermission().then(perm => {
                        if (perm === "granted") setNotificationsEnabled(true);
                      });
                    } else {
                      setNotificationsEnabled(!notificationsEnabled);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${notificationsEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  {notificationsEnabled ? <BellRing className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400" /> : <Bell className="w-6 h-6 mb-2 opacity-50" />}
                  <span className="font-bold text-sm">التنبيهات</span>
                  <span className="text-[10px] opacity-70 mt-1">(في المتصفح)</span>
                </button>
                <button
                  onClick={() => setCelebrationEnabled(!celebrationEnabled)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${celebrationEnabled ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-300 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500'}`}
                >
                  <Star className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">الاحتفال بالنهاية</span>
                  <span className="text-[10px] opacity-70 mt-1">(عند إتمام 100%)</span>
                </button>
              </div>

              {/* إعداد المظهر (ليلي / نهاري) */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">مظهر التطبيق</span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 font-bold transition shadow-sm active:scale-95"
                >
                  {isDarkMode ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <span>{isDarkMode ? 'ليلي' : 'نهاري'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">حجم الخط</span>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
                  <button
                    onClick={() => setFontSizeIndex(p => Math.min(p + 1, fontSizes.length - 1))}
                    disabled={fontSizeIndex === fontSizes.length - 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg min-w-[20px] text-center">{fontSizeIndex + 1}</span>
                  <button
                    onClick={() => setFontSizeIndex(p => Math.max(p - 1, 0))}
                    disabled={fontSizeIndex === 0}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 rounded-md transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* قسم اختيار الألوان */}
              <div className="flex flex-col gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2 border-b border-slate-200 dark:border-slate-600 pb-3">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">تخصيص الألوان</span>
                  </div>
                  <button
                    onClick={() => setThemeColors(defaultThemeColors)}
                    className="text-xs text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                    title="العودة للألوان الأصلية"
                  >
                    <RotateCcw className="w-3 h-3" /> الافتراضي
                  </button>
                </div>

                {Object.keys(defaultThemeColors).map(tab => (
                  <div key={tab} className="flex items-center justify-between py-1">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-400 w-20 shrink-0">
                      {getTabLabel(tab)}
                    </span>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {Object.keys(colorMap).map(color => (
                        <button
                          key={color}
                          onClick={() => setThemeColors({ ...themeColors, [tab]: color })}
                          className={`w-6 h-6 rounded-full transition-all ${themeColors[tab] === color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-400 scale-110' : 'opacity-50 hover:opacity-100 hover:scale-110'}`}
                          style={{ backgroundColor: colorMap[color].hex }}
                          title={colorMap[color].name}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={celebrationEnabled} onChange={(e) => setCelebrationEnabled(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">الاحتفال والدعاء عند الإنجاز</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showTakhreej} onChange={(e) => setShowTakhreej(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض تخريج الأحاديث</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFadl} onChange={(e) => setShowFadl(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض فضل الذكر</span>
              </label>
              <label className="flex items-center space-x-4 space-x-reverse p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition border border-transparent">
                <input type="checkbox" checked={showFawaid} onChange={(e) => setShowFawaid(e.target.checked)} className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500" />
                <span className="font-semibold text-lg text-slate-700 dark:text-slate-200">عرض الفوائد اللغوية</span>
              </label>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="mt-8 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-lg transition shadow-md"
            >
              حفظ وإغلاق
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pt-[130px] md:pt-[140px]">

        {/* --- تنبيه أوقات الأذكار --- */}
        {activeTab !== 'garden' && (
          <div className="mb-8 p-5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
            <div className="flex items-start gap-3">
              <TabIcon className={`w-6 h-6 ${currentTabTheme.icon} shrink-0 mt-1`} />
              <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                  {activeTab === 'sleep' ? 'سنن وآداب النوم' : activeTab === 'wake' ? 'عند الاستيقاظ والتعار من الليل' : activeTab === 'prayer' ? 'أذكار ما بعد الصلاة المفروضة' : 'وقت الأذكار المفضل'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  {activeTab === 'sleep' ? (
                    <span>
                      يُستحب للمسلم إذا أتى فراشه أن يكون على <strong className={currentTabTheme.icon}>طهارة</strong>، وأن <strong className={currentTabTheme.icon}>ينفض فراشه</strong> بداخلة إزاره، وأن يضطجع على <strong className={currentTabTheme.icon}>جنبه الأيمن</strong>، وأن يضع يده تحت خده الأيمن، ثم يأتي بالأذكار.
                    </span>
                  ) : activeTab === 'wake' ? (
                    <span>
                      يُستحب للمسلم أول ما يستيقظ من نومه أن <strong className={currentTabTheme.icon}>يمسح النوم عن وجهه</strong> بيده، ثم يأتي بأذكار الاستيقاظ. ولمن استيقظ من الليل وتَقَلَّب أن يأتي بذكر <strong className={currentTabTheme.icon}>التعار من الليل</strong> فدعوته مستجابة.
                    </span>
                  ) : activeTab === 'prayer' ? (
                    <span>
                      تُقرأ هذه الأذكار دبر كل <strong className={currentTabTheme.icon}>صلاة مكتوبة (مفروضة)</strong>، ويُسنّ للمسلم أن لا يبرح مكانه حتى ينهيها لينال أجرها العظيم.
                    </span>
                  ) : activeTab === 'morning' ? (
                    <span>
                      <strong className={currentTabTheme.icon}>وقت الصباح:</strong> يبدأ من طلوع الفجر الصادق، ويمتد إلى شروق الشمس.
                    </span>
                  ) : (
                    <span>
                      <strong className={currentTabTheme.icon}>وقت المساء:</strong> يبدأ من بعد صلاة العصر، ويمتد إلى غروب الشمس.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- زر أذكار التعار - يظهر فقط في نافذة الاستيقاظ --- */}
        {activeTab === 'wake' && (
          <div className="mb-8">
            <button
              onClick={() => setShowTaarSection(!showTaarSection)}
              className={`w-full p-5 rounded-3xl flex items-center justify-between transition-all shadow-lg active:scale-95 ${showTaarSection ? 'bg-slate-800 text-white' : `bg-gradient-to-r ${currentTabTheme.taarBtn} text-white`}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${showTaarSection ? 'bg-slate-700' : 'bg-white/20'}`}>
                  <MoonStar className={showTaarSection ? 'text-yellow-400' : 'text-white'} />
                </div>
                <div className="text-right">
                  <h3 className="font-black text-lg">أذكار التعار من الليل</h3>
                  <p className="text-xs opacity-80">إذا استيقظت أو تقلبت في الليل</p>
                </div>
              </div>
              {showTaarSection ? <ChevronUp /> : <ChevronDown />}
            </button>

            {/* --- قسم التعار المنسدل --- */}
            {showTaarSection && (
              <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl text-amber-800 dark:text-amber-200 text-xs border border-amber-200 dark:border-amber-800 flex gap-3">
                  <Info className="w-5 h-5 shrink-0" />
                  <p>هذه الأذكار لها فضل عظيم جداً؛ فمن قالها ثم دعا استُجيب له، وإن توضأ وصلى قُبلت صلاته.</p>
                </div>

                {taarAdhkar.map(dhikr => {
                  const count = progress[`${activeTab}-${dhikr.id}`] || 0;
                  const done = count >= dhikr.target;
                  return (
                    <div key={dhikr.id} id={`dhikr-${dhikr.id}`} className={`dhikr-card ${done ? 'completed' : ''} bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700`}>
                      <p className={`font-bold leading-relaxed mb-4 ${fontSizes[fontSizeIndex]}`}>
                        {dhikr.textMorning}
                      </p>

                      {showTakhreej && dhikr.takhreej && (
                        <div className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl mb-3 border border-slate-100 dark:border-slate-800">
                          <BookOpen className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                          <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
                        </div>
                      )}
                      {showFadl && dhikr.fadl && (
                        <div className="flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl mb-6 border border-rose-100 dark:border-rose-900/20">
                          <Star className="w-4 h-4 shrink-0 mt-0.5" />
                          <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
                        </div>
                      )}

                      <button
                        onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                        className={`dhikr-increment-btn w-full py-4 rounded-xl font-black text-lg shadow-md transition-all flex items-center justify-center gap-2 ${done ? currentTabTheme.counterDone + ' cursor-default shadow-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}
                      >
                        {done ? <CheckCircle className="mx-auto" /> : `كرر: ${count} / ${dhikr.target}`}
                      </button>
                    </div>
                  );
                })}
                <div className="h-px bg-slate-200 dark:bg-slate-700 w-full my-4" />
              </div>
            )}
          </div>
        )}

        {/* --- عرض بستان الجنة كـ Tab --- */}
        {activeTab === 'garden' && (
          <div className="w-full flex justify-center animate-in fade-in zoom-in-95 duration-500">
            <JannahGarden totalTasbeehs={totalTasbeehsMade + totalAdhkarRead} />
          </div>
        )}

        {/* --- عنوان القسم وزر تصفير الكل --- */}
        {activeTab !== 'garden' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                {activeTab === 'morning' && 'أذكار الصباح'}
                {activeTab === 'evening' && 'أذكار المساء'}
                {activeTab === 'sleep' && 'أذكار النوم'}
                {activeTab === 'wake' && 'أذكار الاستيقاظ'}
                {activeTab === 'prayer' && 'أذكار بعد الصلاة'}
              </h2>
              <button
                onClick={resetAllProgress}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl transition-colors text-sm md:text-base font-bold shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                تصفير الكل
              </button>
            </div>

            {/* --- التتبع النفسي (Mood Tracker) --- */}
            {shouldShowBeforeMood && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 dark:border-slate-700 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Heart className="w-6 h-6 animate-[pulse_2s_ease-in-out_infinite]" />
                  كيف حال قلبك الآن؟
                </h3>
                <p className="text-center text-slate-500 dark:text-slate-400 text-sm md:text-base mb-6">قبل أن تبدأ بذكر الله، سجل شعورك الحالي.</p>

                <div className="flex justify-center gap-3 md:gap-8 flex-wrap">
                  {[
                    { id: 'sad', icon: '😔', label: 'حزين' },
                    { id: 'anxious', icon: '😟', label: 'قلق' },
                    { id: 'tired', icon: '😩', label: 'متعب' },
                    { id: 'calm', icon: '😌', label: 'هادئ' },
                    { id: 'peaceful', icon: '🤍', label: 'مطمئن' }
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id, 'before')}
                      className="flex flex-col items-center gap-2 p-3 md:p-4 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all hover:scale-110 active:scale-95"
                    >
                      <span className="text-4xl md:text-5xl">{mood.icon}</span>
                      <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {shouldShowAfterMood && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 backdrop-blur-xl rounded-3xl p-6 md:p-8 mb-8 border border-emerald-200 dark:border-emerald-800/50 shadow-2xl animate-in zoom-in duration-500">
                <h3 className="text-xl md:text-2xl font-bold mb-2 flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <Heart className="w-6 h-6 animate-[pulse_2s_ease-in-out_infinite]" />
                  كيف حال قلبك الآن بعد الذكر؟
                </h3>
                <p className="text-center text-emerald-600/80 dark:text-emerald-400/80 text-sm md:text-lg mb-6 font-bold">«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ»</p>

                <div className="flex justify-center gap-3 md:gap-8 flex-wrap">
                  {[
                    { id: 'sad', icon: '😔', label: 'حزين' },
                    { id: 'anxious', icon: '😟', label: 'قلق' },
                    { id: 'tired', icon: '😩', label: 'متعب' },
                    { id: 'calm', icon: '😌', label: 'هادئ' },
                    { id: 'peaceful', icon: '🤍', label: 'مطمئن' }
                  ].map(mood => (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id, 'after')}
                      className="flex flex-col items-center gap-2 p-3 md:p-4 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all hover:scale-110 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      <span className="text-4xl md:text-5xl">{mood.icon}</span>
                      <span className="text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300">{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* --- قائمة الأذكار الرئيسية (تتغير حسب التبويب) --- */}
            <div className="space-y-6 md:space-y-8">
              {currentTabAdhkar.map((dhikr) => {
                const currentCount = progress[`${activeTab}-${dhikr.id}`] || 0;
                const isCompleted = currentCount >= dhikr.target;
                const percentage = dhikr.target > 1 ? (currentCount / dhikr.target) : (currentCount > 0 ? 1 : 0);

                const displayText = (activeTab === 'evening' && dhikr.textEvening) ? dhikr.textEvening : dhikr.textMorning;

                let counterBgClass = isCompleted
                  ? currentTabTheme.counterDone + " cursor-default shadow-none"
                  : percentage > 0.6 ? `${currentTabTheme.counterHigh} text-white shadow-lg dark:shadow-none`
                    : percentage > 0.3 ? `${currentTabTheme.counterMed} text-white shadow-lg dark:shadow-none`
                      : `${currentTabTheme.counterLow} text-white shadow-lg dark:shadow-none`;

                return (
                  <div
                    key={dhikr.id}
                    id={`dhikr-${dhikr.id}`}
                    className={`dhikr-card ${isCompleted ? 'completed' : ''} card-hover group relative bg-white dark:bg-slate-800 rounded-3xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border ${isCompleted ? 'border-slate-200 dark:border-slate-700 opacity-90' : 'border-slate-200 dark:border-slate-700'} overflow-hidden scroll-mt-24`}
                  >
                    <div className={`py-3 px-6 text-sm md:text-base font-bold border-b border-slate-200 dark:border-slate-700 flex justify-between items-center ${currentTabTheme.cardHeader}`}>
                      <span>{dhikr.category}</span>
                    </div>

                    <div className="p-6 md:p-8">
                      <p className={`font-cairo font-semibold leading-[2.4] md:leading-[2.6] text-slate-800 dark:text-slate-100 mb-8 whitespace-pre-line text-justify md:text-right ${fontSizes[fontSizeIndex]}`}>
                        {displayText}
                      </p>

                      <div className="space-y-3 mb-8">
                        {showTakhreej && dhikr.takhreej && (
                          <div className="flex items-start gap-3 text-sm md:text-base text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <BookOpen className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" />
                            <span><strong className="text-slate-700 dark:text-slate-300">التخريج:</strong> {dhikr.takhreej}</span>
                          </div>
                        )}
                        {showFadl && dhikr.fadl && (
                          <div className="flex items-start gap-3 text-sm md:text-base text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/10 p-4 rounded-xl border border-rose-100 dark:border-rose-900/20">
                            <Star className="w-5 h-5 shrink-0 mt-0.5" />
                            <span><strong>فضل الذكر:</strong> {dhikr.fadl}</span>
                          </div>
                        )}
                        {showFawaid && dhikr.fawaid && (
                          <div className="flex items-start gap-3 text-sm md:text-base text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                            <Info className="w-5 h-5 shrink-0 mt-0.5" />
                            <span><strong>فائدة:</strong> {dhikr.fawaid}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row-reverse gap-3 items-stretch justify-center w-full md:w-5/6 mx-auto">
                        <button
                          onClick={() => resetSingleDhikr(dhikr.id)}
                          className="px-5 md:px-8 rounded-3xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-500 hover:text-slate-700 dark:text-slate-300 transition-all flex justify-center items-center active:scale-95 border border-slate-200 dark:border-slate-600"
                          title="إعادة تصفير هذا الذكر"
                        >
                          <RotateCcw className="w-7 h-7 md:w-8 md:h-8" />
                        </button>

                        <button
                          onClick={() => handleDhikrClick(dhikr.id, dhikr.target)}
                          disabled={isCompleted}
                          className={`dhikr-increment-btn flex-1 relative overflow-hidden h-[120px] md:h-[140px] rounded-3xl font-bold text-2xl md:text-4xl transition-all duration-300 flex justify-center items-center gap-4 active:scale-95 ${counterBgClass}`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-8 h-8 md:w-10 md:h-10" />
                              <span>تم الانتهاء</span>
                            </>
                          ) : (
                            <>
                              <span className="bg-black/10 dark:bg-white/10 px-5 py-2 rounded-2xl text-3xl md:text-5xl font-extrabold tracking-wider z-10">
                                {currentCount} <span className="text-xl md:text-2xl text-white/70">/ {dhikr.target}</span>
                              </span>
                              <span className="hidden md:inline text-white/90 z-10 font-semibold">اضغط للعد</span>
                            </>
                          )}

                          {!isCompleted && dhikr.target > 1 && currentCount > 0 && (
                            <div
                              className="absolute top-0 right-0 h-full bg-black/10 z-0 transition-all duration-300"
                              style={{ width: `${percentage * 100}%` }}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      <footer className="bg-slate-200 dark:bg-slate-950 py-8 text-center text-slate-600 dark:text-slate-400 mt-12 border-t border-slate-300 dark:border-slate-800">
        <p className="font-bold text-lg">تنسيق: قصي مسالمة</p>
        <p className="text-sm mt-2 opacity-80">تم التصميم بناءًا على رسائل د. مطلق الجاسر</p>
      </footer>

      {/* بطاقة الإنجاز (مخفية، تستخدم للتصدير فقط) موجودة في جذر التطبيق لتفادي مشاكل القص */}
      <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100 }}>
        <div id="story-export-card" className="w-[1080px] h-[1920px] bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 flex flex-col items-center justify-center p-20 text-white relative overflow-hidden" dir="rtl">
          {/* زخرفة خلفية عشوائية */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.4) 0%, transparent 50%)' }}></div>

          <div className="z-10 bg-white/10 backdrop-blur-2xl p-16 rounded-[4rem] border-4 border-white/20 shadow-2xl w-full max-w-[900px] flex flex-col items-center text-center">
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-10 rounded-full mb-12 shadow-[0_0_80px_rgba(251,191,36,0.6)]">
              <Flame className="w-32 h-32 text-white" />
            </div>

            <h1 className="text-7xl font-black mb-8 text-white">إنجاز عظيم!</h1>
            <p className="text-5xl leading-snug mb-16 text-white/90 font-bold">
              أنا أواظب على أذكاري وتسابيحي لـ
              <br />
              <span className="text-amber-400 text-[12rem] leading-none font-black block my-12 drop-shadow-lg">{streak}</span>
              يوم متتالي بفضل الله
            </p>

            <div className="grid grid-cols-2 gap-8 w-full">
              <div className="bg-black/30 p-10 rounded-[3rem] border border-white/10 shadow-inner">
                <TasbeehIcon className="w-20 h-20 mx-auto mb-6 text-teal-400" />
                <div className="text-5xl font-black mb-2">{totalTasbeehsMade}</div>
                <div className="text-3xl text-white/70 font-bold">تسبيحة</div>
              </div>
              <div className="bg-black/30 p-10 rounded-[3rem] border border-white/10 shadow-inner">
                <BookOpen className="w-20 h-20 mx-auto mb-6 text-indigo-400" />
                <div className="text-5xl font-black mb-2">{totalAdhkarRead}</div>
                <div className="text-3xl text-white/70 font-bold">ذكر مقروء</div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-24 flex items-center gap-6 z-10 bg-black/40 backdrop-blur-md px-12 py-6 rounded-full border border-white/10">
            <div className="bg-teal-500 p-4 rounded-3xl">
              <Moon className="w-10 h-10 text-white" />
            </div>
            <div className="text-4xl font-bold text-white tracking-wide">تطبيق حصن المسلم - DhikrBook</div>
          </div>
        </div>
      </div>
    </div>
  );
}