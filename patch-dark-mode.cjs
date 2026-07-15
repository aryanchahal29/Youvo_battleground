const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');

const startIndex = 2024 - 1;
const endIndex = 2775 - 1;

for (let i = startIndex; i <= endIndex; i++) {
  let line = lines[i];

  // Only apply to classNames
  if (line.includes('className=')) {
    line = line.replace(/bg-white(?! dark:)/g, 'bg-white dark:bg-[#121215]');
    line = line.replace(/text-neutral-900(?! dark:)/g, 'text-neutral-900 dark:text-white');
    line = line.replace(/text-neutral-800(?! dark:)/g, 'text-neutral-800 dark:text-neutral-200');
    line = line.replace(/text-neutral-700(?! dark:)/g, 'text-neutral-700 dark:text-neutral-300');
    line = line.replace(/text-neutral-600(?! dark:)/g, 'text-neutral-600 dark:text-neutral-400');
    line = line.replace(/text-neutral-500(?! dark:)/g, 'text-neutral-500 dark:text-neutral-400');
    line = line.replace(/text-neutral-400(?! dark:)/g, 'text-neutral-400 dark:text-neutral-500');
    line = line.replace(/bg-neutral-50(?! dark:)/g, 'bg-neutral-50 dark:bg-[#1A1A1F]');
    line = line.replace(/bg-neutral-100(?! dark:)/g, 'bg-neutral-100 dark:bg-[#25252B]');
    line = line.replace(/bg-neutral-200(?! dark:)/g, 'bg-neutral-200 dark:bg-neutral-800');
    line = line.replace(/border-neutral-100(?! dark:)/g, 'border-neutral-100 dark:border-neutral-800');
    line = line.replace(/border-neutral-200(?! dark:)/g, 'border-neutral-200 dark:border-neutral-800');
    line = line.replace(/border-neutral-300(?! dark:)/g, 'border-neutral-300 dark:border-neutral-700');
    line = line.replace(/hover:bg-neutral-50(?! dark:)/g, 'hover:bg-neutral-50 dark:hover:bg-[#1A1A1F]');
    line = line.replace(/hover:bg-neutral-100(?! dark:)/g, 'hover:bg-neutral-100 dark:hover:bg-[#2A2A30]');
    line = line.replace(/hover:border-neutral-300(?! dark:)/g, 'hover:border-neutral-300 dark:hover:border-neutral-600');
    line = line.replace(/shadow-sm(?! shadow-)/g, 'shadow-sm dark:shadow-none');
    line = line.replace(/bg-transparent(?! border)/g, 'bg-transparent');
  }

  lines[i] = line;
}

fs.writeFileSync('src/App.tsx', lines.join('\n'));
console.log('App.tsx patched successfully.');
