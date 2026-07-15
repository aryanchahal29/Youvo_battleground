const fs = require('fs');

function fixLogo(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Fix App.tsx
  if (file.includes('App.tsx')) {
    content = content.replace(
      /<Logo className="w-10 h-10 rounded-2xl shadow-lg group-hover:scale-105 transition-transform" \/>/g,
      '<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform"><Logo className="w-6 h-6 text-white" /></div>'
    );
  }

  // Fix LandingPage.tsx
  if (file.includes('LandingPage.tsx')) {
    content = content.replace(
      /<Logo className="w-10 h-10 rounded-2xl shadow-lg" \/>/g,
      '<div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/25"><Logo className="w-6 h-6 text-white" /></div>'
    );
  }

  fs.writeFileSync(file, content);
}

fixLogo('src/App.tsx');
fixLogo('src/components/LandingPage.tsx');
console.log('Fixed Logo');
