import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  Animated, 
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionService from '../services/QuestionService';

const { width, height } = Dimensions.get('window');
// Responsive ölçüler için yardımcı fonksiyonlar
const wp = (percentage) => {
  return width * (percentage / 100);
};

const hp = (percentage) => {
  return height * (percentage / 100);
};

const fontSize = (size) => {
  return Math.min(wp(size), hp(size / 1.5));
};

const QuizScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [timer, setTimer] = useState(null);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadQuestions();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      startTimer();
      updateProgress();
    }
  }, [currentQuestionIndex, loading, questions]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const categoryQuestions = await QuestionService.getQuestionsByCategory(category);
      
      if (categoryQuestions.length > 0) {
        setQuestions(categoryQuestions);
      } else {
        alert('Bu kategori için soru bulunamadı.');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Sorular yüklenirken hata:', error);
      alert('Sorular yüklenirken bir hata oluştu.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (timer) clearInterval(timer);
    setTimeRemaining(30);
    
    const newTimer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          if (!isAnswered) {
            handleAnswerSelect(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimer(newTimer);
  };

  const updateProgress = () => {
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / questions.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleAnswerSelect = (optionId) => {
    if (isAnswered) return;
    
    clearInterval(timer);
    setIsAnswered(true);
    setSelectedAnswer(optionId);
    
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(option => option.id === optionId);
    
    if (selectedOption && selectedOption.isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -wp(10),
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
        
        slideAnim.setValue(wp(10));
        
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          })
        ]).start();
      });
    } else {
      // Quiz completed
      navigation.replace('QuizResult', { 
        score, 
        total: questions.length,
        category
      });
    }
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Coğrafya': 'rgba(76, 175, 80, 1)',
      'Kimya': 'rgba(244, 67, 54, 1)',
      'Bilim': 'rgba(33, 150, 243, 1)',
      'Günlük': 'rgba(156, 39, 176, 1)',
      'Spor': 'rgba(255, 152, 0, 1)',
      'Etkinlik': 'rgba(96, 125, 139, 1)',
      'Söz ve Deyiş': 'rgba(0, 188, 212, 1)',
      'Spor ve Oyun': 'rgba(121, 85, 72, 1)',
      'Yeşilçam': 'rgba(233, 30, 99, 1)',
    };
    
    return colors[categoryName] || 'rgba(33, 33, 33, 1)';
  };

  const renderTimer = () => {
    const color = timeRemaining <= 10 ? '#F44336' : timeRemaining <= 20 ? '#FFC107' : '#4CAF50';
    
    return (
      <View style={styles.timerContainer}>
        <Icon name="clock-outline" size={fontSize(4.5)} color={color} />
        <Text style={[styles.timerText, { color }]}>{timeRemaining}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={[getCategoryColor(category), getCategoryColor(category).replace('1)', '0.7)')]}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Sorular Yükleniyor...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={[getCategoryColor(category), getCategoryColor(category).replace('1)', '0.7)')]}
          style={styles.loadingGradient}
        >
          <Icon name="alert-circle-outline" size={fontSize(15)} color="#fff" />
          <Text style={styles.loadingText}>Bu kategori için soru bulunamadı.</Text>
          <TouchableOpacity 
            style={styles.backToHomeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToHomeText}>Kategorilere Dön</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const categoryColor = getCategoryColor(category);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        style={styles.background}
        imageStyle={styles.backgroundImage}
      >
        <LinearGradient
          colors={[categoryColor, categoryColor.replace('1)', '0.8)')]}
          style={styles.gradient}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-left" size={fontSize(6)} color="white" />
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar, 
                  { width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%']
                  }) }
                ]} 
              />
            </View>
            
            {renderTimer()}
          </View>
          
          {/* Category and Score */}
          <View style={styles.infoContainer}>
            <View style={styles.categoryBadge}>
              <Icon name="tag" size={fontSize(3.5)} color="white" />
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            
            <View style={styles.scoreBadge}>
              <Icon name="star" size={fontSize(3.5)} color="white" />
              <Text style={styles.scoreText}>{score}/{questions.length}</Text>
            </View>
          </View>

          {/* Question */}
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <Animated.View 
              style={[
                styles.questionContainer, 
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={styles.questionNumber}>Soru {currentQuestionIndex + 1}/{questions.length}</Text>
              <Text style={styles.questionText}>{currentQuestion.question}</Text>

              {/* Options */}
              <View style={styles.optionsContainer}>
                {currentQuestion.options.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      selectedAnswer === option.id && styles.selectedOption,
                      isAnswered && option.isCorrect && styles.correctOption,
                      isAnswered && selectedAnswer === option.id && !option.isCorrect && styles.wrongOption,
                    ]}
                    onPress={() => handleAnswerSelect(option.id)}
                    disabled={isAnswered}
                    activeOpacity={0.8}
                  >
                    <View style={styles.optionBullet}>
                      <Text style={styles.optionBulletText}>{option.id.toUpperCase()}</Text>
                    </View>
                    
                    <Text style={[
                      styles.optionText,
                      isAnswered && option.isCorrect && styles.correctOptionText,
                      isAnswered && selectedAnswer === option.id && !option.isCorrect && styles.wrongOptionText,
                    ]}>
                      {option.text}
                    </Text>
                    
                    {isAnswered && option.isCorrect && (
                      <View style={styles.iconContainer}>
                        <Icon name="check-circle" size={fontSize(6)} color="#4CAF50" />
                      </View>
                    )}
                    {isAnswered && selectedAnswer === option.id && !option.isCorrect && (
                      <View style={styles.iconContainer}>
                        <Icon name="close-circle" size={fontSize(6)} color="#F44336" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              {/* Explanation */}
              {isAnswered && (
                <View style={styles.explanationContainer}>
                  <View style={styles.explanationHeader}>
                    <Icon name="information-outline" size={fontSize(5)} color="white" />
                    <Text style={styles.explanationTitle}>Açıklama</Text>
                  </View>
                  <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                  
                  <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleNextQuestion}
                  >
                    <LinearGradient
                      colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                      style={styles.nextGradient}
                    >
                      <Text style={styles.nextButtonText}>
                        {currentQuestionIndex < questions.length - 1 ? 'Sonraki Soru' : 'Sonuçları Gör'}
                      </Text>
                      <Icon 
                        name={currentQuestionIndex < questions.length - 1 ? "arrow-right" : "flag-checkered"} 
                        size={fontSize(5)} 
                        color="white" 
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.05,
  },
  gradient: {
    flex: 1,
    padding: wp(5),
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  loadingText: {
    marginTop: hp(2),
    color: 'white',
    fontSize: fontSize(4.5),
    fontWeight: '600',
    textAlign: 'center',
  },
  backToHomeButton: {
    marginTop: hp(2),
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(5),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  backToHomeText: {
    color: 'white',
    fontSize: fontSize(4),
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    paddingTop: Platform.OS === 'android' ? hp(2) : 0,
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2.5),
  },
  progressContainer: {
    flex: 1,
    height: hp(0.8),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: hp(0.4),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: hp(0.4),
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: wp(2.5),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    marginLeft: wp(2.5),
  },
  timerText: {
    marginLeft: wp(1),
    fontWeight: 'bold',
    fontSize: fontSize(4),
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    flexWrap: 'wrap',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    marginBottom: hp(1),
    marginRight: wp(2),
  },
  categoryText: {
    color: 'white',
    marginLeft: wp(1),
    fontWeight: '600',
    fontSize: fontSize(3.5),
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
    borderRadius: wp(5),
    marginBottom: hp(1),
  },
  scoreText: {
    color: 'white',
    marginLeft: wp(1),
    fontWeight: '600',
    fontSize: fontSize(3.5),
  },
  questionContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp(5),
    padding: wp(5),
    marginBottom: hp(2),
    minHeight: hp(50),
  },
  questionNumber: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSize(3.5),
    fontWeight: '500',
    marginBottom: hp(1),
  },
  questionText: {
    color: 'white',
    fontSize: fontSize(5.5),
    fontWeight: '700',
    marginBottom: hp(3),
  },
  optionsContainer: {
    marginBottom: hp(2),
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: wp(4),
    borderRadius: wp(3.5),
    marginBottom: hp(1.5),
  },
  optionBullet: {
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  optionBulletText: {
    color: 'white',
    fontWeight: '700',
    fontSize: fontSize(3.5),
  },
  selectedOption: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'white',
    borderWidth: 1,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  wrongOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.25)',
    borderColor: '#F44336',
    borderWidth: 1,
  },
  optionText: {
    color: 'white',
    fontSize: fontSize(4),
    flex: 1,
    flexWrap: 'wrap',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  wrongOptionText: {
    color: '#F44336',
  },
  iconContainer: {
    width: wp(7.5),
    alignItems: 'center',
  },
  explanationContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: wp(3.5),
    padding: wp(4),
    marginTop: hp(1),
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  explanationTitle: {
    color: 'white',
    fontSize: fontSize(4),
    fontWeight: '700',
    marginLeft: wp(2),
  },
  explanationText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: fontSize(3.7),
    lineHeight: fontSize(5.5),
    marginBottom: hp(2),
  },
  nextButton: {
    borderRadius: wp(3),
    overflow: 'hidden',
    height: hp(6),
  },
  nextGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: fontSize(4),
    fontWeight: '700',
    marginRight: wp(2),
  },
});

export default QuizScreen; 