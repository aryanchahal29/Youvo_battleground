const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const oldClashesRegex = /<div className="flex-1 w-full relative">.*?<\/div>\s*<\/div>\s*<\/section>/s;

let newSection = `
          <div className="flex-1 w-full relative">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={\`p-6 md:p-8 rounded-3xl border shadow-2xl \${theme === 'dark' ? 'bg-[#121215] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}\`}
            >
              <div className="flex items-center justify-between mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                  </span>
                  <div className="text-[10px] font-bold tracking-widest uppercase font-mono text-neutral-500">
                    Active Simulation Preview
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Message A */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className={\`flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg \${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}\`}
                >
                  <div className="w-8 h-8 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">A</div>
                  <div>
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Model Alpha (Academic Architect)</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      "I strongly advocate for TypeScript type safety here. While Model Beta's schema yields rapid prototyping, the runtime risk isn't worth the brief velocity bump..."
                    </p>
                  </div>
                </motion.div>

                {/* Message B */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className={\`flex gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg \${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}\`}
                >
                  <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">B</div>
                  <div>
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Model Beta (Strategic Flagship)</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      "Model Alpha is correct on safety, but overlooks the database cost multiplier. Running a fully normalized structure increases join latency. I suggest a Hybrid cache model..."
                    </p>
                  </div>
                </motion.div>

                {/* Message M */}
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                  className={\`flex gap-4 p-4 rounded-xl border relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(139,92,246,0.2)] \${theme === 'dark' ? 'bg-[#121215] border-violet-500/30' : 'bg-violet-50/50 border-violet-500/30'}\`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 translate-x-[-100%] animate-[shimmer_3s_infinite]"></div>
                  <div className="w-8 h-8 rounded bg-violet-500 text-white flex items-center justify-center font-bold text-sm shrink-0 relative z-10">M</div>
                  <div className="relative z-10">
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Synthesized Moderator Consensus</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      The council has reached general consensus on applying Type Safety checks, with a compromised denormalized caching layer to protect lookup latency.
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>
`;

content = content.replace(oldClashesRegex, newSection);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed clashes section animation');
