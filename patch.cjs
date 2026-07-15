const fs = require('fs');

function patchFile(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix Logo wrapper in App.tsx
  content = content.replace(
    /<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500\/25 group-hover:scale-105 transition-transform">\s*<Logo className="w-5 h-5 text-white" \/>\s*<\/div>/g,
    '<Logo className="w-10 h-10 rounded-2xl shadow-lg group-hover:scale-105 transition-transform" />'
  );

  // Fix Logo wrapper in LandingPage.tsx
  content = content.replace(
    /<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500\/25">\s*<Logo className="w-5 h-5 text-white" \/>\s*<\/div>/g,
    '<Logo className="w-10 h-10 rounded-2xl shadow-lg" />'
  );

  // Fix Enterprise link in LandingPage.tsx
  content = content.replace(
    /<a href="#" className=\{`transition-colors flex items-center gap-1.5/g,
    '<a href="#enterprise" className={`transition-colors flex items-center gap-1.5'
  );

  fs.writeFileSync(file, content);
}

patchFile('src/App.tsx');
patchFile('src/components/LandingPage.tsx');
console.log('Patched Logo and links.');
