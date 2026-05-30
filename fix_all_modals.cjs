const fs = require('fs');
const path = require('path');

const modalsDir = 'src/components/Modals';
const files = fs.readdirSync(modalsDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(modalsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find all JSX tags
  const tags = [...content.matchAll(/<([A-Z][a-zA-Z0-9]+)/g)].map(m => m[1]);
  const uniqueTags = [...new Set(tags)];

  // We only care about lucide-react and Icons.jsx icons.
  // Actually, let's just make sure all used capital tags are imported SOMEWHERE.
  let missing = [];
  uniqueTags.forEach(tag => {
    // If it's a DOM element, skip (but we only matched capital letters)
    // If it's in the file, it must be imported or declared.
    const importRegex = new RegExp(`import.*\\b${tag}\\b.*from`);
    const declRegex = new RegExp(`(function|const|let|var|class)\\s+${tag}\\b`);
    if (!importRegex.test(content) && !declRegex.test(content) && tag !== 'TasbeehIcon') {
        missing.push(tag);
    }
  });

  if (missing.length > 0) {
    console.log(`File: ${file} is missing imports for: ${missing.join(', ')}`);
    
    // Auto-fix lucide-react imports!
    // We assume all missing capital tags are from lucide-react except TasbeehIcon.
    const lucideRegex = /import\s+\{([^}]+)\}\s+from\s+'lucide-react'/;
    if (lucideRegex.test(content)) {
        content = content.replace(lucideRegex, (match, p1) => {
            const existing = p1.split(',').map(s => s.trim()).filter(s => s);
            const newImports = [...new Set([...existing, ...missing])];
            return `import { ${newImports.join(', ')} } from 'lucide-react'`;
        });
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`-> Fixed ${file}`);
    } else {
        content = `import { ${missing.join(', ')} } from 'lucide-react';\n` + content;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`-> Fixed ${file} (added import)`);
    }
  }
});
