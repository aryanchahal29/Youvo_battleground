const fs = require('fs');
let landing = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

landing = landing.replace(
  /<div className="hidden sm:flex items-center gap-5 pr-5 border-r border-neutral-200 dark:border-neutral-800">/g,
  '<div className="flex items-center gap-5 sm:pr-5 sm:border-r border-neutral-200 dark:border-neutral-800">'
);
fs.writeFileSync('src/components/LandingPage.tsx', landing);
console.log("Done");
