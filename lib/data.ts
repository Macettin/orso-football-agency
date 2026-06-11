import type {Locale} from '@/i18n/routing';

type Localized = Record<Locale, string>;

export type Player = {
  id?: string;
  slug: string;
  name: string;
  initials: string;
  position: Localized;
  nationality: Localized;
  age: number;
  club: string;
  height: string;
  foot: Localized;
  contract: Localized;
  bio: Localized;
  strengths: Localized[];
  career: {years: string; club: string; detail: Localized}[];
  tone: string;
  photoUrl?: string | null;
  transfermarktUrl?: string | null;
  videoUrl?: string | null;
  isFeatured?: boolean;
  isPublished?: boolean;
};

export const players: Player[] = [
  {
    slug: 'kaan-demir',
    name: 'Kaan Demir',
    initials: 'KD',
    position: {en: 'Centre Forward', tr: 'Santrfor', ru: 'Центральный нападающий', ar: 'مهاجم صريح'},
    nationality: {en: 'Türkiye', tr: 'Türkiye', ru: 'Турция', ar: 'تركيا'},
    age: 23,
    club: 'Anatolia SK',
    height: '1.87 m',
    foot: {en: 'Right', tr: 'Sağ', ru: 'Правая', ar: 'اليمنى'},
    contract: {en: 'June 2027', tr: 'Haziran 2027', ru: 'Июнь 2027', ar: 'يونيو 2027'},
    bio: {
      en: 'A mobile number nine with strong penalty-area instincts, intelligent pressing and the physical profile to lead the line.',
      tr: 'Ceza sahası sezgisi, akıllı presi ve hücum hattını taşıyabilecek fiziksel profiliyle hareketli bir santrfor.',
      ru: 'Мобильный форвард с отличным чувством штрафной, умным прессингом и физикой для игры на острие.',
      ar: 'مهاجم متحرك بحدس قوي داخل منطقة الجزاء وضغط ذكي وقدرة بدنية لقيادة الخط الأمامي.'
    },
    strengths: [
      {en: 'Finishing', tr: 'Bitiricilik', ru: 'Завершение атак', ar: 'إنهاء الهجمات'},
      {en: 'Hold-up play', tr: 'Top saklama', ru: 'Игра корпусом', ar: 'الاحتفاظ بالكرة'},
      {en: 'Pressing', tr: 'Pres', ru: 'Прессинг', ar: 'الضغط'},
      {en: 'Aerial threat', tr: 'Hava hakimiyeti', ru: 'Игра в воздухе', ar: 'القوة الهوائية'}
    ],
    career: [
      {years: '2024–', club: 'Anatolia SK', detail: {en: 'Senior team', tr: 'A takım', ru: 'Основная команда', ar: 'الفريق الأول'}},
      {years: '2022–2024', club: 'Bosphorus FK', detail: {en: 'First professional contract', tr: 'İlk profesyonel sözleşme', ru: 'Первый профессиональный контракт', ar: 'أول عقد احترافي'}},
      {years: '2018–2022', club: 'Bosphorus Academy', detail: {en: 'Academy development', tr: 'Akademi gelişimi', ru: 'Подготовка в академии', ar: 'التطور في الأكاديمية'}}
    ],
    tone: 'from-blue-500/35 via-blue-950 to-slate-950'
  },
  {
    slug: 'marko-petrovic',
    name: 'Marko Petrović',
    initials: 'MP',
    position: {en: 'Central Midfielder', tr: 'Merkez Orta Saha', ru: 'Центральный полузащитник', ar: 'لاعب وسط مركزي'},
    nationality: {en: 'Serbia', tr: 'Sırbistan', ru: 'Сербия', ar: 'صربيا'},
    age: 25,
    club: 'FK Dunav',
    height: '1.82 m',
    foot: {en: 'Both', tr: 'Her ikisi', ru: 'Обе', ar: 'كلتا القدمين'},
    contract: {en: 'June 2026', tr: 'Haziran 2026', ru: 'Июнь 2026', ar: 'يونيو 2026'},
    bio: {
      en: 'A composed two-way midfielder who controls tempo, progresses possession and reads transitions early.',
      tr: 'Oyunun temposunu yöneten, topu ileri taşıyan ve geçişleri erken okuyan soğukkanlı iki yönlü orta saha.',
      ru: 'Хладнокровный универсальный полузащитник, управляющий темпом и качественно продвигающий мяч.',
      ar: 'لاعب وسط متوازن يتحكم في الإيقاع ويتقدم بالاستحواذ ويقرأ التحولات مبكراً.'
    },
    strengths: [
      {en: 'Game intelligence', tr: 'Oyun zekâsı', ru: 'Игровой интеллект', ar: 'الذكاء التكتيكي'},
      {en: 'Progressive passing', tr: 'İleri pas', ru: 'Продвигающие передачи', ar: 'التمرير التقدمي'},
      {en: 'Ball recovery', tr: 'Top kazanma', ru: 'Отбор мяча', ar: 'استعادة الكرة'},
      {en: 'Set pieces', tr: 'Duran toplar', ru: 'Стандарты', ar: 'الكرات الثابتة'}
    ],
    career: [
      {years: '2023–', club: 'FK Dunav', detail: {en: 'First team', tr: 'A takım', ru: 'Основная команда', ar: 'الفريق الأول'}},
      {years: '2020–2023', club: 'Radnik 1922', detail: {en: 'Senior football', tr: 'Profesyonel takım', ru: 'Профессиональный футбол', ar: 'كرة القدم الاحترافية'}},
      {years: '2016–2020', club: 'Vojvodina Youth', detail: {en: 'Youth development', tr: 'Gençlik gelişimi', ru: 'Молодёжная подготовка', ar: 'مرحلة الشباب'}}
    ],
    tone: 'from-blue-500/30 via-blue-950 to-slate-950'
  },
  {
    slug: 'omar-al-hassan',
    name: 'Omar Al-Hassan',
    initials: 'OH',
    position: {en: 'Left Winger', tr: 'Sol Kanat', ru: 'Левый вингер', ar: 'جناح أيسر'},
    nationality: {en: 'Jordan', tr: 'Ürdün', ru: 'Иордания', ar: 'الأردن'},
    age: 21,
    club: 'Al Qimma SC',
    height: '1.78 m',
    foot: {en: 'Right', tr: 'Sağ', ru: 'Правая', ar: 'اليمنى'},
    contract: {en: 'May 2027', tr: 'Mayıs 2027', ru: 'Май 2027', ar: 'مايو 2027'},
    bio: {
      en: 'An explosive wide forward who attacks space with confidence and creates separation in one-versus-one situations.',
      tr: 'Alanı özgüvenle kullanan ve bire bir pozisyonlarda fark yaratan patlayıcı bir kanat forvet.',
      ru: 'Взрывной крайний нападающий, уверенно атакующий пространство и сильный в игре один в один.',
      ar: 'جناح هجومي سريع يهاجم المساحات بثقة ويصنع الفارق في المواجهات الفردية.'
    },
    strengths: [
      {en: 'Acceleration', tr: 'Hızlanma', ru: 'Ускорение', ar: 'التسارع'},
      {en: 'One versus one', tr: 'Bire bir', ru: 'Один в один', ar: 'المواجهات الفردية'},
      {en: 'Chance creation', tr: 'Pozisyon üretme', ru: 'Создание моментов', ar: 'صناعة الفرص'},
      {en: 'Counter attacks', tr: 'Kontra atak', ru: 'Контратаки', ar: 'الهجمات المرتدة'}
    ],
    career: [
      {years: '2024–', club: 'Al Qimma SC', detail: {en: 'First team', tr: 'A takım', ru: 'Основная команда', ar: 'الفريق الأول'}},
      {years: '2022–2024', club: 'Amman Stars', detail: {en: 'Breakthrough seasons', tr: 'Çıkış sezonları', ru: 'Прорывные сезоны', ar: 'مواسم التألق'}},
      {years: '2018–2022', club: 'Amman Academy', detail: {en: 'Academy', tr: 'Akademi', ru: 'Академия', ar: 'الأكاديمية'}}
    ],
    tone: 'from-emerald-500/30 via-emerald-950 to-slate-950'
  },
  {
    slug: 'alexei-volkov',
    name: 'Alexei Volkov',
    initials: 'AV',
    position: {en: 'Goalkeeper', tr: 'Kaleci', ru: 'Вратарь', ar: 'حارس مرمى'},
    nationality: {en: 'Russia', tr: 'Rusya', ru: 'Россия', ar: 'روسيا'},
    age: 27,
    club: 'FC North',
    height: '1.93 m',
    foot: {en: 'Right', tr: 'Sağ', ru: 'Правая', ar: 'اليمنى'},
    contract: {en: 'December 2026', tr: 'Aralık 2026', ru: 'Декабрь 2026', ar: 'ديسمبر 2026'},
    bio: {
      en: 'A commanding modern goalkeeper with excellent reach, calm distribution and confident box management.',
      tr: 'Üstün erişim, sakin oyun kurma ve ceza sahası hakimiyetine sahip modern bir kaleci.',
      ru: 'Современный уверенный вратарь с отличной реакцией, спокойным пасом и контролем штрафной.',
      ar: 'حارس مرمى عصري قوي يتميز بالوصول الممتاز والتمرير الهادئ والسيطرة على منطقة الجزاء.'
    },
    strengths: [
      {en: 'Shot stopping', tr: 'Şut kurtarma', ru: 'Отражение ударов', ar: 'التصدي للتسديدات'},
      {en: 'Distribution', tr: 'Oyun kurma', ru: 'Игра ногами', ar: 'بناء اللعب'},
      {en: 'Cross claiming', tr: 'Yan top hakimiyeti', ru: 'Игра на выходах', ar: 'التعامل مع العرضيات'},
      {en: 'Leadership', tr: 'Liderlik', ru: 'Лидерство', ar: 'القيادة'}
    ],
    career: [
      {years: '2022–', club: 'FC North', detail: {en: 'Starting goalkeeper', tr: 'Birinci kaleci', ru: 'Основной вратарь', ar: 'الحارس الأساسي'}},
      {years: '2019–2022', club: 'Baltika City', detail: {en: 'Senior squad', tr: 'A takım kadrosu', ru: 'Основной состав', ar: 'الفريق الأول'}},
      {years: '2014–2019', club: 'North Academy', detail: {en: 'Academy', tr: 'Akademi', ru: 'Академия', ar: 'الأكاديمية'}}
    ],
    tone: 'from-violet-500/30 via-violet-950 to-slate-950'
  }
];

export const markets = ['Europe', 'Türkiye', 'Balkans', 'Middle East', 'Japan', 'International'];

export const transfers = [
  {player: 'Kaan Demir', from: 'Bosphorus FK', to: 'Anatolia SK', season: '2024/25', type: 'Permanent'},
  {player: 'Omar Al-Hassan', from: 'Amman Stars', to: 'Al Qimma SC', season: '2024/25', type: 'Permanent'},
  {player: 'Emir Kaya', from: 'Marmara Academy', to: 'NK Adriatic', season: '2023/24', type: 'Development'},
  {player: 'Stefan Ilić', from: 'FK Unity', to: 'Central Europe FC', season: '2023/24', type: 'Loan'}
];

export const newsItems = [
  {
    date: '28.05.2026',
    category: 'Transfer',
    title: {
      en: 'Orso expands its club network in Central Europe',
      tr: 'Orso, Orta Avrupa kulüp ağını genişletiyor',
      ru: 'Orso расширяет клубную сеть в Центральной Европе',
      ar: 'Orso توسع شبكة أنديتها في أوروبا الوسطى'
    },
    excerpt: {
      en: 'New relationships create stronger pathways for senior and development players.',
      tr: 'Yeni ilişkiler, profesyonel ve gelişim oyuncuları için daha güçlü yollar oluşturuyor.',
      ru: 'Новые партнёрства открывают больше возможностей для взрослых и молодых игроков.',
      ar: 'علاقات جديدة تفتح مسارات أقوى للاعبين المحترفين والواعدين.'
    }
  },
  {
    date: '11.04.2026',
    category: 'Agency',
    title: {
      en: 'A closer look at responsible young player representation',
      tr: 'Sorumlu genç oyuncu temsiline yakından bakış',
      ru: 'Ответственный подход к представлению молодых игроков',
      ar: 'نظرة أقرب إلى التمثيل المسؤول للاعبين الشباب'
    },
    excerpt: {
      en: 'Why patience, education and the right sporting environment matter more than early headlines.',
      tr: 'Sabır, eğitim ve doğru sportif ortam neden erken manşetlerden daha önemlidir?',
      ru: 'Почему терпение, образование и правильная среда важнее ранней известности.',
      ar: 'لماذا الصبر والتعليم والبيئة الرياضية الصحيحة أهم من الشهرة المبكرة.'
    }
  },
  {
    date: '19.02.2026',
    category: 'Market',
    title: {
      en: 'Japan and Türkiye: two markets with growing potential',
      tr: 'Japonya ve Türkiye: Potansiyeli büyüyen iki pazar',
      ru: 'Япония и Турция: два растущих рынка',
      ar: 'اليابان وتركيا: سوقان بإمكانات متنامية'
    },
    excerpt: {
      en: 'Sporting culture, player profiles and the value of carefully matched opportunities.',
      tr: 'Sportif kültür, oyuncu profilleri ve doğru eşleştirilmiş fırsatların değeri.',
      ru: 'Спортивная культура, профили игроков и ценность точного подбора возможностей.',
      ar: 'الثقافة الرياضية وملفات اللاعبين وقيمة الفرص المختارة بعناية.'
    }
  }
];

export const coaches = [
  {
    name: 'Murat Aydın',
    role: {en: 'UEFA Pro Head Coach', tr: 'UEFA Pro Teknik Direktör', ru: 'Главный тренер UEFA Pro', ar: 'مدرب رئيسي UEFA Pro'},
    expertise: {en: 'Game model, youth integration, leadership', tr: 'Oyun modeli, genç entegrasyonu, liderlik', ru: 'Игровая модель, развитие молодёжи, лидерство', ar: 'نموذج اللعب، دمج الشباب، القيادة'}
  },
  {
    name: 'Nikola Jovanović',
    role: {en: 'First Team Assistant', tr: 'A Takım Yardımcı Antrenörü', ru: 'Ассистент главного тренера', ar: 'مساعد مدرب الفريق الأول'},
    expertise: {en: 'Opposition analysis, set plays, training design', tr: 'Rakip analizi, duran toplar, antrenman tasarımı', ru: 'Анализ соперника, стандарты, тренировочный процесс', ar: 'تحليل الخصم، الكرات الثابتة، تصميم التدريب'}
  },
  {
    name: 'Samir Haddad',
    role: {en: 'Performance Coach', tr: 'Performans Antrenörü', ru: 'Тренер по физподготовке', ar: 'مدرب أداء'},
    expertise: {en: 'Physical periodisation, return to play, monitoring', tr: 'Fiziksel periyodizasyon, sahaya dönüş, takip', ru: 'Периодизация, восстановление, мониторинг', ar: 'التخطيط البدني، العودة للعب، المراقبة'}
  }
];
