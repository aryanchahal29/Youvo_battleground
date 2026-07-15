const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// The hero content wrapper starts around line 271 with <motion.div ... className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
content = content.replace(
  /className="max-w-4xl mx-auto text-center space-y-8 relative z-10">/,
  'className="max-w-4xl mx-auto text-center space-y-8 relative z-10">\n          {/* Subtle backdrop to ensure text readability over 3D model */}\n          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-full blur-[60px] pointer-events-none -z-10 ${theme === "dark" ? "bg-black/20" : "bg-white/70"}`}></div>'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
