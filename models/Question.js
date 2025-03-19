// Soru şeması örneği
const questionSchema = {
  id: 'string', // Benzersiz soru ID'si
  category: 'string', // Soru kategorisi (örn: 'Coğrafya', 'Tarih' vs.)
  question: 'string', // Soru metni
  options: [
    {
      id: 'string',
      text: 'string',
      isCorrect: 'boolean'
    }
  ],
  difficulty: 'number', // Zorluk seviyesi (1-5)
  explanation: 'string', // Doğru cevabın açıklaması
  created_at: 'timestamp',
  updated_at: 'timestamp'
};

// Örnek soru verisi
const questions = [
    {
      category: 'Kimya',
      question: 'Hangi elementin sembolü "O"dur?',
      options: [
        { id: 'a', text: 'Oksijen', isCorrect: true },
        { id: 'b', text: 'Ozon', isCorrect: false },
        { id: 'c', text: 'Osmiyum', isCorrect: false },
        { id: 'd', text: 'Oganeson', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Oksijen, atom numarası 8 olan bir elementtir ve sembolü "O"dur.'
    },
    {
      category: 'Kimya',
      question: 'Hangi asit suda çözündüğünde asidik özellik gösterir?',
      options: [
        { id: 'a', text: 'HCl', isCorrect: true },
        { id: 'b', text: 'NaOH', isCorrect: false },
        { id: 'c', text: 'NaCl', isCorrect: false },
        { id: 'd', text: 'H2O', isCorrect: false }
      ],
      difficulty: 2,
      explanation: 'HCl (Hidroklorik Asit), suda çözündüğünde asidik özellik gösterir.'
    },
    {
      category: 'Kimya',
      question: 'Periodik tabloda "Fe" sembolü hangi elemente aittir?',
      options: [
        { id: 'a', text: 'Demir', isCorrect: true },
        { id: 'b', text: 'Flor', isCorrect: false },
        { id: 'c', text: 'Fosfor', isCorrect: false },
        { id: 'd', text: 'Framiyum', isCorrect: false }
      ],
      difficulty: 1,
      explanation: '"Fe" sembolü, demir elementine aittir.'
    },
    {
      category: 'Kimya',
      question: 'Su molekülünün kimyasal formülü nedir?',
      options: [
        { id: 'a', text: 'H2O', isCorrect: true },
        { id: 'b', text: 'H2O2', isCorrect: false },
        { id: 'c', text: 'O2', isCorrect: false },
        { id: 'd', text: 'CO2', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Su molekülü H2O formülüne sahiptir.'
    },
    {
      category: 'Kimya',
      question: 'Hangi elementin atom numarası 1\'dir?',
      options: [
        { id: 'a', text: 'Hidrojen', isCorrect: true },
        { id: 'b', text: 'Helyum', isCorrect: false },
        { id: 'c', text: 'Lityum', isCorrect: false },
        { id: 'd', text: 'Berilyum', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Hidrojen, atom numarası 1 olan ilk elementtir.'
    },
  
    {
      category: 'Bilim',
      question: 'Işığın hızının en yüksek olduğu ortam nedir?',
      options: [
        { id: 'a', text: 'Vakum', isCorrect: true },
        { id: 'b', text: 'Su', isCorrect: false },
        { id: 'c', text: 'Hava', isCorrect: false },
        { id: 'd', text: 'Cam', isCorrect: false }
      ],
      difficulty: 3,
      explanation: 'Işık, vakumda en yüksek hızda hareket eder, saatte 299.792.458 kilometre hızla.'
    },
    {
      category: 'Bilim',
      question: 'Evrenin yaşı tahminen ne kadar yıldır?',
      options: [
        { id: 'a', text: '13.8 milyar yıl', isCorrect: true },
        { id: 'b', text: '4.5 milyar yıl', isCorrect: false },
        { id: 'c', text: '10 milyon yıl', isCorrect: false },
        { id: 'd', text: '20 milyar yıl', isCorrect: false }
      ],
      difficulty: 3,
      explanation: 'Evrenin yaşı, yapılan hesaplamalarla yaklaşık 13.8 milyar yıl olarak tahmin edilmektedir.'
    },
    {
      category: 'Bilim',
      question: 'Hangi gezegen Güneş Sistemi\'nde en büyük gezegendir?',
      options: [
        { id: 'a', text: 'Jüpiter', isCorrect: true },
        { id: 'b', text: 'Mars', isCorrect: false },
        { id: 'c', text: 'Venüs', isCorrect: false },
        { id: 'd', text: 'Uranüs', isCorrect: false }
      ],
      difficulty: 2,
      explanation: 'Jüpiter, Güneş Sistemi\'ndeki en büyük gezegendir.'
    },
    {
      category: 'Bilim',
      question: 'Hangi gezegen Güneş\'e en yakın olan gezegendir?',
      options: [
        { id: 'a', text: 'Merkür', isCorrect: true },
        { id: 'b', text: 'Venüs', isCorrect: false },
        { id: 'c', text: 'Dünya', isCorrect: false },
        { id: 'd', text: 'Mars', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Merkür, Güneş\'e en yakın gezegen olup, ortalama 57 milyon kilometre uzaklıktadır.'
    },
    {
      category: 'Bilim',
      question: 'Dünya\'nın çekirdeği hangi maddelerden oluşur?',
      options: [
        { id: 'a', text: 'Demir ve Nikel', isCorrect: true },
        { id: 'b', text: 'Alüminyum ve Magnezyum', isCorrect: false },
        { id: 'c', text: 'Karbon ve Kükürt', isCorrect: false },
        { id: 'd', text: 'Oksijen ve Silikon', isCorrect: false }
      ],
      difficulty: 2,
      explanation: 'Dünya\'nın çekirdeği büyük ölçüde demir ve nikelden oluşur.'
    },
  
    {
      category: 'Spor',
      question: 'Hangi ülke 2020 Tokyo Olimpiyatları\'nda en çok altın madalya kazandı?',
      options: [
        { id: 'a', text: 'Amerika Birleşik Devletleri', isCorrect: true },
        { id: 'b', text: 'Çin', isCorrect: false },
        { id: 'c', text: 'Japonya', isCorrect: false },
        { id: 'd', text: 'Rusya', isCorrect: false }
      ],
      difficulty: 3,
      explanation: 'ABD, 2020 Tokyo Olimpiyatları\'nda en çok altın madalya kazanan ülke oldu.'
    },
    {
      category: 'Spor',
      question: 'Futbolun "Efsane 10 numarası" olarak bilinen oyuncu kimdir?',
      options: [
        { id: 'a', text: 'Diego Maradona', isCorrect: true },
        { id: 'b', text: 'Lionel Messi', isCorrect: false },
        { id: 'c', text: 'Cristiano Ronaldo', isCorrect: false },
        { id: 'd', text: 'Zinedine Zidane', isCorrect: false }
      ],
      difficulty: 2,
      explanation: 'Diego Maradona, futbol dünyasında "Efsane 10 numarası" olarak bilinen ve Arjantin\'in futbol kahramanı olan bir oyuncudur.'
    },
    {
      category: 'Spor',
      question: 'Basketbolun en yüksek sayısına ulaşmak için kaç sayı gerekir?',
      options: [
        { id: 'a', text: '3', isCorrect: true },
        { id: 'b', text: '2', isCorrect: false },
        { id: 'c', text: '1', isCorrect: false },
        { id: 'd', text: '4', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Basketbolda, 3 sayı çizgisine dışarıdan atılan şut 3 sayı kazandırır.'
    },
    {
      category: 'Spor',
      question: 'Hangi sporda Wimbledon şampiyonluğu kazanılır?',
      options: [
        { id: 'a', text: 'Tenis', isCorrect: true },
        { id: 'b', text: 'Futbol', isCorrect: false },
        { id: 'c', text: 'Basketbol', isCorrect: false },
        { id: 'd', text: 'Hentbol', isCorrect: false }
      ],
      difficulty: 2,
      explanation: 'Wimbledon, tenis dünyasında prestijli bir turnuvadır ve her yıl Londra\'da düzenlenir.'
    },
  
    {
      category: 'Söz ve Deyiş',
      question: '"Ayağını yorganına göre uzat" deyimi ne anlama gelir?',
      options: [
        { id: 'a', text: 'Harcamalarına dikkat et', isCorrect: true },
        { id: 'b', text: 'Çok çalışmak gerekir', isCorrect: false },
        { id: 'c', text: 'Yavaş olmak gerektiğini anlatır', isCorrect: false },
        { id: 'd', text: 'Herkese yardımcı ol', isCorrect: false }
      ],
      difficulty: 1,
      explanation: 'Bu deyim, harcamaları gelirine göre yapmayı, aşırıya kaçmamayı ifade eder.'
    }
  ];
  
  console.log(questions);
  