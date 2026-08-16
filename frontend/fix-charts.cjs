const fs = require('fs');

function fix(file) {
  let c = fs.readFileSync(file, 'utf8');
  
  c = c.replace(/fill="hsl\(var\(--primary\)\)"/g, 'fill="var(--color-primary)"');
  c = c.replace(/strokeDasharray="3 3" vertical=\{false\} \/>/g, 'strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />');
  c = c.replace(/tickLine=\{false\} axisLine=\{false\}/g, 'tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)"');
  c = c.replace(/<Tooltip cursor=\{\{ fill: 'transparent' \}\} \/>/g, '<Tooltip cursor={{ fill: \'var(--color-muted)\' }} contentStyle={{ backgroundColor: \'var(--color-card)\', borderColor: \'var(--color-border)\', color: \'var(--color-foreground)\' }} />');
  c = c.replace(/<Tooltip \/>/g, '<Tooltip contentStyle={{ backgroundColor: \'var(--color-card)\', borderColor: \'var(--color-border)\', color: \'var(--color-foreground)\' }} />');
  c = c.replace(/const COLORS = \[.*\]/g, 'const COLORS = [\'var(--color-primary)\', \'var(--color-accent)\', \'var(--color-destructive)\', \'#00C49F\', \'#8884d8\', \'#82ca9d\']');

  fs.writeFileSync(file, c);
}

fix('src/pages/admin/AnalyticsPage.tsx');
fix('src/pages/supervisor/AnalyticsPage.tsx');
