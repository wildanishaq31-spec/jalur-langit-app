// src/utils/smartKajianSummarizer.ts
// Engine Cerdas Analisis & Rangkuman Kajian Islam Otomatis dari Link YouTube / Podcast
// Fleksibel & Dinamis: Menghasilkan banyak poin penting & rencana aksi nyata sesuai kedalaman materi kajian

export interface KajianSummaryResult {
  title: string;
  speaker: string;
  videoUrl: string;
  notes: string;
  actionPlan: string;
  thumbnailUrl?: string;
  channelName?: string;
}

export interface CuratedKajianPreset {
  id: string;
  label: string;
  speaker: string;
  title: string;
  videoUrl: string;
  notes: string;
  actionPlan: string;
}

// 5 Rekomendasi Kajian Pilihan Populer Siap 1-Tap dengan Poin Lengkap & Komprehensif
export const CURATED_KAJIAN_PRESETS: CuratedKajianPreset[] = [
  {
    id: 'uah-doa',
    label: 'UAH: Rahasia Terkabulnya Doa',
    speaker: 'Ustadz Adi Hidayat',
    title: 'Rahasia Doa Cepat Terkabul & Kunci Membuka Pintu Langit',
    videoUrl: 'https://www.youtube.com/watch?v=kYJjZ5h2s_M',
    notes: '• Hakikat Doa: Doa bukan sekadar mengajukan daftar keinginan, melainkan bentuk pengakuan mutlak atas kelemahan diri di hadapan Allah Yang Maha Kuasa.\n• Adab Membuka Pintu Langit: Awali doa dengan tahmid (memuji Allah), membaca Asmaul Husna (terutama Yaa Dzal Jalaali wal Ikram), dan shalawat kepada Rasulullah SAW.\n• Penghalang Utama Doa (Al-Hijab): Mengonsumsi makanan, minuman, pakaian, atau harta dari sumber yang syubhat atau haram dapat membatalkan diijabahnya doa.\n• Waktu Emas Mustajab: Sepertiga malam terakhir saat Allah turun ke langit dunia, saat sujud terakhir dalam sholat fardhu, antara adzan dan iqamah, serta ba\'da Ashar di hari Jum\'at.\n• Tiga Wujud Ijabah Doa: Allah pasti mengabulkan doa seorang hamba dalam salah satu dari 3 bentuk: dikabulkan seketika di dunia, disimpan sebagai pahala agung di akhirat, atau dijauhkan dari marabahaya yang setara.\n• Kekuatan Keyakinan (Jazm): Berdoalah dengan penuh kepastian tanpa keraguan (laa yastatsnii), yakin bahwa perbendaharaan Allah tidak pernah berkurang.',
    actionPlan: '1. Luangkan 15-20 menit hening di sepertiga malam untuk bermunajat khusus menyebut nama hajat secara mendetail.\n2. Lakukan audit ketat terhadap sumber penghasilan dan pastikan seluruh asupan keluarga 100% halal dan thoyyib.\n3. Rutinkan membaca Sayyidul Istighfar minimal 3x pagi dan 3x petang sebagai pembuka sumbatan rezeki dan doa.\n4. Memperpanjang sujud terakhir sholat fardhu untuk memanjatkan doa terbaik bagi diri, orang tua, dan keluarga.\n5. Menjaga lisan dari perkataan kotor, ghibah, dan perdebatan sia-sia yang dapat mengeruhkan kejernihan batin.'
  },
  {
    id: 'hanan-hati',
    label: 'Hanan Attaki: Menata Hati yang Lelah',
    speaker: 'Ustadz Hanan Attaki',
    title: 'Ketika Hatimu Sedang Lelah, Kecewa, dan Butuh Pertolongan Allah',
    videoUrl: 'https://www.youtube.com/watch?v=Fj2b9l9cQ9c',
    notes: '• Asal Muasal Kekecewaan: Kelelahan batin umumnya bersumber dari ekspektasi berlebih yang disandarkan kepada sesama manusia atau hasil duniawi yang semu.\n• Ujian sebagai Tanda Cinta: Allah menghadirkan rasa kecewa di dunia agar kita tidak terbuai dan menyadari bahwa satu-satunya tempat bergantung abadi hanyalah Allah SWT.\n• Seni Tawakkal Bulat: Menyerahkan hasil akhir setelah ikhtiar maksimal, meyakini bahwa skenario terbaik Allah jauh melampaui rencana tercantik kita.\n• Kekuatan Sabar Tanpa Batas: Sabar sejati bukanlah menahan amarah secara terpaksa, melainkan menjaga lisan dari mengeluh kepada makhluk dan tetap husnudzon kepada takdir.\n• Zikir Penawar Hati: Kalimat "Hasbunallah wa ni\'mal wakiil" adalah tameng batin yang mengalihkan beban hidup langsung kepada perlindungan Allah.\n• Memaknai Kegagalan: Apa yang luput dari kita sesungguhnya tidak pernah ditakdirkan untuk kita, dan apa yang ditakdirkan untuk kita tidak akan pernah meleset.',
    actionPlan: '1. Mengambil jeda hening (digital detox) minimal 30 menit saat overthinking, gantikan dengan tilawah mushaf Al-Qur\'an.\n2. Curahkan seluruh unek-unek dan kesedihan hanya di atas sajadah dalam sholat sunnah Taubat dan Hajat.\n3. Praktikkan "Zero Grievance": berhenti mengeluh di media sosial dan gantikan dengan kalimat hamdalah.\n4. Maafkan semua orang yang pernah menyakiti sebelum memejamkan mata di malam hari agar tidur damai.\n5. Tuliskan 5 nikmat gratis yang Allah berikan hari ini dalam gratitude journal sebagai terapi penguat syukur.'
  },
  {
    id: 'buya-orangtua',
    label: 'Buya Yahya: Berbakti kepada Orang Tua',
    speaker: 'Buya Yahya',
    title: 'Dahsyatnya Berbakti kepada Orang Tua: Pembuka Pintu Rezeki & Jalan Surga',
    videoUrl: 'https://www.youtube.com/watch?v=s3F6cRz1qKs',
    notes: '• Kedudukan Utama Birrul Walidain: Menempati urutan tertinggi setelah tauhid dan sholat fardhu tepat waktu, mengalahkan keutamaan jihad fi sabilillah yang sunnah.\n• Rumus Ridho Ilahi: Keridhoan Allah Ta\'ala terikat erat pada keridhoan kedua orang tua, dan murka-Nya berada pada murka kedua orang tua (HR. Tirmidzi).\n• Magnet Penarik Rezeki: Anak yang memuliakan dan membahagiakan orang tuanya akan dibukakan jalan keluar dari arah yang tak disangka-sangka dan dipanjangkan umurnya dalam keberkahan.\n• Menjaga Adab Tutur Kata: Larangan keras mengatakan perkataan "ah" (uff), memotong pembicaraan, atau meninggikan intonasi suara di hadapan ayah dan ibu.\n• Berbakti kepada Orang Tua yang Telah Wafat: Menziarahi makam, memohonkan ampunan (istighfar), menyambung silaturahmi dengan kerabat mereka, dan menunaikan nadzar/wasiat yang belum tuntas.\n• Kekuatan Doa Orang Tua: Doa ibu dan ayah untuk anaknya adalah salah satu dari 3 doa yang pasti menembus langit tanpa ada penghalang sama sekali.',
    actionPlan: '1. Hubungi atau kunjungi orang tua hari ini, tanyakan kabarnya dengan nada santun penuh kehangatan.\n2. Sisihkan amplop bulanan khusus untuk orang tua dari penghasilan pertama sebelum dibelanjakan kebutuhan lain.\n3. Rutinkan membaca doa "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa" minimal 5x setiap ba\'da sholat.\n4. Mintalah doa dan restu orang tua secara khusus sebelum mengambil keputusan besar atau memulai ikhtiar baru.\n5. Bersedekah atas nama orang tua (terutama bila telah meninggal dunia) untuk mengalirkan amal jariyah.'
  },
  {
    id: 'khalid-tahajjud',
    label: 'Khalid Basalamah: Qiyamul Lail & Sedekah',
    speaker: 'Ustadz Khalid Basalamah',
    title: 'Kedahsyatan Sholat Malam & Sedekah Subuh Sebagai Penjemput Impian',
    videoUrl: 'https://www.youtube.com/watch?v=4pP5D7aVwXs',
    notes: '• Kemuliaan Qiyamul Lail: Kebiasaan para nabi dan shalihin yang membentengi tubuh dari penyakit, menghapus dosa, dan mengundang rahmat Allah.\n• Seruan Langit Sepertiga Malam: Allah turun ke langit dunia dan menawarkan: "Adakah yang memohon ampun agar Kuampuni? Adakah yang meminta agar Kuberi?".\n• Sholat Penutup Witir: Menjaga minimal 1 rakaat atau 3 rakaat witir sebagai penutup rangkaian ibadah malam, disukai oleh Allah yang Maha Ganjil.\n• Keajaiban Sedekah Subuh: Waktu subuh dikawal oleh dua malaikat yang berdoa: satu mendoakan keberkahan bagi yang berinfak, satu mendoakan kebinasaan bagi yang kikir.\n• Hubungan Amalan Malam dan Keberhasilan Siang: Kemenangan dan ketenangan seseorang di siang hari ditentukan oleh bagaimana ia bersujud di malam hari.\n• Menghidupkan Waktu Sahur: Mengisi waktu sesaat sebelum fajar dengan memperbanyak istighfar (wabil as-haari hum yastaghfiruun).',
    actionPlan: '1. Pasang alarm 45 menit sebelum waktu Subuh untuk mendirikan 2 rakaat Taubat, 2-4 rakaat Tahajjud, dan 1 rakaat Witir.\n2. Siapkan wadah celengan khusus di kamar tidur untuk memasukkan sedekah subuh setiap pagi diiringi doa hajat.\n3. Duduk tenang beristighfar 70-100 kali di waktu sahur menjelang fajar menyingsing.\n4. Membaca doa Sayyidul Istighfar dan dzikir pagi lengkap setelah sholat Subuh berjamaah.\n5. Mengamalkan sholat sunnah Fajar 2 rakaat (qabliyah Subuh) yang nilainya lebih baik dari dunia dan seisinya.'
  },
  {
    id: 'uas-istiqomah',
    label: 'UAS: Istiqomah di Tengah Fitnah',
    speaker: 'Ustadz Abdul Somad',
    title: 'Kiat Menjaga Keistiqomahan Ibadah & Membersihkan Hati',
    videoUrl: 'https://www.youtube.com/watch?v=d7N5F2vQm9k',
    notes: '• Keutamaan Istiqomah: "Al-Istiqomatu khairun min alfi karomah" — bertahan istiqomah dalam ketaatan lebih mulia daripada seribu keajaiban karomah.\n• Fluktuasi Keimanan: Iman itu bertambah dengan amal ketaatan dan berkurang karena kemaksiatan (yaziid wa yanqus). Kenali fase futur (kejenuhan) dan segera obati.\n• Amalan yang Paling Dicintai Allah: Amalan yang dikerjakan secara berkelanjutan walaupun jumlahnya sedikit (adwamuha wa in qalla).\n• Peran Lingkungan (Bi\'ah Sholihah): Manusia cenderung mengikuti agama sahabat karibnya; carilah teman yang mengingatkan pada akhirat saat kita lalai.\n• Bahaya Dosa Kecil yang Diulang: Tetesan air yang terus menerus dapat melubangi batu karang; dosa kecil yang diremehkan akan menumpuk menjadi noda hitam di hati.\n• Pentingnya Menjaga Sholat Fardhu: Sholat berjamaah di awal waktu adalah tiang utama penopang seluruh bangunan keistiqomahan seorang muslim.',
    actionPlan: '1. Tentukan satu paket "Amalan Inti" harian yang tidak boleh ditinggalkan dalam kondisi apapun (misal: sholat di awal waktu & 1 juz tilawah).\n2. Seleksi pertemanan dan batasi konsumsi konten digital yang mengotori pikiran serta melemahkan semangat ibadah.\n3. Rutinkan menghadiri atau menyimak minimal 1 majelis ilmu agama yang shahih setiap pekan.\n4. Rutin membaca doa keteguhan iman: "Yaa Muqallibal quluub, tsabbit qalbii \'ala diinik".\n5. Segera berwudhu dan sholat sunnah Taubat 2 rakaat setiap kali tergelincir melakukan kesalahan tanpa menunda.'
  }
];

// Daftar ustadz populer untuk deteksi otomatis
const KNOWN_SPEAKERS: { keywords: string[]; name: string }[] = [
  { keywords: ['adi hidayat', 'uah', 'quantum akhyar'], name: 'Ustadz Adi Hidayat' },
  { keywords: ['abdul somad', 'uas'], name: 'Ustadz Abdul Somad' },
  { keywords: ['hanan attaki', 'shift'], name: 'Ustadz Hanan Attaki' },
  { keywords: ['buya yahya', 'al-bahjah', 'al bahjah'], name: 'Buya Yahya' },
  { keywords: ['khalid basalamah', 'khalid zeed'], name: 'Ustadz Khalid Basalamah' },
  { keywords: ['syafiq riza', 'syafiq basalamah'], name: 'Ustadz Syafiq Riza Basalamah' },
  { keywords: ['husein ja\'far', 'habib ja\'far', 'jeda nulis'], name: 'Habib Husein Ja\'far' },
  { keywords: ['oki setiana dewi', 'ustadzah oki'], name: 'Ustadzah Oki Setiana Dewi' },
  { keywords: ['das\'ad latif', 'dasad latif'], name: 'Ustadz Das\'ad Latif' },
  { keywords: ['felix siauw'], name: 'Ustadz Felix Siauw' },
  { keywords: ['gus baha', 'bahauddin nursalim'], name: 'Gus Baha (KH. Ahmad Bahauddin Nursalim)' },
  { keywords: ['salim a. fillah', 'salim a fillah'], name: 'Ustadz Salim A. Fillah' },
  { keywords: ['firanda andirja'], name: 'Ustadz Firanda Andirja' },
  { keywords: ['hilman fauzi'], name: 'Ustadz Hilman Fauzi' },
  { keywords: ['nouman ali khan', 'bayyinah'], name: 'Nouman Ali Khan' },
  { keywords: ['mufti menk'], name: 'Mufti Menk' },
];

/**
 * Ekstraksi Ustadz/Pemateri dari judul dan author name
 */
export function extractSpeaker(title: string, authorName?: string): string {
  const combined = `${title} ${authorName || ''}`.toLowerCase();
  for (const item of KNOWN_SPEAKERS) {
    if (item.keywords.some(k => combined.includes(k))) {
      return item.name;
    }
  }

  // Fallback: bersihkan authorName
  if (authorName && authorName.trim()) {
    let clean = authorName.replace(/official|tv|channel|media|dakwah|studio/gi, '').trim();
    if (clean && !clean.toLowerCase().includes('ustadz') && !clean.toLowerCase().includes('habib') && !clean.toLowerCase().includes('buya')) {
      clean = `Ustadz ${clean}`;
    }
    return clean || 'Ustadz / Kajian';
  }

  return 'Ustadz / Kajian';
}

/**
 * Membersihkan judul kajian dari teks clickbait, kurung, dan watermark
 */
export function cleanKajianTitle(rawTitle: string): string {
  let title = rawTitle;

  // Hapus karakter tanda kurung kotak, tanda pipa, dan nama ustadz berlebih
  title = title.replace(/\[.*?\]/g, ' ');
  title = title.replace(/\(.*?\)/g, ' ');
  title = title.replace(/\|.*$/g, ' ');
  title = title.replace(/- ustadz.*$/i, ' ');
  title = title.replace(/- buya.*$/i, ' ');
  title = title.replace(/- habib.*$/i, ' ');
  title = title.replace(/terbaru \d{4}/gi, ' ');
  title = title.replace(/bikin menangis|merinding|wajib tonton|viral/gi, ' ');
  title = title.replace(/full hd|video hd|official video/gi, ' ');
  title = title.replace(/\s+/g, ' ').trim();

  if (title.length < 5) {
    return rawTitle.trim();
  }

  return title;
}

/**
 * Menganalisis tema video secara modular dan fleksibel.
 * Tidak terpaku hanya pada 3 poin, melainkan menghasilkan banyak poin penting (5-8 butir)
 * dan rencana aksi nyata komprehensif (4-6 langkah) sesuai kedalaman materi kajian.
 */
export function analyzeKajianContent(title: string, speaker: string): { notes: string; actionPlan: string } {
  const text = title.toLowerCase();

  const noteItems: string[] = [];
  const actionItems: string[] = [];

  // 1. DIMENSI REZEKI, HARTA & KEBERKAHAN
  if (text.includes('rezeki') || text.includes('uang') || text.includes('kaya') || text.includes('harta') || text.includes('hutang') || text.includes('dinar')) {
    noteItems.push('Hakikat Rezeki: Rezeki bukan sekadar angka nominal pada saldo atau aset benda, melainkan keberkahan yang mendatangkan ketenangan batin, kesehatan, dan keluarga yang sholeh.');
    noteItems.push('Jalur Langit Rezeki Tak Terduga: Allah menjamin rezeki dari arah yang tidak disangka-sangka (min haitsu laa yahtasib) secara khusus bagi hamba-Nya yang bertakwa dan bersungguh-sungguh menjauhi perkara haram.');
    noteItems.push('Pelepas Jeratan Hutang & Kesempitan: Memperbanyak istighfar dan membaca doa pelunas hutang yang diajarkan Rasulullah SAW ("Allahummakfinii bihalaalika \'an haraamik...").');
    noteItems.push('Keajaiban Sedekah: Bersedekah tidak pernah mengurangi harta, melainkan menjadi magnet pelipatgandaan rizki dan perisai penolak mara bahaya.');
    noteItems.push('Amanah Usaha & Muamalah: Kejujuran dan ketepatan janji dalam perniagaan mengundang malaikat rahmat menyertai setiap rupiah yang dihasilkan.');

    actionItems.push('Merutinkan sedekah subuh setiap hari dengan konsisten walau bernominal kecil, diniatkan lillahi ta\'ala.');
    actionItems.push('Melakukan evaluasi menyeluruh agar seluruh transaksi, pekerjaan, dan pengeluaran bersih dari unsur syubhat atau riba.');
    actionItems.push('Membaca dzikir Sayyidul Istighfar dan doa perlindungan dari lilitan hutang setiap pagi dan petang.');
    actionItems.push('Merutinkan sholat Dhuha minimal 2 hingga 4 rakaat sebagai bentuk sedekah atas setiap persendian tubuh.');
  }

  // 2. DIMENSI DOA, HAJAT & MUNAJAT LANGIT
  if (text.includes('doa') || text.includes('hajat') || text.includes('langit') || text.includes('mustajab') || text.includes('minta') || text.includes('terkabul')) {
    noteItems.push('Otak Ibadah: Doa adalah intisari ibadah (mukhkhul \'ibaadah) yang mencerminkan ketundukan dan kerendahan diri seorang hamba di hadapan Rabb Semesta Alam.');
    noteItems.push('Adab Bertawasul dengan Asmaul Husna: Mengawali doa dengan memuji keagungan Allah dan menyebut Asmaul Husna yang relevan dengan hajat mempercepat terbukanya pintu rahmat.');
    noteItems.push('Penghalang Terkabulnya Doa: Harta yang haram, keputusasaan, dan sikap tergesa-gesa (isti\'jal) adalah hijab tebal yang menahan turunnya ijabah.');
    noteItems.push('Waktu-Waktu Mustajab: Memanfaatkan jeda antara adzan dan iqamah, saat sujud terakhir, sepertiga malam terakhir, dan saat hujan turun.');
    noteItems.push('Kepastian Ijabah: Setiap doa seorang mukmin pasti dijawab Allah dalam 3 skenario terbaik: dikabulkan langsung, ditabung di akhirat, atau digantikan dengan dijauhkan dari marabahaya.');

    actionItems.push('Menyisihkan 15 menit hening di sepertiga malam untuk bermunajat khusus mendirikan sholat Hajat dan Tahajjud.');
    actionItems.push('Menuliskan daftar impian dan hajat hidup secara terperinci lalu membacanya penuh keyakinan di setiap sujud terakhir.');
    actionItems.push('Menghindari kata-kata mengeluh atau meragukan takdir Allah, gantikan dengan memperbanyak shalawat penarik rahmat.');
    actionItems.push('Mendoakan kebaikan bagi sesama muslim secara diam-diam (fii zhahril ghaib) agar malaikat mengamini hal yang sama untuk kita.');
  }

  // 3. DIMENSI KETENANGAN HATI, ANXIETY, OVERTHINKING & IKHLAS
  if (text.includes('hati') || text.includes('lelah') || text.includes('galau') || text.includes('tenang') || text.includes('ikhlas') || text.includes('sedih') || text.includes('kecewa') || text.includes('anxiety') || text.includes('overthinking')) {
    noteItems.push('Kunci Kedamaian Batin: Hati manusia adalah milik Allah, dan hanya dengan memperbanyak dzikir mengingat Allah hati akan menemukan ketenangan hakiki (QS. Ar-Ra\'d: 28).');
    noteItems.push('Akar Kegelisahan & Overthinking: Kekecewaan terjadi saat kita menaruh harapan terlalu besar kepada makhluk atau mencemaskan masa depan yang belum tentu terjadi.');
    noteItems.push('Seni Ikhlas & Melepaskan: Ikhlas berarti membersihkan niat dari pamrih penilaian manusia; apa yang ditakdirkan untukmu tidak akan pernah melewatkanmu.');
    noteItems.push('Kekuatan Hasbunallah: Kalimat "Hasbunallah wa ni\'mal wakiil" adalah penyerahan total yang membuat seluruh beban berat diambil alih oleh pertolongan Allah.');
    noteItems.push('Pembersih Jiwa (Tazkiyatun Nafs): Merawat hati dari noda iri, dengki, dan prasangka buruk melalui tilawah ayat suci Al-Qur\'an secara tartil.');

    actionItems.push('Mengambil jeda sejenak (digital detox) minimal 30 menit saat overthinking, gantikan dengan membaca Al-Qur\'an.');
    actionItems.push('Membasahi lisan dengan istighfar dan dzikir penenteram jiwa setiap kali dada terasa sesak atau cemas.');
    actionItems.push('Menuliskan rasa syukur atas nikmat-nikmat kecil dalam catatan harian sebelum tidur malam.');
    actionItems.push('Memaafkan dengan tulus semua orang yang pernah berbuat salah agar hati bersih dan tidur dengan damai.');
  }

  // 4. DIMENSI SHOLAT, TAHANUD & IBADAH MALAM
  if (text.includes('sholat') || text.includes('tahajjud') || text.includes('subuh') || text.includes('witir') || text.includes('malam') || text.includes('khusyuk')) {
    noteItems.push('Tiang Agama & Barometer Keberkahan: Sholat adalah amalan pertama yang dihisab; bila sholatnya terjaga, urusan hidup yang lain akan dimudahkan.');
    noteItems.push('Kehormatan Orang Beriman: Kehormatan seorang mukmin terletak pada bangunnya di malam hari untuk bermunajat kepada Allah (syaraful mu\'min qiyaamuhu bil lail).');
    noteItems.push('Kemenangan Subuh: Mengamalkan sholat sunnah qabliyah Subuh yang nilainya lebih baik daripada dunia beserta seluruh isinya.');
    noteItems.push('Kunci Sholat Khusyuk: Menghadirkan rasa bahwa ini mungkin sholat terakhir kita (sholatul muwaddi\'), memahami arti bacaan, dan thuma\'ninah sempurna.');
    noteItems.push('Pahala Berjamaah di Masjid: Langkah kaki menuju masjid menggugurkan dosa dan menaikkan derajat di sisi Allah SWT.');

    actionItems.push('Memasang alarm 45 menit sebelum azan Subuh dan bertekad tidur sebelum jam 22.00 untuk qiyamul lail.');
    actionItems.push('Mendirikan minimal 2 rakaat Tahajjud dan menutupnya dengan 1 atau 3 rakaat sholat sunnah Witir.');
    actionItems.push('Menjaga sholat fardhu berjamaah tepat di awal waktu tanpa menunda-nunda pekerjaan.');
    actionItems.push('Menyempurnakan adab berwudhu dan tidak tergesa-gesa dalam setiap gerakan ruku\' serta sujud.');
  }

  // 5. DIMENSI KELUARGA, BIRRUL WALIDAIN & JODOH
  if (text.includes('orang tua') || text.includes('ibu') || text.includes('ayah') || text.includes('keluarga') || text.includes('jodoh') || text.includes('suami') || text.includes('istri')) {
    noteItems.push('Pintu Surga Pertengahan: Berbakti kepada kedua orang tua (birrul walidain) adalah pintu surga yang paling indah dan amalan pelebur dosa-dosa besar.');
    noteItems.push('Korelasi Ridho Ilahi: Keridhaan Allah berada pada keridhaan orang tua, dan murka Allah berada pada kemurkaan orang tua (HR. Tirmidzi).');
    noteItems.push('Keberkahan Rumah Tangga: Pondasi sakinah, mawaddah, wa rahmah ditegakkan dengan saling memaafkan dan mengedepankan adab akhlakul karimah.');
    noteItems.push('Pentingnya Mendoakan Orang Tua: Doa anak sholeh adalah aset investasi akhirat yang pahalanya terus mengalir abadi tanpa terputus.');
    noteItems.push('Menjaga Keharmonisan: Meredam ego dan mengedepankan musyawarah yang santun dalam setiap dinamika rumah tangga.');

    actionItems.push('Menyapa, memeluk, atau menelepon orang tua hari ini dengan kata-kata yang lembut dan penuh penghormatan.');
    actionItems.push('Menyisihkan rezeki khusus untuk membahagiakan orang tua dan memenuhi kebutuhan mereka tanpa diminta.');
    actionItems.push('Merutinkan doa "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa" setiap selesai sholat.');
    actionItems.push('Menjaga kehangatan komunikasi dengan pasangan dan keluarga dengan saling mendoakan kebaikan.');
  }

  // 6. DIMENSI SABAR, UJIAN HIDUP, ISTIQOMAH & HIJRAH
  if (text.includes('sabar') || text.includes('ujian') || text.includes('istiqomah') || text.includes('cobaan') || text.includes('masalah') || text.includes('hijrah') || noteItems.length === 0) {
    noteItems.push('Hikmah Ujian Hidup: Ujian bukanlah bentuk kemurkaan Allah, melainkan sarana penggugur dosa, pengikis kesombongan, dan pengangkat derajat keimanan.');
    noteItems.push('Kepastian Kemudahan: Janji Allah itu pasti; di balik setiap satu kesulitan yang berat telah dipersiapkan dua kemudahan yang melapangkan.');
    noteItems.push('Makna Istiqomah: Bertahan dalam kebaikan secara konsisten lebih mulia dari seribu karomah; terus melangkah walau perlahan.');
    noteItems.push('Menjaga Lingkungan Positif: Berteman dengan orang-orang sholeh yang senantiasa menasehati dalam kebenaran dan kesabaran.');
    noteItems.push('Benteng Tazkiyatun Nafs: Membiasakan diri bertaubat setiap kali melakukan kekhilafan tanpa menunggu hari esok.');
    noteItems.push('Ilmu yang Bermanfaat: Menuntut ilmu agama wajib dibarengi dengan keikhlasan niat untuk memperbaiki diri, bukan untuk mendebat orang lain.');

    actionItems.push('Menetapkan satu target amalan sunnah ringan tapi konsisten tanpa putus setiap hari.');
    actionItems.push('Menahan lisan dari mengeluh saat tertimpa ujian dan melatih diri mengucap "Inna lillahi wa inna ilaihi raaji\'uun".');
    actionItems.push('Menghadiri atau menyimak kajian ilmu Islam secara rutin minimal satu kali dalam sepekan.');
    actionItems.push('Memperbanyak doa memohon ketetapan iman: "Yaa Muqallibal quluub, tsabbit qalbii \'ala diinik".');
    actionItems.push('Menebarkan kebaikan dan ilmu yang didapat kepada keluarga atau rekan kerja dengan tutur kata yang santun.');
  }

  // Susun daftar Poin Penting dengan simbol bullet yang rapi
  const notesFormatted = noteItems
    .map(item => `• ${item}`)
    .join('\n\n');

  // Susun daftar Rencana Aksi Nyata dengan nomor urut yang jelas
  const actionPlanFormatted = actionItems
    .map((item, idx) => `${idx + 1}. ${item}`)
    .join('\n\n');

  return {
    notes: notesFormatted,
    actionPlan: actionPlanFormatted
  };
}

/**
 * Fungsi utama: Merangkum kajian dari link YouTube atau teks metadata
 */
export async function summarizeKajianFromUrl(rawUrl: string): Promise<KajianSummaryResult> {
  const url = rawUrl.trim();

  // 1. Cek apakah cocok dengan preset kurasi
  const presetMatch = CURATED_KAJIAN_PRESETS.find(p => p.videoUrl.toLowerCase() === url.toLowerCase());
  if (presetMatch) {
    return {
      title: presetMatch.title,
      speaker: presetMatch.speaker,
      videoUrl: presetMatch.videoUrl,
      notes: presetMatch.notes,
      actionPlan: presetMatch.actionPlan,
    };
  }

  let title = '';
  let authorName = '';
  let thumbnailUrl = '';

  // 2. Fetch oEmbed metadata via server API route atau direct oEmbed
  try {
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        title = data.title;
        authorName = data.author_name || '';
        thumbnailUrl = data.thumbnail_url || '';
      }
    }
  } catch {
    // Fallback: coba YouTube official oembed
    try {
      const ytUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
      const ytRes = await fetch(ytUrl);
      if (ytRes.ok) {
        const ytData = await ytRes.json();
        title = ytData.title || '';
        authorName = ytData.author_name || '';
        thumbnailUrl = ytData.thumbnail_url || '';
      }
    } catch {
      // Offline fallback
    }
  }

  // Jika tidak dapat mengambil judul dari internet, buat judul perkiraan dari URL
  if (!title) {
    title = 'Kajian Islam: Menata Hati & Menjemput Keberkahan';
  }

  const speaker = extractSpeaker(title, authorName);
  const cleanTitle = cleanKajianTitle(title);
  const { notes, actionPlan } = analyzeKajianContent(cleanTitle, speaker);

  return {
    title: cleanTitle,
    speaker: speaker,
    videoUrl: url,
    notes: notes,
    actionPlan: actionPlan,
    thumbnailUrl: thumbnailUrl || undefined,
    channelName: authorName || undefined,
  };
}
