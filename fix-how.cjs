const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const processRegex = /\{\/\* 4\. How it Works \(Process\) \*\/\}.*?\{\/\* 5\. Clashes vs Single Prompts \*\/\}/s;
let processBlock = content.match(processRegex)[0];

processBlock = processBlock.replace(
  /whileInView={{ opacity: 1, y: 0 }}\s+viewport={{ once: true }}\s+transition={{ delay: i \* 0\.1, duration: 0\.5 }}\s+className={`p-8 rounded-3xl border flex flex-col space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl \${/g,
  `whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={\`group p-8 rounded-3xl border flex flex-col space-y-6 transition-all duration-300 hover:shadow-xl \${`
);

// add color transition to the number
processBlock = processBlock.replace(
  /<span className="font-mono text-4xl font-black text-neutral-200 dark:text-neutral-800 select-none">/g,
  '<span className="font-mono text-4xl font-black text-neutral-200 dark:text-neutral-800 select-none group-hover:text-violet-500/20 transition-colors duration-300">'
);

content = content.replace(processRegex, processBlock);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed How it Works section');
