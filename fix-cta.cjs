const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const ctaRegex = /\{\/\* 7\. CTA Section \*\/\}.*?\{\/\* 8\. Confidentiality & Footer \*\/\}/s;
let ctaBlock = content.match(ctaRegex)[0];

const ctaBgRegex = /<div className="absolute top-1\/2 left-1\/2 w-\[800px\] h-\[800px\] bg-violet-600\/10 rounded-full blur-\[100px\] -translate-x-1\/2 -translate-y-1\/2 pointer-events-none"><\/div>/;
const newCtaBg = `<motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-violet-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        ></motion.div>`;

ctaBlock = ctaBlock.replace(ctaBgRegex, newCtaBg);

// Let's also wrap the inner div in a motion container with fadeInUp if we want.
// For now, I'll just change the wrapper to motion.div and add whileInView.
const innerWrapperRegex = /<div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">/;
const newInnerWrapper = `<motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8 relative z-10"
        >`;
const endDivRegex = /<\/div>\s*<\/section>/;
ctaBlock = ctaBlock.replace(innerWrapperRegex, newInnerWrapper).replace(endDivRegex, '</motion.div>\n      </section>');


content = content.replace(ctaRegex, ctaBlock);
fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Fixed cta blobs');
