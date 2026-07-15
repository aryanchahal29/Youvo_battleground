const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const oldStr = 'className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(139,92,246,0.15)]"';

const newStr = 'className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-black tracking-widest uppercase backdrop-blur-sm shadow-[0_0_25px_rgba(139,92,246,0.25)] transition-colors ${theme === "dark" ? "bg-violet-500/20 border-violet-500/50 text-violet-300" : "bg-violet-500/10 border-violet-500/30 text-violet-700"}`}'

content = content.replace(oldStr, newStr);

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed Badge.');
