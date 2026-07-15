const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const regex = /<a href="#enterprise".*?>\s*Enterprise <span.*?>New<\/span>\s*<\/a>/gs;
content = content.replace(regex, '');

fs.writeFileSync('src/components/LandingPage.tsx', content);
