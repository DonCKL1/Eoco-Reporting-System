const fs = require('fs');
const file = 'c:/wamp64/www/eoco/backend/database/seeders/SampleCaseSeeder.php';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/'in_progress'/g, "'investigating'");
fs.writeFileSync(file, content);
