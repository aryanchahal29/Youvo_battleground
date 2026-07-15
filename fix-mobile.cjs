const fs = require('fs');

// Fix LandingPage.tsx
let landing = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Hero H1
landing = landing.replace(
  /className=\{\`text-5xl md:text-7xl lg:text-8xl/g,
  'className={`text-4xl sm:text-5xl md:text-7xl lg:text-8xl'
);
// Hero p
landing = landing.replace(
  /className=\{\`text-lg md:text-xl font-medium/g,
  'className={`text-base sm:text-lg md:text-xl font-medium'
);
// Make section padding responsive
landing = landing.replace(
  /className="relative overflow-hidden py-24 lg:py-40 px-6 flex flex-col justify-center min-h-\[90vh\]"/g,
  'className="relative overflow-hidden py-16 md:py-24 lg:py-40 px-4 sm:px-6 flex flex-col justify-center min-h-[90vh]"'
);

fs.writeFileSync('src/components/LandingPage.tsx', landing);

// Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Fix main height in arena view
app = app.replace(
  /<main className="h-\[calc\(100vh-64px\)\] flex flex-col/g,
  '<main className="flex-1 min-h-0 flex flex-col'
);

// Fix grid wrapper in arena
app = app.replace(
  /<div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-full">/g,
  '<div className="flex-1 min-h-0 flex flex-col xl:grid xl:grid-cols-12 overflow-y-auto xl:overflow-hidden h-full">'
);

// Fix Left Column (Panelists)
app = app.replace(
  /<div className="xl:col-span-3 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-\[#121215\] p-4 overflow-y-auto space-y-4">/g,
  '<div className="shrink-0 xl:col-span-3 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-4 overflow-y-auto space-y-4 xl:h-full">'
);

// Fix Left Chat
app = app.replace(
  /<div className="xl:col-span-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-\[#121215\] h-full overflow-hidden flex flex-col">/g,
  '<div className="shrink-0 h-[60vh] xl:h-full xl:col-span-4 border-b xl:border-b-0 xl:border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] overflow-hidden flex flex-col">'
);

// Fix Right Column
app = app.replace(
  /\} flex flex-col overflow-hidden bg-neutral-50 dark:bg-\[#0A0A0A\] h-full relative`\}>/g,
  '} shrink-0 min-h-[80vh] xl:min-h-0 xl:h-full flex flex-col overflow-hidden bg-neutral-50 dark:bg-[#0A0A0A] relative`}>'
);

fs.writeFileSync('src/App.tsx', app);
console.log("Done");
