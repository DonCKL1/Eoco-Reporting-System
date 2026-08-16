const fs = require('fs');

const files = [
  'src/components/common/AppSidebar.tsx',
  'src/components/common/PublicFooter.tsx',
  'src/components/common/PublicNavbar.tsx',
  'src/pages/auth/LoginPage.tsx',
  'src/pages/auth/RegisterPage.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/className="h-8 w-8 rounded-lg object-cover"/g, 'className="h-10 w-auto object-contain"');
  content = content.replace(/className="h-8 w-8 rounded-lg object-cover mx-auto"/g, 'className="h-10 w-auto object-contain mx-auto"');
  content = content.replace(/className="h-9 w-9 rounded-lg object-cover"/g, 'className="h-10 w-auto object-contain"');
  content = content.replace(/className="inline-flex h-16 w-16 rounded-2xl object-cover shadow-lg mb-4"/g, 'className="inline-flex h-16 w-auto object-contain shadow-lg mb-4"');
  fs.writeFileSync(f, content);
});
