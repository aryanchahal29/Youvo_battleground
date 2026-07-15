const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const oldStr = `            ].map((useCase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={\`p-8 rounded-3xl text-center space-y-6 \${theme === 'dark' ? 'bg-[#121215] border border-neutral-800' : 'bg-neutral-50 border border-neutral-200'}\`}
              >
                <div className={\`w-16 h-16 mx-auto rounded-full flex items-center justify-center \${useCase.bg} \${useCase.color}\`}>
                  {useCase.icon}
                </div>
                <h3 className={\`text-xl font-bold \${theme === 'dark' ? 'text-white' : 'text-neutral-900'}\`}>{useCase.title}</h3>
                <p className={\`text-sm leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>{useCase.desc}</p>
              </motion.div>
            ))}`;

const newStr = `            ].map((useCase, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ delay: idx * 0.1, y: { type: "spring", stiffness: 300, damping: 20 } }}
                className={\`group relative p-8 rounded-3xl text-center space-y-6 overflow-hidden transition-all duration-300 \${theme === 'dark' ? 'bg-[#121215] border border-neutral-800 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,0.1)]' : 'bg-white border border-neutral-200 hover:border-violet-500/30 hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)]'}\`}
              >
                <div className={\`absolute inset-0 bg-gradient-to-br \${useCase.color.replace('text', 'from').replace('500', '500/10')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none\`}></div>
                <div className={\`relative z-10 w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 \${useCase.bg} \${useCase.color}\`}>
                  {useCase.icon}
                </div>
                <h3 className={\`text-xl font-bold relative z-10 \${theme === 'dark' ? 'text-white' : 'text-neutral-900'}\`}>{useCase.title}</h3>
                <p className={\`text-sm leading-relaxed relative z-10 transition-colors duration-300 \${theme === 'dark' ? 'text-neutral-400 group-hover:text-neutral-300' : 'text-neutral-600 group-hover:text-neutral-700'}\`}>{useCase.desc}</p>
              </motion.div>
            ))}`;

if(content.includes(oldStr)) {
  content = content.replace(oldStr, newStr);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log("Updated Use Cases!");
} else {
  console.log("String not found!");
}
