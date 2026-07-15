const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const newSection = `
      {/* 5. Clashes vs Single Prompts */}
      <section className={\`py-24 px-6 transition-colors duration-300 \${theme === "dark" ? "bg-[#0A0A0B]" : "bg-white"}\`}>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-8">
            <h2 className={\`text-3xl md:text-5xl font-black tracking-tight leading-tight \${theme === "dark" ? "text-white" : "text-neutral-900"}\`}>
              Why Battleground Clashes<br />Outperform Single Prompts
            </h2>
            <p className={\`text-base leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
              When you ask a single AI model for advice, you receive a single confirmation-biased perspective. By pitting different, highly specialized minds against each other, assumptions are cross-examined, hidden failure modes are brought to light, and compromises are rigorously resolved.
            </p>
            <ul className="space-y-5">
              {[
                "Neutralizes confirmation bias of a single LLM vendor",
                "Injects real-time human interventions to guide debate logic",
                "Multimodal integration supports files, PDFs, and code directly",
                "Fully customizable expert personas tailored to your industry"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="w-5 h-5 rounded-full border border-violet-500/50 flex items-center justify-center shrink-0 text-violet-500">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className={\`text-sm font-bold \${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}\`}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full relative">
            <div className={\`p-6 md:p-8 rounded-3xl border shadow-2xl \${theme === 'dark' ? 'bg-[#121215] border-neutral-800' : 'bg-neutral-50 border-neutral-200'}\`}>
              <div className="flex items-center justify-between mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-[10px] font-bold tracking-widest uppercase font-mono text-neutral-500">
                  Active Simulation Preview
                </div>
              </div>

              <div className="space-y-4">
                {/* Message A */}
                <div className={\`flex gap-4 p-4 rounded-xl border \${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}\`}>
                  <div className="w-8 h-8 rounded bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">A</div>
                  <div>
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Model Alpha (Academic Architect)</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      "I strongly advocate for TypeScript type safety here. While Model Beta's schema yields rapid prototyping, the runtime risk isn't worth the brief velocity bump..."
                    </p>
                  </div>
                </div>

                {/* Message B */}
                <div className={\`flex gap-4 p-4 rounded-xl border \${theme === 'dark' ? 'bg-[#1A1A1E] border-neutral-800' : 'bg-white border-neutral-200'}\`}>
                  <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">B</div>
                  <div>
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Model Beta (Strategic Flagship)</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      "Model Alpha is correct on safety, but overlooks the database cost multiplier. Running a fully normalized structure increases join latency. I suggest a Hybrid cache model..."
                    </p>
                  </div>
                </div>

                {/* Message M */}
                <div className={\`flex gap-4 p-4 rounded-xl border \${theme === 'dark' ? 'bg-[#121215] border-violet-500/20' : 'bg-violet-50/50 border-violet-500/20'}\`}>
                  <div className="w-8 h-8 rounded bg-violet-500 text-white flex items-center justify-center font-bold text-sm shrink-0">M</div>
                  <div>
                    <h4 className={\`text-sm font-bold mb-1 \${theme === 'dark' ? 'text-neutral-200' : 'text-neutral-800'}\`}>Synthesized Moderator Consensus</h4>
                    <p className={\`text-xs leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                      The council has reached general consensus on applying Type Safety checks, with a compromised denormalized caching layer to protect lookup latency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
`;

content = content.replace('{/* 5. Use Cases */}', newSection + '\n      {/* 6. Use Cases */}');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Added Clashes section');
