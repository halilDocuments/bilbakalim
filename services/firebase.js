import { ref, onValue, set, push, remove, update, get } from 'firebase/database';
import { Alert } from 'react-native';
import { sampleQuestions } from '../utils/loadInitialData';
import { database } from '../config/firebase';

// Firebase servis sınıfı
class FirebaseService {
  constructor() {
    if (!database) {
      console.error('Firebase veritabanı başlatılamadı!');
      return;
    }
    this.questionsRef = ref(database, 'questions');
    this.listeners = new Set();
    console.log('FirebaseService başlatıldı');
  }

  // Bağlantıyı test et
  async testConnection() {
    try {
      if (!database) return false;
      
      const snapshot = await get(this.questionsRef);
      console.log('Firebase bağlantısı başarılı');
      return snapshot !== null;
    } catch (error) {
      console.error('Firebase bağlantı hatası:', error);
      return false;
    }
  }

  // Tüm soruları getir
  async getAllQuestions() {
    try {
      if (!database) return [];
      
      const snapshot = await get(this.questionsRef);
      if (snapshot && snapshot.exists()) {
        const questions = [];
        snapshot.forEach((childSnapshot) => {
          questions.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        console.log(`${questions.length} soru yüklendi`);
        return questions;
      }
      console.log('Hiç soru bulunamadı');
      return [];
    } catch (error) {
      console.error('Sorular yüklenirken hata:', error);
      return [];
    }
  }

  // Kategoriye göre soruları getir
  async getQuestionsByCategory(category) {
    try {
      if (!database || !category) return [];
      
      const questions = await this.getAllQuestions();
      const filteredQuestions = questions.filter(q => q && q.category === category);
      console.log(`${category} kategorisinde ${filteredQuestions.length} soru bulundu`);
      return filteredQuestions;
    } catch (error) {
      console.error(`${category} kategorisi soruları yüklenirken hata:`, error);
      return [];
    }
  }

  // Zorluk seviyesine göre soruları getir
  async getQuestionsByDifficulty(difficulty) {
    try {
      if (!database || !difficulty) return [];
      
      const questions = await this.getAllQuestions();
      const filteredQuestions = questions.filter(q => q && q.difficulty === difficulty);
      console.log(`${difficulty} zorluk seviyesinde ${filteredQuestions.length} soru bulundu`);
      return filteredQuestions;
    } catch (error) {
      console.error('Zorluk seviyesi bazlı soru getirme hatası:', error);
      return [];
    }
  }

  // Soru ekle
  async addQuestion(question) {
    try {
      if (!database || !question) {
        console.error('Geçersiz soru verisi');
        return null;
      }
      
      // Veriyi normalize et
      const normalizedQuestion = this._normalizeQuestionData(question);
      
      const newQuestionRef = push(this.questionsRef);
      await set(newQuestionRef, {
        ...normalizedQuestion,
        createdAt: new Date().toISOString()
      });
      console.log('Yeni soru eklendi, ID:', newQuestionRef.key);
      return newQuestionRef.key;
    } catch (error) {
      console.error('Soru eklenirken hata:', error);
      throw error;
    }
  }

  // Soru güncelle
  async updateQuestion(questionId, updates) {
    try {
      if (!database || !questionId || !updates) {
        console.error('Geçersiz güncelleme verisi');
        throw new Error('Geçersiz güncelleme verisi');
      }
      
      // Veriyi normalize et ve mevcut veriyle birleştir
      const normalizedQuestion = this._normalizeQuestionData(updates);
      
      console.log('Güncellenen soru ID:', questionId);
      console.log('Güncellenen veriler:', JSON.stringify(normalizedQuestion, null, 2));
      
      const questionRef = ref(database, `questions/${questionId}`);
      const snapshot = await get(questionRef);
      
      if (!snapshot.exists()) {
        throw new Error(`${questionId} ID'li soru bulunamadı`);
      }
      
      await update(questionRef, {
        ...normalizedQuestion,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Soru güncellendi, ID: ${questionId}`);
      return questionId;
    } catch (error) {
      console.error('Soru güncellenirken hata:', error);
      throw error;
    }
  }

  // Soru sil
  async deleteQuestion(questionId) {
    try {
      if (!database || !questionId) return;
      
      const questionRef = ref(database, `questions/${questionId}`);
      await remove(questionRef);
      console.log(`Soru silindi, ID: ${questionId}`);
    } catch (error) {
      console.error('Soru silinirken hata:', error);
      throw error;
    }
  }

  // Çoklu soru sil
  async deleteMultipleQuestions(questionIds) {
    try {
      if (!database || !questionIds || !questionIds.length) return;
      
      const updates = {};
      questionIds.forEach(id => {
        if (id) updates[`questions/${id}`] = null;
      });
      
      await update(ref(database), updates);
      console.log(`${questionIds.length} soru silindi`);
    } catch (error) {
      console.error('Çoklu soru silme hatası:', error);
      throw error;
    }
  }

  // Tüm soruları sil
  async deleteAllQuestions() {
    try {
      if (!database) return;
      
      await set(this.questionsRef, null);
      console.log('Tüm sorular silindi');
    } catch (error) {
      console.error('Tüm soruları silme hatası:', error);
      throw error;
    }
  }

  // Soru verilerini normalize et
  _normalizeQuestionData(question) {
    try {
      const normalized = { ...question };
      
      // Options formatını normalize et
      if (Array.isArray(normalized.options)) {
        // Eğer options nesneler dizisi ise
        if (normalized.options.length > 0 && typeof normalized.options[0] === 'object') {
          normalized.options = normalized.options.map(opt => {
            if (typeof opt === 'object') {
              return {
                text: opt.text || '',
                isCorrect: opt.isCorrect || false
              };
            }
            return { text: String(opt), isCorrect: false };
          });
        }
        // Eğer options string dizisi ise
        else if (normalized.options.length > 0 && typeof normalized.options[0] === 'string') {
          const correctAnswer = normalized.correctAnswer;
          normalized.options = normalized.options.map(opt => ({
            text: opt,
            isCorrect: opt === correctAnswer
          }));
          delete normalized.correctAnswer;
        }
      } else {
        normalized.options = [];
      }
      
      // Diğer alanları normalize et
      normalized.category = normalized.category || '';
      normalized.question = normalized.question || '';
      normalized.difficulty = normalized.difficulty || 'Kolay';
      normalized.explanation = normalized.explanation || '';
      
      return normalized;
    } catch (error) {
      console.error('Soru verileri normalize edilirken hata:', error);
      return question;
    }
  }

  // Soruları gerçek zamanlı dinle
  subscribeToQuestions(callback) {
    if (!database) {
      console.error('Firebase veritabanına bağlanılamadı');
      callback([], new Error('Firebase veritabanına bağlanılamadı'));
      return () => {};
    }
    
    try {
      console.log('Sorular dinleniyor...');
      const unsubscribe = onValue(this.questionsRef, 
        (snapshot) => {
          try {
            if (snapshot && snapshot.exists()) {
              const questions = [];
              snapshot.forEach((childSnapshot) => {
                if (childSnapshot && childSnapshot.val()) {
                  questions.push({
                    id: childSnapshot.key,
                    ...childSnapshot.val()
                  });
                }
              });
              console.log(`Dinleme: ${questions.length} soru bulundu`);
              callback(questions, null);
            } else {
              console.log('Dinleme: Hiç soru bulunamadı');
              callback([], null);
            }
          } catch (error) {
            console.error('Soruları işlerken hata:', error);
            callback([], error);
          }
        },
        (error) => {
          console.error('Dinleme hatası:', error);
          callback([], error);
        }
      );
      
      this.listeners.add(unsubscribe);
      console.log('Dinleyici eklendi');
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
          this.listeners.delete(unsubscribe);
          console.log('Dinleyici kaldırıldı');
        }
      };
    } catch (error) {
      console.error('Dinleyici oluşturulurken hata:', error);
      callback([], error);
      return () => {};
    }
  }

  // Tüm dinleyicileri temizle
  cleanup() {
    try {
      this.listeners.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
      this.listeners.clear();
      console.log('Tüm dinleyiciler kaldırıldı');
    } catch (error) {
      console.error('Dinleyicileri temizlerken hata:', error);
    }
  }

  // Örnek soruları yükle
  async loadInitialData() {
    try {
      if (!database) {
        console.error('Firebase veritabanına bağlanılamadı');
        return false;
      }
      
      // Mevcut soruları sil
      await set(this.questionsRef, null);
      console.log('Mevcut sorular silindi');
      
      let totalCount = 0;
      
      // Tüm kategoriler için soruları ekle
      for (const category in sampleQuestions) {
        const questions = sampleQuestions[category];
        for (const question of questions) {
          // Soru verilerini normalize et
          const normalizedQuestion = this._normalizeQuestionData(question);
          
          const newQuestionRef = push(this.questionsRef);
          await set(newQuestionRef, {
            ...normalizedQuestion,
            createdAt: new Date().toISOString()
          });
          totalCount++;
        }
      }
      
      console.log(`${totalCount} örnek soru başarıyla yüklendi`);
      return true;
    } catch (error) {
      console.error('Örnek veri yükleme hatası:', error);
      return false;
    }
  }

  // Kullanıcı istatistiklerini al
  async getUserStatistics(userId = 'default') {
    try {
      console.log('getUserStatistics çağrıldı. userId:', userId);
      
      if (!database) {
        console.error('Firebase veritabanı başlatılamadı!');
        return null;
      }
      
      const userStatsRef = ref(database, `statistics/${userId}`);
      console.log('İstatistik referansı oluşturuldu. Path:', `statistics/${userId}`);
      
      const snapshot = await get(userStatsRef);
      console.log('Firebase istatistik verisi alındı. Veri var mı:', snapshot.exists());
      
      if (snapshot && snapshot.exists()) {
        console.log('İstatistik verileri bulundu');
        return snapshot.val();
      }
      
      console.log('İstatistik verisi bulunamadı, boş varsayılan veri döndürülüyor');
      // Hiç istatistik yoksa varsayılan boş istatistik döndür
      return {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        categoryStats: {},
        difficultyStats: {},
        lastGames: []
      };
    } catch (error) {
      console.error('İstatistikler alınırken hata:', error);
      return null;
    }
  }

  // Kullanıcı istatistiklerini güncelle
  async updateUserStatistics(statistics, userId = 'default') {
    try {
      console.log('updateUserStatistics çağrıldı. userId:', userId);
      
      if (!database) {
        console.error('Firebase veritabanı başlatılamadı!');
        return false;
      }
      
      const userStatsRef = ref(database, `statistics/${userId}`);
      console.log('İstatistik referansı oluşturuldu. Path:', `statistics/${userId}`);
      
      await set(userStatsRef, {
        ...statistics,
        updatedAt: new Date().toISOString()
      });
      
      console.log('İstatistikler başarıyla güncellendi');
      return true;
    } catch (error) {
      console.error('İstatistikler güncellenirken hata:', error);
      return false;
    }
  }

  // Oyun sonucunu kaydet ve istatistikleri güncelle
  async saveGameResult(gameData, userId = 'default') {
    try {
      if (!database) return false;
      
      // Mevcut istatistikleri al
      const currentStats = await this.getUserStatistics(userId);
      if (!currentStats) return false;
      
      // Yeni oyun verilerini al
      const { 
        score, 
        totalQuestions, 
        correctAnswers, 
        categoryResults = {}, 
        difficultyResults = {} 
      } = gameData;
      
      // Son oyunları güncelle - son 10 oyunu tut
      const lastGames = currentStats.lastGames || [];
      lastGames.unshift({
        date: new Date().toISOString(),
        score,
        totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100)
      });
      
      // Maksimum 10 oyun tut
      while (lastGames.length > 10) {
        lastGames.pop();
      }
      
      // Kategori istatistiklerini güncelle
      const categoryStats = currentStats.categoryStats || {};
      Object.keys(categoryResults).forEach(category => {
        if (!categoryStats[category]) {
          categoryStats[category] = {
            total: 0,
            correct: 0
          };
        }
        
        categoryStats[category].total += categoryResults[category].total || 0;
        categoryStats[category].correct += categoryResults[category].correct || 0;
      });
      
      // Zorluk seviyesi istatistiklerini güncelle
      const difficultyStats = currentStats.difficultyStats || {};
      Object.keys(difficultyResults).forEach(difficulty => {
        if (!difficultyStats[difficulty]) {
          difficultyStats[difficulty] = {
            total: 0,
            correct: 0
          };
        }
        
        difficultyStats[difficulty].total += difficultyResults[difficulty].total || 0;
        difficultyStats[difficulty].correct += difficultyResults[difficulty].correct || 0;
      });
      
      // İstatistikleri güncelle
      const updatedStats = {
        totalGamesPlayed: (currentStats.totalGamesPlayed || 0) + 1,
        totalQuestionsAnswered: (currentStats.totalQuestionsAnswered || 0) + totalQuestions,
        correctAnswers: (currentStats.correctAnswers || 0) + correctAnswers,
        incorrectAnswers: (currentStats.incorrectAnswers || 0) + (totalQuestions - correctAnswers),
        categoryStats,
        difficultyStats,
        lastGames
      };
      
      // Firebase'e kaydet
      return await this.updateUserStatistics(updatedStats, userId);
    } catch (error) {
      console.error('Oyun sonucu kaydedilirken hata:', error);
      return false;
    }
  }
}

export const firebaseService = new FirebaseService(); 