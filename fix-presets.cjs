const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(
  /<div className="grid grid-cols-4 gap-1.5 bg-neutral-100/g,
  '<div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-neutral-100'
);
fs.writeFileSync('src/App.tsx', app);
console.log("Done");
