const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Remove navigation link
content = content.replace(
  /\s*<a href="#enterprise"[^>]*>\s*Enterprise\s*<span[^>]*>New<\/span>\s*<\/a>/,
  ''
);

// Remove enterprise section block
const enterpriseSectionRegex = /\s*\{\/\* 6\. Enterprise Section \*\/\}.*?(?=\{\/\* 7\. CTA Section \*\/\})/s;
content = content.replace(enterpriseSectionRegex, '\n      ');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Removed Enterprise link and section.');
