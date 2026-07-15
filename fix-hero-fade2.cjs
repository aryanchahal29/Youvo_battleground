const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// Replace bg-white/80 with a more subtle bg-white/40
content = content.replace(
  /bg-white\/80\b/g,
  function(match, offset, string) {
    if (offset > 10000) { // Targeting the hero bg which is later in the file
        return 'bg-white/40';
    }
    return match; // Header bg-white/80
  }
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
