import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
  StatusBar,
  SafeAreaView,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as theme from '../utils/theme';
import { firebaseService } from '../services/firebase';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import QuestionService from '../services/QuestionService';

const GameScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gameFinished, setGameFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [timerActive, setTimerActive] = useState(false);
  const [answersDisabled, setAnswersDisabled] = useState(false);
  
  // Animasyon değerleri
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerAnim = useRef(new Animated.Value(1)).current;
  
  // Timer ref
  const timerRef = useRef(null);

  useEffect(() => {
    // Soruları yükle
    loadQuestions();
    
    // Component temizliği
    return () => {
      firebaseService.cleanup();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Soru değiştiğinde animasyonları başlat
    if (!loading && questions.length > 0) {
      startQuestionAnimations();
      startTimer();
    }
  }, [currentQuestionIndex, loading]);

  useEffect(() => {
    // Timer yönetimi
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerActive(false);
            if (selectedAnswer === null) {
              handleTimeUp();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      if (selectedAnswer === null) {
        handleTimeUp();
      }
    }

    // Timer animasyonu
    Animated.timing(timerAnim, {
      toValue: timeLeft / 20, // 20 saniyeye göre normalize edilmiş değer
      duration: 200,
      useNativeDriver: false
    }).start();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLeft, timerActive]);

  const startQuestionAnimations = () => {
    // Soruyu görünür hale getir
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.9);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true
      })
    ]).start();
    
    // İlerleme çubuğunu güncelle
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 500,
      useNativeDriver: false
    }).start();
  };

  const startTimer = () => {
    setTimeLeft(20);
    setTimerActive(true);
    setAnswersDisabled(false);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerActive(false);
  };

  const handleTimeUp = () => {
    setAnswersDisabled(true);
    
    // Süre dolduğunda cevabı göster ve bir süre sonra diğer soruya geç
    const currentQuestion = questions[currentQuestionIndex];
    setShowExplanation(true);
    
    setTimeout(() => {
      goToNextQuestion();
    }, 3000);
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const allQuestions = await firebaseService.getAllQuestions();
      
      if (allQuestions.length === 0) {
        Alert.alert(
          'Uyarı', 
          'Hiç soru bulunamadı. Lütfen soru yönetimi ekranından soru ekleyin.',
          [{ text: 'Tamam', onPress: () => navigation.goBack() }]
        );
        return;
      }
      
      // Soruların formatını kontrol et ve normalize et
      const normalizedQuestions = allQuestions.map(q => {
        // Kopya oluştur
        const normalizedQuestion = { ...q };
        
        // Seçenekleri normalize et
        if (Array.isArray(normalizedQuestion.options)) {
          // Seçenekler dizi olarak gelmiş ama string içeriyorsa
          if (normalizedQuestion.options.length > 0 && typeof normalizedQuestion.options[0] === 'string') {
            // correctAnswer string olacak, onu kullanarak objeye dönüştürme
            normalizedQuestion.options = normalizedQuestion.options.map(opt => ({
              text: opt,
              isCorrect: opt === normalizedQuestion.correctAnswer
            }));
          }
          // Eğer zaten obje formatındaysa sadece varlığını kontrol et
          else if (normalizedQuestion.options.length > 0 && typeof normalizedQuestion.options[0] === 'object') {
            normalizedQuestion.options = normalizedQuestion.options.map(opt => ({
              text: opt.text || '',
              isCorrect: opt.isCorrect || false
            }));
          }
        } else {
          normalizedQuestion.options = [];
        }
        
        // Birden fazla doğru cevap varsa veya hiç doğru cevap işaretlenmemişse
        // İlk seçeneği doğru olarak işaretle
        const hasCorrect = normalizedQuestion.options.some(opt => opt.isCorrect);
        if (!hasCorrect && normalizedQuestion.options.length > 0) {
          normalizedQuestion.options[0].isCorrect = true;
        }
        
        return normalizedQuestion;
      });
      
      // Rasgele 10 soru seç veya tümünü kullan
      const shuffled = normalizedQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(10, shuffled.length));
      
      console.log('Seçilen sorular:', JSON.stringify(selected, null, 2));
      
      setQuestions(selected);
      setLoading(false);
    } catch (error) {
      console.error('Sorular yüklenirken hata:', error);
      Alert.alert(
        'Hata', 
        'Sorular yüklenirken bir hata oluştu.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    }
  };

  const handleAnswerSelect = (option) => {
    if (answersDisabled) return;
    
    setAnswersDisabled(true);
    setSelectedAnswer(option);
    stopTimer();
    setShowExplanation(true);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = option.isCorrect === true;
    
    if (isCorrect) {
      // Doğru cevap verildiyse puanı arttır
      setScore(score + 1);
    }
    
    // 3 saniye sonra bir sonraki soruya geç
    setTimeout(() => {
      goToNextQuestion();
    }, 3000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setAnswersDisabled(false);
    } else {
      // Oyun bittiğinde istatistikleri kaydet
      saveGameStatistics();
      
      // Sonuç ekranına geçmeden önce oyunu bitir olarak işaretle
      setGameFinished(true);
    }
  };

  const restartGame = async () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowExplanation(false);
    setGameFinished(false);
    setLoading(true);
    await loadQuestions();
  };

  const renderOptions = (question) => {
    if (!question || !Array.isArray(question.options)) return null;
    
    return question.options.map((option, index) => {
      const isSelected = selectedAnswer === option;
      const isCorrect = option.isCorrect === true;
      
      let buttonStyle = [styles.option];
      let textStyle = [styles.optionText];
      
      if (selectedAnswer !== null) {
        if (isCorrect) {
          buttonStyle.push(styles.correctOption);
          textStyle.push(styles.correctOptionText);
        } else if (isSelected) {
          buttonStyle.push(styles.wrongOption);
          textStyle.push(styles.wrongOptionText);
        }
      } else if (isSelected) {
        buttonStyle.push(styles.selectedOption);
      }
      
      const optionLetters = ['A', 'B', 'C', 'D'];
      
      return (
        <TouchableOpacity
          key={index}
          style={buttonStyle}
          onPress={() => handleAnswerSelect(option)}
          disabled={selectedAnswer !== null || answersDisabled}
          activeOpacity={0.8}
        >
          <View style={styles.optionLetterContainer}>
            <Text style={styles.optionLetter}>{optionLetters[index]}</Text>
          </View>
          <Text style={textStyle}>{option.text}</Text>
          {selectedAnswer !== null && isCorrect && (
            <Icon name="check-circle" size={20} color={theme.colors.success} style={styles.optionIcon} />
          )}
          {selectedAnswer !== null && isSelected && !isCorrect && (
            <Icon name="close-circle" size={20} color={theme.colors.danger} style={styles.optionIcon} />
          )}
        </TouchableOpacity>
      );
    });
  };

  // İstatistikleri güncelle
  const saveGameStatistics = async () => {
    try {
      console.log('Oyun istatistikleri kaydediliyor...');
      
      // Kategori sonuçlarını hazırla
      const categoryResults = {};
      const difficultyResults = {};
      let correctAnswers = 0;
      
      // Oyunda cevaplanmış tüm soruları işle
      for (let i = 0; i < questions.length; i++) {
        // Son soru ve henüz cevaplanmadıysa dahil etme
        if (i > currentQuestionIndex) continue;
        
        const question = questions[i];
        const category = question.category || 'Karışık';
        const difficulty = question.difficulty || 'Karışık';
        
        // Doğru cevap verilip verilmediğini kontrol et
        const isCorrect = i < score; // Basit hesaplama: eğer skor i'den büyükse doğru kabul et
        
        // Kategori istatistiklerini güncelle
        if (!categoryResults[category]) {
          categoryResults[category] = { total: 0, correct: 0 };
        }
        categoryResults[category].total += 1;
        
        if (isCorrect) {
          categoryResults[category].correct += 1;
          correctAnswers++;
        }
        
        // Zorluk seviyesi istatistiklerini güncelle
        if (!difficultyResults[difficulty]) {
          difficultyResults[difficulty] = { total: 0, correct: 0 };
        }
        difficultyResults[difficulty].total += 1;
        
        if (isCorrect) {
          difficultyResults[difficulty].correct += 1;
        }
      }
      
      // Oyun sonuç verisini hazırla
      const gameData = {
        score,
        totalQuestions: questions.length,
        correctAnswers,
        incorrectAnswers: currentQuestionIndex + 1 - correctAnswers,
        categoryResults,
        difficultyResults
      };
      
      console.log('Kaydedilecek oyun verileri:', JSON.stringify(gameData, null, 2));
      
      // Mevcut istatistikleri QuestionService üzerinden al
      const currentStats = await QuestionService.getUserStatistics();
      
      if (currentStats) {
        // İstatistikleri güncelle
        const updatedStats = {
          totalGamesPlayed: (currentStats.totalGamesPlayed || 0) + 1,
          totalQuestionsAnswered: (currentStats.totalQuestionsAnswered || 0) + gameData.totalQuestions,
          correctAnswers: (currentStats.correctAnswers || 0) + gameData.correctAnswers,
          incorrectAnswers: (currentStats.incorrectAnswers || 0) + gameData.incorrectAnswers,
          categoryStats: { ...currentStats.categoryStats },
          difficultyStats: { ...currentStats.difficultyStats },
          lastGames: [...(currentStats.lastGames || [])]
        };
        
        // Kategori istatistiklerini güncelle
        Object.entries(categoryResults).forEach(([category, data]) => {
          if (!updatedStats.categoryStats[category]) {
            updatedStats.categoryStats[category] = { total: 0, correct: 0 };
          }
          updatedStats.categoryStats[category].total += data.total;
          updatedStats.categoryStats[category].correct += data.correct;
        });
        
        // Zorluk seviyesi istatistiklerini güncelle
        Object.entries(difficultyResults).forEach(([difficulty, data]) => {
          if (!updatedStats.difficultyStats[difficulty]) {
            updatedStats.difficultyStats[difficulty] = { total: 0, correct: 0 };
          }
          updatedStats.difficultyStats[difficulty].total += data.total;
          updatedStats.difficultyStats[difficulty].correct += data.correct;
        });
        
        // Son oyunları güncelle
        updatedStats.lastGames.unshift({
          date: new Date().toISOString(),
          score: gameData.score,
          totalQuestions: gameData.totalQuestions,
          percentage: Math.round((gameData.score / gameData.totalQuestions) * 100)
        });
        
        // Son 10 oyunu tut
        if (updatedStats.lastGames.length > 10) {
          updatedStats.lastGames = updatedStats.lastGames.slice(0, 10);
        }
        
        // İstatistikleri kaydet - QuestionService kullan
        const result = await QuestionService.updateUserStatistics(updatedStats);
        
        if (result) {
          console.log('İstatistikler başarıyla güncellendi');
        } else {
          console.error('İstatistikler güncellenemedi');
        }
      } else {
        console.log('Mevcut istatistik bulunamadı, yeni istatistik oluşturuluyor');
        
        // Yeni istatistik oluştur
        const newStats = {
          totalGamesPlayed: 1,
          totalQuestionsAnswered: gameData.totalQuestions,
          correctAnswers: gameData.correctAnswers,
          incorrectAnswers: gameData.incorrectAnswers,
          categoryStats: {},
          difficultyStats: {},
          lastGames: [{
            date: new Date().toISOString(),
            score: gameData.score,
            totalQuestions: gameData.totalQuestions,
            percentage: Math.round((gameData.score / gameData.totalQuestions) * 100)
          }]
        };
        
        // Kategori istatistiklerini ekle
        Object.entries(categoryResults).forEach(([category, data]) => {
          newStats.categoryStats[category] = { total: data.total, correct: data.correct };
        });
        
        // Zorluk seviyesi istatistiklerini ekle
        Object.entries(difficultyResults).forEach(([difficulty, data]) => {
          newStats.difficultyStats[difficulty] = { total: data.total, correct: data.correct };
        });
        
        // Yeni istatistikleri kaydet
        const result = await QuestionService.updateUserStatistics(newStats);
        
        if (result) {
          console.log('Yeni istatistikler başarıyla oluşturuldu');
        } else {
          console.error('Yeni istatistikler oluşturulamadı');
        }
      }
    } catch (error) {
      console.error('İstatistikler kaydedilirken hata:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  if (gameFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <ScrollView contentContainerStyle={styles.resultContainer}>
          <LinearGradient
            colors={
              percentage > 70 
                ? [theme.colors.success, theme.colors.successLight] 
                : percentage > 40 
                  ? [theme.colors.warning, theme.colors.warningLight]
                  : [theme.colors.danger, theme.colors.dangerLight]
            }
            style={styles.resultBadge}
          >
            <Icon 
              name={
                percentage > 70 
                  ? "trophy" 
                  : percentage > 40 
                    ? "thumb-up" 
                    : "emoticon-sad"
              } 
              size={60} 
              color={theme.colors.white} 
            />
          </LinearGradient>
          
          <Text style={styles.resultTitle}>
            {percentage > 70 
              ? 'Tebrikler!' 
              : percentage > 40 
                ? 'İyi İş!' 
                : 'Tekrar Dene!'
            }
          </Text>
          
          <Text style={styles.resultScore}>
            {questions.length} sorudan {score} doğru cevap
          </Text>
          
          <View style={styles.resultPercentContainer}>
            <Text style={styles.resultPercent}>
              %{percentage}
            </Text>
            <Text style={styles.resultPercentLabel}>
              Başarı
            </Text>
          </View>
          
          <View style={styles.resultButtons}>
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: theme.colors.primary }]}
              onPress={restartGame}
            >
              <Icon name="replay" size={20} color={theme.colors.white} />
              <Text style={styles.resultButtonText}>Tekrar Oyna</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.resultButton, { backgroundColor: theme.colors.textSecondary }]}
              onPress={() => navigation.navigate('Home')}
            >
              <Icon name="home" size={20} color={theme.colors.white} />
              <Text style={styles.resultButtonText}>Ana Menü</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Kategori rengi ve ikonu
  const categoryColor = theme.getCategoryColor(currentQuestion.category);
  const categoryIcon = theme.getCategoryIcon(currentQuestion.category);
  
  // Zorluk rengi ve ikonu
  const difficultyColor = theme.getDifficultyColor(currentQuestion.difficulty);
  const difficultyIcon = theme.getDifficultyIcon(currentQuestion.difficulty);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Alert.alert(
              'Oyundan Çık', 
              'Oyundan çıkmak istediğinize emin misiniz?',
              [
                { text: 'İptal', style: 'cancel' },
                { text: 'Çık', onPress: () => navigation.goBack() }
              ]
            );
          }}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        
        <View style={styles.progress}>
          <View style={styles.progressHeader}>
            <Text style={styles.questionCounter}>
              Soru {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <View style={styles.scoreContainer}>
              <Icon name="star" size={18} color={theme.colors.warning} />
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) }
                ]}
              />
            </View>
          </View>
        </View>
      </View>
      
      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View 
          style={[
            styles.questionContainer,
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.questionHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
              <Icon name={categoryIcon} size={16} color={theme.colors.white} />
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>
            
            <View style={[styles.difficultyBadge, { backgroundColor: difficultyColor }]}>
              <Icon name={difficultyIcon} size={16} color={theme.colors.white} />
              <Text style={styles.difficultyText}>{currentQuestion.difficulty}</Text>
            </View>
          </View>
          
          <View style={styles.timerBar}>
            <Animated.View 
              style={[
                styles.timerFill, 
                { 
                  width: timerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }),
                  backgroundColor: timerAnim.interpolate({
                    inputRange: [0, 0.3, 0.7, 1],
                    outputRange: [theme.colors.danger, theme.colors.warning, theme.colors.primary, theme.colors.primary]
                  })
                }
              ]}
            />
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {renderOptions(currentQuestion)}
          </View>
          
          {showExplanation && (
            <View style={styles.explanationContainer}>
              <Text style={styles.explanationTitle}>Açıklama:</Text>
              <Text style={styles.explanationText}>{currentQuestion.explanation || 'Bu soru için açıklama bulunmamaktadır.'}</Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.medium,
    fontSize: theme.typography.body1,
    color: theme.colors.text,
  },
  header: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.small,
    ...theme.shadows.medium,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginBottom: theme.spacing.small,
  },
  progress: {
    width: '100%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  questionCounter: {
    fontSize: theme.typography.body2,
    color: theme.colors.textMuted,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,193,7,0.2)',
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.medium,
  },
  scoreText: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.warning,
    marginLeft: 4,
  },
  progressBarContainer: {
    marginVertical: theme.spacing.xs,
  },
  progressBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
  },
  content: {
    padding: theme.spacing.medium,
    paddingBottom: theme.spacing.xl,
  },
  questionContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    ...theme.shadows.medium,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.medium,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.medium,
  },
  categoryText: {
    fontSize: theme.typography.small,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: 4,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.medium,
  },
  difficultyText: {
    fontSize: theme.typography.small,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: 4,
  },
  timerBar: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: theme.spacing.medium,
  },
  timerFill: {
    height: '100%',
    borderRadius: 2,
  },
  questionText: {
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.large,
  },
  optionsContainer: {
    marginBottom: theme.spacing.medium,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.small,
  },
  optionLetterContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.small,
  },
  optionLetter: {
    fontSize: theme.typography.body2,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  selectedOption: {
    backgroundColor: 'rgba(33, 150, 243, 0.3)',
    borderColor: theme.colors.info,
    borderWidth: 1,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: theme.colors.success,
    borderWidth: 1,
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: theme.colors.danger,
    borderWidth: 1,
  },
  optionText: {
    flex: 1,
    fontSize: theme.typography.body1,
    color: theme.colors.text,
  },
  optionIcon: {
    marginLeft: theme.spacing.small,
  },
  correctOptionText: {
    color: theme.colors.success,
    fontWeight: 'bold',
  },
  wrongOptionText: {
    color: theme.colors.danger,
    fontWeight: 'bold',
  },
  explanationContainer: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginTop: theme.spacing.small,
    ...theme.shadows.small,
  },
  explanationTitle: {
    fontSize: theme.typography.body2,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.small,
  },
  explanationText: {
    fontSize: theme.typography.body1,
    color: theme.colors.text,
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
  resultBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.large,
    ...theme.shadows.medium,
  },
  resultTitle: {
    fontSize: theme.typography.title,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  resultScore: {
    fontSize: theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  resultPercentContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: theme.spacing.large,
    ...theme.shadows.medium,
  },
  resultPercent: {
    fontSize: theme.typography.h1,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  resultPercentLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.textMuted,
  },
  resultButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: theme.spacing.large,
  },
  resultButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.medium,
    borderRadius: theme.borderRadius.medium,
    marginHorizontal: theme.spacing.small,
    ...theme.shadows.medium,
    minWidth: 140,
  },
  resultButtonText: {
    marginLeft: theme.spacing.small,
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.white,
  }
});

export default GameScreen; 