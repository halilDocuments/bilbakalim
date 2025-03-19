import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionService from '../services/QuestionService';

const CATEGORIES = [
  { name: 'Coğrafya', icon: 'earth', color: 'rgba(76, 175, 80, 1)' },
  { name: 'Kimya', icon: 'flask', color: 'rgba(244, 67, 54, 1)' },
  { name: 'Bilim', icon: 'atom', color: 'rgba(33, 150, 243, 1)' },
  { name: 'Günlük', icon: 'calendar-today', color: 'rgba(156, 39, 176, 1)' },
  { name: 'Spor', icon: 'soccer', color: 'rgba(255, 152, 0, 1)' },
  { name: 'Etkinlik', icon: 'star', color: 'rgba(96, 125, 139, 1)' },
  { name: 'Söz ve Deyiş', icon: 'chat', color: 'rgba(0, 188, 212, 1)' },
  { name: 'Spor ve Oyun', icon: 'basketball', color: 'rgba(121, 85, 72, 1)' },
  { name: 'Yeşilçam', icon: 'movie', color: 'rgba(233, 30, 99, 1)' },
];

const DIFFICULTY_LEVELS = [1, 2, 3, 4, 5];

const AddQuestion = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([
    { id: 'a', text: '', isCorrect: true },
    { id: 'b', text: '', isCorrect: false },
    { id: 'c', text: '', isCorrect: false },
    { id: 'd', text: '', isCorrect: false }
  ]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(1);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index) => {
    const newOptions = options.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const validateForm = () => {
    if (!question.trim()) {
      Alert.alert('Hata', 'Lütfen soru metnini girin');
      return false;
    }
    
    if (!selectedCategory) {
      Alert.alert('Hata', 'Lütfen bir kategori seçin');
      return false;
    }

    for (const option of options) {
      if (!option.text.trim()) {
        Alert.alert('Hata', 'Lütfen tüm seçenekleri doldurun');
        return false;
      }
    }

    if (!explanation.trim()) {
      Alert.alert('Hata', 'Lütfen bir açıklama girin');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const questionData = {
        category: selectedCategory.name,
        question,
        options,
        difficulty,
        explanation,
      };

      await QuestionService.addQuestion(questionData);
      Alert.alert(
        'Başarılı', 
        'Soru başarıyla eklendi!',
        [{ text: 'Tamam', onPress: resetForm }]
      );
    } catch (error) {
      Alert.alert('Hata', 'Soru eklenirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setQuestion('');
    setOptions([
      { id: 'a', text: '', isCorrect: true },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
      { id: 'd', text: '', isCorrect: false }
    ]);
    setSelectedCategory(null);
    setDifficulty(1);
    setExplanation('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Soru Ekle</Text>
        </View>

        {/* Kategori Seçimi */}
        <Text style={styles.sectionTitle}>Kategori Seçin</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryCard,
                selectedCategory?.name === category.name && { 
                  borderColor: category.color,
                  borderWidth: 2 
                }
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Icon 
                name={category.icon} 
                size={28} 
                color={category.color} 
              />
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Soru Metni */}
        <Text style={styles.sectionTitle}>Soru Metni</Text>
        <TextInput
          style={styles.textInput}
          value={question}
          onChangeText={setQuestion}
          placeholder="Soru metnini girin..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          multiline
        />

        {/* Seçenekler */}
        <Text style={styles.sectionTitle}>Seçenekler</Text>
        {options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <Text style={styles.optionLabel}>{option.id.toUpperCase()}</Text>
            <TextInput
              style={[styles.optionInput, option.isCorrect && styles.correctOption]}
              value={option.text}
              onChangeText={(text) => handleOptionChange(index, text)}
              placeholder={`Seçenek ${option.id.toUpperCase()}`}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
            <TouchableOpacity
              style={[
                styles.correctButton,
                option.isCorrect && styles.correctButtonActive
              ]}
              onPress={() => handleCorrectChange(index)}
            >
              <Icon 
                name={option.isCorrect ? "check-circle" : "circle-outline"} 
                size={24} 
                color={option.isCorrect ? "#4CAF50" : "white"} 
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Zorluk Seviyesi */}
        <Text style={styles.sectionTitle}>Zorluk Seviyesi: {difficulty}</Text>
        <View style={styles.difficultyContainer}>
          {DIFFICULTY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.difficultyButton,
                difficulty === level && styles.activeDifficultyButton
              ]}
              onPress={() => setDifficulty(level)}
            >
              <Text style={[
                styles.difficultyText,
                difficulty === level && styles.activeDifficultyText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Açıklama */}
        <Text style={styles.sectionTitle}>Açıklama</Text>
        <TextInput
          style={[styles.textInput, styles.explanationInput]}
          value={explanation}
          onChangeText={setExplanation}
          placeholder="Doğru cevabın açıklamasını girin..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          multiline
        />

        {/* Kaydet Butonu */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.submitText}>
              {loading ? 'Ekleniyor...' : 'Soruyu Ekle'}
            </Text>
            {!loading && <Icon name="check" size={24} color="white" />}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 20,
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  categoryCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginRight: 15,
    borderRadius: 12,
    width: 90,
    height: 90,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  categoryText: {
    color: 'white',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 16,
    color: 'white',
    fontSize: 16,
    minHeight: 60,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionLabel: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  optionInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 16,
    color: 'white',
    marginHorizontal: 10,
  },
  correctOption: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  correctButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctButtonActive: {
    backgroundColor: 'rgba(76,175,80,0.2)',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  difficultyButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeDifficultyButton: {
    backgroundColor: '#4CAF50',
  },
  difficultyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  activeDifficultyText: {
    color: 'white',
  },
  explanationInput: {
    minHeight: 100,
  },
  submitButton: {
    marginTop: 30,
    marginBottom: 40,
    borderRadius: 15,
    overflow: 'hidden',
    height: 60,
  },
  submitGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});

export default AddQuestion;
