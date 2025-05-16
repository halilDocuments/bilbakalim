import { firebaseService } from './firebase';

class QuestionService {
  // Firebasebağlantısını test et
  static async testConnection() {
    try {
      return await firebaseService.testConnection();
    } catch (error) {
      console.error('Bağlantı testi hatası:', error);
      return false;
    }
  }

  // Tüm soruları getir
  static async getAllQuestions() {
    try {
      return await firebaseService.getAllQuestions();
    } catch (error) {
      console.error('Soruları getirme hatası:', error);
      return [];
    }
  }

  // Soru ekle
  static async addQuestion(questionData) {
    try {
      return await firebaseService.addQuestion(questionData);
    } catch (error) {
      console.error('Soru eklerken hata:', error);
      throw error;
    }
  }

  // Soru güncelle
  static async updateQuestion(questionId, questionData) {
    try {
      return await firebaseService.updateQuestion(questionId, questionData);
    } catch (error) {
      console.error('Soru güncellerken hata:', error);
      throw error;
    }
  }

  // Soru sil
  static async deleteQuestion(questionId) {
    try {
      return await firebaseService.deleteQuestion(questionId);
    } catch (error) {
      console.error('Soru silerken hata:', error);
      throw error;
    }
  }

  // Çoklu soru sil
  static async deleteMultipleQuestions(questionIds) {
    try {
      return await firebaseService.deleteMultipleQuestions(questionIds);
    } catch (error) {
      console.error('Çoklu soru silerken hata:', error);
      throw error;
    }
  }

  // Kullanıcı istatistikleri
  static async getUserStatistics(userId = 'default') {
    try {
      return await firebaseService.getUserStatistics(userId);
    } catch (error) {
      console.error('İstatistikleri getirirken hata:', error);
      return null;
    }
  }

  // İstatistikleri güncelle
  static async updateUserStatistics(statistics, userId = 'default') {
    try {
      return await firebaseService.updateUserStatistics(statistics, userId);
    } catch (error) {
      console.error('İstatistikleri güncellerken hata:', error);
      return false;
    }
  }

  // Kategoriye göre soruları getir
  async getQuestionsByCategory(category) {
    return await firebaseService.getQuestionsByCategory(category);
  }
  
  // Rastgele sorular getir
  async getRandomQuestions(count = 10) {
    try {
      const allQuestions = await firebaseService.getAllQuestions();
      
      // Soruları karıştır
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      
      // İstenen sayıda soru döndür
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Rastgele soru getirme hatası:', error);
      throw error;
    }
  }
  
  // Birden çok soru ekle
  async addMultipleQuestions(questions) {
    try {
      const results = [];
      for (const question of questions) {
        const result = await this.addQuestion(question);
        results.push(result);
      }
      return results;
    } catch (error) {
      console.error('Çoklu soru ekleme hatası:', error);
      throw error;
    }
  }

  // Zorluk seviyesine göre soruları getir
  async getQuestionsByDifficulty(difficulty) {
    return await firebaseService.getQuestionsByDifficulty(difficulty);
  }
}

const questionService = new QuestionService();
export default questionService; 