import { AmalanItem, TasbihPreset } from '@/types';

export const DEFAULT_AMALAN_LIST: AmalanItem[] = [
  // --- DINI HARI (02:30 - Subuh) ---
  {
    id: 'tahajjud',
    title: 'Sholat Tahajjud',
    arabicTitle: 'صلاة التهجد',
    category: 'dini_hari',
    timeRange: '02:30 - 04:30 WIB',
    description: 'Minimal 2 rakaat di sepertiga malam terakhir. Luapkan seluruh isi hati dan doa di sujud terakhir.',
    virtue: 'Doa di waktu tahajjud bagaikan anak panah yang tepat sasaran mengenai targetnya.',
    isPriority: true,
    hukum: "Sunnah Mu'akkadah",
    tataCara: [
      { step: 1, title: 'Wudhu & Niat', detail: 'Bangun di sepertiga malam terakhir, berwudhu dengan sempurna, berniat sholat Tahajjud karena Allah SWT.' },
      { step: 2, title: 'Rakaat Pertama & Kedua', detail: 'Dikerjakan minimal 2 rakaat dengan salam tiap 2 rakaat. Disunnahkan membaca surat pendek atau surat yang dihafal dengan tartil.' },
      { step: 3, title: 'Panjangkan Sujud Terakhir', detail: 'Pada sujud terakhir sebelum salam, curahkan seluruh doa, hajat, keluh kesah, dan permohonan ampunan secara tulus.' },
      { step: 4, title: 'Salam & Doa Tahajjud', detail: 'Tutup dengan salam, membaca istighfar, dan melantunkan doa tahajjud yang diajarkan Rasulullah SAW.' }
    ],
    bacaanList: [
      {
        title: 'Doa Sholat Tahajjud (HR. Bukhari)',
        arabic: 'اللَّهُمَّ لَكَ الْحَمْدُ أَنْتَ قَيِّمُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، وَلَكَ الْحَمْدُ لَكَ مُلْكُ السَّمَاوَاتِ وَالْأَرْضِ وَمَنْ فِيهِنَّ، أَنْتَ الْحَقُّ وَوَعْدُكَ الْحَقُّ',
        latin: 'Allahumma lakal hamdu anta qayyimus samawati wal ardhi wa man fiihinna, wa lakal hamdu laka mulkus samawati wal ardhi wa man fiihinna, antal haqqu wa wa\'dukal haqqu.',
        translation: 'Ya Allah, bagi-Mu segala puji, Engkaulah Pemelihara langit dan bumi beserta isinya. Bagi-Mu segala puji, milik-Mu lah kerajaan langit dan bumi beserta isinya. Engkaulah Yang Maha Benar dan janji-Mu adalah benar.'
      }
    ],
    dalil: {
      source: 'QS. Al-Isra: 79 & HR. Muslim no. 1163',
      grade: 'Al-Qur\'an',
      indonesianText: 'Dan pada sebagian malam hari bertahajudlah kamu sebagai suatu ibadah tambahan bagimu; mudah-mudahan Tuhan-mu mengangkat kamu ke tempat yang terpuji. (QS. Al-Isra: 79)',
      notes: 'Rasulullah SAW bersabda: "Sebaik-baik sholat setelah sholat fardhu adalah sholat malam." (HR. Muslim)'
    },
    tipsIstiqomah: 'Mulai bertahap dari 2 rakaat saja secara rutin setiap malam. Pasang alarm 30-45 menit sebelum waktu fajar Subuh.'
  },
  {
    id: 'witir',
    title: 'Sholat Witir',
    arabicTitle: 'صلاة الوتر',
    category: 'dini_hari',
    timeRange: '02:30 - 04:30 WIB',
    description: '1 atau 3 rakaat sebagai penutup seluruh rangkaian sholat malam.',
    virtue: 'Sesungguhnya Allah itu Witir (Ganjil) dan menyukai yang ganjil. (HR. Abu Dawud)',
    isPriority: false,
    hukum: "Sunnah Mu'akkadah",
    tataCara: [
      { step: 1, title: 'Waktu Pelaksanaan', detail: 'Dikerjakan setelah sholat Tahajjud sebagai penutup sholat malam, atau langsung sesudah Isya bagi yang khawatir tidak bangun malam.' },
      { step: 2, title: 'Jumlah Rakaat', detail: 'Minimal 1 rakaat, atau 3 rakaat (bisa 2 rakaat salam disambung 1 rakaat salam, atau 3 rakaat sekaligus).' },
      { step: 3, title: 'Surat yang Dianjurkan', detail: 'Pada 3 rakaat: rakaat 1 membaca Al-A\'la, rakaat 2 membaca Al-Kafirun, dan rakaat 3 membaca Al-Ikhlas, Al-Falaq, dan An-Nas.' },
      { step: 4, title: 'Dzikir Selesai Witir', detail: 'Membaca doa "Subhanal Malikil Quddus" sebanyak 3 kali (pada ketukan ketiga disunnahkan memanjangkan suara).' }
    ],
    bacaanList: [
      {
        title: 'Dzikir Selesai Sholat Witir',
        arabic: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ (٣×)، رَبِّ الْمَلَائِكَةِ وَالرُّوحِ',
        latin: 'Subhanal malikil qudduus (3x), rabbil malaaikati war ruuh.',
        translation: 'Maha Suci Allah Penguasa Yang Maha Suci (3x), Tuhan para malaikat dan ruh (Jibril).'
      }
    ],
    dalil: {
      source: 'HR. Abu Dawud no. 1416 & HR. Bukhari no. 998',
      grade: 'Shahih',
      indonesianText: 'Sesungguhnya Allah itu Witir (Ganjil) dan menyukai yang ganjil, maka shalat witirlah wahai para ahli Al-Qur\'an. (HR. Abu Dawud no. 1416)',
      notes: 'Nabi SAW juga berpesan: "Jadikanlah akhir sholatmu di malam hari adalah sholat witir." (HR. Bukhari no. 998)'
    },
    tipsIstiqomah: 'Jika lelah atau khawatir terlambat bangun, amalkan minimal 1 rakaat witir setelah Ba\'diyah Isya.'
  },
  {
    id: 'istighfar_sahur',
    title: 'Istighfar Waktu Sahur',
    arabicTitle: 'وَبِالْأَسْحَارِ هُمْ يَسْتَغْفِرُونَ',
    category: 'dini_hari',
    timeRange: '03:30 - 04:30 WIB',
    description: 'Duduk beristighfar 100x menjelang fajar Subuh untuk meraih ampunan dan kelapangan rezeki.',
    targetCount: 100,
    targetUnit: 'kali',
    virtue: 'Ciri penghuni surga yang dipuji Allah dalam QS. Adz-Dzariyat: 18.',
    isPriority: true,
    hukum: 'Sunnah Mustahabbah',
    linkedMenu: {
      tab: 'tasbih',
      presetId: 'istighfar_sahur',
      actionLabel: 'Kerjakan di Tasbih (100x)',
    },
    tataCara: [
      { step: 1, title: 'Waktu Utama', detail: 'Dikerjakan sekitar 15–30 menit menjelang adzan fajar Subuh berkumandang.' },
      { step: 2, title: 'Duduk Menghadap Kiblat', detail: 'Ambil posisi duduk tenang dan khusyuk, renungkan kekhilafan dan dosa yang pernah diperbuat.' },
      { step: 3, title: 'Lafadzkan 100 Kali', detail: 'Ucapkan istighfar dengan lisan yang berirama lembut seraya menghadirkan harapan rahmat Allah di hati.' }
    ],
    bacaanList: [
      {
        title: 'Lafadz Istighfar Waktu Sahur',
        arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
        latin: 'Astaghfirullahal \'adzim wa atubu ilaih.',
        translation: 'Aku memohon ampunan kepada Allah Yang Maha Agung dan bertaubat kepada-Nya.'
      }
    ],
    dalil: {
      source: 'QS. Adz-Dzariyat: 18 & QS. Ali \'Imran: 17',
      grade: 'Al-Qur\'an',
      indonesianText: 'Dan pada akhir-akhir malam (waktu sahur) mereka memohon ampunan (kepada Allah). (QS. Adz-Dzariyat: 18)',
      notes: 'Waktu sahur adalah waktu mustajab di mana Allah turun menyeru hamba-hamba-Nya yang memohon ampunan.'
    },
    tipsIstiqomah: 'Gunakan Tasbih Digital di aplikasi untuk menghitung target 100x ketukan secara presisi dan tenang.'
  },
  {
    id: 'hajat_dini_hari',
    title: 'Munajat Hajat Spesifik',
    category: 'dini_hari',
    timeRange: '02:30 - 04:30 WIB',
    description: 'Sebut nama hajat dan impian terbesar Anda secara rinci, yakin bahwa Allah Maha Kuasa.',
    virtue: 'Allah turun ke langit dunia di sepertiga malam terakhir menyeru: Siapa yang meminta kepada-Ku maka Aku kabulkan.',
    isPriority: false,
    hukum: 'Sunnah Mustahabbah',
    linkedMenu: {
      tab: 'hajat',
      subTab: 'hajat',
      actionLabel: 'Buka Papan Hajat & Doa',
    },
    tataCara: [
      { step: 1, title: 'Puji Allah & Sholawat', detail: 'Awali munajat dengan membaca Tahmid (Alhamdulillah) dan Sholawat kepada Rasulullah SAW.' },
      { step: 2, title: 'Sebut Hajat Spesifik', detail: 'Ungkapkan impian, kebutuhan finansial, jodoh, kesehatan, atau kelulusan secara rinci dan jujur.' },
      { step: 3, title: 'Penuh Keyakinan', detail: 'Yakinlah (husnudzan) bahwa tidak ada yang mustahil bagi Allah, serahkan hasilnya dengan tawakkal.' }
    ],
    bacaanList: [
      {
        title: 'Doa Pembuka Hajat',
        arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ',
        latin: 'Ya Hayyu Ya Qayyum, birahmatika astaghits, ashlih lii sya\'nii kullahu wa laa takilnii ilaa nafsii tharfata \'ain.',
        translation: 'Wahai Yang Maha Hidup, wahai Yang Maha Mandiri, dengan rahmat-Mu aku memohon pertolongan. Perbaikilah seluruh urusanku dan jangan Engkau serahkan aku kepada diriku sendiri walau sekejap mata.'
      }
    ],
    dalil: {
      source: 'HR. Bukhari no. 1145 & Muslim no. 758',
      grade: 'Shahih',
      indonesianText: 'Rabb kita turun ke langit dunia pada sepertiga malam terakhir seraya berfirman: "Siapa yang berdoa kepada-Ku niscaya Aku kabulkan, siapa yang meminta kepada-Ku niscaya Aku beri, dan siapa yang memohon ampun niscaya Aku ampuni." (HR. Bukhari & Muslim)'
    },
    tipsIstiqomah: 'Buka menu Papan Hajat untuk membaca dan mengaminkan daftar doa target 40 hari Anda secara konsisten.'
  },

  // --- SUBUH ---
  {
    id: 'qobliyah_subuh',
    title: 'Sholat Qobliyah Subuh (Fajar)',
    arabicTitle: 'سنة الفجر',
    category: 'subuh',
    timeRange: '04:30 - 05:00 WIB',
    description: '2 rakaat sebelum sholat fardhu Subuh. Ibadah sunnah yang nilainya melampaui dunia dan seisinya.',
    virtue: 'Dua rakaat fajar lebih baik daripada dunia seisinya. (HR. Muslim)',
    isPriority: true,
    hukum: "Sunnah Mu'akkadah",
    tataCara: [
      { step: 1, title: 'Waktu', detail: 'Dikerjakan tepat setelah adzan Subuh berkumandang sebelum iqomah sholat fardhu Subuh ditegakkan.' },
      { step: 2, title: 'Niat & Rakaat', detail: 'Dikerjakan 2 rakaat secara ringan (tidak berlama-lama).' },
      { step: 3, title: 'Surat yang Dibaca', detail: 'Disunnahkan membaca Surat Al-Kafirun pada rakaat pertama dan Surat Al-Ikhlas pada rakaat kedua.' },
      { step: 4, title: 'Setelah Salam', detail: 'Duduk sejenak berdzikir atau berbaring miring ke kanan sejenak (jika sholat di rumah).' }
    ],
    bacaanList: [
      {
        title: 'Niat Sholat Qobliyah Subuh',
        arabic: 'أُصَلِّي سُنَّةَ الصُّبْحِ رَكْعَتَيْنِ قَبْلِيَّةً لِلَّهِ تَعَالَى',
        latin: 'Usholli sunnatash shubhi rok\'ataini qobliyyatan lillaahi Ta\'aala.',
        translation: 'Aku niat sholat sunnah sebelum Subuh dua rakaat karena Allah Ta\'ala.'
      }
    ],
    dalil: {
      source: 'HR. Muslim no. 725 & Bukhari no. 1159',
      grade: 'Shahih',
      indonesianText: 'Dua rakaat fajar (sebelum Subuh) itu lebih baik daripada dunia seisinya. (HR. Muslim no. 725)',
      notes: 'Nabi SAW tidak pernah meninggalkan 2 rakaat fajar ini baik saat berada di rumah maupun saat bepergian (safar).'
    },
    tipsIstiqomah: 'Jadikan sholat ini prioritas pertama begitu adzan berkumandang, jangan tunda sampai iqomah mendekat.'
  },
  {
    id: 'sholat_subuh',
    title: 'Sholat Subuh Tepat Waktu',
    arabicTitle: 'صلاة الصبح',
    category: 'subuh',
    timeRange: '04:30 - 05:30 WIB',
    description: 'Sholat di awal waktu, diutamakan berjamaah di masjid bagi laki-laki.',
    virtue: 'Barangsiapa sholat Subuh berjamaah, maka ia berada dalam jaminan perlindungan Allah. (HR. Muslim)',
    isPriority: true,
    hukum: "Fardhu 'Ain (Wajib)",
    tataCara: [
      { step: 1, title: 'Sholat 2 Rakaat', detail: 'Dirikan 2 rakaat sholat fardhu Subuh dengan bacaan bersuara merdu (jahr).' },
      { step: 2, title: 'Khusyuk', detail: 'Hadirkan hati bahwa sholat ini disaksikan langsung oleh para malaikat malam dan malaikat siang.' },
      { step: 3, title: 'Dzikir Ba\'da Sholat', detail: 'Jangan terburu-buru beranjak; bacalah istighfar 3x, tasbih, tahmid, takbir 33x, dan Ayat Kursi.' }
    ],
    bacaanList: [
      {
        title: 'Dzikir Selesai Sholat Fardhu',
        arabic: 'أَسْتَغْفِرُ اللَّهَ (٣×)، اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ',
        latin: 'Astaghfirullah (3x), Allahumma antas salam wa minkas salam tabarakta ya dzal jalali wal ikram.',
        translation: 'Aku memohon ampun kepada Allah (3x). Ya Allah, Engkaulah Sumber Kesejahteraan dan dari-Mu lah kesejahteraan, Maha Berkah Engkau wahai Rabb Pemilik Keagungan dan Kemuliaan.'
      }
    ],
    dalil: {
      source: 'HR. Muslim no. 657 & HR. Bukhari no. 574',
      grade: 'Shahih',
      indonesianText: 'Barangsiapa sholat Subuh berjamaah, maka ia berada dalam jaminan perlindungan Allah. (HR. Muslim no. 657)',
      notes: 'Nabi SAW juga bersabda: "Barangsiapa sholat di dua waktu dingin (Subuh dan Ashar), ia pasti masuk surga." (HR. Bukhari)'
    },
    tipsIstiqomah: 'Tidur lebih awal di malam hari dan letakkan alarm di tempat yang mengharuskan Anda berdiri untuk mematikannya.'
  },
  {
    id: 'sedekah_subuh',
    title: 'Sedekah Subuh',
    category: 'subuh',
    timeRange: '04:30 - 06:30 WIB',
    description: 'Sisihkan sedekah di awal pagi (lewat celengan khusus atau transfer) sambil selipkan doa hajat.',
    virtue: 'Dua malaikat berdoa setiap pagi: Ya Allah gantilah yang berinfak, dan binasakanlah yang kikir. (HR. Bukhari & Muslim)',
    isPriority: true,
    hukum: 'Sunnah / Fadhilah Amal',
    linkedMenu: {
      tab: 'hajat',
      subTab: 'sedekah',
      actionLabel: 'Catat Sedekah Subuh',
    },
    tataCara: [
      { step: 1, title: 'Siapkan Media Sedekah', detail: 'Gunakan celengan kaleng khusus di rumah, atau buka mobile banking / QRIS lembaga infaq resmi.' },
      { step: 2, title: 'Keluarkan di Pagi Hari', detail: 'Sisihkan nominal berapapun secara konsisten setiap pagi ba\'da Subuh (misal Rp 2.000, Rp 5.000, atau Rp 10.000).' },
      { step: 3, title: 'Iringi dengan Doa', detail: 'Saat memasukkan uang, mintalah kepada Allah agar sedekah tersebut menjadi penolak bala dan pembuka hajat.' }
    ],
    bacaanList: [
      {
        title: 'Doa Saat Berinfak / Bersedekah',
        arabic: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ',
        latin: 'Rabbana taqabbal minna innaka antas samii\'ul \'aliim.',
        translation: 'Ya Tuhan kami, terimalah amal dari kami, sungguh Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.'
      }
    ],
    dalil: {
      source: 'HR. Bukhari no. 1442 & Muslim no. 1010',
      grade: 'Shahih',
      indonesianText: 'Tidaklah ada suatu hari pun di mana hamba-hamba Allah berada di waktu pagi melainkan ada dua malaikat yang turun. Salah satunya berdoa: "Ya Allah berikanlah ganti bagi orang yang berinfak." Dan yang lain berdoa: "Ya Allah berikanlah kehancuran bagi yang kikir." (HR. Bukhari & Muslim)'
    },
    tipsIstiqomah: 'Kuncinya bukan pada besarnya nominal, melainkan pada konsistensi setiap pagi tanpa putus.'
  },
  {
    id: 'dzikir_pagi',
    title: 'Dzikir Pagi (Al-Ma\'tsurat)',
    arabicTitle: 'أذكار الصباح',
    category: 'subuh',
    timeRange: '05:00 - 06:30 WIB',
    description: 'Membaca wirid dan doa perlindungan pagi hari untuk benteng diri dan keberkahan hari.',
    virtue: 'Menjadi pelindung dari godaan syaithan dan pembuka pintu ketenangan jiwa.',
    isPriority: false,
    hukum: 'Sunnah Mustahabbah',
    linkedMenu: {
      tab: 'tasbih',
      presetId: 'dzikir_pagi',
      actionLabel: 'Buka Dzikir Pagi di Tasbih',
    },
    tataCara: [
      { step: 1, title: 'Waktu Terbaik', detail: 'Dibaca antara selesai sholat Subuh hingga matahari terbit (isyraq), atau sebelum masuk Dhuha.' },
      { step: 2, title: 'Ayat Perlindungan', detail: 'Membaca Ayat Kursi 1x, Surat Al-Ikhlas, Al-Falaq, dan An-Nas masing-masing 3x.' },
      { step: 3, title: 'Doa Berkah Pagi', detail: 'Membaca doa perlindungan dan rasa syukur atas nikmat kesehatan serta keimanan.' }
    ],
    bacaanList: [
      {
        title: 'Doa Memasuki Waktu Pagi',
        arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ',
        latin: 'Ashbahnaa wa ashbahal mulku lillahi, walhamdulillahi laa ilaaha illallahu wahdahu laa syariika lah.',
        translation: 'Kami telah memasuki waktu pagi dan kerajaan hanya milik Allah. Segala puji bagi Allah, tiada sesembahan yang berhak disembah selain Allah Yang Maha Esa, tiada sekutu bagi-Nya.'
      }
    ],
    dalil: {
      source: 'QS. Ghafir: 55 & HR. Abu Dawud no. 5068',
      grade: 'Al-Qur\'an & Hasan',
      indonesianText: 'Maka bersabarlah kamu, karena sesungguhnya janji Allah itu benar, dan mohonlah ampunan untuk dosamu dan bertasbihlah seraya memuji Tuhanmu pada waktu petang dan pagi. (QS. Ghafir: 55)'
    },
    tipsIstiqomah: 'Buka fitur Tasbih Digital di aplikasi untuk membaca dzikir pagi berulang secara teratur.'
  },

  // --- DHUHA & SIANG ---
  {
    id: 'sholat_dhuha',
    title: 'Sholat Dhuha',
    arabicTitle: 'صلاة الضحى',
    category: 'dhuha',
    timeRange: '07:00 - 11:00 WIB',
    description: 'Sholat 2 hingga 8 rakaat di pagi hari saat matahari mulai meninggi.',
    targetCount: 4,
    targetUnit: 'rakaat',
    virtue: 'Sebagai sedekah bagi 360 persendian tubuh dan pembuka kran rezeki. (HR. Muslim)',
    isPriority: true,
    hukum: "Sunnah Mu'akkadah",
    tataCara: [
      { step: 1, title: 'Waktu Pelaksanaan', detail: 'Dimulai sekitar 20 menit setelah matahari terbit (waktu syuruq) hingga menjelang waktu zawal (sebelum Dzuhur).' },
      { step: 2, title: 'Jumlah Rakaat', detail: 'Minimal 2 rakaat (salam tiap 2 rakaat), diutamakan 4 rakaat atau lebih.' },
      { step: 3, title: 'Surat Pendek', detail: 'Dianjurkan membaca Surat Asy-Syams dan Ad-Dhuha, atau surat apa saja yang dihafal.' },
      { step: 4, title: 'Doa Dhuha', detail: 'Selesai sholat, berdoalah memohon kelapangan rezeki halal dan kemudahan urusan dunia-akhirat.' }
    ],
    bacaanList: [
      {
        title: 'Doa Sholat Dhuha',
        arabic: 'اللَّهُمَّ إِنَّ الضُّحَاءَ ضُحَاؤُكَ وَالْبَهَاءَ بَهَاؤُكَ وَالْجَمَالَ جَمَالُكَ، اللَّهُمَّ إِنْ كَانَ رِزْقِي فِي السَّمَاءِ فَأَنْزِلْهُ وَإِنْ كَانَ فِي الْأَرْضِ فَأَخْرِجْهُ',
        latin: 'Allahumma innadh dhuhaa-a dhuhaa-uka, wal bahaa-a bahaa-uka, wal jamaala jamaaluka. Allahumma in kaana rizqii fis samaa-i fa-anzilhu, wa in kaana fil ardhi fa-akhrijhu.',
        translation: 'Ya Allah, sesungguhnya waktu Dhuha adalah waktu Dhuha-Mu, keagungan adalah keagungan-Mu, dan keindahan adalah keindahan-Mu. Ya Allah, jika rezekiku di atas langit maka turunkanlah, jika di dalam bumi maka keluarkanlah.'
      }
    ],
    dalil: {
      source: 'HR. Muslim no. 720',
      grade: 'Shahih',
      indonesianText: 'Setiap pagi setiap persendian di antara kalian wajib bersedekah... dan semua itu cukup digantikan dengan dua rakaat yang dikerjakan pada waktu Dhuha. (HR. Muslim no. 720)'
    },
    tipsIstiqomah: 'Luangkan 10 menit saat jeda kerja pagi hari untuk mengambil wudhu dan mendirikan sholat Dhuha.'
  },
  {
    id: 'sholat_dzuhur',
    title: 'Sholat Dzuhur & Rawatib',
    arabicTitle: 'صلاة الظهر',
    category: 'dhuha',
    timeRange: '11:45 - 13:00 WIB',
    description: 'Sholat Dzuhur tepat waktu disertai 4 rakaat Qobliyah dan 2 rakaat Ba\'diyah.',
    virtue: 'Dibukanya pintu langit saat matahari tergelincir.',
    isPriority: false,
    hukum: "Fardhu 'Ain & Sunnah Rawatib",
    tataCara: [
      { step: 1, title: 'Qobliyah Dzuhur', detail: 'Kerjakan 2 atau 4 rakaat sholat sunnah sebelum fardhu Dzuhur.' },
      { step: 2, title: 'Fardhu Dzuhur', detail: 'Dirikan 4 rakaat sholat fardhu Dzuhur tepat di awal waktu.' },
      { step: 3, title: 'Ba\'diyah Dzuhur', detail: 'Tutup dengan 2 rakaat sholat sunnah setelah sholat fardhu.' }
    ],
    bacaanList: [
      {
        title: 'Doa Perlindungan Ba\'da Rawatib',
        arabic: 'اللَّهُمَّ أَجِرْنَا مِنَ النَّارِ',
        latin: 'Allahumma ajirna minan naar.',
        translation: 'Ya Allah, lindungilah kami dari siksa api neraka.'
      }
    ],
    dalil: {
      source: 'HR. Tirmidzi no. 428 & An-Nasa\'i no. 1814',
      grade: 'Shahih',
      indonesianText: 'Barangsiapa menjaga empat rakaat sebelum Dzuhur dan empat rakaat sesudahnya, maka Allah mengharamkan dirinya dari api neraka. (HR. Tirmidzi no. 428)'
    },
    tipsIstiqomah: 'Segera bersiap ketika adzan Dzuhur berkumandang; tinggalkan sejenak urusan kantor / bisnis.'
  },
  {
    id: 'ikhtiar_bumi',
    title: 'Ikhtiar Bumi Profesional',
    category: 'dhuha',
    timeRange: '08:00 - 16:00 WIB',
    description: 'Bekerja, belajar, atau berbisnis dengan etos tinggi, jujur, dan meniatkan lelah untuk ibadah.',
    virtue: 'Menyeimbangkan ikhtiar langit dengan aksi nyata yang maksimal di bumi.',
    isPriority: false,
    hukum: 'Ibadah Muamalah',
    tataCara: [
      { step: 1, title: 'Luruskan Niat', detail: 'Niatkan mencari nafkah yang halal sebagai bentuk tanggung jawab dan ibadah mencari ridha Allah.' },
      { step: 2, title: 'Etos Kerja Unggul (Ihsan)', detail: 'Bekerja secara profesional, jujur, amanah, dan berikan karya terbaik tanpa menipu atau curang.' },
      { step: 3, title: 'Tawakkal Penuh', detail: 'Hasil di luar kendali kita adalah wewenang Allah; nikmati proses dan syukuri setiap langkah.' }
    ],
    bacaanList: [
      {
        title: 'Doa Keluar Rumah Menjemput Rezeki',
        arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        latin: 'Bismillahi tawakkaltu \'alallahi laa hawla wa laa quwwata illaa billaah.',
        translation: 'Dengan menyebut nama Allah, aku bertawakkal kepada Allah. Tiada daya dan kekuatan kecuali dengan pertolongan Allah.'
      }
    ],
    dalil: {
      source: 'QS. Al-Mulk: 15 & HR. Bukhari no. 2072',
      grade: 'Al-Qur\'an & Shahih',
      indonesianText: 'Tidak ada seorang pun yang memakan makanan yang lebih baik daripada hasil jerih payah tangannya sendiri. (HR. Bukhari no. 2072)'
    },
    tipsIstiqomah: 'Ikhtiar langit membuka pintu berkah, ikhtiar bumi adalah wadah penampung berkah tersebut.'
  },

  // --- SORE & PETANG ---
  {
    id: 'sholat_ashar',
    title: 'Sholat Ashar Tepat Waktu',
    arabicTitle: 'صلاة العصر',
    category: 'petang',
    timeRange: '15:15 - 16:30 WIB',
    description: 'Menjaga sholat wustha (pertengahan) tanpa ditunda menjelang sore.',
    virtue: 'Barangsiapa meninggalkan sholat Ashar, maka terhapuslah amalnya. (HR. Bukhari)',
    isPriority: true,
    hukum: "Fardhu 'Ain (Wajib)",
    tataCara: [
      { step: 1, title: 'Sholat di Awal Waktu', detail: 'Dikerjakan 4 rakaat saat bayangan benda mulai sama panjang dengan bendanya.' },
      { step: 2, title: 'Jangan Ditunda', detail: 'Hindari menunda sholat hingga matahari mulai menguning temaram mendekati Maghrib.' },
      { step: 3, title: 'Dzikir Khusyuk', detail: 'Selesaikan sholat dengan istighfar dan tasbih penenang jiwa.' }
    ],
    bacaanList: [
      {
        title: 'Dzikir Sholat Ashar',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Tiada Tuhan selain Allah semata, tidak ada sekutu bagi-Nya. Milik-Nya lah segala kerajaan dan segala puji, dan Dia Maha Kuasa atas segala sesuatu.'
      }
    ],
    dalil: {
      source: 'QS. Al-Baqarah: 238 & HR. Bukhari no. 553',
      grade: 'Al-Qur\'an & Shahih',
      indonesianText: 'Peliharalah semua sholat dan sholat wustha (Ashar). Berdirilah untuk Allah (dalam sholatmu) dengan khusyuk. (QS. Al-Baqarah: 238)',
      notes: 'Rasulullah SAW memperingatkan: "Barangsiapa meninggalkan sholat Ashar, maka terhapuslah amalnya." (HR. Bukhari no. 553)'
    },
    tipsIstiqomah: 'Pasang alarm pengingat 10 menit sebelum adzan Ashar agar tidak terlewat saat kesibukan sore.'
  },
  {
    id: 'dzikir_petang',
    title: 'Dzikir Petang',
    arabicTitle: 'أذكار المساء',
    category: 'petang',
    timeRange: '16:00 - 18:00 WIB',
    description: 'Membaca doa perlindungan menjelang matahari terbenam.',
    virtue: 'Menjaga diri dari marabahaya malam hingga terbit fajar kembali.',
    isPriority: false,
    hukum: 'Sunnah Mustahabbah',
    linkedMenu: {
      tab: 'tasbih',
      presetId: 'dzikir_petang',
      actionLabel: 'Buka Dzikir Petang di Tasbih',
    },
    tataCara: [
      { step: 1, title: 'Waktu Pelaksanaan', detail: 'Dibaca antara selesai sholat Ashar hingga menjelang adzan Maghrib berkumandang.' },
      { step: 2, title: 'Doa Perlindungan', detail: 'Membaca kalimat ta\'awudz memohon perlindungan dari mara bahaya, sihir, dan godaan malam.' },
      { step: 3, title: 'Dzikir Tasbih', detail: 'Membaca tasbih dan istighfar untuk membersihkan hati setelah seharian beraktivitas.' }
    ],
    bacaanList: [
      {
        title: 'Doa Benteng Perlindungan Petang',
        arabic: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ (٣×)',
        latin: 'Bismillahilladzi laa yadhurru ma\'asmihi syai-un fil ardhi wa laa fis samaa-i wa huwas samii\'ul \'aliim (3x).',
        translation: 'Dengan nama Allah yang bersama nama-Nya tidak ada sesuatu pun di bumi maupun di langit yang dapat membahayakan, dan Dia Maha Mendengar lagi Maha Mengetahui (3x).'
      }
    ],
    dalil: {
      source: 'QS. Ar-Rum: 17 & HR. Abu Dawud no. 5088',
      grade: 'Al-Qur\'an & Shahih',
      indonesianText: 'Barangsiapa membacanya 3 kali di waktu pagi dan 3 kali di waktu petang, maka tidak ada sesuatu pun yang dapat membahayakannya. (HR. Abu Dawud & Tirmidzi - Shahih)'
    },
    tipsIstiqomah: 'Buka modul Tasbih Digital untuk membaca dzikir petang dengan irama yang tenang dan tertuntun.'
  },
  {
    id: 'surah_waqiah',
    title: 'Membaca QS. Al-Waqi\'ah',
    arabicTitle: 'سورة الواقعة',
    category: 'petang',
    timeRange: '16:00 - 18:00 WIB',
    description: 'Membaca dan merenungi ayat-ayat pembuka kelapangan rezeki dan akhirat.',
    virtue: 'Diajarkan oleh para ulama sebagai wasilah menjauhkan diri dari kefakiran dan kemiskinan.',
    isPriority: true,
    hukum: 'Fadhail Al-Qur\'an',
    linkedMenu: {
      tab: 'quran',
      subTab: 'tadabbur',
      actionLabel: 'Buka QS. Al-Waqi\'ah di Quran',
    },
    tataCara: [
      { step: 1, title: 'Wudhu & Tenang', detail: 'Duduk menghadap kiblat dengan memegang mushaf atau membuka aplikasi Al-Qur\'an.' },
      { step: 2, title: 'Tartil', detail: 'Membaca 96 ayat surat Al-Waqi\'ah dengan pelan dan menyimak maknanya.' },
      { step: 3, title: 'Tadabbur Rezeki', detail: 'Resapi bahwa Allah adalah Yang Maha Menjamin rezeki dan pemilik kekayaan sejati.' }
    ],
    bacaanList: [
      {
        title: 'Ayat Kunci QS. Al-Waqi\'ah (Ayat 88-89)',
        arabic: 'فَأَمَّا إِنْ كَانَ مِنَ الْمُقَرَّبِينَ ۝ فَرَوْحٌ وَرَيْحَانٌ وَجَنَّتُ نَعِيمٍ',
        latin: 'Fa ammaa in kaana minal muqarrabiin, fa rawhun wa rayhaanun wa jannatu na\'iim.',
        translation: 'Adapun jika dia termasuk golongan orang yang didekatkan (kepada Allah), maka dia memperoleh ketenteraman, rezeki serta surga kenikmatan.'
      }
    ],
    dalil: {
      source: 'Riwayat Ibnu Mas\'ud RA & Atsar Ulama',
      grade: 'Hasan / Fadhail Amal',
      indonesianText: 'Para ulama salaf menganjurkan membaca surat Al-Waqi\'ah secara rutin setiap malam/petang sebagai wasilah menjaga keimanan dan dijauhkan dari kefakiran.'
    },
    tipsIstiqomah: 'Buka tab Al-Qur\'an di aplikasi untuk membaca teks arab yang jelas disertai murottal audio.'
  },

  // --- MALAM & SEBELUM TIDUR ---
  {
    id: 'sholat_maghrib',
    title: 'Sholat Maghrib & Ba\'diyah',
    arabicTitle: 'صلاة المغرب',
    category: 'malam',
    timeRange: '18:00 - 19:00 WIB',
    description: 'Sholat Maghrib di awal waktu + 2 rakaat sholat sunnah Ba\'diyah.',
    virtue: 'Termasuk sholat rawatib mu\'akkadah penjaga keimanan.',
    isPriority: false,
    hukum: "Fardhu 'Ain & Sunnah Rawatib",
    tataCara: [
      { step: 1, title: 'Segera Sholat', detail: 'Waktu Maghrib sangat singkat; segera berwudhu dan dirikan 3 rakaat sholat fardhu Maghrib.' },
      { step: 2, title: 'Dzikir Ba\'da Sholat', detail: 'Membaca tahlil 10x dan doa memohon perlindungan dari api neraka.' },
      { step: 3, title: 'Ba\'diyah Maghrib', detail: 'Tegakkan 2 rakaat sholat sunnah Ba\'diyah Maghrib.' }
    ],
    bacaanList: [
      {
        title: 'Dzikir Khusus Ba\'da Maghrib (10x)',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ (١٠×)',
        latin: 'Laa ilaaha illallahu wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa \'alaa kulli syai-in qadiir (10x).',
        translation: 'Tiada Tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya lah segala kerajaan dan segala puji, Dia Yang menghidupkan dan mematikan, dan Dia Maha Kuasa atas segala sesuatu.'
      }
    ],
    dalil: {
      source: 'HR. Tirmidzi no. 414 & Muslim no. 728',
      grade: 'Shahih',
      indonesianText: 'Dua rakaat setelah Maghrib merupakan bagian dari sholat sunnah rawatib yang dijanjikan rumah di surga bagi yang rutin menjaganya. (HR. Tirmidzi no. 414)'
    },
    tipsIstiqomah: 'Jadikan waktu Maghrib sebagai momen berkumpul di rumah bersama keluarga untuk sholat berjamaah.'
  },
  {
    id: 'sholat_isya',
    title: 'Sholat Isya & Ba\'diyah',
    arabicTitle: 'صلاة العشاء',
    category: 'malam',
    timeRange: '19:15 - 20:30 WIB',
    description: 'Sholat Isya tepat waktu + 2 rakaat Ba\'diyah Isya.',
    virtue: 'Pahala sholat Isya berjamaah bagaikan sholat separuh malam.',
    isPriority: true,
    hukum: "Fardhu 'Ain & Sunnah Rawatib",
    tataCara: [
      { step: 1, title: 'Fardhu Isya', detail: 'Dirikan 4 rakaat sholat fardhu Isya di awal waktu.' },
      { step: 2, title: 'Ba\'diyah Isya', detail: 'Kerjakan 2 rakaat sholat sunnah Ba\'diyah Isya setelah salam.' },
      { step: 3, title: 'Persiapan Witir', detail: 'Boleh langsung ditutup witir 1 atau 3 rakaat jika khawatir tidak bangun sholat malam.' }
    ],
    bacaanList: [
      {
        title: 'Niat Sholat Ba\'diyah Isya',
        arabic: 'أُصَلِّي سُنَّةَ الْعِشَاءِ رَكْعَتَيْنِ بَعْدِيَّةً لِلَّهِ تَعَالَى',
        latin: 'Usholli sunnatal \'isyaa-i rok\'ataini ba\'diyyatan lillaahi Ta\'aala.',
        translation: 'Aku niat sholat sunnah setelah Isya dua rakaat karena Allah Ta\'ala.'
      }
    ],
    dalil: {
      source: 'HR. Muslim no. 656',
      grade: 'Shahih',
      indonesianText: 'Barangsiapa sholat Isya berjamaah, maka seakan-akan ia telah sholat separuh malam. (HR. Muslim no. 656)'
    },
    tipsIstiqomah: 'Setelah sholat Isya, selesaikan urusan rumah dan kurangi screen time HP agar lekas tidur.'
  },
  {
    id: 'surah_mulk',
    title: 'Membaca QS. Al-Mulk (Tabarak)',
    arabicTitle: 'سورة الملك',
    category: 'malam',
    timeRange: '20:00 - 22:30 WIB',
    description: 'Membaca 30 ayat surat Al-Mulk setiap malam sebelum terlelap.',
    virtue: 'Surat pelindung dan pembela pembacanya dari siksa kubur. (HR. Tirmidzi)',
    isPriority: true,
    hukum: 'Sunnah Mustahabbah',
    linkedMenu: {
      tab: 'quran',
      subTab: 'tadabbur',
      actionLabel: 'Buka QS. Al-Mulk di Quran',
    },
    tataCara: [
      { step: 1, title: 'Waktu', detail: 'Dibaca setiap malam sebelum merebahkan diri untuk tidur.' },
      { step: 2, title: 'Membaca 30 Ayat', detail: 'Baca dengan tartil surat Al-Mulk dari ayat 1 hingga ayat 30.' },
      { step: 3, title: 'Tadabbur Kematian', detail: 'Ingatlah bahwa tidur adalah kematian kecil, dan surat ini akan menjadi pembela di alam kubur.' }
    ],
    bacaanList: [
      {
        title: 'Ayat Pembuka QS. Al-Mulk',
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Tabaarakalladzii biyadihil mulku wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Maha Suci Allah yang di tangan-Nya lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu.'
      }
    ],
    dalil: {
      source: 'HR. Abu Dawud no. 1400 & Tirmidzi no. 2891',
      grade: 'Hasan Shahih',
      indonesianText: 'Ada satu surat dalam Al-Qur\'an berisi tiga puluh ayat yang dapat memberi syafaat kepada pembacanya hingga diampuni dosanya, yaitu Tabarakalladzi biyadihil mulk (Surat Al-Mulk). (HR. Abu Dawud & Tirmidzi)'
    },
    tipsIstiqomah: 'Letakkan mushaf di samping bantal atau buka tab Quran di aplikasi sebelum mematikan lampu kamar.'
  },
  {
    id: 'sholawat_jibril',
    title: 'Sholawat Jibril',
    arabicTitle: 'صَلَّى اللهُ عَلَى مُحَمَّدٍ، صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
    category: 'malam',
    timeRange: 'Sepanjang Hari / Malam',
    description: "Bersholawat kepada Baginda Rasulullah SAW: Shallallahu 'ala Muhammad, shallallahu 'alaihi wasallam minimal 100x hingga 1.000x.",
    targetCount: 1000,
    targetUnit: 'kali',
    virtue: 'Barangsiapa bersholawat kepadaku 1x, Allah akan bersholawat kepadanya 10x dan menghapus 10 dosanya.',
    isPriority: true,
    hukum: 'Sunnah / Perintah Al-Qur\'an',
    linkedMenu: {
      tab: 'tasbih',
      presetId: 'sholawat_jibril',
      actionLabel: 'Kerjakan di Tasbih (1.000x)',
    },
    tataCara: [
      { step: 1, title: 'Lafadz yang Ringkas & Padat', detail: 'Membaca Sholawat Jibril versi panjang yang shahih: "Shallallahu \'ala Muhammad, shallallahu \'alaihi wasallam".' },
      { step: 2, title: 'Hadirkan Cinta Kepada Nabi', detail: 'Ucapkan dengan lisan yang basah dan hati yang penuh kerinduan kepada Rasulullah SAW.' },
      { step: 3, title: 'Gunakan Tasbih', detail: 'Buka Tasbih Digital dengan mode Sholawat Jibril untuk memantau capaian target 100x hingga 1.000x.' }
    ],
    bacaanList: [
      {
        title: 'Lafadz Sholawat Jibril',
        arabic: 'صَلَّى اللهُ عَلَى مُحَمَّدٍ، صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
        latin: 'Shallallahu \'ala Muhammad, shallallahu \'alaihi wasallam.',
        translation: 'Semoga Allah melimpahkan sholawat kepada Nabi Muhammad, semoga Allah melimpahkan sholawat dan salam kepadanya.'
      }
    ],
    dalil: {
      source: 'QS. Al-Ahzab: 56 & HR. Muslim no. 408',
      grade: 'Al-Qur\'an & Shahih',
      indonesianText: 'Barangsiapa bersholawat kepadaku satu kali, niscaya Allah bersholawat kepadanya sepuluh kali, menghapus sepuluh dosanya, dan mengangkatnya sepuluh derajat. (HR. An-Nasa\'i no. 1297)'
    },
    tipsIstiqomah: 'Bagi waktu: 300x ba\'da Subuh, 300x ba\'da Ashar, dan 400x di waktu malam untuk menggenapkan 1.000x.'
  },
  {
    id: 'sayyidul_istighfar',
    title: 'Sayyidul Istighfar & Dzikir Tidur',
    arabicTitle: 'سَيِّدُ الْاسْتِغْفَار',
    category: 'malam',
    timeRange: '21:00 - 23:00 WIB',
    description: 'Membaca rajanya istighfar, Ayat Kursi, dan 3 Qul (Al-Ikhlas, Al-Falaq, An-Nas) sebelum tidur.',
    virtue: 'Jaminan surga jika meninggal dunia di malam hari tersebut. (HR. Bukhari)',
    isPriority: false,
    hukum: "Sunnah Mu'akkadah",
    linkedMenu: {
      tab: 'tasbih',
      presetId: 'sayyidul_istighfar',
      actionLabel: 'Lantunkan di Tasbih',
    },
    tataCara: [
      { step: 1, title: 'Wudhu Sebelum Tidur', detail: 'Berwudhu seperti wudhu hendak sholat dan bersihkan tempat tidur dengan mengibaskannya 3x.' },
      { step: 2, title: 'Baca Sayyidul Istighfar', detail: 'Lafadzkan rajanya istighfar ini dengan meresapi pengakuan nikmat dan ampunan dosa.' },
      { step: 3, title: 'Tidur Miring ke Kanan', detail: 'Rebahkan tubuh miring ke sisi kanan menghadap kiblat dengan tangan kanan di bawah pipi.' }
    ],
    bacaanList: [
      {
        title: 'Lafadz Sayyidul Istighfar',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي، فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        latin: 'Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa anaa \'abduka, wa anaa \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'uudzu bika min syarri maa shana\'tu, abuu-u laka bini\'matika \'alayya, wa abuu-u laka bidzanbii faghfir lii, fa-innahu laa yaghfirudz dzunuuba illaa anta.',
        translation: 'Ya Allah, Engkaulah Tuhanku, tiada Tuhan selain Engkau. Engkaulah yang menciptakan aku dan aku adalah hamba-Mu. Aku berada dalam perjanjian dan janji-Mu semampuku. Aku berlindung kepada-Mu dari keburukan yang telah kuperbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku, karena tiada yang dapat mengampuni dosa-dosa selain Engkau.'
      }
    ],
    dalil: {
      source: 'HR. Bukhari no. 6306',
      grade: 'Shahih',
      indonesianText: 'Barangsiapa membacanya di petang hari dengan keyakinan lalu ia meninggal di malam itu, maka ia termasuk penghuni surga; dan jika membacanya di pagi hari lalu meninggal di hari itu, maka ia termasuk penghuni surga. (HR. Bukhari no. 6306)'
    },
    tipsIstiqomah: 'Jadikan bacaan ini doa pamungkas setiap malam sebelum memejamkan mata.'
  },
  {
    id: 'muhasabah_gratitude',
    title: 'Muhasabah & Gratitude Journal',
    category: 'malam',
    timeRange: '21:00 - 23:00 WIB',
    description: 'Mencatat 3 nikmat yang disyukuri hari ini dan memaafkan kesalahan semua orang sebelum tidur.',
    virtue: 'Hati yang damai, lapang dada, dan mengundang tambahan nikmat dari Allah (QS. Ibrahim: 7).',
    isPriority: false,
    hukum: 'Adab Islami & Sunnah',
    linkedMenu: {
      tab: 'quran',
      subTab: 'syukur',
      actionLabel: 'Tulis Gratitude Journal',
    },
    tataCara: [
      { step: 1, title: 'Renungan Hari Ini', detail: 'Tinjau kembali amal seharian: apa yang sudah baik disyukuri, apa yang khilaf dimohonkan ampun.' },
      { step: 2, title: 'Tulis 3 Nikmat', detail: 'Catat 3 nikmat spesifik di menu Syukur: nafas sehat, rezeki yang cukup, dan pertolongan tak terduga.' },
      { step: 3, title: 'Maafkan Semua Orang', detail: 'Ikhlaskan dan maafkan setiap orang yang pernah menyakiti hati Anda agar tidur dalam ketenangan jiwa.' }
    ],
    bacaanList: [
      {
        title: 'Doa Sebelum Tidur',
        arabic: 'بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوتُ',
        latin: 'Bismikallahumma ahyaa wa amuutu.',
        translation: 'Dengan nama-Mu ya Allah, aku hidup dan aku mati.'
      }
    ],
    dalil: {
      source: 'QS. Ibrahim: 7 & Atsar Umar bin Khattab RA',
      grade: 'Al-Qur\'an & Atsar',
      indonesianText: 'Dan (ingatlah) ketika Tuhanmu memaklumkan: "Sesungguhnya jika kamu bersyukur, pasti Kami akan menambah (nikmat) kepadamu..." (QS. Ibrahim: 7)',
      notes: 'Sayyidina Umar bin Khattab RA berpesan: "Hisablah (introspeksi) diri kalian sebelum kalian dihisab kelak."'
    },
    tipsIstiqomah: 'Buka menu Gratitude di tab Quran untuk menyimpan catatan syukur harian Anda.'
  },
];

export const TASBIH_PRESETS: TasbihPreset[] = [
  {
    id: 'paket_sholat',
    name: 'Paket Ba\'da Sholat (Subhanallah ➔ Alhamdulillah ➔ Allahu Akbar)',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah (33x) ➔ Alhamdulillah (33x) ➔ Allahu Akbar (33x)',
    meaning: 'Maha Suci Allah (Otomatis beralih ke Alhamdulillah & Allahu Akbar tiap 33x)',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'subhanallah',
    name: 'Subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'Subhanallah',
    meaning: 'Maha Suci Allah dari segala kekurangan dan kesyirikan.',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'alhamdulillah',
    name: 'Alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Segala puji dan syukur hanya bagi Allah Tuhan semesta alam.',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'allahu_akbar',
    name: 'Allahu Akbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah Maha Besar, tiada yang lebih besar dari kekuasaan-Nya.',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'sholawat_jibril',
    name: 'Sholawat Jibril',
    arabic: 'صَلَّى اللهُ عَلَى مُحَمَّدٍ، صَلَّى اللهُ عَلَيْهِ وَسَلَّمَ',
    transliteration: "Shallallahu 'ala Muhammad, shallallahu 'alaihi wasallam",
    meaning: 'Semoga Allah melimpahkan sholawat dan salam kepada Nabi Muhammad SAW.',
    target: 1000,
    category: 'sholawat',
  },
  {
    id: 'istighfar_1000',
    name: 'Istighfar Taubat',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullahal \'adzim wa atubu ilaih',
    meaning: 'Aku memohon ampunan kepada Allah Yang Maha Agung dan bertaubat kepada-Nya.',
    target: 1000,
    category: 'istighfar',
  },
  {
    id: 'istighfar_sahur',
    name: 'Istighfar Waktu Sahur (100x)',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'Astaghfirullahal \'adzim wa atubu ilaih',
    meaning: 'Memohon ampunan Allah di waktu sahur menjelang fajar Subuh (QS. Adz-Dzariyat: 18).',
    target: 100,
    category: 'istighfar',
  },
  {
    id: 'dzikir_pagi',
    name: 'Dzikir Pagi (Al-Ma\'tsurat)',
    arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Ashbahnaa wa ashbahal mulku lillaahi walhamdulillah',
    meaning: 'Kami memasuki waktu pagi dan segala kerajaan milik Allah, segala puji bagi Allah.',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'dzikir_petang',
    name: 'Dzikir Petang (Al-Ma\'tsurat)',
    arabic: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ',
    transliteration: 'Amsaynaa wa amsal mulku lillaahi walhamdulillah',
    meaning: 'Kami memasuki waktu petang dan segala kerajaan milik Allah, segala puji bagi Allah.',
    target: 33,
    category: 'sholat',
  },
  {
    id: 'sayyidul_istighfar',
    name: 'Sayyidul Istighfar & Dzikir Tidur',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
    transliteration: 'Allahumma anta rabbi laa ilaaha illaa anta khalaqtani wa ana \'abduka',
    meaning: 'Ya Allah, Engkau adalah Tuhanku, tidak ada Tuhan selain Engkau yang menciptakanku.',
    target: 3,
    category: 'istighfar',
  },
  {
    id: 'yunus',
    name: 'Doa Nabi Yunus',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'Laa ilaaha illaa anta subhaanaka innii kuntu minazh-zhaalimiin',
    meaning: 'Tidak ada Tuhan selain Engkau, Maha Suci Engkau, sungguh aku termasuk orang yang zalim.',
    target: 100,
    category: 'hajat',
  },
  {
    id: 'hauqalah',
    name: 'Hauqalah (Pelepas Kesulitan)',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
    transliteration: 'Laa hawla wa laa quwwata illaa billaahil \'aliyyil \'adzim',
    meaning: 'Tiada daya dan kekuatan kecuali dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.',
    target: 100,
    category: 'hajat',
  },
];

export const INSPIRATIONAL_QUOTES = [
  {
    quote: "Jika kamu mengejar dunia, akhirat akan lepas. Tapi jika kamu mengejar langit, dunia akan berlutut mengikutimu.",
    author: "Nasehat Ulama"
  },
  {
    quote: "Jangan beri tahu Allah seberapa besar masalahmu, tapi beri tahu masalahmu seberapa Maha Besar Allahmu.",
    author: "Pengingat Hati"
  },
  {
    quote: "Doa di sepertiga malam bagaikan anak panah yang tak pernah meleset dari busurnya.",
    author: "Imam Syafi'i"
  },
  {
    quote: "Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya dan memberinya rezeki dari arah yang tiada disangka-sangka.",
    author: "QS. At-Talaq: 2-3"
  },
  {
    quote: "Dan barangsiapa bertawakkal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya.",
    author: "QS. At-Talaq: 3"
  }
];
