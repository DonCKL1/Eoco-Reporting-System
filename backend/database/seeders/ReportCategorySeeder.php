<?php

namespace Database\Seeders;

use App\Models\ReportCategory;
use Illuminate\Database\Seeder;

/**
 * ReportCategorySeeder
 *
 * Populates the report_categories table with the default set of crime
 * categories recognised by EOCO. Running this seeder multiple times is
 * safe — existing categories will not be duplicated.
 */
class ReportCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name'        => 'Money Laundering',
                'description' => 'The process of concealing the origins of illegally obtained money by passing it through a complex sequence of banking transfers or commercial transactions.',
            ],
            [
                'name'        => 'Fraud',
                'description' => 'Wrongful or criminal deception intended to result in financial or personal gain, including wire fraud, bank fraud, and securities fraud.',
            ],
            [
                'name'        => 'Corruption',
                'description' => 'Dishonest or fraudulent conduct by those in power, typically involving bribery, abuse of entrusted power for private gain, or misuse of public office.',
            ],
            [
                'name'        => 'Cybercrime',
                'description' => 'Criminal activities carried out using computers or the internet, including hacking, phishing, ransomware attacks, and online scams.',
            ],
            [
                'name'        => 'Human Trafficking',
                'description' => 'The illegal trade and exploitation of human beings through force, fraud, or coercion for the purpose of labour, sexual exploitation, or other forms of servitude.',
            ],
            [
                'name'        => 'Tax Evasion',
                'description' => 'The illegal non-payment or underpayment of taxes through deliberate misrepresentation or concealment of income, assets, or financial transactions.',
            ],
            [
                'name'        => 'Bribery',
                'description' => 'The offering, giving, receiving, or soliciting of anything of value as a means of influencing the actions of an official or other person in a position of authority.',
            ],
            [
                'name'        => 'Procurement Fraud',
                'description' => 'Fraudulent activities that occur during the procurement process, including bid rigging, false invoicing, kickbacks, and misrepresentation of goods or services.',
            ],
            [
                'name'        => 'Smuggling',
                'description' => 'The illegal transportation of objects, substances, information, or people, such as out of a house or building, or across an international border.',
            ],
            [
                'name'        => 'Identity Theft',
                'description' => 'The fraudulent acquisition and use of a person\'s private identifying information, usually for financial gain.',
            ],
            [
                'name'        => 'Other',
                'description' => 'Any economic or organised crime that does not fall under the listed categories. Provide full details in your report.',
            ],
        ];

        foreach ($categories as $category) {
            ReportCategory::firstOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }

        $this->command->info('Report categories seeded successfully (' . count($categories) . ' categories).');
    }
}
