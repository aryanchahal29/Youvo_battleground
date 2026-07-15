const fs = require('fs');
let landing = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

landing = landing.replace(/py-24 px-6/g, 'py-16 md:py-24 px-4 sm:px-6');
landing = landing.replace(/py-32 px-6/g, 'py-20 md:py-32 px-4 sm:px-6');
landing = landing.replace(/px-6 md:px-10/g, 'px-4 md:px-10'); // Header

fs.writeFileSync('src/components/LandingPage.tsx', landing);
console.log("Done");
