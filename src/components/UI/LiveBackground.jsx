import React from 'react';
import { Sun, Moon, Cloud, Star, Leaf, RefreshCw } from 'lucide-react';

export const CelestialElements = ({ activeTab }) => {
  if (activeTab === 'sleep') {
    // نجوم وقمر
    return (
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <svg className="absolute top-[10%] left-[10%] w-20 h-20 md:w-32 md:h-32 text-indigo-200/50 drop-shadow-2xl animate-[pulse_4s_ease-in-out_infinite]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>
    );
  }

  if (activeTab === 'morning' || activeTab === 'wake') {
    // شمس مشرقة
    return (
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className={`absolute ${activeTab === 'wake' ? 'bottom-[20%] left-[10%]' : 'top-[10%] right-[10%]'} w-32 h-32 md:w-48 md:h-48 rounded-full bg-yellow-300/20 filter blur-xl animate-pulse duration-1000`}></div>
        <svg className={`absolute ${activeTab === 'wake' ? 'bottom-[22%] left-[12%]' : 'top-[12%] right-[12%]'} w-24 h-24 md:w-36 md:h-36 text-yellow-400 opacity-80 animate-[spin_40s_linear_infinite] will-change-transform`} viewBox="0 0 24 24" fill="currentColor" style={{ filter: 'drop-shadow(0 4px 6px rgba(250,204,21,0.5))' }}>
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18.75a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zM6.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 101.06-1.061l-1.591-1.59zM4.5 12a.75.75 0 01-.75.75H1.5a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM6.166 6.166a.75.75 0 001.06 1.06L5.636 8.818a.75.75 0 10-1.06 1.06l1.59 1.59z" />
        </svg>
      </div>
    );
  }

  if (activeTab === 'evening') {
    // غيوم الغروب
    return (
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <svg className="absolute top-[15%] right-[-10%] w-40 h-40 text-orange-200/40 drop-shadow-md animate-blob1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 17.5A3.5 3.5 0 013 14a3.5 3.5 0 012.71-3.41 5.5 5.5 0 0110.58-1.59 4.5 4.5 0 013.71 4.5 4.5 0 01-4.5 4.5H6.5z" />
        </svg>
        <svg className="absolute top-[30%] left-[-5%] w-32 h-32 text-orange-300/30 drop-shadow-md animate-blob2" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 17.5A3.5 3.5 0 013 14a3.5 3.5 0 012.71-3.41 5.5 5.5 0 0110.58-1.59 4.5 4.5 0 013.71 4.5 4.5 0 01-4.5 4.5H6.5z" />
        </svg>
      </div>
    );
  }

  return null;
};

// مكون الخلفية الحية التفاعلية
export const LiveBackground = ({ colorTheme, isDarkMode, isInteracting, activeTab }) => {
  if (!colorTheme) return null;
  const b1 = isDarkMode ? colorTheme.darkBlob1 : colorTheme.blob1;
  const b2 = isDarkMode ? colorTheme.darkBlob2 : colorTheme.blob2;
  const b3 = isDarkMode ? colorTheme.darkBlob3 : colorTheme.blob3;

  // تقليل العبء على المعالج الرسومي بإزالة تغييرات الـ blur المتحركة
  const interactionClass = isInteracting ? 'scale-[1.05] opacity-50' : 'scale-100 opacity-30';

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] transition-colors duration-1000 bg-slate-50 dark:bg-slate-900">

      {/* Blob 1 */}
      <div className={`absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] md:w-[45vw] md:h-[45vw] rounded-full transition-transform duration-700 ease-out animate-blob1 blur-3xl will-change-transform ${b1} ${interactionClass}`}></div>
      {/* Blob 2 */}
      <div className={`absolute top-[10%] right-[-10%] w-[65vw] h-[65vw] md:w-[40vw] md:h-[40vw] rounded-full transition-transform duration-700 ease-out animate-blob2 blur-3xl will-change-transform ${b2} ${interactionClass}`} style={{ animationDelay: '2s' }}></div>
      {/* Blob 3 */}
      <div className={`absolute bottom-[-10%] left-[10%] w-[80vw] h-[80vw] md:w-[55vw] md:h-[55vw] rounded-full transition-transform duration-700 ease-out animate-blob3 blur-3xl will-change-transform ${b3} ${interactionClass}`} style={{ animationDelay: '4s' }}></div>

      {/* العناصر السماوية بناءً على التبويب */}
      <CelestialElements activeTab={activeTab} />

      {/* وميض تفاعلي خفيف عند التسبيح بدلاً من المربك */}
      <div className={`absolute top-[30%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-white dark:bg-white/20 transition-all duration-300 blur-3xl ${isInteracting ? 'opacity-30 scale-125' : 'opacity-0 scale-50'}`}></div>
    </div>
  );
};
