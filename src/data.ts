import { Product } from './types';

export const CATEGORIES = [
  {
    id: 'resep',
    name: 'Obat Resep',
    color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-300 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900',
    iconName: 'Pill',
  },
  {
    id: 'vitamin',
    name: 'Vitamin & Suplemen',
    color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-300 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
    iconName: 'Droplet',
  },
  {
    id: 'ibu_bayi',
    name: 'Ibu & Bayi',
    color: 'bg-rose-50 text-rose-600 border-rose-100 hover:border-rose-300 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900',
    iconName: 'Baby',
  },
  {
    id: 'tubuh',
    name: 'Kesehatan Tubuh',
    color: 'bg-teal-50 text-teal-600 border-teal-100 hover:border-teal-300 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900',
    iconName: 'Activity',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Paracetamol 500mg Strip 10 Kaplet',
    category: 'resep',
    apotek: 'Apotek Sehat Jaya',
    price: 12000,
    originalPrice: 15000,
    discountLabel: '-20%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD60UI2UQwoxNjaAo65rv40ofM512iqxyFHb32u0l08VVXQzFTKGBRzpk-SP6c9uey5V86vYgaqS0MMuYsv_iPahmB88NO0ICYFOKQogl5T9RqPa4-3NErhcuqP1JS0y8vxKNVYAvh8zybI15aLv3wzmADln3iTBmF1Sqo1hSVgPDVfhdEJ8TIIIXYQB1FKDoUB15FBc-n9Z7KWWNFEY7H0yoF4rs7z4huqchzYwAPUzWvsnIuywRTIPP5BZJr1xmRd-I1SOyIX8vQ',
    rating: 4.8,
    salesCount: '1rb+',
    description: 'Paracetamol digunakan untuk meredakan rasa sakit ringan hingga sedang seperti sakit kepala, sakit gigi, nyeri otot, serta menurunkan demam. Aman digunakan sesuai aturan pakai.'
  },
  {
    id: 'p2',
    name: 'Vitamin C 1000mg Effervescent',
    category: 'vitamin',
    apotek: 'Apotek K24',
    price: 45000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxdx2ioKOO9GtPTj0xfotvdDfzfpqQ6ZQXG-j4kkVv8iq5l1sRFPXeSUSgaSQyTiNBNwsAa5R_1BmSTcPk7xolQZkmEAuEPzIsP4CQJQ_-FrtwIe6JVE6sBiBNDd53L2po4c_H6X9ipdIZwrpYnz39FdySlYHJlVAFekl41ZHOG0GBLT4JR4373HKAPFiC02_3RG2jjbthGhj7_FrynvrJgwmz50qELY-x6-iJ6JfhfJ3SmaUKH1MP88B81gWqLF-LKWfqZzuBDhU',
    rating: 4.9,
    salesCount: '500+',
    description: 'Suplemen Vitamin C effervescent larut air yang menyegarkan untuk membantu memelihara daya tahan tubuh, meningkatkan pemulihan, dan bertindak sebagai antioksidan kuat.'
  },
  {
    id: 'p3',
    name: 'Sirup Obat Batuk Berdahak 60ml',
    category: 'resep',
    apotek: 'Apotek Kimia Farma',
    price: 22500,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6J4ZC30A8iW0QZAh6QBQaNBGujlz1NvSoALYTLDXyfMI-RcAi9E_ijmQmelh-1o-ngbtOIJt3uQivmF0wArQH2qku1BXcNf4MFTyeospAIa5pqMNZCCyE-0eMPJS39H8EF4-qSYiJqtfdCeLF13wsLoFzjRaTrrlAHBOpJZeFAN-FWkdhmQdBSCzpBeo2t8e89e7fbhyWtuM1prIX-9YXv9tV3IkyFRWbnfkLzPlEQotQjjN0SJn24AYPTPM7FgBSTYY_jdhQrs',
    rating: 4.7,
    salesCount: '300+',
    description: 'Bekerja mengencerkan dahak pada saluran napas sehingga memudahkan dahak keluar saat batuk. Cocok untuk meredakan gejala batuk berdahak pada dewasa dan anak.'
  },
  {
    id: 'p4',
    name: 'Kotak P3K Lengkap Family Size',
    category: 'tubuh',
    apotek: 'Apotek Guardian',
    price: 135000,
    originalPrice: 150000,
    discountLabel: '-10%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZFEFIuuO5Q1gMS2502jZFgu9_a0oSNMBVGpS3RbOg6HZVtqD9BU-WvuvZeYGs1tjGfevo-XHb6UW2wPw5zaiSLlw9bohiwVSAL3DbnYm6tU0JKk800Eeyz87BuMbR9CMEaprzquyl4YxhyiukzKTfzvNSzmSO5WK74DOuxVhhD8v_73sLqgA9kUvVMIkawxYSvMs2tsy9WJA9Ad43W72zb-mc-Ak6GiVOhNz1xv626vz2CRkEmdQrzyUFI59KbdeQFRRSXjCBzo',
    rating: 4.9,
    salesCount: '100+',
    description: 'Kotak Pertolongan Pertama Pada Kecelakaan (P3K) lengkap berisi perban, plester, antiseptik, kasa steril, gunting, pinset, dan perlengkapan darurat keluarga lainnya.'
  },
  {
    id: 'p5',
    name: 'Amoxicillin 500mg Strip 10 Tablet',
    category: 'resep',
    apotek: 'Apotek Sehat Jaya',
    price: 15000,
    originalPrice: 18000,
    discountLabel: '-16%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD60UI2UQwoxNjaAo65rv40ofM512iqxyFHb32u0l08VVXQzFTKGBRzpk-SP6c9uey5V86vYgaqS0MMuYsv_iPahmB88NO0ICYFOKQogl5T9RqPa4-3NErhcuqP1JS0y8vxKNVYAvh8zybI15aLv3wzmADln3iTBmF1Sqo1hSVgPDVfhdEJ8TIIIXYQB1FKDoUB15FBc-n9Z7KWWNFEY7H0yoF4rs7z4huqchzYwAPUzWvsnIuywRTIPP5BZJr1xmRd-I1SOyIX8vQ',
    rating: 4.6,
    salesCount: '800+',
    description: 'Antibiotik berspektrum luas untuk mengatasi berbagai jenis infeksi bakteri. HARUS DENGAN RESEP DOKTER. Habiskan antibiotik sesuai petunjuk.'
  },
  {
    id: 'p6',
    name: 'Minyak Kayu Putih Cajuput Oil 120ml',
    category: 'tubuh',
    apotek: 'Apotek K24',
    price: 38000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6J4ZC30A8iW0QZAh6QBQaNBGujlz1NvSoALYTLDXyfMI-RcAi9E_ijmQmelh-1o-ngbtOIJt3uQivmF0wArQH2qku1BXcNf4MFTyeospAIa5pqMNZCCyE-0eMPJS39H8EF4-qSYiJqtfdCeLF13wsLoFzjRaTrrlAHBOpJZeFAN-FWkdhmQdBSCzpBeo2t8e89e7fbhyWtuM1prIX-9YXv9tV3IkyFRWbnfkLzPlEQotQjjN0SJn24AYPTPM7FgBSTYY_jdhQrs',
    rating: 4.9,
    salesCount: '2rb+',
    description: 'Minyak kayu putih berkualitas tinggi beraroma segar untuk meredakan masuk angin, perut kembung, mual, serta gatal-gatal akibat gigitan serangga atau nyamuk.'
  },
  {
    id: 'p7',
    name: 'Susu Formula Bayi Premium Tahap 1 400g',
    category: 'ibu_bayi',
    apotek: 'Apotek Guardian',
    price: 115000,
    originalPrice: 125000,
    discountLabel: '-8%',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIZFEFIuuO5Q1gMS2502jZFgu9_a0oSNMBVGpS3RbOg6HZVtqD9BU-WvuvZeYGs1tjGfevo-XHb6UW2wPw5zaiSLlw9bohiwVSAL3DbnYm6tU0JKk800Eeyz87BuMbR9CMEaprzquyl4YxhyiukzKTfzvNSzmSO5WK74DOuxVhhD8v_73sLqgA9kUvVMIkawxYSvMs2tsy9WJA9Ad43W72zb-mc-Ak6GiVOhNz1xv626vz2CRkEmdQrzyUFI59KbdeQFRRSXjCBzo',
    rating: 4.8,
    salesCount: '300+',
    description: 'Susu formula bernutrisi tinggi yang diformulasikan khusus untuk memenuhi kebutuhan gizi kembang tumbuh bayi umur 0-6 bulan. Air susu ibu (ASI) adalah yang terbaik.'
  },
  {
    id: 'p8',
    name: 'Minyak Telon Bayi Anti Nyamuk 8 Jam',
    category: 'ibu_bayi',
    apotek: 'Apotek Kimia Farma',
    price: 29000,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxdx2ioKOO9GtPTj0xfotvdDfzfpqQ6ZQXG-j4kkVv8iq5l1sRFPXeSUSgaSQyTiNBNwsAa5R_1BmSTcPk7xolQZkmEAuEPzIsP4CQJQ_-FrtwIe6JVE6sBiBNDd53L2po4c_H6X9ipdIZwrpYnz39FdySlYHJlVAFekl41ZHOG0GBLT4JR4373HKAPFiC02_3RG2jjbthGhj7_FrynvrJgwmz50qELY-x6-iJ6JfhfJ3SmaUKH1MP88B81gWqLF-LKWfqZzuBDhU',
    rating: 4.9,
    salesCount: '1.5rb+',
    description: 'Minyak telon bayi beraroma lembut yang memberikan kehangatan tahan lama untuk tubuh bayi serta melindunginya dari gigitan nyamuk demam berdarah hingga 8 jam.'
  }
];
