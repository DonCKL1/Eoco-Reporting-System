<?php

namespace Database\Seeders;

use App\Models\WantedPerson;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class WantedPersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $images = [
            'akwasi-agyemang-abebrese.jpg',
            'asamoah-reginald-kwadjo.jpg',
            'asampana-bernard.jpg',
            'ebenezer-asare.jpg',
            'emmanuel-sesi.jpg',
            'emmanuel-appiah.jpg',
            'evans-glakpe.jpg',
            'innocent-kaycey-ogbonna.jpg',
            'ismail-hamidu-aka-alfred-dankwa.jpg',
            'kwame-dwomoh-poku.jpg',
            'mercy-korang.jpg',
            'quicoo-williams-elliot.jpg',
            'roy.jpg',
            'abdul-bassit.jpg',
            'mayram-abubakar.jpg',
            'wisdom-atsu.jpg'
        ];

        foreach ($images as $filename) {
            $nameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
            $fullName = ucwords(str_replace('-', ' ', $nameWithoutExt));

            WantedPerson::create([
                'full_name' => $fullName,
                'image_path' => '/wanted/' . $filename,
                'is_active' => true,
                'wanted_since' => now()->subDays(rand(10, 300))->toDateString(),
            ]);
        }
    }
}
