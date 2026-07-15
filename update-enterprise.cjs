const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const oldEnterpriseStr = `            <div className={\`relative p-8 rounded-3xl border \${theme === 'dark' ? 'bg-[#0A0A0B] border-neutral-800' : 'bg-white border-neutral-200'} shadow-2xl overflow-hidden\`}>`;

const newEnterpriseStr = `            <div className={\`relative p-8 rounded-3xl border \${theme === 'dark' ? 'bg-[#0A0A0B] border-neutral-800' : 'bg-white border-neutral-200'} shadow-2xl overflow-hidden group hover:border-violet-500/30 transition-colors duration-500\`}>`;


const oldSocStr = `                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                    </div>`;

const newSocStr = `                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:text-violet-500 transition-colors duration-300">
                      <Lock className="w-5 h-5 text-neutral-500 dark:text-neutral-400 group-hover:text-violet-500 transition-colors duration-300" />
                    </div>`;

content = content.replace(oldEnterpriseStr, newEnterpriseStr).replace(oldSocStr, newSocStr);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log("Updated Enterprise block!");
