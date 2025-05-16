import { firebaseService } from '../services/firebase';

export const sampleQuestions = {
  Coğrafya: [
    {
      category: 'Coğrafya',
      question: 'Türkiye\'nin en yüksek dağı hangisidir?',
      options: ['Ağrı Dağı', 'Erciyes Dağı', 'Uludağ', 'Palandöken Dağı'],
      correctAnswer: 'Ağrı Dağı',
      difficulty: 'Kolay',
      explanation: 'Ağrı Dağı, 5.137 metre yüksekliğiyle Türkiye\'nin en yüksek dağıdır.'
    },
    {
      category: 'Coğrafya',
      question: 'Hangi göl Türkiye\'nin en büyük gölüdür?',
      options: ['Van Gölü', 'Tuz Gölü', 'İznik Gölü', 'Beyşehir Gölü'],
      correctAnswer: 'Van Gölü',
      difficulty: 'Orta',
      explanation: 'Van Gölü, 3.713 km² yüzölçümüyle Türkiye\'nin en büyük gölüdür.'
    },
    {
      category: 'Coğrafya',
      question: 'Türkiye\'nin en uzun nehri hangisidir?',
      options: ['Kızılırmak', 'Fırat', 'Sakarya', 'Yeşilırmak'],
      correctAnswer: 'Kızılırmak',
      difficulty: 'Zor',
      explanation: 'Kızılırmak, 1.355 km uzunluğuyla Türkiye\'nin en uzun nehridir.'
    }
  ],
  Kimya: [
    {
      category: 'Kimya',
      question: 'Periyodik tabloda kaç element bulunur?',
      options: ['118', '120', '116', '122'],
      correctAnswer: '118',
      difficulty: 'Kolay',
      explanation: 'Periyodik tabloda 118 element bulunmaktadır.'
    },
    {
      category: 'Kimya',
      question: 'Hangi element periyodik tabloda "Fe" sembolü ile gösterilir?',
      options: ['Demir', 'Fosfor', 'Flor', 'Fermiyum'],
      correctAnswer: 'Demir',
      difficulty: 'Orta',
      explanation: 'Fe, Demir elementinin kimyasal sembolüdür.'
    },
    {
      category: 'Kimya',
      question: 'Suyun kimyasal formülü nedir?',
      options: ['H2O', 'CO2', 'O2', 'N2'],
      correctAnswer: 'H2O',
      difficulty: 'Zor',
      explanation: 'Su, iki hidrojen ve bir oksijen atomundan oluşur ve formülü H2O\'dur.'
    }
  ],
  Bilim: [
    {
      category: 'Bilim',
      question: 'DNA\'nın açılımı nedir?',
      options: ['Deoksiribo Nükleik Asit', 'Diribo Nükleik Asit', 'Deoksiribo Nitrik Asit', 'Diribo Nitrik Asit'],
      correctAnswer: 'Deoksiribo Nükleik Asit',
      difficulty: 'Kolay',
      explanation: 'DNA, Deoksiribo Nükleik Asit\'in kısaltmasıdır.'
    },
    {
      category: 'Bilim',
      question: 'Işık bir yılda kaç kilometre yol alır?',
      options: ['9.46 trilyon km', '8.46 trilyon km', '7.46 trilyon km', '6.46 trilyon km'],
      correctAnswer: '9.46 trilyon km',
      difficulty: 'Orta',
      explanation: 'Işık bir yılda yaklaşık 9.46 trilyon kilometre yol alır.'
    },
    {
      category: 'Bilim',
      question: 'Hangi gezegen Güneş Sisteminin en büyük gezegenidir?',
      options: ['Jüpiter', 'Satürn', 'Mars', 'Venüs'],
      correctAnswer: 'Jüpiter',
      difficulty: 'Zor',
      explanation: 'Jüpiter, Güneş Sisteminin en büyük gezegenidir.'
    }
  ],
  Günlük: [
    {
      category: 'Günlük',
      question: 'Bir günde kaç saat vardır?',
      options: ['24', '20', '22', '26'],
      correctAnswer: '24',
      difficulty: 'Kolay',
      explanation: 'Bir günde 24 saat vardır.'
    },
    {
      category: 'Günlük',
      question: 'Hangi mevsimde günler en uzundur?',
      options: ['Yaz', 'Kış', 'İlkbahar', 'Sonbahar'],
      correctAnswer: 'Yaz',
      difficulty: 'Orta',
      explanation: 'Yaz mevsiminde günler en uzun olur.'
    },
    {
      category: 'Günlük',
      question: 'Bir yılda kaç ay vardır?',
      options: ['12', '10', '14', '16'],
      correctAnswer: '12',
      difficulty: 'Zor',
      explanation: 'Bir yılda 12 ay vardır.'
    }
  ],
  Spor: [
    {
      category: 'Spor',
      question: 'Bir futbol maçı kaç dakika sürer?',
      options: ['90', '80', '100', '110'],
      correctAnswer: '90',
      difficulty: 'Kolay',
      explanation: 'Bir futbol maçı 90 dakika sürer.'
    },
    {
      category: 'Spor',
      question: 'Basketbolda bir takımda kaç oyuncu sahada bulunur?',
      options: ['5', '4', '6', '7'],
      correctAnswer: '5',
      difficulty: 'Orta',
      explanation: 'Basketbolda her takımda 5 oyuncu sahada bulunur.'
    },
    {
      category: 'Spor',
      question: 'Voleybolda bir takımda kaç oyuncu sahada bulunur?',
      options: ['6', '5', '7', '8'],
      correctAnswer: '6',
      difficulty: 'Zor',
      explanation: 'Voleybolda her takımda 6 oyuncu sahada bulunur.'
    }
  ],
  Tarih: [
    {
      category: 'Tarih',
      question: 'İstanbul\'un fethi kaç yılında gerçekleşmiştir?',
      options: ['1453', '1454', '1452', '1455'],
      correctAnswer: '1453',
      difficulty: 'Kolay',
      explanation: 'İstanbul\'un fethi 1453 yılında gerçekleşmiştir.'
    },
    {
      category: 'Tarih',
      question: 'Amerika\'yı ilk keşfeden Viking kaşifi kimdir?',
      options: ['Leif Erikson', 'Erik the Red', 'Bjarni Herjólfsson', 'Thorfinn Karlsefni'],
      correctAnswer: 'Leif Erikson',
      difficulty: 'Orta',
      explanation: 'Leif Erikson, Amerika\'yı ilk keşfeden Viking kaşifidir.'
    },
    {
      category: 'Tarih',
      question: 'Fransız İhtilali hangi yılda gerçekleşmiştir?',
      options: ['1789', '1790', '1788', '1791'],
      correctAnswer: '1789',
      difficulty: 'Zor',
      explanation: 'Fransız İhtilali 1789 yılında gerçekleşmiştir.'
    }
  ],
  Atasözleri: [
    {
      category: 'Atasözleri',
      question: '"Ağaç yaşken eğilir" atasözünün anlamı nedir?',
      options: ['İnsanlar küçükken eğitilmelidir', 'Ağaçlar gençken eğilir', 'Yaşlı ağaçlar eğilmez', 'Ağaçlar her zaman eğilir'],
      correctAnswer: 'İnsanlar küçükken eğitilmelidir',
      difficulty: 'Kolay',
      explanation: 'Bu atasözü, insanların küçük yaşta eğitilmesi gerektiğini anlatır.'
    },
    {
      category: 'Atasözleri',
      question: '"Damlaya damlaya göl olur" atasözünün anlamı nedir?',
      options: ['Küçük birikimler zamanla büyük sonuçlar doğurur', 'Su damlaları göl oluşturur', 'Yağmur damlaları göl olur', 'Damlalar birleşerek göl olur'],
      correctAnswer: 'Küçük birikimler zamanla büyük sonuçlar doğurur',
      difficulty: 'Orta',
      explanation: 'Bu atasözü, küçük birikimlerin zamanla büyük sonuçlar doğurabileceğini anlatır.'
    },
    {
      category: 'Atasözleri',
      question: '"Sakla samanı, gelir zamanı" atasözünün anlamı nedir?',
      options: ['Her şeyin bir zamanı vardır', 'Saman saklanmalıdır', 'Zaman her şeyi getirir', 'Saman zamanla gelir'],
      correctAnswer: 'Her şeyin bir zamanı vardır',
      difficulty: 'Zor',
      explanation: 'Bu atasözü, her şeyin kendine uygun bir zamanı olduğunu anlatır.'
    }
  ],
  Oyunlar: [
    {
      category: 'Oyunlar',
      question: 'Satrançta kaç taş vardır?',
      options: ['32', '30', '34', '36'],
      correctAnswer: '32',
      difficulty: 'Kolay',
      explanation: 'Satrançta toplam 32 taş vardır.'
    },
    {
      category: 'Oyunlar',
      question: 'Scrabble\'da kaç harf vardır?',
      options: ['100', '90', '110', '120'],
      correctAnswer: '100',
      difficulty: 'Orta',
      explanation: 'Scrabble\'da toplam 100 harf vardır.'
    },
    {
      category: 'Oyunlar',
      question: 'Monopoly\'de kaç tane mülk vardır?',
      options: ['28', '26', '30', '32'],
      correctAnswer: '28',
      difficulty: 'Zor',
      explanation: 'Monopoly\'de toplam 28 mülk vardır.'
    }
  ],
  Yeşilçam: [
    {
      category: 'Yeşilçam',
      question: 'Hangi oyuncu "Hababam Sınıfı" filminde "Bacaksız" karakterini canlandırmıştır?',
      options: ['Kemal Sunal', 'Şener Şen', 'Halit Akçatepe', 'Tuncel Kurtiz'],
      correctAnswer: 'Kemal Sunal',
      difficulty: 'Kolay',
      explanation: 'Kemal Sunal, "Hababam Sınıfı" filminde "Bacaksız" karakterini canlandırmıştır.'
    },
    {
      category: 'Yeşilçam',
      question: 'Hangi film Türk sinemasının ilk renkli filmidir?',
      options: ['Halıcı Kız', 'Yılanların Öcü', 'Susuz Yaz', 'Selvi Boylum Al Yazmalım'],
      correctAnswer: 'Halıcı Kız',
      difficulty: 'Orta',
      explanation: 'Halıcı Kız, Türk sinemasının ilk renkli filmidir.'
    },
    {
      category: 'Yeşilçam',
      question: 'Hangi oyuncu "Tosun Paşa" filminde "Tosun Paşa" karakterini canlandırmıştır?',
      options: ['Kemal Sunal', 'Şener Şen', 'Halit Akçatepe', 'Tuncel Kurtiz'],
      correctAnswer: 'Kemal Sunal',
      difficulty: 'Zor',
      explanation: 'Kemal Sunal, "Tosun Paşa" filminde "Tosun Paşa" karakterini canlandırmıştır.'
    }
  ]
};

// Örnek soruları yükle
export const loadInitialData = async () => {
  try {
    console.log('Örnek sorular yükleniyor...');
    const success = await firebaseService.loadInitialData();
    return success;
  } catch (error) {
    console.error('Örnek veri yükleme hatası:', error);
    return false;
  }
}; 