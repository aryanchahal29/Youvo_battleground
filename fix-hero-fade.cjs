const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /bg-white\/80/,
  'bg-white/90' // oops, I need to check where bg-white/80 is first
);
