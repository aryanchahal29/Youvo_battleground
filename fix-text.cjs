const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// We will change the styling of the highlighted text "competing AI minds."
// In light mode, maybe we give it a solid background highlight, or just a strong white drop-shadow.
content = content.replace(
  /<span className="relative z-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-\[length:200%_auto\] animate-gradient drop-shadow-sm">/g,
  '<span className={`relative z-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient ${theme === "dark" ? "drop-shadow-sm" : "drop-shadow-[0_4px_10px_rgba(255,255,255,1)] filter"}`}>'
);

// We should also make sure the headline above it is visible
content = content.replace(
  /className=\{`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-\[1.05\] \$\{/g,
  'className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] relative z-10 ${theme === "dark" ? "" : "drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"} ${'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
