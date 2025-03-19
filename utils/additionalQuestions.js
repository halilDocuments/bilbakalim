import { database } from '../config/firebase';
import { ref, set, push } from 'firebase/database';

const additionalQuestions = [
  {
    category: 'Coğrafya',
    question: 'Türkiye\'nin en büyük gölü hangisidir?',
    options: [
      { id: 'a', text: 'Van Gölü', isCorrect: true },
      { id: 'b', text: 'Tuz Gölü', isCorrect: false },
      { id: 'c', text: 'Beyşehir Gölü', isCorrect: false },
      { id: 'd', text: 'Eğirdir Gölü', isCorrect: false }
    ],
    difficulty: 2,
    explanation: 'Van Gölü 3,755 km² yüzölçümü ile Türkiye\'nin en büyük gölüdür.'
  },
  {
    category: 'Coğrafya',
    question: 'Hangisi Türkiye\'nin komşusu değildir?',
    options: [
      { id: 'a', text: 'Romanya', isCorrect: true },
      { id: 'b', text: 'İran', isCorrect: false },
      { id: 'c', text: 'Suriye', isCorrect: false },
      { id: 'd', text: 'Bulgaristan', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Türkiye\'nin Romanya ile kara sınırı yoktur. Diğer ülkelerle kara sınırı vardır.'
  },
  {
    category: 'Bilim',
    question: 'Hangi gezegen Güneş Sistemi\'nde en büyüktür?',
    options: [
      { id: 'a', text: 'Jüpiter', isCorrect: true },
      { id: 'b', text: 'Satürn', isCorrect: false },
      { id: 'c', text: 'Neptün', isCorrect: false },
      { id: 'd', text: 'Uranüs', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Jüpiter, Güneş Sistemi\'ndeki en büyük gezegendir.'
  },
  {
    category: 'Bilim',
    question: 'DNA\'nın açılımı nedir?',
    options: [
      { id: 'a', text: 'Deoksiribo Nükleik Asit', isCorrect: true },
      { id: 'b', text: 'Deoksi Nitrat Asit', isCorrect: false },
      { id: 'c', text: 'Deoksi Nükleo Asit', isCorrect: false },
      { id: 'd', text: 'Deoksi Nitro Amino', isCorrect: false }
    ],
    difficulty: 2,
    explanation: 'DNA (Deoksiribo Nükleik Asit), canlı organizmaların genetik talimatlarını taşıyan bir moleküldür.'
  },
  {
    category: 'Spor',
    question: 'Bir futbol takımında kaç oyuncu sahada olur?',
    options: [
      { id: 'a', text: '11', isCorrect: true },
      { id: 'b', text: '10', isCorrect: false },
      { id: 'c', text: '12', isCorrect: false },
      { id: 'd', text: '9', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Bir futbol takımında sahada 11 oyuncu bulunur.'
  },
  {
    category: 'Spor',
    question: 'Hangisi bir su sporu değildir?',
    options: [
      { id: 'a', text: 'Badminton', isCorrect: true },
      { id: 'b', text: 'Yüzme', isCorrect: false },
      { id: 'c', text: 'Su Topu', isCorrect: false },
      { id: 'd', text: 'Dalış', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Badminton bir raket sporudur ve su sporları kategorisinde değildir.'
  },
  {
    category: 'Günlük',
    question: 'Türkiye\'de hangi para birimi kullanılır?',
    options: [
      { id: 'a', text: 'Türk Lirası', isCorrect: true },
      { id: 'b', text: 'Dolar', isCorrect: false },
      { id: 'c', text: 'Euro', isCorrect: false },
      { id: 'd', text: 'Sterlin', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Türkiye\'de kullanılan para birimi Türk Lirası (TL)\'dir.'
  },
  {
    category: 'Günlük',
    question: 'Bir yılda kaç ay vardır?',
    options: [
      { id: 'a', text: '12', isCorrect: true },
      { id: 'b', text: '10', isCorrect: false },
      { id: 'c', text: '14', isCorrect: false },
      { id: 'd', text: '11', isCorrect: false }
    ],
    difficulty: 1,
    explanation: 'Bir yılda 12 ay vardır: Ocak, Şubat, Mart, Nisan, Mayıs, Haziran, Temmuz, Ağustos, Eylül, Ekim, Kasım ve Aralık.'
  },
  {
    category: 'Söz ve Deyiş',
    question: '"Damlaya damlaya göl olur" atasözünün anlamı nedir?',
    options: [
      { id: 'a', text: 'Küçük birikimlerin zamanla büyük sonuçlar doğuracağını ifade eder', isCorrect: true },
      { id: 'b', text: 'Suyun değerini anlatır', isCorrect: false },
      { id: 'c', text: 'Her şeyin bir sonu olduğunu ifade eder', isCorrect: false },
      { id: 'd', text: 'Acele etmemek gerektiğini anlatır', isCorrect: false }
    ],
    difficulty: 2,
    explanation: 'Bu atasözü, küçük küçük biriktirilen şeylerin zamanla büyük değerlere ulaşacağını ifade eder.'
  },
  {
    category: 'Söz ve Deyiş',
    question: '"Bal tutan parmağını yalar" atasözünün anlamı nedir?',
    options: [
      { id: 'a', text: 'Bir işi yapan kişi ondan faydalanır', isCorrect: true },
      { id: 'b', text: 'Tatlı yemek iyi değildir', isCorrect: false },
      { id: 'c', text: 'Çalışan insan her zaman kazanır', isCorrect: false },
      { id: 'd', text: 'Yemek yerken dikkatli olmak gerekir', isCorrect: false }
    ],
    difficulty: 2,
    explanation: 'Bu atasözü, bir işi yapan kişinin o işten kendisinin de faydalanacağını ifade eder.'
  }
];

export const addAdditionalQuestions = async () => {
  try {
    const questionsRef = ref(database, 'questions');
    
    for (const question of additionalQuestions) {
      // Her kategori için bir düğüm oluştur
      const categoryRef = ref(database, `questions/${question.category.toLowerCase().replace(/\s+/g, '')}`);
      
      // Yeni bir soru ekle
      const newQuestionRef = push(categoryRef);
      await set(newQuestionRef, question);
    }
    
    console.log('Ek sorular başarıyla eklendi!');
    return true;
  } catch (error) {
    console.error('Sorular eklenirken hata:', error);
    throw error;
  }
}; 