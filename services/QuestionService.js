import { database } from '../config/firebase';
import { ref, push, get, set } from 'firebase/database';

class QuestionService {
  // Yeni soru ekle
  static async addQuestion(questionData) {
    try {
      const categoryKey = questionData.category.toLowerCase().replace(/\s+/g, '');
      const questionsRef = ref(database, `questions/${categoryKey}`);
      const newQuestionRef = push(questionsRef);
      await set(newQuestionRef, {
        ...questionData,
        created_at: new Date().toISOString()
      });
      return newQuestionRef.key;
    } catch (error) {
      console.error('Soru eklenirken hata:', error);
      throw error;
    }
  }

  // Kategoriye göre soruları getir
  static async getQuestionsByCategory(category) {
    try {
      console.log(`Kategori için sorular getiriliyor: ${category}`);
      
      // Doğrudan kategori düğümü referansını al
      const categoryRef = ref(database, `questions/${category.toLowerCase()}`);
      const snapshot = await get(categoryRef);
      
      if (snapshot.exists()) {
        // Kategori altındaki tüm soruları bir diziye dönüştür
        const questions = [];
        snapshot.forEach((childSnapshot) => {
          questions.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        
        console.log(`${category} kategorisi için ${questions.length} soru bulundu`);
        return questions;
      }
      
      console.log(`${category} kategorisi için soru bulunamadı`);
      return [];
    } catch (error) {
      console.error('Sorular getirilirken hata:', error);
      throw error;
    }
  }

  // Rastgele soru getir
  static async getRandomQuestions(limit = 10) {
    try {
      const questionsRef = ref(database, 'questions');
      const snapshot = await get(questionsRef);
      
      if (snapshot.exists()) {
        const allQuestions = [];
        
        // Tüm kategorileri dolaş
        snapshot.forEach((categorySnapshot) => {
          // Her kategori altındaki soruları dolaş
          categorySnapshot.forEach((questionSnapshot) => {
            allQuestions.push({
              id: questionSnapshot.key,
              category: categorySnapshot.key,
              ...questionSnapshot.val()
            });
          });
        });
        
        // Soruları karıştır
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
      }
      return [];
    } catch (error) {
      console.error('Rastgele sorular getirilirken hata:', error);
      throw error;
    }
  }

  // Çoklu soru ekle
  static async addMultipleQuestions(questionsArray) {
    try {
      const results = [];
      
      for (const question of questionsArray) {
        const categoryKey = question.category.toLowerCase().replace(/\s+/g, '');
        const questionsRef = ref(database, `questions/${categoryKey}`);
        const newQuestionRef = push(questionsRef);
        
        await set(newQuestionRef, {
          ...question,
          created_at: new Date().toISOString()
        });
        
        results.push({
          id: newQuestionRef.key,
          ...question
        });
      }
      
      return results;
    } catch (error) {
      console.error('Çoklu soru eklerken hata:', error);
      throw error;
    }
  }
}

export default QuestionService; 