const fs = require('fs');

let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

const footerRegex = /\{\/\* 8\. Confidentiality & Footer \*\/\}.*?(?=\s*<\/div>\s*<\/div>\s*\);\s*\})/s;
let newFooterMatch = content.match(footerRegex);

if (newFooterMatch) {
  let newFooter = newFooterMatch[0];
  
  // Ephemeral Session Block
  newFooter = newFooter.replace('text-sm font-bold tracking-widest uppercase font-mono', 'text-base md:text-lg font-bold tracking-widest uppercase font-mono');
  newFooter = newFooter.replace('text-sm leading-relaxed', 'text-base leading-relaxed');
  
  // Footer Brand
  newFooter = newFooter.replace('Logo className="w-6 h-6 grayscale opacity-80"', 'Logo className="w-8 h-8 grayscale opacity-80"');
  newFooter = newFooter.replace('text-sm font-bold tracking-tight', 'text-lg font-bold tracking-tight');
  newFooter = newFooter.replace('text-sm max-w-sm', 'text-base max-w-sm');
  
  // Footer Headings
  newFooter = newFooter.replace(/text-xs font-bold tracking-widest uppercase/g, 'text-sm font-bold tracking-widest uppercase');
  
  // Footer Links
  newFooter = newFooter.replace(/text-sm font-medium/g, 'text-base font-medium');
  
  // Footer Copyright
  newFooter = newFooter.replace('text-xs font-medium', 'text-sm font-medium');
  
  content = content.replace(footerRegex, newFooter);
  fs.writeFileSync('src/components/LandingPage.tsx', content);
  console.log('Fixed Footer sizes.');
} else {
  console.log('Footer not found.');
}
