const fs = require('fs');
let content = fs.readFileSync('src/hooks/useAppLogic.jsx', 'utf8');

const regex = /import \{ Flame, Shield, Target, Trophy, Crown, CheckCircle, Star, MoonStar, Award, Sunrise, BookOpen, Sun, Edit3 \} from 'lucide-react';/;
const newImport = "import { Flame, Shield, Target, Trophy, Crown, CheckCircle, Star, MoonStar, Award, Sunrise, BookOpen, Sun, Edit3, Moon, Clock, Leaf, Sunset } from 'lucide-react';";

content = content.replace(regex, newImport);

fs.writeFileSync('src/hooks/useAppLogic.jsx', content, 'utf8');
console.log('Added missing icons to useAppLogic.jsx');
