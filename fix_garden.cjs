const fs = require('fs');
let content = fs.readFileSync('src/components/Garden/Garden3D.jsx', 'utf8');

// Add Leaf import
if (!content.includes("import { Leaf }")) {
    content = content.replace(
        "import * as THREE from 'three';",
        "import * as THREE from 'three';\nimport { Leaf } from 'lucide-react';"
    );
}

// Add the Hadith and Title overlay
const newOverlay = `
      {/* Overlay UI - Hadith and Title */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center z-10 p-6 md:p-8 mt-2">
        <h4 className="text-3xl md:text-5xl font-black mb-4 text-emerald-300 drop-shadow-md flex items-center justify-center gap-3">
          <Leaf className="w-8 h-8 md:w-12 md:h-12 text-emerald-400 animate-pulse" />
          بستان الجنة
        </h4>
        <p className="text-xs md:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed font-medium px-4 text-center">
          «ألَا أدُلُّكَ على غِراسٍ، هو خير مِنْ هذا؟ تقول: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر، يُغرس لك بكل كلمةٍ منها شجرةٌ في الجنة»
        </p>
      </div>

      <Canvas`;

content = content.replace("<Canvas", newOverlay);

fs.writeFileSync('src/components/Garden/Garden3D.jsx', content, 'utf8');
console.log("Fixed Garden3D Hadith and Leaf");
