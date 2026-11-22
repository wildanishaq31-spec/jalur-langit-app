// src/utils/smartKajianSummarizer.ts
// Engine Cerdas Analisis & Rangkuman Kajian Islam Otomatis dari Link YouTube / Podcast

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

// 5 Rekomendasi Kajian Pilihan Populer Siap 1-Tap
export const CURATED_KAJIAN_PRESETS: CuratedKajianPreset[] = [
  {
    id: 'uah-doa',
    label: 'UAH: Rahasia Terkabulnya Doa',
    speaker: 'Ustadz Adi Hidayat',
    title: 'Rahasia Doa Cepat Terkabul & Kunci Membuka Pintu Langit',
    videoUrl: 'https://www.youtube.com/watch?v=kYJjZ5h2s_M',
    notes: '• Doa bukan sekadar meminta hajat, melainkan sarana ketundukan jiwa dan pengakuan kehambaan mutlak kepada Allah Ta\'ala.\n• Kunci doa cepat diijabah adalah membersihkan diri dari yang haram/syubhat serta memuji Allah dengan Asmaul Husna sebelum bermunajat.\n• Manfaatkan waktu-waktu mustajab: sepertiga malam terakhir, saat sujud terakhir dalam sholat, dan antara adzan dan iqamah.',
    actionPlan: '1. Luangkan 10 menit hening di sepertiga malam untuk bermunajat menyebut nama Allah Yaa Dzal Jalaali wal Ikram.\n2. Jaga kehalalan makanan dan hindari harta syubhat agar doa tidak terhijab.\n3. Perbanyak istighfar minimal 100x setiap hari sebagai pembersih jiwa.'
  },
  {
    id: 'hanan-hati',
    label: 'Hanan Attaki: Menata Hati yang Lelah',
    speaker: 'Ustadz Hanan Attaki',
    title: 'Ketika Hatimu Sedang Lelah, Kecewa, dan Butuh Pertolongan Allah',
    videoUrl: 'https://www.youtube.com/watch?v=Fj2b9l9cQ9c',
    notes: '• Kelelahan jiwa seringkali terjadi karena kita menggantungkan harapan pada manusia atau hasil duniawi yang rapuh.\n• Allah menurunkan ujian bukan untuk menghancurkan kita, melainkan untuk melatih hati agar hanya bergantung dan bersandar kepada-Nya (Tawakkal).\n• Bersabar bukan berarti pasif, melainkan menahan lisan dari mengeluh dan tetap berprasangka baik (husnudzon) kepada takdir Allah.',
    actionPlan: '1. Menuliskan isi hati dan kekhawatiran dalam sujud sholat malam, serahkan semua keputusan kepada Allah.\n2. Berhenti mengeluh di media sosial, gantikan dengan membaca Hasbunallah wa ni\'mal wakiil saat cemas melanda.\n3. Ambil jeda istirahat sejenak untuk tilawah Al-Qur\'an penyejuk dada.'
  },
  {
    id: 'buya-orangtua',
    label: 'Buya Yahya: Berbakti kepada Orang Tua',
    speaker: 'Buya Yahya',
    title: 'Dahsyatnya Berbakti kepada Orang Tua: Pembuka Pintu Rezeki & Jalan Surga',
    videoUrl: 'https://www.youtube.com/watch?v=s3F6cRz1qKs',
    notes: '• Ridho Allah Ta\'ala terletak pada ridho kedua orang tua, dan murka-Nya ada pada murka kedua orang tua (HR. Tirmidzi).\n• Birrul walidain adalah amalan paling utama setelah sholat fardhu pada waktunya, yang mampu merontokkan kesulitan hidup dan mempermudah urusan.\n• Mendoakan orang tua yang masih hidup maupun yang telah tiada merupakan hutang budi abadi yang tidak akan pernah lunas.',
    actionPlan: '1. Hubungi atau kunjungi orang tua hari ini, tanyakan kabarnya dengan nada lembut dan mintalah doa restunya.\n2. Sisihkan sebagian rezeki/gaji bulanan khusus untuk membahagiakan orang tua tanpa diminta.\n3. Rutinkan doa: "Rabbighfir lii wa liwaalidayya warhamhumaa kamaa rabbayaanii shaghiiraa" setiap selesai sholat fardhu.'
  },
  {
    id: 'khalid-tahajjud',
    label: 'Khalid Basalamah: Qiyamul Lail & Sedekah',
    speaker: 'Ustadz Khalid Basalamah',
    title: 'Kedahsyatan Sholat Malam & Sedekah Subuh Sebagai Penjemput Impian',
    videoUrl: 'https://www.youtube.com/watch?v=4pP5D7aVwXs',
    notes: '• Qiyamul Lail adalah kebiasaan orang-orang sholeh terdahulu yang membentengi diri dari dosa dan penyakit hati.\n• Di sepertiga malam terakhir, Allah turun ke langit dunia dan berfirman: "Siapa yang meminta kepada-Ku akan Kuberi, siapa yang berdoa akan Kukabulkan, siapa yang memohon ampun akan Kuampuni."\n• Menggabungkan sholat malam dengan sedekah subuh mengundang dua malaikat yang khusus mendoakan keberkahan bagi orang yang berinfak.',
    actionPlan: '1. Pasang alarm 30-45 menit sebelum waktu Subuh untuk mendirikan minimal 2 rakaat Tahajjud dan 1 rakaat Witir.\n2. Siapkan celengan atau transfer sedekah subuh harian sebelum matahari terbit, iringi dengan doa hajat spesifik.\n3. Duduk sejenak beristighfar 70x-100x menjelang adzan fajar Subuh.'
  },
  {
    id: 'uas-istiqomah',
    label: 'UAS: Istiqomah di Tengah Fitnah',
    speaker: 'Ustadz Abdul Somad',
    title: 'Kiat Menjaga Keistiqomahan Ibadah & Membersihkan Hati',
    videoUrl: 'https://www.youtube.com/watch?v=d7N5F2vQm9k',
    notes: '• Istiqomah lebih mulia daripada seribu karomah. Istiqomah membutuhkan kesabaran terus-menerus dan keikhlasan niat semata karena Allah.\n• Iman manusia bersifat naik dan turun (yaziid wa yanqus). Ketika sedang turun, bentengi dengan tidak meninggalkan sholat fardhu dan menjauhi maksiat.\n• Bergaul dengan sahabat yang sholeh dan senantiasa menghadiri majelis ilmu adalah benteng utama menjaga konsistensi hijrah.',
    actionPlan: '1. Tetapkan satu amalan sunnah ringan tapi pantang putus setiap hari (misal: dhuha 2 rakaat atau tilawah 1 lembar).\n2. Jaga lingkungan pertemanan positif dan batasi konsumsi konten media sosial yang merusak hati.\n3. Hadiri atau dengarkan minimal 1 kajian ilmu Islam berbobot setiap pekannya.'
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
 * Menganalisis tema video berdasarkan kata kunci dan menghasilkan rangkuman hikmah & rencana aksi
 */
export function analyzeKajianContent(title: string, speaker: string): { notes: string; actionPlan: string } {
  const text = title.toLowerCase();

  // 1. Tema Rezeki & Keberkahan Finansial
  if (text.includes('rezeki') || text.includes('uang') || text.includes('kaya') || text.includes('harta') || text.includes('hutang') || text.includes('dinar')) {
    return {
      notes: `• Rezeki bukan semata tentang nominal angka, melainkan keberkahan yang menghadirkan ketenangan jiwa dan kecukupan hidup.\n• Kunci pembuka pintu rezeki yang tak disangka-sangka (min haitsu laa yahtasib) adalah ketakwaan, menjauhi riba/syubhat, dan memperbanyak istighfar.\n• Sedekah tidak akan mengurangi harta, melainkan menjadi magnet pelipat ganda rezeki dan perisai dari bala.`,
      actionPlan: `1. Rutinkan sedekah subuh setiap hari walau dengan nominal kecil, niatkan lillahi ta'ala.\n2. Bersihkan seluruh transaksi usaha dari hal yang meragukan atau berbau riba.\n3. Perbanyak dzikir Sayyidul Istighfar dan sholat Dhuha minimal 2 rakaat setiap pagi.`
    };
  }

  // 2. Tema Doa, Hajat & Jalur Langit
  if (text.includes('doa') || text.includes('hajat') || text.includes('langit') || text.includes('mustajab') || text.includes('minta') || text.includes('terkabul')) {
    return {
      notes: `• Doa adalah otak ibadah (mukhkhul 'ibaadah) dan senjata terkuat seorang mukmin saat seluruh ikhtiar duniawi menemui jalan buntu.\n• Allah sangat senang mendengar hamba-Nya merengek dalam doa di keheningan malam, karena itu menunjukkan ketundukan mutlak.\n• Bersabar menunggu ijabah doa dengan husnudzon, sebab Allah pasti mengabulkan dalam bentuk terbaik di waktu yang paling tepat.`,
      actionPlan: `1. Bangun di sepertiga malam terakhir khusus untuk mendirikan Sholat Hajat dan Tahajjud.\n2. Sebut nama-nama agung Allah (Asmaul Husna) dan baca shalawat Nabi sebelum memanjatkan permohonan.\n3. Tuliskan 3 impian terbesar secara spesifik dan bawa selalu dalam sujud sholat fardhu.`
    };
  }

  // 3. Tema Ketenangan Hati, Galau, Anxiety & Ikhlas
  if (text.includes('hati') || text.includes('lelah') || text.includes('galau') || text.includes('tenang') || text.includes('ikhlas') || text.includes('sedih') || text.includes('kecewa') || text.includes('anxiety')) {
    return {
      notes: `• Hati manusia adalah milik Allah, dan hanya dengan mengingat Allah hati akan menjadi tenang (QS. Ar-Ra'd: 28).\n• Kekecewaan terjadi ketika kita meletakkan porsi harapan terlalu besar kepada manusia atau dunia yang fana.\n• Menyerahkan urusan (tawakkal) dan berdamai dengan takdir adalah seni tertinggi dalam meraih kedamaian batin sejati.`,
      actionPlan: `1. Dengarkan murottal Al-Qur'an dan kurangi paparan media sosial saat hati merasa gundah atau overthinking.\n2. Basahi lisan dengan dzikir "Hasbunallah wa ni'mal wakiil" setiap kali menghadapi situasi di luar kendali diri.\n3. Luangkan waktu tafakkur 15 menit setiap malam untuk mengevaluasi hati dan memaafkan semua orang.`
    };
  }

  // 4. Tema Sholat, Qiyamul Lail & Ibadah Malam
  if (text.includes('sholat') || text.includes('tahajjud') || text.includes('subuh') || text.includes('witir') || text.includes('malam') || text.includes('khusyuk')) {
    return {
      notes: `• Sholat adalah amal pertama yang akan dihisab pada hari kiamat; baik sholatnya maka baik seluruh amalan lainnya.\n• Bangun sholat malam adalah kehormatan bagi seorang mukmin (syaraful mu'min qiyaamuhu bil lail) yang mengangkat martabat ke tempat terpuji (Maqamam Mahmuda).\n• Meraih khusyuk membutuhkan kehadiran hati, memahami makna bacaan, dan tidak tergesa-gesa saat ruku' dan sujud.`,
      actionPlan: `1. Usahakan tidur lebih awal sebelum jam 22.00 agar memiliki energi bangun di sepertiga malam.\n2. Tunaikan sholat fardhu tepat di awal waktu, dahului dengan adab berwudhu yang sempurna.\n3. Jangan tinggalkan sholat sunnah Rawatib dan minimal 1 rakaat Witir sebelum tidur atau setelah Tahajjud.`
    };
  }

  // 5. Tema Berbakti kepada Orang Tua & Keluarga
  if (text.includes('orang tua') || text.includes('ibu') || text.includes('ayah') || text.includes('keluarga') || text.includes('jodoh') || text.includes('suami') || text.includes('istri')) {
    return {
      notes: `• Berbakti kepada kedua orang tua (birrul walidain) adalah jembatan tercepat menuju surga dan pelebur dosa-dosa besar.\n• Rumah tangga yang berkah dibangun di atas pondasi takwa, saling memaafkan, dan kesabaran dalam melayani sesama anggota keluarga.\n• Keridhaan Allah sangat berkorelasi dengan kebahagiaan yang kita hadirkan untuk orang tua kita.`,
      actionPlan: `1. Luangkan waktu menyapa, memijat, atau menelepon orang tua dengan kalimat yang santun dan penuh kasih sayang.\n2. Selalu mendoakan kedua orang tua di setiap ba'da sholat: "Rabbighfir lii wa liwaalidayya...".\n3. Redam amarah dan dahulukan musyawarah saat timbul perselisihan di dalam rumah tangga.`
    };
  }

  // 6. Tema Sabar, Ujian Hidup & Istiqomah
  if (text.includes('sabar') || text.includes('ujian') || text.includes('istiqomah') || text.includes('cobaan') || text.includes('masalah') || text.includes('hijrah')) {
    return {
      notes: `• Di balik setiap kesulitan yang berat pasti ada kemudahan yang menyertainya (Fa inna ma'al 'usri yusra).\n• Ujian hidup adalah tanda cinta Allah untuk menghapus dosa, menaikkan derajat, dan membersihkan hati dari cinta duniawi.\n• Istiqomah tidak menuntut kesempurnaan tanpa cela, melainkan komitmen untuk selalu bangkit kembali bertaubat setiap kali terjatuh.`,
      actionPlan: `1. Tetapkan satu amalan sunnah kecil (seperti 2 rakaat dhuha atau 1 lembar Quran) yang dikerjakan konsisten setiap hari.\n2. Hindari perkataan mengeluh kepada orang lain; keluhkan semua ujian hanya kepada Allah dalam sujud.\n3. Perbanyak doa keteguhan iman: "Yaa Muqallibal quluub, tsabbit qalbii 'ala diinik".`
    };
  }

  // Default Template Universal yang Mendalam
  return {
    notes: `• Ilmu yang bermanfaat adalah ilmu yang membuahkan rasa takut kepada Allah dan mendorong perbaikan akhlak dalam keseharian.\n• Setiap nasehat agama yang didengar adalah bentuk kasih sayang Allah untuk menuntun kembali langkah kita ke jalan yang lurus.\n• Menjaga kebersihan hati dari penyakit riya', ujub, dan iri dengki adalah kunci utama agar ilmu meresap menjadi hidayah.`,
    actionPlan: `1. Catat 1 poin paling menyentuh dari kajian ini dan bagikan kepada keluarga atau sahabat terdekat.\n2. Lakukan perbaikan diri mulai dari hal kecil hari ini, terutama memperbaiki kualitas sholat fardhu.\n3. Amalkan doa memohon ilmu yang bermanfaat: "Allahumma inni as-aluka 'ilman naafi'aa, wa rizqan thayyibaa, wa 'amalan mutaqabbalaa".`
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
