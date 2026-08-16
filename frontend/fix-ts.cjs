const fs = require('fs');

function fix(file, replaces) {
  let c = fs.readFileSync(file, 'utf8');
  replaces.forEach(r => c = c.replace(r[0], r[1]));
  fs.writeFileSync(file, c);
}

fix('src/pages/admin/RolesPage.tsx', [[/const permissions = permissionsData\?.data\.data \|\| \[\]/g, '']]);
fix('src/pages/admin/UsersPage.tsx', [[/import userApi, \{ type any \} from '@\/api\/userApi'/g, "import userApi from '@/api/userApi'"]]);
fix('src/pages/admin/WantedPersonsPage.tsx', [[/setEditPerson\(null\)/g, '']]);
fix('src/pages/supervisor/DashboardPage.tsx', [[/import \{ useAuthStore \} from '@\/store\/authStore'/g, '']]);

let faq = fs.readFileSync('src/pages/public/FaqPage.tsx', 'utf8');
faq = faq.replace(/<Accordion[\s\S]*?<\/Accordion>/g, `
        <div className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group border-b border-border pb-4">
              <summary className="text-lg font-medium cursor-pointer list-none hover:text-primary focus:outline-none">
                {faq.question}
              </summary>
              <div className="text-muted-foreground leading-relaxed text-base mt-2 pl-4 border-l-2 border-primary/20">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
`);
faq = faq.replace(/import \{[\s\S]*?\} from '@\/components\/ui\/accordion'/g, '');
fs.writeFileSync('src/pages/public/FaqPage.tsx', faq);
