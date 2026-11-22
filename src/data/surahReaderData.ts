export interface SurahAyah {
  number: number;
  arabic: string;
  latin: string;
  translation: string;
}

export interface SurahContent {
  id: 'al-waqiah' | 'al-mulk' | 'al-kahfi';
  name: string;
  arabicName: string;
  meaning: string;
  surahNumber: number;
  ayahCount: number;
  revelation: 'Makkiyah' | 'Madaniyah';
  virtue: string;
  amalanId: 'surah_waqiah' | 'surah_mulk' | 'surah_kahfi';
  timeDescription: string;
  verses: SurahAyah[];
}

export const SURAH_READER_DATA: Record<string, SurahContent> = {
  'al-waqiah': {
    id: 'al-waqiah',
    name: "QS. Al-Waqi'ah",
    arabicName: 'سُورَةُ الْوَاقِعَةِ',
    meaning: 'Hari Kiamat',
    surahNumber: 56,
    ayahCount: 96,
    revelation: 'Makkiyah',
    virtue: 'Membaca surat Al-Waqi\'ah setiap petang/malam adalah wasilah menjaga keimanan, kelapangan rezeki, dan dijauhkan dari kemiskinan selamanya.',
    amalanId: 'surah_waqiah',
    timeDescription: 'Amalan Rutin Waktu Petang (Ba\'da Ashar - Maghrib)',
    verses: [
      {
        number: 1,
        arabic: 'إِذَا وَقَعَتِ الْوَاقِعَةُ',
        latin: 'Idzaa waqa\'atil waaqi\'ah.',
        translation: 'Apabila terjadi hari Kiamat,'
      },
      {
        number: 2,
        arabic: 'لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ',
        latin: 'Laisa liwaq\'atihaa kaadzibah.',
        translation: 'terjadinya tidak dapat didustakan (pasti terjadi).'
      },
      {
        number: 3,
        arabic: 'خَافِضَةٌ رَافِعَةٌ',
        latin: 'Khaafidhatur raafi\'ah.',
        translation: '(Kejadian itu) merendahkan (satu golongan) dan meninggikan (golongan yang lain).'
      },
      {
        number: 4,
        arabic: 'إِذَا رُجَّتِ الْأَرْضُ رَجًّا',
        latin: 'Idzaa rujjatil ardhu rajjaa.',
        translation: 'Apabila bumi diguncangkan sedahsyat-dahsyatnya,'
      },
      {
        number: 5,
        arabic: 'وَبُسَّتِ الْجِبَالُ بَسًّا',
        latin: 'Wa bussatil jibaalu bassaa.',
        translation: 'dan gunung-gunung dihancurluluhkan sehancur-hancurnya,'
      },
      {
        number: 6,
        arabic: 'فَكَانَتْ هَبَاءً مُنْبَثًّا',
        latin: 'Fakaanat habaa-am mumbatstsaa.',
        translation: 'maka jadilah ia debu yang beterbangan,'
      },
      {
        number: 7,
        arabic: 'وَكُنْتُمْ أَزْوَاجًا ثَلَاثَةً',
        latin: 'Wa kuntum azwaajan tsalaatsah.',
        translation: 'dan kamu menjadi tiga golongan,'
      },
      {
        number: 8,
        arabic: 'فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ',
        latin: 'Fa ash-haabul maymanati maa ash-haabul maymanah.',
        translation: 'yaitu golongan kanan, alangkah mulianya golongan kanan itu;'
      },
      {
        number: 9,
        arabic: 'وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ',
        latin: 'Wa ash-haabul masy-amati maa ash-haabul masy-amah.',
        translation: 'dan golongan kiri, alangkah sengsaranya golongan kiri itu;'
      },
      {
        number: 10,
        arabic: 'وَالسَّابِقُونَ السَّابِقُونَ',
        latin: 'Was saabiquunas saabiquun.',
        translation: 'dan orang-orang yang paling dahulu (beriman), merekalah yang paling dahulu (masuk surga).'
      },
      {
        number: 11,
        arabic: 'أُولَٰئِكَ الْمُقَرَّبُونَ',
        latin: 'Ulaa-ikal muqarrabuun.',
        translation: 'Mereka itulah orang-orang yang didekatkan (kepada Allah),'
      },
      {
        number: 12,
        arabic: 'فِي جَنَّاتِ النَّعِيمِ',
        latin: 'Fii jannaatin na\'iim.',
        translation: 'berada dalam surga kenikmatan,'
      },
      {
        number: 13,
        arabic: 'ثُلَّةٌ مِنَ الْأَوَّلِينَ',
        latin: 'Tsullatum minal awwaliin.',
        translation: 'segolongan besar dari orang-orang yang terdahulu,'
      },
      {
        number: 14,
        arabic: 'وَقَلِيلٌ مِنَ الْآخِرِينَ',
        latin: 'Wa qaliilum minal aakhiriin.',
        translation: 'dan segolongan kecil dari orang-orang yang kemudian.'
      },
      {
        number: 15,
        arabic: 'عَلَىٰ سُرُرٍ مَوْضُونَةٍ',
        latin: '‘Alaa sururim maudhuunah.',
        translation: 'Mereka berada di atas dipan-dipan yang bertatahkan emas dan permata,'
      },
      {
        number: 16,
        arabic: 'مُتَّكِئِينَ عَلَيْهَا مُتَقَابِلِينَ',
        latin: 'Muttaki-iina ‘alaihaa mutaqabiliin.',
        translation: 'seraya bersandar di atasnya berhadap-hadapan.'
      },
      {
        number: 17,
        arabic: 'يَطُوفُ عَلَيْهِمْ وِلْدَانٌ مُخَلَّدُونَ',
        latin: 'Yathuufu ‘alaihim wildaanum mukhalladuun.',
        translation: 'Mereka dikelilingi oleh anak-anak muda yang tetap muda,'
      },
      {
        number: 18,
        arabic: 'بِأَكْوَابٍ وَأَبَارِيقَ وَكَأْسٍ مِنْ مَعِينٍ',
        latin: 'Bi-akwaabiw wa abaariiqi wa ka’sim mim ma’iin.',
        translation: 'dengan membawa piala-piala, cerek-cerek dan gelas berisi minuman yang diambil dari mata air yang mengalir,'
      },
      {
        number: 19,
        arabic: 'لَا يُصَدَّعُونَ عَنْهَا وَلَا يُنْزِفُونَ',
        latin: 'Laa yushadda’uuna ‘anhaa wa laa yunzifuun.',
        translation: 'mereka tidak pening karenanya dan tidak pula mabuk,'
      },
      {
        number: 20,
        arabic: 'وَفَاكِهَةٍ مِمَّا يَتَخَيَّرُونَ',
        latin: 'Wa faakihatim mimmaa yatakhayyaruun.',
        translation: 'dan buah-buahan apa pun yang mereka pilih,'
      },
      {
        number: 21,
        arabic: 'وَلَحْمِ طَيْرٍ مِمَّا يَشْتَهُونَ',
        latin: 'Wa lahmi thairim mimmaa yasytahuun.',
        translation: 'dan daging burung apa pun yang mereka inginkan.'
      },
      {
        number: 22,
        arabic: 'وَحُورٌ عِينٌ',
        latin: 'Wa huurun ‘iin.',
        translation: 'Dan ada bidadari-bidadari bermata jeli,'
      },
      {
        number: 23,
        arabic: 'كَأَمْثَالِ اللُّؤْلُؤِ الْمَكْنُونِ',
        latin: 'Ka-amtsaalil lu’lu-il maknuun.',
        translation: 'laksana mutiara yang tersimpan baik.'
      },
      {
        number: 24,
        arabic: 'جَزَاءً بِمَا كَانُوا يَعْمَلُونَ',
        latin: 'Jazaa-am bimaa kaanuu ya’maluun.',
        translation: 'Sebagai balasan bagi apa yang telah mereka kerjakan.'
      },
      {
        number: 25,
        arabic: 'لَا يَسْمَعُونَ فِيهَا لَغْوًا وَلَا تَأْثِيمًا',
        latin: 'Laa yasma’uuna fiihaa laghwaw wa laa ta’tsiimaa.',
        translation: 'Mereka tidak mendengar di dalamnya perkataan yang sia-sia dan tidak pula perkataan yang menimbulkan dosa,'
      },
      {
        number: 26,
        arabic: 'إِلَّا قِيلًا سَلَامًا سَلَامًا',
        latin: 'Illaa qiilan salaaman salaamaa.',
        translation: 'akan tetapi mereka mendengar ucapan salam.'
      },
      {
        number: 88,
        arabic: 'فَأَمَّا إِنْ كَانَ مِنَ الْمُقَرَّبِينَ',
        latin: 'Fa ammaa in kaana minal muqarrabiin.',
        translation: 'Adapun jika dia termasuk golongan orang yang didekatkan (kepada Allah),'
      },
      {
        number: 89,
        arabic: 'فَرَوْحٌ وَرَيْحَانٌ وَجَنَّتُ نَعِيمٍ',
        latin: 'Farawhuw wa raihaanuw wa jannatu na’iim.',
        translation: 'maka dia memperoleh ketenteraman, rezeki serta surga kenikmatan.'
      },
      {
        number: 96,
        arabic: 'فَسَبِّحْ بِاسْمِ رَبِّكَ الْعَظِيمِ',
        latin: 'Fasabbih bismi rabbikal ‘azhiim.',
        translation: 'Maka bertasbihlah dengan menyebut nama Tuhanmu Yang Maha Agung.'
      }
    ]
  },
  'al-mulk': {
    id: 'al-mulk',
    name: 'QS. Al-Mulk (Tabarak)',
    arabicName: 'سُورَةُ الْمُلْكِ',
    meaning: 'Kerajaan',
    surahNumber: 67,
    ayahCount: 30,
    revelation: 'Makkiyah',
    virtue: 'Surat pembela dan penyelamat dari siksa kubur. Siapa yang membacanya rutin setiap malam, surat ini akan memohonkan ampunan hingga dosanya diampuni. (HR. Abu Dawud & Tirmidzi)',
    amalanId: 'surah_mulk',
    timeDescription: 'Amalan Rutin Waktu Malam (Sebelum Tidur)',
    verses: [
      {
        number: 1,
        arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Tabaarakalladzii biyadihil mulku wa huwa ‘alaa kulli syai-in qadiir.',
        translation: 'Maha Suci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu.'
      },
      {
        number: 2,
        arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ',
        latin: 'Alladzii khalaqal mawta wal hayaata liyabluwakum ayyukum ahsanu ‘amalaa, wa huwal ‘aziizul ghafuur.',
        translation: 'Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa lagi Maha Pengampun.'
      },
      {
        number: 3,
        arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ',
        latin: 'Alladzii khalaqa sab’a samaawaatin thibaaqaa, maa taraa fii khalqir rahmaani min tafaawut, farji’il bashara hal taraa min futhuur.',
        translation: 'Yang telah menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pengasih sesuatu yang tidak seimbang. Maka lihatlah berulang-ulang, adakah kamu lihat sesuatu yang cacat?'
      },
      {
        number: 4,
        arabic: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنْقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ',
        latin: 'Tsummar ji’il bashara karrataini yanqalib ilaikal basharu khaasi-aw wa huwa hasiir.',
        translation: 'Kemudian pandanglah sekali lagi niscaya penglihatanmu akan kembali kepadamu dengan tidak menemukan sesuatu cacat dan penglihatanmu itu pun dalam keadaan payah.'
      },
      {
        number: 5,
        arabic: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ',
        latin: 'Wa laqad zayyannas samaa-ad dun-yaa bimashaabiiha wa ja’alnaahaa rujuumal lisy-syayaathiin, wa a’tadnaa lahum ‘adzaabas sa’iir.',
        translation: 'Sesungguhnya Kami telah menghiasi langit yang dekat dengan bintang-bintang, dan Kami jadikan bintang-bintang itu alat-alat pelempar syaitan, dan Kami sediakan bagi mereka siksa neraka yang menyala-nyala.'
      },
      {
        number: 12,
        arabic: 'إِنَّ الَّذِينَ يَخْشَوْنَ رَبَّهُمْ بِالْغَيْبِ لَهُمْ مَغْفِرَةٌ وَأَجْرٌ كَبِيرٌ',
        latin: 'Innal ladziina yakhsyauna rabbahum bil-ghaibi lahum maghfiratuw wa ajrun kabiir.',
        translation: 'Sesungguhnya orang-orang yang takut kepada Tuhannya Yang tidak terlihat oleh mereka, mereka memperoleh ampunan dan pahala yang besar.'
      },
      {
        number: 13,
        arabic: 'وَأَسِرُّوا قَوْلَكُمْ أَوِ اجْهَرُوا بِهِ ۖ إِنَّهُ عَلِيمٌ بِذَاتِ الصُّدُورِ',
        latin: 'Wa asirruu qaulakum awijharuu bih, innahuu ‘aliimum bidzaatish shuduur.',
        translation: 'Dan rahasiakanlah perkataanmu atau lahirkanlah; sesungguhnya Dia Maha Mengetahui segala isi hati.'
      },
      {
        number: 14,
        arabic: 'أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ اللَّطِيفُ الْخَبِيرُ',
        latin: 'Alaa ya’lamu man khalaqa wa huwal lathiiful khabiir.',
        translation: 'Apakah Allah Yang menciptakan itu tidak mengetahui (apa yang kamu lahirkan atau rahasiakan); dan Dia Maha Halus lagi Maha Mengetahui?'
      },
      {
        number: 15,
        arabic: 'هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِنْ رِزْقِهِ ۖ وَإِلَيْهِ النُّشُورُ',
        latin: 'Huwal ladzii ja’ala lakumul ardha dzaluulan famsyuu fii manaakibihaa wa kuluu mir rizqih, wa ilaihin nusyuur.',
        translation: 'Dialah Yang menjadikan bumi itu mudah bagi kamu, maka berjalanlah di segala penjurunya dan makanlah sebahagian dari rezeki-Nya. Dan hanya kepada-Nya-lah kamu (kembali setelah) dibangkitkan.'
      },
      {
        number: 30,
        arabic: 'قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَنْ يَأْتِيكُمْ بِمَاءٍ مَعِينٍ',
        latin: 'Qul ara-aitum in ashbaha maa-ukum ghauran famay ya’tiikum bimaa-im ma’iin.',
        translation: 'Katakanlah: "Terangkanlah kepadaku jika sumber airmu menjadi kering; maka siapakah yang akan mendatangkan air yang mengalir bagimu?"'
      }
    ]
  },
  'al-kahfi': {
    id: 'al-kahfi',
    name: 'QS. Al-Kahfi',
    arabicName: 'سُورَةُ الْكَهْفِ',
    meaning: 'Gua',
    surahNumber: 18,
    ayahCount: 110,
    revelation: 'Makkiyah',
    virtue: 'Membaca surat Al-Kahfi pada hari Jum\'at akan memancarkan cahaya baginya di antara dua Jum\'at dan menghafal 10 ayat pertamanya melindungi dari fitnah Dajjal. (HR. Muslim & Al-Hakim)',
    amalanId: 'surah_kahfi',
    timeDescription: 'Amalan Hari Jum\'at (Kamis Petang s.d. Jum\'at Sore)',
    verses: [
      {
        number: 1,
        arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ',
        latin: 'Alhamdulillahilladzii anzala ‘alaa ‘abdihil kitaaba wa lam yaj’al lahu ‘iwajaa.',
        translation: 'Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur\'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok;'
      },
      {
        number: 2,
        arabic: 'قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا',
        latin: 'Qayyimal liyundzira ba’san syadiidam mil ladunhu wa yubasysyiral mu’miniinal ladziina ya’maluunash shaalihaati anna lahum ajran hasanaa.',
        translation: 'sebagai bimbingan yang lurus, untuk memperingatkan siksaan yang sangat pedih dari sisi-Nya dan memberi kabar gembira kepada orang-orang mukmin yang mengerjakan kebajikan bahwa mereka akan mendapat balasan yang baik,'
      },
      {
        number: 3,
        arabic: 'مَاكِثِينَ فِيهِ أَبَدًا',
        latin: 'Maakitsiina fiihi abadaa.',
        translation: 'mereka kekal di dalamnya untuk selama-lamanya.'
      },
      {
        number: 4,
        arabic: 'وَيُنْذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا',
        latin: 'Wa yundziral ladziina qaalut takhadzallaahu waladaa.',
        translation: 'Dan untuk memperingatkan orang-orang yang berkata, "Allah mengangkat seorang anak."'
      },
      {
        number: 10,
        arabic: 'إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا',
        latin: 'Idz awal fityatu ilal kahfi faqaaluu rabbanaa aatinaa mil ladunka rahmataw wa hayyi’ lanaa min amrinaa rasyadaa.',
        translation: '(Ingatlah) tatkala pemuda-pemuda itu berlindung ke dalam gua lalu mereka berdoa: "Ya Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah petunjuk yang lurus bagi kami dalam urusan kami."'
      },
      {
        number: 110,
        arabic: 'قُلْ إِنَّمَا أَنَا بَشَرٌ مِثْلُكُمْ يُوحَىٰ إِلَيَّ أَنَّمَا إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ فَمَنْ كَانَ يَرْجُو لِقَاءَ رَبِّهِ فَلْيَعْمَلْ عَمَلًا صَالِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا',
        latin: 'Qul innamaa ana basyarum mitslukum yuuhaa ilayya annamaa ilaahukum ilaahuw waahid, faman kaana yarjuu liqaa-a rabbihii falya’mal ‘amalan shaalihaw wa laa yusyrik bi’ibaadati rabbihii ahadaa.',
        translation: 'Katakanlah: "Sesungguhnya aku ini hanya seorang manusia seperti kamu, yang diwahyukan kepadaku: \'Bahwa sesungguhnya Tuhan kamu itu adalah Tuhan Yang Maha Esa\'. Barangsiapa mengharap perjumpaan dengan Tuhannya maka hendaklah ia mengerjakan amal yang saleh dan janganlah ia mempersekutukan seorang pun dalam beribadat kepada Tuhannya."'
      }
    ]
  }
};

/**
 * Fallback kamus ayat Al-Qur'an lengkap untuk card tadabbur default
 * Menjamin card lama yang belum memiliki arabicText di localStorage tetap tampil sempurna!
 */
export const TADABBUR_AYAT_FALLBACK: Record<string, { arabic: string; latin: string; translation: string }> = {
  'tadabbur-1': {
    arabic: 'إِذَا وَقَعَتِ الْوَاقِعَةُ ۝ لَيْسَ لِوَقْعَتِهَا كَاذِبَةٌ ۝ خَافِضَةٌ رَافِعَةٌ ۝ إِذَا رُجَّتِ الْأَرْضُ رَجًّا ۝ وَبُسَّتِ الْجِبَالُ بَسًّا ۝ فَكَانَتْ هَبَاءً مُنْبَثًّا ۝ وَكُنْتُمْ أَزْوَاجًا ثَلَاثَةً ۝ فَأَصْحَابُ الْمَيْمَنَةِ مَا أَصْحَابُ الْمَيْمَنَةِ ۝ وَأَصْحَابُ الْمَشْأَمَةِ مَا أَصْحَابُ الْمَشْأَمَةِ ۝ وَالسَّابِقُونَ السَّابِقُونَ ۝ أُولَٰئِكَ الْمُقَرَّبُونَ ۝',
    latin: "Idzaa waqa'atil waaqi'ah. Laisa liwaq'atihaa kaadzibah. Khaafidhatur raafi'ah. Idzaa rujjatil ardhu rajjaa. Wa bussatil jibaalu bassaa. Fakaanat habaa-am mumbatstsaa. Wa kuntum azwaajan tsalaatsah. Fa ash-haabul maymanati maa ash-haabul maymanah. Wa ash-haabul masy-amati maa ash-haabul masy-amah. Was saabiquunas saabiquun. Ulaa-ikal muqarrabuun.",
    translation: '1. Apabila terjadi hari Kiamat, 2. terjadinya tidak dapat didustakan (pasti terjadi). 3. (Kejadian itu) merendahkan (satu golongan) dan meninggikan (golongan yang lain). 4. Apabila bumi diguncangkan sedahsyat-dahsyatnya, 5. dan gunung-gunung dihancurluluhkan sehancur-hancurnya, 6. maka jadilah ia debu yang beterbangan, 7. dan kamu menjadi tiga golongan: 8. yaitu golongan kanan, alangkah mulianya golongan kanan itu; 9. dan golongan kiri, alangkah sengsaranya golongan kiri itu; 10. dan orang-orang yang paling dahulu (beriman), merekalah yang paling dahulu (masuk surga). 11. Mereka itulah orang-orang yang didekatkan (kepada Allah).'
  },
  'tadabbur-2': {
    arabic: 'وَمَنْ يَتَّقِ اللَّهَ يَجْعَلْ لَهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ ۚ وَمَنْ يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ ۚ قَدْ جَعَلَ اللَّهُ لِكُلِّ شَيْءٍ قَدْرًا ۝',
    latin: "Wa may yattaqillaaha yaj'al lahuu makhrajaa. Wa yarzuqhu min haitsu laa yahtasib, wa may yatawakkal 'alallaahi fahuwa hasbuh, innallaaha baalighu amrih, qad ja'alallaahu likulli syai-in qadraa.",
    translation: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan memberinya rezeki dari arah yang tiada disangka-sangkanya. Dan barangsiapa bertawakkal kepada Allah niscaya Allah akan mencukupkan (keperluan)nya. Sesungguhnya Allah melaksanakan urusan yang (dikehendaki)-Nya. Sesungguhnya Allah telah mengadakan ketentuan bagi tiap-tiap sesuatu. (QS. At-Talaq: 2-3)'
  },
  'tadabbur-3': {
    arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ۝ الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ۝ الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِنْ تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِنْ فُطُورٍ ۝',
    latin: "Tabaarakalladzii biyadihil mulku wa huwa 'alaa kulli syai-in qadiir. Alladzii khalaqal mawta wal hayaata liyabluwakum ayyukum ahsanu 'amalaa, wa huwal 'aziizul ghafuur. Alladzii khalaqa sab'a samaawaatin thibaaqaa, maa taraa fii khalqir rahmaani min tafaawut, farji'il bashara hal taraa min futhuur.",
    translation: '1. Maha Suci Allah Yang di tangan-Nya-lah segala kerajaan, dan Dia Maha Kuasa atas segala sesuatu. 2. Yang menciptakan mati dan hidup, untuk menguji kamu, siapa di antara kamu yang lebih baik amalnya. Dan Dia Maha Perkasa lagi Maha Pengampun. 3. Yang telah menciptakan tujuh langit berlapis-lapis. Kamu sekali-kali tidak melihat pada ciptaan Tuhan Yang Maha Pengasih sesuatu yang tidak seimbang. Maka lihatlah berulang-ulang, adakah kamu lihat sesuatu yang cacat?'
  },
  'tadabbur-4': {
    arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنْزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَلْ لَهُ عِوَجًا ۜ قَيِّمًا لِيُنْذِرَ بَأْسًا شَدِيدًا مِنْ لَدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ ۝ ... إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِنْ لَدُنْكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا ۝',
    latin: "Alhamdulillahilladzii anzala 'alaa 'abdihil kitaaba wa lam yaj'al lahu 'iwajaa. Qayyimal liyundzira ba'san syadiidam mil ladunhu wa yubasysyiral mu'miniin... Idz awal fityatu ilal kahfi faqaaluu rabbanaa aatinaa mil ladunka rahmataw wa hayyi' lanaa min amrinaa rasyadaa.",
    translation: '1. Segala puji bagi Allah yang telah menurunkan Kitab (Al-Qur\'an) kepada hamba-Nya dan Dia tidak menjadikannya bengkok; 2. sebagai bimbingan yang lurus, untuk memperingatkan siksaan yang sangat pedih dari sisi-Nya dan memberi kabar gembira kepada orang-orang mukmin... 10. (Ingatlah) tatkala pemuda-pemuda itu berlindung ke dalam gua lalu mereka berdoa: "Ya Tuhan kami, berikanlah rahmat kepada kami dari sisi-Mu dan sempurnakanlah petunjuk yang lurus bagi kami dalam urusan kami".'
  }
};
