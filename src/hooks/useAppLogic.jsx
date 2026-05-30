import { usePrayerTimes } from './usePrayerTimes';
import { useVoiceTasbeeh } from './useVoiceTasbeeh';
import { useAudioVibration } from './useAudioVibration';
import { useImageExport } from './useImageExport';
import { Flame, Shield, Target, Trophy, Crown, CheckCircle, Star, MoonStar, Award, Sunrise, BookOpen, Sun, Edit3, Moon, Clock, Leaf, Sunset } from 'lucide-react';
import { TasbeehIcon } from '../components/UI/Icons';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { adhkarData, prayerAdhkar } from '../data/adhkar';
import { colorMap, defaultThemeColors } from '../utils/theme';
import html2canvas from 'html2canvas';

export function useAppLogic() {

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
  const { prayerTimes, isLocating, autoFetchLocation, setPrayerTimes, setLocation, location } = usePrayerTimes();

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
  const { isListening, speechSupported, toggleVoiceTasbeeh } = useVoiceTasbeeh();

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

  // دالة المؤثرات الصوتية والاهتزاز
  const { playSound, triggerVibration } = useAudioVibration(soundEnabled, vibrationEnabled);

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

  const { exportStatsAsImage, exportStoryAsImage } = useImageExport(setIsExporting, isDarkMode);

  // --- منطق التتبع النفسي (Mood Tracker) ---
  const isTabCompleted = currentTabAdhkar.length > 0 && currentTabAdhkar.every(dhikr => (progress[`${activeTab}-${dhikr.id}`] || 0) >= dhikr.target);

  const moodDateObj = new Date();
  const todayStr = `${moodDateObj.getFullYear()}-${String(moodDateObj.getMonth() + 1).padStart(2, '0')}-${String(moodDateObj.getDate()).padStart(2, '0')}`;
  const todayMoodData = moodLog[todayStr]?.[activeTab] || {};
  const hasAnsweredBefore = !!pendingMoods[activeTab] || !!todayMoodData.before;
  const hasAnsweredAfter = !!todayMoodData.after;
  const shouldShowBeforeMood = ['morning', 'evening', 'sleep', 'wake', 'prayer'].includes(activeTab) && !hasAnsweredBefore;
  const shouldShowAfterMood = ['morning', 'evening', 'sleep', 'wake', 'prayer'].includes(activeTab) && isTabCompleted && hasAnsweredBefore && !hasAnsweredAfter;

  
  

  return {
    needRefresh, setNeedRefresh, updateServiceWorker,
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
    fontSizeIndex, setFontSizeIndex,
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
    badges, exportStatsAsImage, exportStoryAsImage, isExporting,
    devData, setDevData,
    currentTabTheme, activeTab, setActiveTab, getTabClass, totalProgressPercentage,
    speechSupported, toggleVoiceTasbeeh, isListening, currentLevel,
    currentTabAdhkar, showConfetti, setShowConfetti, isInteracting, setIsInteracting,
    shouldShowBeforeMood, shouldShowAfterMood, handleMoodSelect
  };
}
