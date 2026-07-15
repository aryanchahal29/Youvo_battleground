const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(/body \{\n  font-family: var\(--font-sans\);\n  background-color: #0A0A0B; \/\* Deep neutral sophisticated black \*\/\n  color: #E5E5E5; \/\* neutral-200 \*\/\n\}/,
`body {
  font-family: var(--font-sans);
  background-color: #FAFAFA; /* Light neutral */
  color: #171717; /* neutral-900 */
}`);

fs.writeFileSync('src/index.css', content);
console.log('Fixed body CSS');
