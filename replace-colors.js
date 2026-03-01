const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-\[#04070d\]/g, to: 'bg-background' },
  { from: /bg-\[#1b1a14\]/g, to: 'bg-muted' },
  { from: /border-\[#2a2a2a\]/g, to: 'border-border' },
  { from: /text-\[#0099ff\]/g, to: 'text-primary' },
  { from: /text-\[#d5dbe6\]/g, to: 'text-secondary' },
  { from: /text-white/g, to: 'text-foreground' },
  { from: /text-gray-400/g, to: 'text-muted-foreground' },
  { from: /text-gray-500/g, to: 'text-muted-foreground' },
  { from: /text-gray-600/g, to: 'text-muted-foreground' },
  { from: /bg-\[#0099ff\]/g, to: 'bg-primary' },
  { from: /bg-\[#d5dbe6\]/g, to: 'bg-secondary' },
  { from: /border-\[#0099ff\]/g, to: 'border-primary' },
  { from: /border-\[#d5dbe6\]\/30/g, to: 'border-secondary/30' },
  { from: /border-\[#d5dbe6\]\/50/g, to: 'border-secondary/50' },
  { from: /from-\[#0099ff\]/g, to: 'from-primary' },
  { from: /to-\[#d5dbe6\]/g, to: 'to-secondary' },
  { from: /from-\[#d5dbe6\]/g, to: 'from-secondary' },
  { from: /text-black/g, to: 'text-background' },
  { from: /bg-white/g, to: 'bg-foreground' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      for (const { from, to } of replacements) {
        content = content.replace(from, to);
      }
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./components');
