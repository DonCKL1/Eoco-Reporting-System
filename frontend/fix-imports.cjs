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
  [/@\/assets\/logos\/Logo\.jpg/g, '@/assets/brand/Logo.jpg'],
  [/@\/assets\/images\/Logo\.jpg/g, '@/assets/brand/Logo.jpg'],
  [/@\/assets\/logos\/Generic\.jpg/g, '@/assets/banners/Generic.jpg'],
  [/@\/assets\/images\/Generic\.jpg/g, '@/assets/banners/Generic.jpg'],
  [/@\/assets\/logos\/customer_service\.jpg/g, '@/assets/banners/customer_service.jpg'],
  [/@\/assets\/images\/customer_service\.jpg/g, '@/assets/banners/customer_service.jpg'],
  [/@\/assets\/logos\/Alerts\.jpg/g, '@/assets/banners/Alerts.jpg'],
  [/@\/assets\/images\/Alerts\.jpg/g, '@/assets/banners/Alerts.jpg'],
  [/@\/assets\/logos\/FAQS\.png/g, '@/assets/icons/FAQS.png'],
  [/@\/assets\/images\/FAQS\.png/g, '@/assets/icons/FAQS.png'],
  [/@\/assets\/images\/([^'"`]+\.jpg)/g, '@/assets/wanted/$1']
];

walkDir('src', function(filePath) {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replaces.forEach(r => {
      content = content.replace(r[0], r[1]);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed', filePath);
    }
  }
});
