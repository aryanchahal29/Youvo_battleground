const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
content = content.replace(
  /\<div className=\{\`absolute top-1\/2 left-1\/2 -translate-x-1\/2 -translate-y-1\/2 w-\[120%\] h-\[150%\] rounded-\[100%\] blur-\[100px\] pointer-events-none -z-10 \$\{theme === "dark" \? "" : "bg-white\/50"\}\`\}\>\<\/div\>/,
  '<div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] blur-[100px] pointer-events-none -z-10 ${theme === "dark" ? "" : "bg-white/20"}`}></div>'
);
fs.writeFileSync('src/components/LandingPage.tsx', content);
