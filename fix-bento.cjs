const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const bentoRegex = /\{\/\* 3\. Features Bento Grid \*\/\}.*?\{\/\* 4\. How it Works \(Process\) \*\/\}/s;
let bentoBlock = content.match(bentoRegex)[0];

bentoBlock = bentoBlock.replace(/<motion\.div\s+initial={{ opacity: 0, y: 20 }}\s+whileInView={{ opacity: 1, y: 0 }}/g, '<motion.div \n              initial={{ opacity: 0, y: 30 }}\n              whileInView={{ opacity: 1, y: 0 }}\n              whileHover={{ scale: 1.02 }}');
bentoBlock = bentoBlock.replace(/viewport={{ once: true }}\s+className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group \${/g, 'viewport={{ once: true }}\n              className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${');
bentoBlock = bentoBlock.replace(/viewport={{ once: true }}\s+transition={{ delay: 0\.([12]) }}\s+className={`p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group \${/g, 'viewport={{ once: true }}\n              transition={{ delay: 0.$1 }}\n              className={`p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${');
bentoBlock = bentoBlock.replace(/viewport={{ once: true }}\s+transition={{ delay: 0\.3 }}\s+className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group \${/g, 'viewport={{ once: true }}\n              transition={{ delay: 0.3 }}\n              className={`md:col-span-2 p-8 rounded-3xl border flex flex-col justify-between overflow-hidden relative group transition-colors duration-300 hover:border-violet-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] ${');

content = content.replace(bentoRegex, bentoBlock);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed bento grid');
