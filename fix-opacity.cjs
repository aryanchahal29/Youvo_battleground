const fs = require('fs');
let content = fs.readFileSync('src/components/ThreeDModel.tsx', 'utf8');

content = content.replace(/className=\{`absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-80 `\}/,
  'className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center ${theme === "dark" ? "opacity-100" : "opacity-80"}`}');

fs.writeFileSync('src/components/ThreeDModel.tsx', content);
console.log('Fixed opacity');
