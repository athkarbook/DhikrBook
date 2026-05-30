const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAppLogic.jsx', 'utf8');

const oldLucideImport = "import { Flame, Shield, Target, Trophy, Crown, CheckCircle } from 'lucide-react';";
const newLucideImport = "import { Flame, Shield, Target, Trophy, Crown, CheckCircle, Star, MoonStar, Award, Sunrise, BookOpen, Sun, Edit3 } from 'lucide-react';\nimport { TasbeehIcon } from '../components/UI/Icons';";

content = content.replace(oldLucideImport, newLucideImport);

fs.writeFileSync('src/hooks/useAppLogic.jsx', content, 'utf8');
console.log('Fixed missing icon imports in useAppLogic.jsx');
