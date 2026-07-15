const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /<span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-\[length:200%_auto\] animate-gradient">/,
  '<span className="relative z-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient drop-shadow-sm">'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
