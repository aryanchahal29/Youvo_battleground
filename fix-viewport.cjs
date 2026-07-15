const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace viewport={{ once: true }} with viewport={{ once: false, amount: 0.1 }}
content = content.replace(/viewport={{ once: true }}/g, 'viewport={{ once: false, amount: 0.1 }}');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed viewport settings for re-triggering animations.');
