// src/data/quranSurahCatalog.ts
// Katalog 114 Surah Al-Qur'an dan Generator Tadabbur Pintar (Ayat Arab, Latin, Kisah, Topik, Hikmah, & Aksi Nyata)

export interface SurahMeta {
  number: number;
  name: string;
  arabic: string;
  meaning: string;
  ayahCount: number;
  revelation: 'Makkiyah' | 'Madaniyah';
}

export interface SmartTadabburTemplate {
  surahNumber: number;
  surahName: string;
  ayahRange: string;
  arabicText: string;
  latinText: string;
  translationText: string;
  story: string;
  topic: string;
  wisdom: string;
  actionPlan: string;
  youtubeLink?: string;
}

export const ALL_114_SURAHS: SurahMeta[] = [
  { number: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "Pembukaan", ayahCount: 7, revelation: "Makkiyah" },
  { number: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "Sapi Betina", ayahCount: 286, revelation: "Madaniyah" },
  { number: 3, name: "Ali 'Imran", arabic: "آل عمران", meaning: "Keluarga Imran", ayahCount: 200, revelation: "Madaniyah" },
  { number: 4, name: "An-Nisa'", arabic: "النساء", meaning: "Wanita", ayahCount: 176, revelation: "Madaniyah" },
  { number: 5, name: "Al-Ma'idah", arabic: "المائدة", meaning: "Jamuan Hidangan", ayahCount: 120, revelation: "Madaniyah" },
  { number: 6, name: "Al-An'am", arabic: "الأنعام", meaning: "Hewan Ternak", ayahCount: 165, revelation: "Makkiyah" },
  { number: 7, name: "Al-A'raf", arabic: "الأعراف", meaning: "Tempat yang Tertinggi", ayahCount: 206, revelation: "Makkiyah" },
  { number: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "Harta Rampasan Perang", ayahCount: 75, revelation: "Madaniyah" },
  { number: 9, name: "At-Taubah", arabic: "التوبة", meaning: "Pengampunan", ayahCount: 129, revelation: "Madaniyah" },
  { number: 10, name: "Yunus", arabic: "يونس", meaning: "Nabi Yunus", ayahCount: 109, revelation: "Makkiyah" },
  { number: 11, name: "Hud", arabic: "هود", meaning: "Nabi Hud", ayahCount: 123, revelation: "Makkiyah" },
  { number: 12, name: "Yusuf", arabic: "يوسف", meaning: "Nabi Yusuf", ayahCount: 111, revelation: "Makkiyah" },
  { number: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "Guruh", ayahCount: 43, revelation: "Madaniyah" },
  { number: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Nabi Ibrahim", ayahCount: 52, revelation: "Makkiyah" },
  { number: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "Gunung Al-Hijr", ayahCount: 99, revelation: "Makkiyah" },
  { number: 16, name: "An-Nahl", arabic: "النحل", meaning: "Lebah", ayahCount: 128, revelation: "Makkiyah" },
  { number: 17, name: "Al-Isra'", arabic: "الإسراء", meaning: "Perjalanan Malam", ayahCount: 111, revelation: "Makkiyah" },
  { number: 18, name: "Al-Kahfi", arabic: "الكهف", meaning: "Gua", ayahCount: 110, revelation: "Makkiyah" },
  { number: 19, name: "Maryam", arabic: "مريم", meaning: "Maryam", ayahCount: 98, revelation: "Makkiyah" },
  { number: 20, name: "Ta-Ha", arabic: "طه", meaning: "Ta-Ha", ayahCount: 135, revelation: "Makkiyah" },
  { number: 21, name: "Al-Anbiya'", arabic: "الأنبياء", meaning: "Para Nabi", ayahCount: 112, revelation: "Makkiyah" },
  { number: 22, name: "Al-Hajj", arabic: "الحج", meaning: "Haji", ayahCount: 78, revelation: "Madaniyah" },
  { number: 23, name: "Al-Mu'minun", arabic: "المؤمنون", meaning: "Orang-Orang Mukmin", ayahCount: 118, revelation: "Makkiyah" },
  { number: 24, name: "An-Nur", arabic: "النور", meaning: "Cahaya", ayahCount: 64, revelation: "Madaniyah" },
  { number: 25, name: "Al-Furqan", arabic: "الفرقان", meaning: "Pembeda", ayahCount: 77, revelation: "Makkiyah" },
  { number: 26, name: "Asy-Syu'ara'", arabic: "الشعراء", meaning: "Para Penyair", ayahCount: 227, revelation: "Makkiyah" },
  { number: 27, name: "An-Naml", arabic: "النمل", meaning: "Semut", ayahCount: 93, revelation: "Makkiyah" },
  { number: 28, name: "Al-Qashash", arabic: "القصص", meaning: "Kisah-Kisah", ayahCount: 88, revelation: "Makkiyah" },
  { number: 29, name: "Al-'Ankabut", arabic: "العنكبوت", meaning: "Laba-Laba", ayahCount: 69, revelation: "Makkiyah" },
  { number: 30, name: "Ar-Rum", arabic: "الروم", meaning: "Bangsa Romawi", ayahCount: 60, revelation: "Makkiyah" },
  { number: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman", ayahCount: 34, revelation: "Makkiyah" },
  { number: 32, name: "As-Sajdah", arabic: "السجدة", meaning: "Sujud", ayahCount: 30, revelation: "Makkiyah" },
  { number: 33, name: "Al-Ahzab", arabic: "الأحزاب", meaning: "Golongan yang Bersekutu", ayahCount: 73, revelation: "Madaniyah" },
  { number: 34, name: "Saba'", arabic: "سبأ", meaning: "Kaum Saba'", ayahCount: 54, revelation: "Makkiyah" },
  { number: 35, name: "Fathir", arabic: "فاطر", meaning: "Pencipta", ayahCount: 45, revelation: "Makkiyah" },
  { number: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya-Sin", ayahCount: 83, revelation: "Makkiyah" },
  { number: 37, name: "Ash-Shaffat", arabic: "الصافات", meaning: "Barisan-Barisan", ayahCount: 182, revelation: "Makkiyah" },
  { number: 38, name: "Shad", arabic: "ص", meaning: "Shad", ayahCount: 88, revelation: "Makkiyah" },
  { number: 39, name: "Az-Zumar", arabic: "الزمر", meaning: "Rombongan", ayahCount: 75, revelation: "Makkiyah" },
  { number: 40, name: "Ghafir", arabic: "غافر", meaning: "Maha Pengampun", ayahCount: 85, revelation: "Makkiyah" },
  { number: 41, name: "Fushshilat", arabic: "فصلت", meaning: "Dijelaskan", ayahCount: 54, revelation: "Makkiyah" },
  { number: 42, name: "Asy-Syura", arabic: "الشورى", meaning: "Musyawarah", ayahCount: 53, revelation: "Makkiyah" },
  { number: 43, name: "Az-Zukhruf", arabic: "الزخرف", meaning: "Perhiasan", ayahCount: 89, revelation: "Makkiyah" },
  { number: 44, name: "Ad-Dukhan", arabic: "الدخان", meaning: "Kabut Asap", ayahCount: 59, revelation: "Makkiyah" },
  { number: 45, name: "Al-Jatsiyah", arabic: "الجاثية", meaning: "Yang Berlutut", ayahCount: 37, revelation: "Makkiyah" },
  { number: 46, name: "Al-Ahqaf", arabic: "الأحقاف", meaning: "Bukit-Bukit Pasir", ayahCount: 35, revelation: "Makkiyah" },
  { number: 47, name: "Muhammad", arabic: "محمد", meaning: "Nabi Muhammad", ayahCount: 38, revelation: "Madaniyah" },
  { number: 48, name: "Al-Fath", arabic: "الفتح", meaning: "Kemenangan", ayahCount: 29, revelation: "Madaniyah" },
  { number: 49, name: "Al-Hujurat", arabic: "الحجرات", meaning: "Kamar-Kamar", ayahCount: 18, revelation: "Madaniyah" },
  { number: 50, name: "Qaf", arabic: "ق", meaning: "Qaf", ayahCount: 45, revelation: "Makkiyah" },
  { number: 51, name: "Adz-Dzariyat", arabic: "الذاريات", meaning: "Angin yang Menerbangkan", ayahCount: 60, revelation: "Makkiyah" },
  { number: 52, name: "Ath-Thur", arabic: "الطور", meaning: "Bukit Tursina", ayahCount: 49, revelation: "Makkiyah" },
  { number: 53, name: "An-Najm", arabic: "النجم", meaning: "Bintang", ayahCount: 62, revelation: "Makkiyah" },
  { number: 54, name: "Al-Qamar", arabic: "القمر", meaning: "Bulan", ayahCount: 55, revelation: "Makkiyah" },
  { number: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "Yang Maha Pengasih", ayahCount: 78, revelation: "Madaniyah" },
  { number: 56, name: "Al-Waqi'ah", arabic: "الواقعة", meaning: "Hari Kiamat", ayahCount: 96, revelation: "Makkiyah" },
  { number: 57, name: "Al-Hadid", arabic: "الحديد", meaning: "Besi", ayahCount: 29, revelation: "Madaniyah" },
  { number: 58, name: "Al-Mujadilah", arabic: "المجادلة", meaning: "Gugatan", ayahCount: 22, revelation: "Madaniyah" },
  { number: 59, name: "Al-Hasyr", arabic: "الحشر", meaning: "Pengusiran", ayahCount: 24, revelation: "Madaniyah" },
  { number: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", meaning: "Wanita yang Diuji", ayahCount: 13, revelation: "Madaniyah" },
  { number: 61, name: "Ash-Shaff", arabic: "الصف", meaning: "Barisan", ayahCount: 14, revelation: "Madaniyah" },
  { number: 62, name: "Al-Jumu'ah", arabic: "الجمعة", meaning: "Hari Jum'at", ayahCount: 11, revelation: "Madaniyah" },
  { number: 63, name: "Al-Munafiqun", arabic: "المنافقون", meaning: "Orang-Orang Munafik", ayahCount: 11, revelation: "Madaniyah" },
  { number: 64, name: "At-Taghabun", arabic: "التغابن", meaning: "Hari Dinampakkan Kesalahan", ayahCount: 18, revelation: "Madaniyah" },
  { number: 65, name: "At-Talaq", arabic: "الطلاق", meaning: "Perceraian", ayahCount: 12, revelation: "Madaniyah" },
  { number: 66, name: "At-Tahrim", arabic: "التحريم", meaning: "Pengharaman", ayahCount: 12, revelation: "Madaniyah" },
  { number: 67, name: "Al-Mulk", arabic: "الملك", meaning: "Kerajaan", ayahCount: 30, revelation: "Makkiyah" },
  { number: 68, name: "Al-Qalam", arabic: "القلم", meaning: "Pena", ayahCount: 52, revelation: "Makkiyah" },
  { number: 69, name: "Al-Haqqah", arabic: "الحاقة", meaning: "Hari Kiamat yang Pasti", ayahCount: 52, revelation: "Makkiyah" },
  { number: 70, name: "Al-Ma'arij", arabic: "المعارج", meaning: "Tempat Naik", ayahCount: 44, revelation: "Makkiyah" },
  { number: 71, name: "Nuh", arabic: "نوح", meaning: "Nabi Nuh", ayahCount: 28, revelation: "Makkiyah" },
  { number: 72, name: "Al-Jinn", arabic: "الجن", meaning: "Jin", ayahCount: 28, revelation: "Makkiyah" },
  { number: 73, name: "Al-Muzzammil", arabic: "المزمل", meaning: "Orang yang Berselimut", ayahCount: 20, revelation: "Makkiyah" },
  { number: 74, name: "Al-Muddatstsir", arabic: "المدثر", meaning: "Orang yang Berkemul", ayahCount: 56, revelation: "Makkiyah" },
  { number: 75, name: "Al-Qiyamah", arabic: "القيامة", meaning: "Hari Kiamat", ayahCount: 40, revelation: "Makkiyah" },
  { number: 76, name: "Al-Insan", arabic: "الإنسان", meaning: "Manusia", ayahCount: 31, revelation: "Madaniyah" },
  { number: 77, name: "Al-Mursalat", arabic: "المرسلات", meaning: "Malaikat yang Diutus", ayahCount: 50, revelation: "Makkiyah" },
  { number: 78, name: "An-Naba'", arabic: "النبأ", meaning: "Berita Besar", ayahCount: 40, revelation: "Makkiyah" },
  { number: 79, name: "An-Nazi'at", arabic: "النازعات", meaning: "Malaikat Pencabut Nyawa", ayahCount: 46, revelation: "Makkiyah" },
  { number: 80, name: "'Abasa", arabic: "عبس", meaning: "Bermuka Masam", ayahCount: 42, revelation: "Makkiyah" },
  { number: 81, name: "At-Takwir", arabic: "التكوير", meaning: "Menggulung", ayahCount: 29, revelation: "Makkiyah" },
  { number: 82, name: "Al-Infithar", arabic: "الانفطار", meaning: "Terbelah", ayahCount: 19, revelation: "Makkiyah" },
  { number: 83, name: "Al-Muthaffifin", arabic: "المطففين", meaning: "Orang-Orang Curang", ayahCount: 36, revelation: "Makkiyah" },
  { number: 84, name: "Al-Insyiqaq", arabic: "الانشقاق", meaning: "Terbelah", ayahCount: 25, revelation: "Makkiyah" },
  { number: 85, name: "Al-Buruj", arabic: "البروج", meaning: "Gugusan Bintang", ayahCount: 22, revelation: "Makkiyah" },
  { number: 86, name: "Ath-Thariq", arabic: "الطارق", meaning: "Yang Datang di Malam Hari", ayahCount: 17, revelation: "Makkiyah" },
  { number: 87, name: "Al-A'la", arabic: "الأعلى", meaning: "Yang Maha Tinggi", ayahCount: 19, revelation: "Makkiyah" },
  { number: 88, name: "Al-Ghasyiyah", arabic: "الغاشية", meaning: "Hari Pembalasan", ayahCount: 26, revelation: "Makkiyah" },
  { number: 89, name: "Al-Fajr", arabic: "الفجر", meaning: "Waktu Fajar", ayahCount: 30, revelation: "Makkiyah" },
  { number: 90, name: "Al-Balad", arabic: "البلد", meaning: "Negeri", ayahCount: 20, revelation: "Makkiyah" },
  { number: 91, name: "Asy-Syams", arabic: "الشمس", meaning: "Matahari", ayahCount: 15, revelation: "Makkiyah" },
  { number: 92, name: "Al-Lail", arabic: "الليل", meaning: "Malam", ayahCount: 21, revelation: "Makkiyah" },
  { number: 93, name: "Adh-Dhuha", arabic: "الضحى", meaning: "Waktu Dhuha", ayahCount: 11, revelation: "Makkiyah" },
  { number: 94, name: "Asy-Syarh", arabic: "الشرح", meaning: "Kelapangan Dada (Al-Insyirah)", ayahCount: 8, revelation: "Makkiyah" },
  { number: 95, name: "At-Tin", arabic: "التين", meaning: "Buah Tin", ayahCount: 8, revelation: "Makkiyah" },
  { number: 96, name: "Al-'Alaq", arabic: "العلق", meaning: "Segumpal Darah", ayahCount: 19, revelation: "Makkiyah" },
  { number: 97, name: "Al-Qadr", arabic: "القدر", meaning: "Kemuliaan", ayahCount: 5, revelation: "Makkiyah" },
  { number: 98, name: "Al-Bayyinah", arabic: "البينة", meaning: "Bukti Nyata", ayahCount: 8, revelation: "Madaniyah" },
  { number: 99, name: "Az-Zalzalah", arabic: "الزلزلة", meaning: "Goncangan", ayahCount: 8, revelation: "Madaniyah" },
  { number: 100, name: "Al-'Adiyat", arabic: "العاديات", meaning: "Kuda yang Berlari Kencang", ayahCount: 11, revelation: "Makkiyah" },
  { number: 101, name: "Al-Qari'ah", arabic: "القارعة", meaning: "Hari Kiamat", ayahCount: 11, revelation: "Makkiyah" },
  { number: 102, name: "At-Takatsur", arabic: "التكاثر", meaning: "Bermegah-Megahan", ayahCount: 8, revelation: "Makkiyah" },
  { number: 103, name: "Al-'Ashr", arabic: "العصر", meaning: "Masa / Waktu", ayahCount: 3, revelation: "Makkiyah" },
  { number: 104, name: "Al-Humazah", arabic: "الهمزة", meaning: "Pengumpat", ayahCount: 9, revelation: "Makkiyah" },
  { number: 105, name: "Al-Fil", arabic: "الفيل", meaning: "Gajah", ayahCount: 5, revelation: "Makkiyah" },
  { number: 106, name: "Quraisy", arabic: "قريش", meaning: "Suku Quraisy", ayahCount: 4, revelation: "Makkiyah" },
  { number: 107, name: "Al-Ma'un", arabic: "الماعون", meaning: "Barang yang Berguna", ayahCount: 7, revelation: "Makkiyah" },
  { number: 108, name: "Al-Kautsar", arabic: "الكوثر", meaning: "Nikmat yang Berlimpah", ayahCount: 3, revelation: "Makkiyah" },
  { number: 109, name: "Al-Kafirun", arabic: "الكافرون", meaning: "Orang-Orang Kafir", ayahCount: 6, revelation: "Makkiyah" },
  { number: 110, name: "An-Nashr", arabic: "النصر", meaning: "Pertolongan", ayahCount: 3, revelation: "Madaniyah" },
  { number: 111, name: "Al-Lahab", arabic: "اللهب", meaning: "Gejolak Api", ayahCount: 5, revelation: "Makkiyah" },
  { number: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "Memurnikan Ke-Esaan Allah", ayahCount: 4, revelation: "Makkiyah" },
  { number: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "Waktu Subuh", ayahCount: 5, revelation: "Makkiyah" },
  { number: 114, name: "An-Nas", arabic: "الناس", meaning: "Manusia", ayahCount: 6, revelation: "Makkiyah" }
];

export const SMART_TADABBUR_TEMPLATES: Record<string, SmartTadabburTemplate> = {
  // 1. QS. Al-Insyirah (Asy-Syarh)
  '94': {
    surahNumber: 94,
    surahName: "QS. Asy-Syarh (Al-Insyirah)",
    ayahRange: "Ayat 1-8",
    arabicText: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۝ وَوَضَعْنَا عَنْكَ وِزْرَكَ ۝ الَّذِي أَنْقَضَ ظَهْرَكَ ۝ وَرَفَعْنَا لَكَ ذِكْرَكَ ۝ فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ فَإِذَا فَرَغْتَ فَانْصَبْ ۝ وَإِلَىٰ رَبِّكَ فَارْغَبْ ۝",
    latinText: "Alam nasyrah laka shadrak. Wa wadha'naa 'anka wizrak. Alladzii anqadha zhahrak. Wa rafa'naa laka dzikrak. Fa inna ma'al 'usri yusraa. Inna ma'al 'usri yusraa. Fa idzaa faraghta fanshab. Wa ilaa rabbika farghab.",
    translationText: "1. Bukankah Kami telah melapangkan dadamu (Muhammad)? 2. Dan Kami pun telah menurunkan bebanmu darimu, 3. yang memberatkan punggungmu, 4. dan Kami tinggikan sebutan (nama)-mu bagimu. 5. Maka sesungguhnya bersama kesulitan ada kemudahan, 6. sesungguhnya bersama kesulitan ada kemudahan. 7. Maka apabila engkau telah selesai (dari suatu urusan), tetaplah bekerja keras (untuk urusan yang lain), 8. dan hanya kepada Tuhanmulah engkau berharap.",
    story: "Diturunkan untuk menghibur dan menguatkan hati Baginda Rasulullah SAW saat menghadapi masa-masa terberat dakwah di Mekkah dengan intimidasi kaum Quraisy.",
    topic: "Jaminan pasti datangnya kemudahan di balik setiap ujian, kelapangan jiwa orang beriman, dan etos kerja pantang menyerah.",
    wisdom: "Satu kesulitan tidak akan pernah mampu mengalahkan dua kemudahan yang Allah janjikan. Jangan pernah berputus asa dari rahmat Allah.",
    actionPlan: "Ketika tertimpa masalah rumit, tetap berprasangka baik bahwa pertolongan Allah sedang mendekat. Begitu satu tugas selesai, langsung beranjak pada amal produktif berikutnya."
  },

  // 2. QS. Al-Baqarah (Ayat Kursi - 255)
  '2-kursi': {
    surahNumber: 2,
    surahName: "QS. Al-Baqarah (Ayat Kursi)",
    ayahRange: "Ayat 255",
    arabicText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ۝",
    latinText: "Allaahu laa ilaaha illaa huwal hayyul qayyuum, laa ta'khudzuhuu sinatuw wa laa naum, lahuu maa fis samaawaati wa maa fil ardh, man dzalladzii yasyfa'u 'indahuu illaa bi-idznih, ya'lamu maa baina aidiihim wa maa khalfahum, wa laa yuhiithuuna bisyai-im min 'ilmihii illaa bimaa syaa', wasi'a kursiyyuhus samaawaati wal ardh, wa laa ya-uuduhuu hifzhuhumaa, wa huwal 'aliyyul 'azhiim.",
    translationText: "Allah, tidak ada tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang ada di hadapan mereka dan apa yang ada di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Maha Tinggi, Maha Besar. (QS. Al-Baqarah: 255)",
    story: "Ayat paling agung dalam Al-Qur'an (Sayyidatu Ayil Qur'an). Ditegaskan oleh Rasulullah SAW sebagai benteng perlindungan tertinggi dari godaan setan dan marabahaya.",
    topic: "Kemurnian tauhid, keagungan sifat rububiyyah dan uluhiyyah Allah, serta keluasan ilmu dan kekuasaan-Nya yang mutlak.",
    wisdom: "Jika Allah yang memelihara seluruh galaksi langit dan bumi tidak pernah lelah dan tidak pernah tidur, mengapa kita harus cemas menyerahkan hidup kita kepada-Nya?",
    actionPlan: "Membaca Ayat Kursi setiap selesai sholat fardhu 5 waktu dan sebelum berbaring tidur untuk mengundang penjagaan malaikat."
  },

  // 3. QS. Adh-Dhuha
  '93': {
    surahNumber: 93,
    surahName: "QS. Adh-Dhuha",
    ayahRange: "Ayat 1-11",
    arabicText: "وَالضُّحَىٰ ۝ وَاللَّيْلِ إِذَا سَجَىٰ ۝ مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ ۝ وَلَلْآخِرَةُ خَيْرٌ لَكَ مِنَ الْأُولَىٰ ۝ وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ ۝ أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ ۝ وَوَجَدَكَ ضَالًّا فَهَدَىٰ ۝ وَوَجَدَكَ عَائِلًا فَأَغْنَىٰ ۝ فَأَمَّا الْيَتِيمَ فَلَا تَقْهَرْ ۝ وَأَمَّا السَّائِلَ فَلَا تَنْهَرْ ۝ وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ ۝",
    latinText: "Wadh-dhuhaa. Wal-laili idzaa sajaa. Maa wadda'aka rabbuka wa maa qalaa. Wa lal-aakhiratu khairul laka minal uulaa. Wa lasaufa yu'thiika rabbuka fatardhaa. Alam yajidka yatiiman fa-aawaa. Wa wajadaka dhaallan fahadaa. Wa wajadaka 'aa-ilan fa-aghnaa. Fa ammal yatiima falaa taqhar. Wa ammas-saa-ila falaa tanhar. Wa ammaa bini'mati rabbika fahaddits.",
    translationText: "1. Demi waktu dhuha (ketika matahari naik sepenggalah), 2. dan demi malam apabila telah sunyi, 3. Tuhanmu tidak meninggalkan engkau (Muhammad) dan tidak (pula) membencimu, 4. dan sungguh, yang kemudian (akhirat) itu lebih baik bagimu daripada yang permulaan (dunia). 5. Dan sungguh, kelak Tuhanmu pasti memberikan karunia-Nya kepadamu, sehingga engkau menjadi puas. 6. Bukankah Dia mendapatimu sebagai seorang yatim, lalu Dia melindungimu? 7. Dan Dia mendapatimu sebagai seorang yang bingung, lalu Dia memberikan petunjuk? 8. Dan Dia mendapatimu sebagai seorang yang kekurangan, lalu Dia memberikan kecukupan? 9. Maka terhadap anak yatim janganlah engkau berlaku sewenang-wenang. 10. Dan terhadap orang yang meminta-minta janganlah engkau menghardik(nya). 11. Dan terhadap nikmat Tuhanmu, hendaklah engkau nyatakan (dengan bersyukur).",
    story: "Diturunkan tatkala wahyu sempat terhenti beberapa saat hingga kaum musyrikin mengejek bahwa Rasulullah SAW telah ditinggalkan Tuhannya. Allah menurunkan surat ini untuk mendekap hati hamba-Nya yang sedang gundah.",
    topic: "Cinta dan kasih sayang Allah yang abadi, kepastian akhir yang indah, empati kepada sesama, dan rasa syukur atas nikmat hidup.",
    wisdom: "Saat merasa sendirian atau diabaikan oleh dunia, ingatlah bahwa Allah tidak pernah meninggalkan hamba yang beriman. Hari esok pasti lebih baik dari hari ini.",
    actionPlan: "Rutin sholat Dhuha setiap pagi, menyayangi anak yatim/kaum dhuafa, dan menuliskan nikmat-nikmat Allah di jurnal syukur harian."
  },

  // 4. QS. Al-Fatihah
  '1': {
    surahNumber: 1,
    surahName: "QS. Al-Fatihah (Ummul Kitab)",
    ayahRange: "Ayat 1-7",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ۝",
    latinText: "Bismillaahir rahmaanir rahiim. Alhamdulillaahi rabbil 'aalamiin. Ar-rahmaanir rahiim. Maaliki yaumid diin. Iyyaaka na'budu wa iyyaaka nasta'iin. Ihdinash shiraathal mustaqiim. Shiraathal ladziina an'amta 'alaihim ghairil maghdhuubi 'alaihim wa ladh-dhaalliin.",
    translationText: "1. Dengan nama Allah Yang Maha Pengasih, Maha Penyayang. 2. Segala puji bagi Allah, Tuhan semesta alam. 3. Yang Maha Pengasih, Maha Penyayang. 4. Pemilik hari pembalasan. 5. Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan. 6. Tunjukilah kami jalan yang lurus, 7. (yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
    story: "Surat pembuka Al-Qur'an dan rukun sholat yang dialognya dijawab langsung oleh Allah SWT kata demi kata dalam hadis Qudsi.",
    topic: "Pujian kepada Allah, tauhid ibadah dan permohonan pertolongan (Isti'anah), serta doa hidayah istiqomah di jalan yang lurus.",
    wisdom: "Kunci keberhasilan hidup terkumpul pada ayat 'Iyyaka na'budu wa iyyaka nasta'in': ikhtiar maksimal sebagai bentuk ibadah, dan pasrah total memohon pertolongan Allah.",
    actionPlan: "Membaca Al-Fatihah dalam sholat dengan pelan dan penuh jeda di setiap ayat untuk menghadirkan jawaban kasih sayang dari Allah SWT."
  },

  // 5. QS. Al-Waqi'ah
  '56': {
    surahNumber: 56,
    surahName: "QS. Al-Waqi'ah (Ayat 1-10 & 88-96)",
    ayahRange: "Ayat 1-10",
    arabicText: "إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ۝ وَبُسَّتِ الْجِبَالُ بَسًّا ۝ فَكَانَتْ هَبَاءً مُنْبَثًّا ۝ وَكُنْتُمْ أَزْوَاجًا ثَلَاثَةً ۝ فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ ۝ وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ ۝ وَالسَّابِقُونَ السَّابِقُونَ ۝",
    latinText: "Idzaa waqa'atil waaqi'ah. Laisa liwaq'atihaa kaadzibah. Khaafidhatur raafi'ah. Idzaa rujjatil ardhu rajjaa. Wa bussatil jibaalu bassaa. Fakaanat habaa-am mumbatstsaa. Wa kuntum azwaajan tsalaatsah. Fa ash-haabul maymanati maa ash-haabul maymanah. Wa ash-haabul masy-amati maa ash-haabul masy-amah. Was saabiquunas saabiquun.",
    translationText: "1. Apabila terjadi hari Kiamat, 2. terjadinya tidak dapat didustakan (pasti terjadi). 3. (Kejadian itu) merendahkan (satu golongan) dan meninggikan (golongan yang lain). 4. Apabila bumi diguncangkan sedahsyat-dahsyatnya, 5. dan gunung-gunung dihancurluluhkan sehancur-hancurnya, 6. maka jadilah ia debu yang beterbangan, 7. dan kamu menjadi tiga golongan: 8. yaitu golongan kanan, alangkah mulianya golongan kanan itu; 9. dan golongan kiri, alangkah sengsaranya golongan kiri itu; 10. dan orang-orang yang paling dahulu (beriman), merekalah yang paling dahulu (masuk surga).",
    story: "Menggambarkan realitas hari akhirat di mana manusia dikelompokkan berdasarkan kemurnian iman dan kualitas amalnya semasa hidup di dunia.",
    topic: "Kepastian kiamat, golongan orang-orang yang didekatkan kepada Allah (Muqarrabin), dan jaminan rezeki yang berkah.",
    wisdom: "Kemewahan duniawi tidak bernilai jika melalaikan akhirat. Rezeki terbaik adalah rezeki yang membawa ketenangan jiwa dan mengantarkan ke surga.",
    actionPlan: "Istiqomah membaca surat Al-Waqi'ah di waktu petang ba'da Ashar serta menjaga integritas kejujuran dalam berbisnis/bekerja."
  },

  // 6. QS. Al-Mulk
  '67': {
    surahNumber: 67,
    surahName: "QS. Al-Mulk (Tabarakal Mulk)",
    ayahRange: "Ayat 1-5",
    arabicText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ ۝",
    latinText: "Tabaarakalladzii biyadihil mulku wa huwa 'alaa kulli syai-in qadiir. Alladzii khalaqal mawta wal hayaata liyabluwakum ayyukum ahsanu 'amalaa, wa huwal 'aziizul ghafuur. Alladzii khalaqa sab'a samaawaatin thibaaqaa, maa taraa fii khalqir rahmaani min tafaawut, farji'il bashara hal taraa min futhuur.",
    translationText: "1. Maha Suci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu. 2. Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa lagi Maha Pengampun. 3. Yang telah menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pengasih sesuatu yang tidak seimbang. Maka lihatlah berulang-ulang, adakah kamu lihat sesuatu yang cacat?",
    story: "Surat yang diberi nama Al-Munjiyah (Penyelamat) dan Al-Waqiyah (Pelindung) dari siksa kubur yang diajarkan Rasulullah SAW untuk dibaca tiap malam.",
    topic: "Kekuasaan mutlak Allah, hakikat penciptaan hidup dan mati sebagai ladang amal, serta kesempurnaan ciptaan alam semesta.",
    wisdom: "Hidup adalah waktu sementara untuk mengumpulkan bekal terbaik. Menyadari kematian membuat hati zuhud terhadap perhiasan dunia yang fana.",
    actionPlan: "Rutin membaca 30 ayat Al-Mulk sebelum tidur di malam hari serta melakukan muhasabah harian atas khilaf dan dosa yang telah lewat."
  },

  // 7. QS. Al-Kahfi
  '18': {
    surahNumber: 18,
    surahName: "QS. Al-Kahfi (Ayat 1-10)",
    ayahRange: "Ayat 1-10",
    arabicText: "الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ ۝ قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ ۝ ... إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا ۝",
    latinText: "Alhamdulillahilladzii anzala 'alaa 'abdihil kitaaba wa lam yaj'al lahu 'iwajaa. Qayyimal liyundzira ba'san syadiidam mil ladunhu wa yubasysyiral mu'miniin... Idz awal fityatu ilal kahfi faqaaluu rabbanaa aatinaa mil ladunka rahmataw wa hayyi' lanaa min amrinaa rasyadaa.",
    translationText: "1. Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok; 2. sebagai bimbingan yang lurus, untuk memperingatkan siksaan yang sangat pedih dari sisi-Nya dan memberi kabar gembira kepada orang-orang mukmin... 10. (Ingatlah) tatkala pemuda-pemuda itu berlindung ke dalam gua lalu mereka berdoa: 'Wahai Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah petunjuk yang lurus bagi kami dalam urusan kami'.",
    story: "Kisah pemuda beriman yang rela meninggalkan zona nyaman dan gemerlap istana demi mempertahankan kemurnian akidah tauhid di dalam gua.",
    topic: "Perlindungan akidah, pertolongan ajaib dari Allah di saat terjepit, dan lentera cahaya di antara dua Jum'at.",
    wisdom: "Ketika kita memprioritaskan Allah dan menjaga iman, Allah akan melindungi urusan kita dengan cara yang tak terbayangkan oleh logika manusia.",
    actionPlan: "Membaca surat Al-Kahfi setiap hari Jum'at dan merutinkan doa pemuda Kahfi ('Rabbana aatina min ladunka rahmah') saat menghadapi keputusan sulit."
  },

  // 8. QS. At-Talaq (Ayat Seribu Dinar)
  '65': {
    surahNumber: 65,
    surahName: "QS. At-Talaq (Ayat 2-3 - Ayat Seribu Dinar)",
    ayahRange: "Ayat 2-3",
    arabicText: "وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا ۝",
    latinText: "Wa may yattaqillaaha yaj'al lahuu makhrajaa. Wa yarzuqhu min haitsu laa yahtasib, wa may yatawakkal 'alallaahi fahuwa hasbuh, innallaaha baalighu amrih, qad ja'alallaahu likulli syai-in qadraa.",
    translationText: "Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa bertawakkal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan yang (dikehendaki)-Nya. Sesungguhnya Allah telah mengadakan ketentuan bagi tiap-tiap sesuatu. (QS. At-Talaq: 2-3)",
    story: "Janji kepastian jalan keluar bagi hamba yang taat dan bertakwa saat menghadapi kemelut rumah tangga, ekonomi, atau kesulitan hidup.",
    topic: "Buah manis ketakwaan, rezeki tak terduga (min haitsu laa yahtasib), dan kekuatan tawakkal bulat kepada Allah.",
    wisdom: "Ketakwaan adalah magnet solusi. Bukan koneksi atau kehebatan diri yang memecahkan kebuntuan, melainkan keridhoan Allah Ta'ala.",
    actionPlan: "Tinggalkan segala bentuk maksiat dan syubhat, perbanyak istighfar, serta serahkan hasil akhir seluruh ikhtiar kepada takdir terbaik Allah."
  },

  // 9. QS. Al-Ikhlas
  '112': {
    surahNumber: 112,
    surahName: "QS. Al-Ikhlas (Memurnikan Keesaan Allah)",
    ayahRange: "Ayat 1-4",
    arabicText: "قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ۝",
    latinText: "Qul huwallaahu ahad. Allaahush-shamad. Lam yalid wa lam yuulad. Wa lam yakul lahuu kufuwan ahad.",
    translationText: "1. Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa. 2. Allah tempat meminta segala sesuatu. 3. (Allah) tidak beranak dan tidak pula diperanakkan, 4. dan tidak ada sesuatu yang setara dengan Dia.'",
    story: "Diturunkan sebagai jawaban tegas kepada kaum musyrikin yang meminta Nabi Muhammad SAW untuk menyebutkan nasab dan silsilah Tuhannya.",
    topic: "Tauhid mutlak, keesaan Allah (Ahad), dan sifat Ash-Shamad (tempat bergantung seluruh makhluk).",
    wisdom: "Membaca Al-Ikhlas sebanding dengan sepertiga Al-Qur'an karena memuat inti akidah tauhid yang paling murni.",
    actionPlan: "Rutin membaca Al-Ikhlas 3x setiap pagi dan petang serta menghadirkan rasa bergantung hanya kepada Allah dalam setiap kebutuhan hidup."
  },

  // 10. QS. Ar-Rahman
  '55': {
    surahNumber: 55,
    surahName: "QS. Ar-Rahman",
    ayahRange: "Ayat 1-16",
    arabicText: "الرَّحْمَٰنُ ۝ عَلَّمَ الْقُرْآنَ ۝ خَلَقَ الْإِنْسَانَ ۝ عَلَّمَهُ الْبَيَانَ ۝ ... فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ ۝",
    latinText: "Ar-rahmaan. 'Allamal qur'aan. Khalaqal insaan. 'Allamahul bayaan... Fabi-ayyi aalaa-i rabbikumaa tukadz-dzibaan.",
    translationText: "1. (Allah) Yang Maha Pengasih, 2. yang telah mengajarkan Al-Qur'an. 3. Dia menciptakan manusia, 4. mengajarnya pandai berbicara... 13. Maka nikmat Tuhanmu yang manakah yang kamu dustakan?",
    story: "Disebut sebagai 'Arusul Qur'an (Pengantin Al-Qur'an) yang diulang sebanyak 31 kali dengan kalimat pengingat nikmat yang menggugah jiwa.",
    topic: "Limpahan kasih sayang Allah yang tiada batas, anugerah akal dan Al-Qur'an, serta panggilan bersyukur.",
    wisdom: "Jika seluruh nikmat Allah dihitung, niscaya kita tidak akan sanggup menghitungnya. Mengapa kita sering mengeluhkan satu kekurangan kecil?",
    actionPlan: "Luangkan waktu hening menghitung 10 nikmat gratis dari Allah (nafas, detak jantung, keluarga) dan hindari mengeluh di media sosial."
  }
};

/**
 * Fungsi cerdas untuk menghasilkan template tadabbur otomatis
 * berdasarkan nomor surah yang dipilih pengguna
 */
export function generateSmartTadabbur(surahNumber: number): SmartTadabburTemplate {
  const strKey = String(surahNumber);
  if (SMART_TADABBUR_TEMPLATES[strKey]) {
    return SMART_TADABBUR_TEMPLATES[strKey];
  }

  // Jika surah belum memiliki preset khusus, cari data surah dari 114 katalog
  const meta = ALL_114_SURAHS.find(s => s.number === surahNumber) || ALL_114_SURAHS[0];

  return {
    surahNumber: meta.number,
    surahName: `QS. ${meta.name} (${meta.arabic})`,
    ayahRange: `Ayat 1-${Math.min(5, meta.ayahCount)}`,
    arabicText: `بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ۝ سُورَةُ ${meta.arabic}`,
    latinText: `Bismillaahir rahmaanir rahiim. Surah ${meta.name}`,
    translationText: `Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Surah ${meta.name} (${meta.meaning}) terdiri dari ${meta.ayahCount} ayat, diturunkan di ${meta.revelation}.`,
    story: `Surat ke-${meta.number} dalam mushaf Al-Qur'an, diturunkan di kota ${meta.revelation}. Mengandung pelajaran agung tentang ${meta.meaning} dan ketundukan kepada Allah.`,
    topic: `Tadabbur mendalam ayat-ayat surat ${meta.name} mengenai keimanan, keteladanan akhlak, dan tuntunan syariat dalam kehidupan muslim.`,
    wisdom: `Setiap ayat dalam surat ${meta.name} diturunkan dengan penuh hikmah untuk menyucikan jiwa, meneguhkan keyakinan, dan membimbing langkah hamba-Nya.`,
    actionPlan: `Membaca dan menyimak tafsir surat ${meta.name} secara tartil, serta mengamalkan nilai-nilai ${meta.meaning} dalam interaksi sehari-hari.`
  };
}
