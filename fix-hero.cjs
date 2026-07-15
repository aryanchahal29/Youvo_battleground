const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const heroRegex = /\{\/\* 2\. Hero Section \*\/\}.*?\{\/\* 3\. Features Bento Grid \*\/\}/s;
let heroBlock = content.match(heroRegex)[0];

const bgRegex1 = /<div className="absolute top-1\/4 left-1\/4 w-\[500px\] h-\[500px\] bg-violet-600\/20 rounded-full blur-\[120px\] mix-blend-screen pointer-events-none -translate-x-1\/2 -translate-y-1\/2"><\/div>/;
const bgRegex2 = /<div className="absolute bottom-0 right-1\/4 w-\[600px\] h-\[600px\] bg-fuchsia-600\/10 rounded-full blur-\[150px\] mix-blend-screen pointer-events-none translate-x-1\/3 translate-y-1\/3"><\/div>/;

const newBg1 = `<motion.div 
          animate={{ 
            x: [0, 50, -30, 0], 
            y: [0, -50, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none -translate-x-1/2 -translate-y-1/2"
        ></motion.div>`;
const newBg2 = `<motion.div 
          animate={{ 
            x: [0, -60, 40, 0], 
            y: [0, 40, -30, 0],
            scale: [1, 0.8, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none translate-x-1/3 translate-y-1/3"
        ></motion.div>`;

heroBlock = heroBlock.replace(bgRegex1, newBg1).replace(bgRegex2, newBg2);

content = content.replace(heroRegex, heroBlock);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed hero blobs');
