const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const enterpriseSection = `
      {/* 6. Enterprise Section */}
      <section id="enterprise" className={\`py-24 px-6 border-t transition-colors duration-300 \${
        theme === "dark" ? "bg-[#121215] border-neutral-800" : "bg-neutral-50 border-neutral-200"
      }\`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4" />
              For Enterprise
            </div>
            <h2 className={\`text-3xl md:text-5xl font-black tracking-tight \${theme === "dark" ? "text-white" : "text-neutral-900"}\`}>
              Bring the battleground to your private cloud.
            </h2>
            <p className={\`text-lg font-medium \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
              Deploy YouVo Battleground within your VPC. Connect securely to your internal databases, proprietary IP, and private model endpoints without data leaving your environment.
            </p>
            <ul className="space-y-4">
              {[
                "SSO & Role-Based Access Control",
                "Custom Local LLM Integration (Ollama, vLLM)",
                "Full Audit Logs & Compliance Reporting",
                "Dedicated Instance & SLA"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className={\`text-sm font-bold \${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}\`}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-4">
              <a href="mailto:enterprise@youvo.ai" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-black tracking-wide transition-all shadow-lg hover:-translate-y-1 active:scale-95">
                Contact Sales <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none"></div>
            <div className={\`relative p-8 rounded-3xl border \${theme === 'dark' ? 'bg-[#0A0A0B] border-neutral-800' : 'bg-white border-neutral-200'} shadow-2xl overflow-hidden\`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none"></div>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
                    </div>
                    <div>
                      <h4 className={\`text-sm font-bold \${theme === 'dark' ? 'text-white' : 'text-neutral-900'}\`}>SOC 2 Type II Certified</h4>
                      <p className="text-xs text-neutral-500">Enterprise-grade security</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 w-3/4"></div>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-500 w-1/2"></div>
                  </div>
                  <div className="h-2 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-5/6"></div>
                  </div>
                </div>
                <div className={\`p-4 rounded-xl border \${theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'}\`}>
                  <div className="flex items-center gap-3 text-xs font-mono font-bold text-neutral-500 mb-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    SECURE VPC TUNNEL ACTIVE
                  </div>
                  <p className={\`text-xs \${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}\`}>
                    Data isolation verified. Zero external egress detected.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA Section */}
`;

content = content.replace('{/* 6. CTA Section */}', enterpriseSection);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Added Enterprise Section.');
