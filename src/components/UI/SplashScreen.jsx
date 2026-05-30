import React, { useEffect, useState } from 'react';

export const SplashScreen = ({ onComplete }) => {
  const [stage, setStage] = useState('intro'); // intro, growing, outro

  useEffect(() => {
    // Stage 1: Intro (0-1s) - Logo fades in
    const t1 = setTimeout(() => setStage('growing'), 500);
    
    // Stage 2: Growing (1s-2.5s) - Sparkle and text appear
    const t2 = setTimeout(() => setStage('outro'), 2500);
    
    // Stage 3: Outro (2.5s-3s) - Fades out completely
    const t3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-500 ${
        stage === 'outro' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glowing aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/20 blur-3xl rounded-full"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-400/20 blur-2xl rounded-full animate-pulse"></div>

      {/* Main Logo Container */}
      <div className={`relative z-10 transition-all duration-1000 transform ${
        stage === 'intro' ? 'scale-75 opacity-0 translate-y-8' : 'scale-100 opacity-100 translate-y-0'
      }`}>
        <img 
          src="/DhikrBook/ghiras-logo.svg" 
          alt="غراس" 
          className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]"
        />
        
        {/* Sparkle */}
        <div className={`absolute top-0 right-0 w-4 h-4 bg-white rounded-full blur-[2px] transition-opacity duration-500 ${
          stage === 'growing' ? 'opacity-100 animate-ping' : 'opacity-0'
        }`}></div>
      </div>

      {/* Text Branding */}
      <div className={`mt-8 text-center transition-all duration-1000 transform ${
        stage === 'growing' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-500 drop-shadow-md mb-2">
          غِراس
        </h1>
        <p className="text-emerald-100/70 font-medium tracking-wide text-sm md:text-base">
          بُستانُكَ مِن الذِّكر
        </p>
      </div>
    </div>
  );
};
