import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export function usePrayerTimes() {
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

  const [isLocating, setIsLocating] = useState(false);

  const calculatePrayerTimesLocally = (lat, lng) => {
    const coordinates = new Coordinates(lat, lng);
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
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=\${encodeURIComponent(query)}&format=json&limit=1`);
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

  return { prayerTimes, isLocating, autoFetchLocation, setPrayerTimes, setLocation, location };
}
