const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /<a href="#enterprise" className=\{`transition-colors flex items-center gap-1.5 \$\{theme === 'dark' \? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'\}`\}>\s*Enterprise <span className="px-1.5 py-0.5 rounded-md bg-violet-500\/10 text-violet-500 text-\[9px\] uppercase tracking-wider font-black">New<\/span>\s*<\/a>/,
  `<a href="#enterprise" onClick={(e) => { e.preventDefault(); document.getElementById('enterprise')?.scrollIntoView({ behavior: 'smooth' }); }} className={\`transition-colors flex items-center gap-1.5 \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>
            Enterprise <span className="px-1.5 py-0.5 rounded-md bg-violet-500/10 text-violet-500 text-[9px] uppercase tracking-wider font-black">New</span>
          </a>`
);

content = content.replace(
  /<a href="#features" className=\{`transition-colors \$\{theme === 'dark' \? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'\}`\}>Features<\/a>/,
  `<a href="#features" onClick={(e) => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }); }} className={\`transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>Features</a>`
);

content = content.replace(
  /<a href="#how-it-works" className=\{`transition-colors \$\{theme === 'dark' \? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'\}`\}>How it Works<\/a>/,
  `<a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className={\`transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>How it Works</a>`
);

// Fix Enter Arena button design
content = content.replace(
  /<button\s*onClick=\{\(\) => onEnter\(\)\}\s*className=\{\`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md \$\{\s*theme === "dark" \s*\? "bg-white text-neutral-900 hover:bg-neutral-100" \s*: "bg-neutral-900 text-white hover:bg-neutral-800"\s*\}\`\}\s*>\s*Enter Arena <ArrowRight className="w-4 h-4" \/>\s*<\/button>/s,
  `<button
            onClick={() => onEnter()}
            className="hidden sm:flex relative p-[1px] rounded-xl overflow-hidden group hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-[length:200%_auto] animate-gradient"></span>
            <span className={\`relative flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black w-full h-full transition-colors \${
              theme === "dark"
                ? "bg-[#0A0A0B] text-white hover:bg-neutral-900/80"
                : "bg-white text-neutral-900 hover:bg-neutral-50/90"
            }\`}>
              Enter Arena <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>`
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed navigation links and button.');
