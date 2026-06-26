const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script type=\"text\/babel\" data-presets=\"react\">([\s\S]*?)<\/script>/);
const code = scriptMatch[1];
const babelSrc = fs.readFileSync('.system_generated/steps/64/content.md', 'utf8'); // Wait, content.md is lucide-react! I need babel!
