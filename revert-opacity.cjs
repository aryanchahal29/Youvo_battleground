const fs = require('fs');
let content = fs.readFileSync('src/components/ThreeDModel.tsx', 'utf8');

content = content.replace(/className=\{`absolute inset-0 z-0 pointer-events-none flex items-center justify-center \$\{theme === "dark" \? "opacity-100" : "opacity-30"\}`\}/,
  'className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center ${theme === "dark" ? "opacity-100" : "opacity-80"}`}');

fs.writeFileSync('src/components/ThreeDModel.tsx', content);

let lp = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
lp = lp.replace(/\$\{theme === "dark" \? "mix-blend-screen opacity-100" : "mix-blend-normal opacity-50"\}/g,
  '${theme === "dark" ? "mix-blend-screen" : "mix-blend-multiply"}');
fs.writeFileSync('src/components/LandingPage.tsx', lp);

console.log('Reverted opacity');
