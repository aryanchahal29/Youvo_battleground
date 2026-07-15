const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const footerRegex = /\{\/\* 7\. Footer \*\/\}\s*<footer.*?<\/footer>/s;

const newFooter = `      {/* 8. Confidentiality & Footer */}
      <div className={\`border-t \${theme === 'dark' ? 'border-neutral-800 bg-[#0A0A0B]' : 'border-neutral-200 bg-neutral-50'} pt-24 pb-8\`}>
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          
          {/* Confidentiality Block */}
          <div className={\`p-6 md:p-8 rounded-2xl border \${theme === 'dark' ? 'border-violet-500/20 bg-violet-500/5' : 'border-violet-500/20 bg-violet-50'} flex flex-col md:flex-row gap-6 items-start max-w-4xl mx-auto\`}>
            <div className="p-3 rounded-xl bg-violet-500/10 text-violet-500 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className={\`text-sm font-bold tracking-widest uppercase font-mono \${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-800'}\`}>
                Ephemeral Session Confidentiality
              </h4>
              <p className={\`text-sm leading-relaxed \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                Your data is managed transiently within your secure browser session. The moment you log out or close this tab, your local context is cleared. For external processing, we connect exclusively via secure API to the official endpoints of the models you select.
              </p>
            </div>
          </div>

          {/* New Footer */}
          <footer className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Logo className="w-6 h-6 grayscale opacity-80" />
                <span className={\`text-sm font-bold tracking-tight \${theme === "dark" ? "text-white" : "text-neutral-900"}\`}>
                  YouVo Battleground
                </span>
              </div>
              <p className={\`text-sm max-w-sm \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                The premier platform for multi-agent dialectic simulation and rigorous AI consensus generation.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className={\`text-xs font-bold tracking-widest uppercase \${theme === 'dark' ? 'text-white' : 'text-neutral-900'}\`}>Platform</h4>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }} className={\`transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>How it Works</a>
                <button onClick={() => window.location.hash = 'faq'} className={\`text-left transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>FAQ / Case Studies</button>
                <a href="https://youvoai.com" target="_blank" rel="noreferrer" className={\`transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>YouVo AI Parent</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className={\`text-xs font-bold tracking-widest uppercase \${theme === 'dark' ? 'text-white' : 'text-neutral-900'}\`}>Legal & Support</h4>
              <div className="flex flex-col gap-3 text-sm font-medium">
                <button onClick={() => window.location.hash = 'privacy'} className={\`text-left transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>Privacy Policy</button>
                <button onClick={() => window.location.hash = 'terms'} className={\`text-left transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>Terms of Service</button>
                <a href="mailto:support@youvo.ai" className={\`transition-colors \${theme === 'dark' ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'}\`}>Contact Us</a>
              </div>
            </div>
          </footer>

          <div className="text-center pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <p className={\`text-xs font-medium \${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}\`}>
              © 2026 YouVo Battleground. Purely ephemeral dialectic workspace.
            </p>
          </div>
        </div>
      </div>`;

content = content.replace(footerRegex, newFooter);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed Footer.');
