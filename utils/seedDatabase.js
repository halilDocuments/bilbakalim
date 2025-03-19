import { database } from '../config/firebase';
import { ref, set } from 'firebase/database';

const sampleQuestions = {
  questions: {
    geography: {
      q1: {
        category: 'Coğrafya',
        question: 'Türkiye\'nin başkenti neresidir?',
        options: [
          { id: 'a', text: 'Ankara', isCorrect: true },
          { id: 'b', text: 'İstanbul', isCorrect: false },
          { id: 'c', text: 'İzmir', isCorrect: false },
          { id: 'd', text: 'Bursa', isCorrect: false }
        ],
        explanation: 'Ankara, 13 Ekim 1923\'ten beri Türkiye\'nin başkentidir.',
        difficulty: 1
      },
      q2: {
        category: 'Coğrafya',
        question: 'Türkiye\'nin en yüksek dağı hangisidir?',
        options: [
          { id: 'a', text: 'Ağrı Dağı', isCorrect: true },
          { id: 'b', text: 'Erciyes Dağı', isCorrect: false },
          { id: 'c', text: 'Uludağ', isCorrect: false },
          { id: 'd', text: 'Palandöken Dağı', isCorrect: false }
        ],
        explanation: 'Ağrı Dağı, 5137 metre yüksekliği ile Türkiye\'nin en yüksek dağıdır.',
        difficulty: 2
      }
    },
    science: {
      q1: {
        category: 'Bilim',
        question: 'Periyodik tabloda kaç element vardır?',
        options: [
          { id: 'a', text: '118', isCorrect: true },
          { id: 'b', text: '108', isCorrect: false },
          { id: 'c', text: '92', isCorrect: false },
          { id: 'd', text: '120', isCorrect: false }
        ],
        explanation: 'Periyodik tabloda şu anda 118 element bulunmaktadır.',
        difficulty: 2
      }
    }
  }
};

export const seedDatabase = async () => {
  try {
    // Root seviyesinde veriyi yazıyoruz
    const dbRef = ref(database);
    await set(dbRef, sampleQuestions);
    console.log('Örnek sorular başarıyla eklendi!');
  } catch (error) {
    console.error('Veritabanı doldurulurken hata:', error);
  }
}; 