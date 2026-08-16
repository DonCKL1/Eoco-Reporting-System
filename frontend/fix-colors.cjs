const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replaces = [
  [/\bbg-white\b/g, 'bg-background'],
  [/\btext-black\b/g, 'text-foreground'],
  [/\bbg-gray-50\b/g, 'bg-muted/50'],
  [/\bbg-gray-100\b/g, 'bg-muted'],
  [/\bbg-gray-200\b/g, 'bg-muted/70'],
  [/\bbg-gray-800\b/g, 'bg-secondary'],
  [/\bbg-gray-900\b/g, 'bg-secondary'],
  [/\btext-gray-400\b/g, 'text-muted-foreground'],
  [/\btext-gray-500\b/g, 'text-muted-foreground'],
  [/\btext-gray-600\b/g, 'text-muted-foreground'],
  [/\btext-gray-700\b/g, 'text-muted-foreground'],
  [/\btext-gray-800\b/g, 'text-foreground'],
  [/\btext-gray-900\b/g, 'text-foreground'],
  [/\bborder-gray-200\b/g, 'border-border'],
  [/\bborder-gray-300\b/g, 'border-border'],
  [/\bhover:bg-gray-50\b/g, 'hover:bg-muted/50'],
  [/\bhover:bg-gray-100\b/g, 'hover:bg-muted'],
];

walkDir('src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    replaces.forEach(r => content = content.replace(r[0], r[1]));
    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
