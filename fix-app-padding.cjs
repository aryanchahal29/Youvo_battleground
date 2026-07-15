const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

app = app.replace(/px-6/g, 'px-4 sm:px-6');

fs.writeFileSync('src/App.tsx', app);
console.log("Done");
