const fs = require('fs');
const path = require('path');

const dirs = ['src/components/Cards', 'src/components/UI', 'src/components/Garden'];

dirs.forEach(dir => {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');

        const tags = [...content.matchAll(/<([A-Z][a-zA-Z0-9]+)/g)].map(m => m[1]);
        const uniqueTags = [...new Set(tags)];

        let missing = [];
        uniqueTags.forEach(tag => {
            const importRegex = new RegExp(`import.*\\b${tag}\\b.*from`);
            const declRegex = new RegExp(`(function|const|let|var|class)\\s+${tag}\\b`);
            if (!importRegex.test(content) && !declRegex.test(content) && tag !== 'TasbeehIcon') {
                // Some are React three fiber tags. We ignore them if they are from drei or three.
                if (['Canvas', 'OrbitControls', 'Sky', 'ContactShadows', 'Cloud', 'Float', 'Suspense'].includes(tag)) return;
                missing.push(tag);
            }
        });

        if (missing.length > 0) {
            console.log(`File: ${file} is missing imports for: ${missing.join(', ')}`);
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
});
