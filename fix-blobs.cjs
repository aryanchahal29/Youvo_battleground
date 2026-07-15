const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /\$\{theme === "dark" \? "mix-blend-screen" : "mix-blend-multiply"\}/g,
  '${theme === "dark" ? "mix-blend-screen opacity-100" : "mix-blend-normal opacity-50"}'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
