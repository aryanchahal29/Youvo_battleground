const fs = require('fs');
let content = fs.readFileSync('vite.config.ts', 'utf8');
content = content.replace(/allowedHosts: true,/, 'allowedHosts: true as true,');
fs.writeFileSync('vite.config.ts', content);
