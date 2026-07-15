const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(/\(sessionStorage.getItem\("youvo_theme"\) as "light" \| "dark"\) \|\| "dark"/g,
  '(sessionStorage.getItem("youvo_theme") as "light" | "dark") || "light"');

fs.writeFileSync('src/App.tsx', content);
