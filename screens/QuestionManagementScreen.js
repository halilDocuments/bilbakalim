import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Platform,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { firebaseService } from '../services/firebase';
import { colors, spacing, categories } from '../utils/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { wp, hp, fontSize } from '../utils/theme';

const QuestionManagementScreen = ({ navigation }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectionMode, setSelectionMode] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Yeni soru için state
  const [newQuestion, setNewQuestion] = useState({
    category: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    difficulty: 'Kolay',
    explanation: ''
  });

  // Kategori ve zorluk seçenekleri
  const difficulties = ['Kolay', 'Orta', 'Zor'];

  useEffect(() => {
    // Firebase'den soruları dinle
    subscribeToQuestions();

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      firebaseService.cleanup();
    };
  }, []);

  // Gerçek zamanlı veri dinleme
  const subscribeToQuestions = () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Sorular dinleniyor...');
      
      const unsubscribeListener = firebaseService.subscribeToQuestions((questions, error) => {
        if (error) {
          console.error('Veri dinleme hatası:', error);
          setError('Veriler yüklenirken bir hata oluştu. Lütfen yeniden deneyin.');
          setQuestions([]);
        } else {
          console.log(`${questions?.length || 0} soru yüklendi`);
          setQuestions(Array.isArray(questions) ? questions : []);
          setError(null);
        }
        setLoading(false);
        setRefreshing(false);
      });
      
      setUnsubscribe(() => unsubscribeListener);
    } catch (error) {
      console.error('Soru dinleme hatası:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen yeniden deneyin.');
      setLoading(false);
      setRefreshing(false);
      setQuestions([]);
    }
  };

  // Manuel yenileme
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setError(null);
    if (selectedCategory) {
      loadQuestionsByCategory(selectedCategory);
    } else if (selectedDifficulty) {
      loadQuestionsByDifficulty(selectedDifficulty);
    } else {
      subscribeToQuestions();
    }
  }, [selectedCategory, selectedDifficulty]);

  // Tüm soruları yükle
  const loadAllQuestions = async () => {
    try {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      setLoading(true);
      setError(null);
      const fetchedQuestions = await firebaseService.getAllQuestions();
      setQuestions(Array.isArray(fetchedQuestions) ? fetchedQuestions : []);
      setSelectedCategory(null);
      setSelectedDifficulty(null);
    } catch (error) {
      console.error('Tüm soruları yükleme hatası:', error);
      setError('Sorular yüklenirken bir hata oluştu. Lütfen yeniden deneyin.');
      setQuestions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Kategoriye göre soruları yükle
  const loadQuestionsByCategory = async (category) => {
    try {
      setLoading(true);
      setError(null);
      
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      
      const result = await firebaseService.getQuestionsByCategory(category);
      if (Array.isArray(result)) {
        console.log(`Kategori ${category}: ${result.length} soru yüklendi`);
        setQuestions(result);
        setSelectedCategory(category);
        setSelectedDifficulty(null);
        if (result.length === 0) {
          setError(`"${category}" kategorisinde soru bulunamadı`);
        }
      } else {
        setError('Veriler yüklenirken bir hata oluştu');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Kategori soruları yüklenirken hata:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen yeniden deneyin.');
      setQuestions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Zorluk seviyesine göre soruları yükle
  const loadQuestionsByDifficulty = async (difficulty) => {
    try {
      setLoading(true);
      setError(null);
      
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
      
      const result = await firebaseService.getQuestionsByDifficulty(difficulty);
      if (Array.isArray(result)) {
        console.log(`Zorluk ${difficulty}: ${result.length} soru yüklendi`);
        setQuestions(result);
        setSelectedDifficulty(difficulty);
        setSelectedCategory(null);
        if (result.length === 0) {
          setError(`"${difficulty}" zorluk seviyesinde soru bulunamadı`);
        }
      } else {
        setError('Veriler yüklenirken bir hata oluştu');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Zorluk bazlı sorular yüklenirken hata:', error);
      setError('Veriler yüklenirken bir hata oluştu. Lütfen yeniden deneyin.');
      setQuestions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Filtreleri temizle
  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setError(null);
    subscribeToQuestions();
    setFilterModalVisible(false);
  };

  // Tekli soru silme
  const handleDelete = async (questionId) => {
    Alert.alert(
      'Soru Silme',
      'Bu soruyu silmek istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await firebaseService.deleteQuestion(questionId);
              // Gerçek zamanlı dinleme varsa otomatik güncellenecek
              // Yoksa manuel yenileme yapalım
              if (!unsubscribe) {
                if (selectedCategory) {
                  await loadQuestionsByCategory(selectedCategory);
                } else if (selectedDifficulty) {
                  await loadQuestionsByDifficulty(selectedDifficulty);
                } else {
                  await loadAllQuestions();
                }
              }
              Alert.alert('Başarılı', 'Soru başarıyla silindi.');
            } catch (error) {
              console.error('Soru silme hatası:', error);
              Alert.alert('Hata', 'Soru silinirken bir hata oluştu.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Çoklu soru silme
  const handleMultipleDelete = async () => {
    if (selectedQuestions.length === 0) {
      Alert.alert('Uyarı', 'Lütfen silinecek soruları seçin.');
      return;
    }

    Alert.alert(
      'Çoklu Soru Silme',
      `${selectedQuestions.length} soruyu silmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel'
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await firebaseService.deleteMultipleQuestions(selectedQuestions);
              setSelectedQuestions([]);
              setSelectionMode(false);
              // Gerçek zamanlı dinleme varsa otomatik güncellenecek
              // Yoksa manuel yenileme yapalım
              if (!unsubscribe) {
                if (selectedCategory) {
                  await loadQuestionsByCategory(selectedCategory);
                } else if (selectedDifficulty) {
                  await loadQuestionsByDifficulty(selectedDifficulty);
                } else {
                  await loadAllQuestions();
                }
              }
              Alert.alert('Başarılı', 'Seçilen sorular başarıyla silindi.');
            } catch (error) {
              console.error('Çoklu soru silme hatası:', error);
              Alert.alert('Hata', 'Sorular silinirken bir hata oluştu.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Soru seçme işlevi
  const toggleQuestionSelection = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  // Soruları filtrele
  const filteredQuestions = questions.filter(question => {
    if (!question || !question.question) return false;
    
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || question.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Soru düzenleme
  const handleEditQuestion = (question) => {
    console.log('Düzenlenecek ham soru verisi:', JSON.stringify(question, null, 2));
    
    // Seçenekleri doğru formata dönüştür
    let formattedOptions = [];
    
    // Eğer options bir dizi ise
    if (Array.isArray(question.options)) {
      // Modern format: Her seçenek bir nesne
      if (question.options.length > 0 && typeof question.options[0] === 'object') {
        formattedOptions = question.options.map((opt, idx) => ({
          id: String.fromCharCode(97 + idx), // a, b, c, d olarak id'leri oluştur
          text: opt.text || '',
          isCorrect: opt.isCorrect || false
        }));
      } 
      // Eski format: Her seçenek bir string ve ayrı bir correctAnswer var
      else if (question.options.length > 0 && typeof question.options[0] === 'string') {
        formattedOptions = question.options.map((opt, idx) => ({
          id: String.fromCharCode(97 + idx), // a, b, c, d olarak id'leri oluştur
          text: opt || '',
          isCorrect: question.correctAnswer === opt
        }));
      }
    }
    
    // En az bir seçeneğin doğru olduğundan emin ol
    if (!formattedOptions.some(opt => opt.isCorrect)) {
      // Hiç doğru cevap işaretlenmemişse ilk seçeneği doğru olarak ayarla
      if (formattedOptions.length > 0) {
        formattedOptions[0].isCorrect = true;
      }
    }
    
    // Tüm soru verisini formatla
    const formattedQuestion = {
      id: question.id,
      category: question.category || '',
      question: question.question || '',
      options: formattedOptions,
      difficulty: question.difficulty || 'Kolay',
      explanation: question.explanation || ''
    };
    
    console.log('Düzenleme ekranına gönderilen formatlanmış soru:', JSON.stringify(formattedQuestion, null, 2));
    
    navigation.navigate('AddQuestion', { 
      editMode: true, 
      question: formattedQuestion 
    });
  };

  // Soru ekleme
  const handleAddQuestion = async () => {
    // Form doğrulama
    if (!newQuestion.category) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin.');
      return;
    }
    if (!newQuestion.question) {
      Alert.alert('Hata', 'Lütfen soru metnini girin.');
      return;
    }
    if (newQuestion.options.some(option => !option)) {
      Alert.alert('Hata', 'Lütfen tüm seçenekleri doldurun.');
      return;
    }
    if (!newQuestion.correctAnswer) {
      Alert.alert('Hata', 'Lütfen doğru cevabı seçin.');
      return;
    }
    if (!newQuestion.explanation) {
      Alert.alert('Hata', 'Lütfen açıklama girin.');
      return;
    }

    try {
      setLoading(true);
      const questionId = await firebaseService.addQuestion(newQuestion);
      const newQuestionWithId = { id: questionId, ...newQuestion };
      setQuestions([newQuestionWithId, ...questions]);
      
      // Formu sıfırla
      setNewQuestion({
        category: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'Kolay',
        explanation: ''
      });
      
      setFilterModalVisible(false);
      Alert.alert('Başarılı', 'Soru başarıyla eklendi.');
    } catch (error) {
      console.error('Soru eklenirken hata:', error);
      Alert.alert('Hata', 'Soru eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Her soru için card bileşeni
  const renderQuestion = ({ item }) => {
    // Eğer item geçersizse, boş bir View döndür
    if (!item || !item.id) return <View />;
    
    // options dizisi yoksa veya geçersizse, boş bir dizi olarak ayarla
    const options = Array.isArray(item.options) ? item.options : [];
    
    const isSelected = selectedQuestions.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.questionCard,
          isSelected && styles.selectedQuestion
        ]}
        onPress={() => toggleQuestionSelection(item.id)}
        onLongPress={() => handleEditQuestion(item)}
      >
        {selectionMode && (
          <View style={styles.checkboxContainer}>
            <Icon 
              name={selectedQuestions.includes(item.id) ? "checkbox-marked" : "checkbox-blank-outline"} 
              size={24} 
              color={selectedQuestions.includes(item.id) ? colors.primary : colors.textSecondary} 
            />
          </View>
        )}
        <View style={styles.questionHeader}>
          <Text style={styles.category}>{item.category || 'Kategori Yok'}</Text>
          <Text style={styles.difficulty}>Zorluk: {item.difficulty || 'Belirtilmemiş'}</Text>
        </View>
        <Text style={styles.questionText}>{item.question || 'Soru metni yok'}</Text>
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Text key={index} style={[
              styles.option,
              option && option.isCorrect && styles.correctOption
            ]}>
              {option?.text || `Seçenek ${index + 1}`}
            </Text>
          ))}
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEditQuestion(item)}
          >
            <Icon name="pencil" size={20} color={colors.white} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id)}
          >
            <Icon name="delete" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // applyFilters fonksiyonu eklenecek
  const applyFilters = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let filteredQuestions = await firebaseService.getAllQuestions();
      
      // Kategori filtresi
      if (selectedCategory) {
        filteredQuestions = filteredQuestions.filter(q => q.category === selectedCategory);
      }
      
      // Zorluk seviyesi filtresi
      if (selectedDifficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === selectedDifficulty);
      }
      
      // Metin araması
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filteredQuestions = filteredQuestions.filter(q => 
          q.question.toLowerCase().includes(query) || 
          q.options.some(option => option.toLowerCase().includes(query)) ||
          (q.explanation && q.explanation.toLowerCase().includes(query))
        );
      }
      
      // Sonuçları güncelle
      setQuestions(filteredQuestions);
      
      if (filteredQuestions.length === 0) {
        setError('Aramanıza uygun soru bulunamadı.');
      }
    } catch (error) {
      console.error('Filtre uygulama hatası:', error);
      setError('Filtreleme sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Gelişmiş Filtre Bölümü komponenti eklenecek
  const FilterSection = ({ 
    selectedCategory, 
    setSelectedCategory, 
    selectedDifficulty, 
    setSelectedDifficulty,
    searchQuery,
    setSearchQuery,
    applyFilters,
    clearFilters
  }) => {
    // Kategori listesini sabit liste olarak tanımlıyorum, theme'den alınan değer yerine
    const categoryList = [
      'Coğrafya', 'Kimya', 'Bilim', 'Günlük', 'Spor', 'Tarih', 'Atasözleri', 'Oyunlar', 'Yeşilçam'
    ];

    return (
      <View style={styles.filterSection}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Soru metni ara..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => applyFilters()} style={styles.searchButton}>
            <Icon name="magnify" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Kategori:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.filterScroll}
          >
            {categoryList.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.filterChip,
                  selectedCategory === category && styles.filterChipSelected
                ]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text 
                  style={[
                    styles.filterChipText,
                    selectedCategory === category && styles.filterChipTextSelected
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Zorluk:</Text>
          <View style={styles.difficultyContainer}>
            {['Kolay', 'Orta', 'Zor'].map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyChip,
                  selectedDifficulty === difficulty && styles.difficultyChipSelected,
                  difficulty === 'Kolay' && styles.easyChip,
                  difficulty === 'Orta' && styles.mediumChip,
                  difficulty === 'Zor' && styles.hardChip,
                ]}
                onPress={() => setSelectedDifficulty(selectedDifficulty === difficulty ? null : difficulty)}
              >
                <Text 
                  style={[
                    styles.difficultyChipText,
                    selectedDifficulty === difficulty && styles.difficultyChipTextSelected
                  ]}
                >
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={styles.clearFilterButton}
            onPress={clearFilters}
          >
            <Icon name="filter-remove" size={18} color={colors.danger} />
            <Text style={styles.clearFilterText}>Filtreleri Temizle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Yükleme durumu
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Sorular yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={fontSize(6)} color={colors.white} />
        </TouchableOpacity>
        
        <Text style={styles.title}>Soru Yönetimi</Text>
        
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddQuestion')}
        >
          <Icon name="plus" size={fontSize(6)} color={colors.white} />
        </TouchableOpacity>
      </View>

      <FilterSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {selectedQuestions.length > 0 && (
        <View style={styles.selectedActions}>
          <Text style={styles.selectedCount}>
            {selectedQuestions.length} soru seçildi
          </Text>
          <TouchableOpacity
            style={styles.deleteSelectedButton}
            onPress={handleMultipleDelete}
          >
            <Icon name="delete" size={fontSize(4)} color={colors.white} />
            <Text style={styles.deleteSelectedText}>Seçilenleri Sil</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Hata mesajı */}
      {error && (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryButtonText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sorular Listesi */}
      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={item => item?.id ? item.id : Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !error && (
            <View style={styles.emptyContainer}>
              <Icon name="database-off" size={50} color={colors.textMuted} />
              <Text style={styles.emptyText}>Hiç soru bulunamadı</Text>
              <Text style={styles.emptySubText}>Soru ekleyin veya filtrelerinizi değiştirin</Text>
              <TouchableOpacity 
                style={styles.loadSampleButton}
                onPress={() => {
                  navigation.navigate('AddQuestion');
                }}
              >
                <Text style={styles.loadSampleButtonText}>Yeni Soru Ekle</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
      
      {/* Filtre Modalı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtreleme</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Icon name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            <FilterSection
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              applyFilters={applyFilters}
              clearFilters={clearFilters}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(2),
  },
  backButton: {
    padding: wp(2),
  },
  title: {
    fontSize: fontSize(5),
    fontWeight: 'bold',
    color: colors.white,
  },
  addButton: {
    padding: wp(2),
  },
  filterContainer: {
    padding: wp(4),
    backgroundColor: colors.backgroundLight,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: wp(2),
    padding: wp(3),
    color: colors.white,
    marginBottom: hp(2),
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    backgroundColor: colors.background,
    padding: wp(3),
    borderRadius: wp(2),
    marginHorizontal: wp(1),
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    color: colors.white,
    fontSize: fontSize(3.5),
  },
  selectedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(4),
    backgroundColor: colors.primary,
  },
  selectedCount: {
    color: colors.white,
    fontSize: fontSize(3.5),
  },
  deleteSelectedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.danger,
    padding: wp(2),
    borderRadius: wp(2),
  },
  deleteSelectedText: {
    color: colors.white,
    fontSize: fontSize(3.5),
    marginLeft: wp(2),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.white,
    fontSize: fontSize(4),
    marginTop: hp(2),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.whiteMuted,
    fontSize: fontSize(4),
    marginTop: hp(2),
  },
  emptySubText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  loadSampleButton: {
    backgroundColor: colors.info,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  loadSampleButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  errorContainer: {
    padding: spacing.md,
    backgroundColor: colors.dangerLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    margin: spacing.md,
  },
  errorText: {
    color: colors.danger,
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 5,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: wp(4),
  },
  questionCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
  },
  selectedQuestion: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  checkboxContainer: {
    position: 'absolute',
    top: wp(2),
    right: wp(2),
    zIndex: 1,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  category: {
    fontSize: fontSize(3.5),
    fontWeight: 'bold',
    color: colors.primary,
  },
  difficulty: {
    fontSize: fontSize(3.5),
    color: colors.whiteMuted,
  },
  questionText: {
    fontSize: fontSize(4),
    marginBottom: hp(2),
    color: colors.white,
  },
  optionsContainer: {
    marginBottom: hp(2),
  },
  option: {
    fontSize: fontSize(3.5),
    padding: wp(3),
    marginBottom: hp(1),
    backgroundColor: colors.background,
    borderRadius: wp(2),
    color: colors.white,
  },
  correctOption: {
    backgroundColor: colors.success,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    padding: wp(2),
    marginLeft: wp(2),
  },
  deleteButton: {
    padding: wp(2),
  },
  buttonText: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  filterBadgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 15,
    paddingHorizontal: wp(2),
    paddingVertical: wp(1),
    marginRight: wp(1),
    marginBottom: wp(1),
  },
  filterBadgeText: {
    color: colors.white,
    fontSize: fontSize(3),
    marginRight: wp(1),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: wp(20),
    borderTopRightRadius: wp(20),
    padding: wp(4),
    minHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: wp(4),
  },
  modalTitle: {
    fontSize: fontSize(5),
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  filterLabel: {
    fontSize: fontSize(4),
    color: colors.textPrimary,
    marginBottom: wp(2),
    marginTop: wp(2),
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: wp(4),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    borderRadius: wp(10),
    marginRight: wp(1),
    marginBottom: wp(1),
  },
  categoryText: {
    color: colors.white,
    marginLeft: wp(1),
    fontWeight: 'bold',
  },
  difficultyContainer: {
    flexDirection: 'row',
    marginBottom: wp(4),
  },
  difficultyChip: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(1),
  },
  difficultyText: {
    fontWeight: 'bold',
  },
  clearFilterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerLight,
    borderRadius: wp(2),
    padding: wp(4),
    marginTop: wp(4),
  },
  clearFilterText: {
    color: colors.danger,
    fontWeight: 'bold',
  },
  filterSection: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    marginHorizontal: spacing.medium,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: spacing.medium,
  },
  searchInput: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    color: colors.text,
    fontSize: fontSize.medium,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.small,
    marginLeft: spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    marginBottom: spacing.medium,
  },
  filterChip: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginRight: spacing.small,
    marginBottom: spacing.small,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSize.small,
    color: colors.text,
  },
  filterChipTextSelected: {
    color: colors.white,
    fontWeight: 'bold',
  },
  difficultyContainer: {
    flexDirection: 'row',
  },
  difficultyChip: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: spacing.small,
    marginHorizontal: spacing.xsmall,
    alignItems: 'center',
  },
  difficultyChipSelected: {
    borderWidth: 2,
  },
  easyChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: colors.success,
  },
  mediumChip: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderColor: colors.warning,
  },
  hardChip: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: colors.danger,
  },
  difficultyChipText: {
    fontSize: fontSize.small,
    color: colors.text,
  },
  difficultyChipTextSelected: {
    fontWeight: 'bold',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.small,
  },
  editButton: {
    backgroundColor: colors.info,
    borderRadius: 4,
    padding: 5,
    marginRight: 4,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    right: 8,
    top: 8,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    borderRadius: 4,
    padding: 5,
  },
});

export default QuestionManagementScreen; 