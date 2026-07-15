const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  /<motion\.div \n          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"\n          variants=\{staggerContainer\}\n          initial="hidden"\n          whileInView="visible" viewport=\{\{ once: false, amount: 0.1 \}\}\n        >/,
  '<motion.div \n          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"\n          variants={staggerContainer}\n          initial="hidden"\n          whileInView="visible" viewport={{ once: false, amount: 0.1 }}\n        >\n          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] rounded-[100%] blur-[80px] pointer-events-none -z-10 ${theme === "dark" ? "" : "bg-white/80"}`}></div>'
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log("Updated");
