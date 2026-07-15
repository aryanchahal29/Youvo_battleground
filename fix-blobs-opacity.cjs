const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(/bg-violet-600\/20/g, 'bg-violet-600/40');
content = content.replace(/bg-fuchsia-600\/10/g, 'bg-fuchsia-600/30');

fs.writeFileSync('src/components/LandingPage.tsx', content);

let model = fs.readFileSync('src/components/ThreeDModel.tsx', 'utf8');
model = model.replace(/className=\{`absolute inset-0 z-0 pointer-events-none flex items-center justify-center \$\{theme === "dark" \? "opacity-100" : "opacity-90"\}`\}/g,
'className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center ${theme === "dark" ? "opacity-100" : "opacity-[0.85]"}`}');
fs.writeFileSync('src/components/ThreeDModel.tsx', model);
