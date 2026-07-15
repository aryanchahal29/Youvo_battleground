const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');
content = content.replace('animate-[shimmer_3s_infinite]', 'animate-shimmer');
fs.writeFileSync('src/components/LandingPage.tsx', content);
