const fs = require('fs');
let header = fs.readFileSync('src/components/UI/Header.jsx', 'utf8');

// Mic button
header = header.replace(
  /{isListening \? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' : 'bg-black\/20 hover:bg-black\/30 dark:bg-slate-700\/50 dark:hover:bg-slate-700'}/,
  "{isListening ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-2 ring-red-300 shadow-lg' : 'bg-emerald-500/80 hover:bg-emerald-600 text-white shadow-md ring-1 ring-white/50 animate-pulse-slow'} active:scale-90"
);

// Streak
header = header.replace(
  /className="flex items-center gap-1 bg-yellow-400\/20 text-yellow-100 px-2 py-1 rounded-full text-xs md:text-base font-bold border border-yellow-400\/30 cursor-pointer hover:bg-yellow-400\/30 transition"/,
  'className="flex items-center gap-1 bg-yellow-400/20 text-yellow-100 px-2 py-1 rounded-full text-xs md:text-base font-bold border border-yellow-400/30 cursor-pointer hover:bg-yellow-400/40 hover:shadow-lg active:scale-90 transition-all"'
);

// Level (Crown)
header = header.replace(
  /className="flex items-center gap-1 bg-white\/20 text-white px-2 py-1 rounded-full text-\[10px\] md:text-sm font-bold border border-white\/30 cursor-pointer hover:bg-white\/30 transition"/,
  'className="flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-[10px] md:text-sm font-bold border border-white/30 cursor-pointer hover:bg-white/40 hover:shadow-lg active:scale-90 transition-all"'
);

// Tasbeeh Target
header = header.replace(
  /className="hidden sm:flex items-center gap-1 bg-white\/20 text-white px-2 py-1 rounded-full text-xs md:text-base font-bold border border-white\/30 cursor-pointer hover:bg-white\/30 transition"/,
  'className="hidden sm:flex items-center gap-1 bg-white/20 text-white px-2 py-1 rounded-full text-xs md:text-base font-bold border border-white/30 cursor-pointer hover:bg-white/40 hover:shadow-lg active:scale-90 transition-all"'
);

// Add text to Mic button
header = header.replace(
  /{isListening \? <Mic className="w-4 h-4 md:w-5 md:h-5" \/> : <MicOff className="w-4 h-4 md:w-5 md:h-5" \/>}/,
  `{isListening ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
                <span className="text-[10px] sm:text-xs font-bold mr-1 leading-none hidden sm:inline-block">تلاوة ذكية</span>`
);

fs.writeFileSync('src/components/UI/Header.jsx', header, 'utf8');
console.log("Updated Header.jsx with active states and Mic label.");
