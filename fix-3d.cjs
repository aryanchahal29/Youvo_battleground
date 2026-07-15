const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

// 1. Remove HeroAgentAnimation definition
const heroAgentAnimationRegex = /const HeroAgentAnimation = \(\) => \{[\s\S]*?(?=\n\nexport const LandingPage =)/;
content = content.replace(heroAgentAnimationRegex, '');

// 2. Add import for ThreeDScene
const importRegex = /import \{ motion, useAnimation \} from "motion\/react";/;
content = content.replace(importRegex, 'import { motion, useAnimation } from "motion/react";\nimport { ThreeDScene } from "./ThreeDModel";');

// 3. Replace <HeroAgentAnimation /> with <ThreeDScene theme={theme} />
content = content.replace(/<HeroAgentAnimation \/>/, '<ThreeDScene theme={theme} />');

fs.writeFileSync('src/components/LandingPage.tsx', content);
console.log('Replaced SVG animation with ThreeDScene');
