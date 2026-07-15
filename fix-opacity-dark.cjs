const fs = require('fs');

let model = fs.readFileSync('src/components/ThreeDModel.tsx', 'utf8');
model = model.replace(/className=\{`absolute inset-0 z-0 pointer-events-none flex items-center justify-center \$\{theme === "dark" \? "opacity-30" : "opacity-\[0\.85\]"\}`\}/,
'className={`absolute inset-0 z-0 pointer-events-none flex items-center justify-center ${theme === "dark" ? "opacity-80" : "opacity-[0.85]"}`}');
fs.writeFileSync('src/components/ThreeDModel.tsx', model);

let landing = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
landing = landing.replace(
  /\<div className=\{\`absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-\[120%\] h-\[150%\] rounded-\[100%\] blur-\[100px\] pointer-events-none -z-10 \$\{theme === "dark" \? "bg-black\/60" : "bg-white\/20"\}\`\}\>\<\/div\>/,
  '<div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] blur-[100px] pointer-events-none -z-10 ${theme === "dark" ? "bg-black/20" : "bg-white/20"}`}></div>'
);
fs.writeFileSync('src/components/LandingPage.tsx', landing);
