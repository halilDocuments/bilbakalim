import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'; //async doğru import edilişi 

import * as theme from '../utils/theme';
import { firebaseService } from '../services/firebase';
import { loadInitialData } from '../utils/loadInitialData';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [developerMode, setDeveloperMode] = useState(false);
  const [developerClickCount, setDeveloperClickCount] = useState(0);

  useEffect(() => {
    loadQuestionData();
    loadDeveloperMode();
    
    // Firebase'den gelen verileri canlı olarak dinle
    const unsubscribe = firebaseService.subscribeToQuestions((questions, error) => {
      if (!error) {
        setQuestionCount(questions.length);
        
        // Kategori bazlı soru sayılarını hesapla
        const countsByCategory = {};
        questions.forEach(question => {
          if (question.category) {
            if (!countsByCategory[question.category]) {
              countsByCategory[question.category] = 0;
            }
            countsByCategory[question.category]++;
          }
        });
        
        setCategoryCounts(countsByCategory);
        setLoading(false);
      } else {
        console.error('Sorular dinlenirken hata:', error);
        setLoading(false);
      }
    });
    
    // Component unmount olduğunda dinleyiciyi kaldır
    return () => {
      unsubscribe && unsubscribe();
      firebaseService.cleanup();
    };
  }, []);

  // Geliştirici modu için AsyncStorage üzerinden ayarı yükle
  const loadDeveloperMode = async () => {
    try {
      const value = await AsyncStorage.getItem('developerMode');
      if (value !== null) {
        setDeveloperMode(value === 'true');
      }
    } catch (error) {
      console.error('Geliştirici modu yüklenirken hata:', error);
    }
  };

  // Geliştirici modunu kaydet
  const saveDeveloperMode = async (value) => {
    try {
      // String değere çevirerek kaydet
      const stringValue = value === true ? 'true' : 'false';
      await AsyncStorage.setItem('developerMode', stringValue);
      setDeveloperMode(value);
      console.log('Geliştirici modu başarıyla kaydedildi:', value);
    } catch (error) {
      console.error('Geliştirici modu kaydedilirken hata:', error);
      // Hataya rağmen UI durumunu güncelle
      setDeveloperMode(value);
    }
  };

  // Logo ya  - 5 kez tıklanınca geliştirici modunu aç
  const handleDeveloperModeClick = () => {
    const newCount = developerClickCount + 1;
    setDeveloperClickCount(newCount);
    
    if (newCount === 5) {
      const newMode = !developerMode;
      saveDeveloperMode(newMode);
      if (newMode) {
        Alert.alert('Geliştirici Modu', 'Geliştirici modu aktif edildi.');
      } else {
        Alert.alert('Geliştirici Modu', 'Geliştirici modu devre dışı bırakıldı.');
      }
      setDeveloperClickCount(0);
    }
  };

  const loadQuestionData = async () => {
    try {
      setLoading(true);
      // Başlangıç yüklemesi dinleyici aktif olana kadar
      const questions = await firebaseService.getAllQuestions();
      
      // Sadece başlangıç yüklemesi için bir kez çalıştır
      // Sonraki güncellemeler subscribeToQuestions üzerinden gelecek
      setQuestionCount(questions.length);
      
      // Kategori bazlı soru sayılarını hesapla (başlangıç için)
      const countsByCategory = {};
      questions.forEach(question => {
        if (question.category) {
          if (!countsByCategory[question.category]) {
            countsByCategory[question.category] = 0;
          }
          countsByCategory[question.category]++;
        }
      });
      
      setCategoryCounts(countsByCategory);
    } catch (error) {
      console.error('Veri yüklenirken hata:', error);
      Alert.alert('Hata', 'Veriler yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.');
    }
    // setLoading(false); yok çünkü dinleyici içinde yapılacak
  };

  const handleStartGame = () => {
    if (questionCount === 0) {
      Alert.alert(
        'Uyarı', 
        'Hiç soru bulunamadı. Lütfen soru yönetimi ekranından soru ekleyin.',
        [
          {
            text: 'Tamam',
            style: 'default'
          }
        ]
      );
    } else {
      navigation.navigate('Game');
    }
  };

  const handleLoadSampleData = async () => {
    try {
      setLoadingData(true);
      const success = await loadInitialData();
      
      if (success) {
        Alert.alert('Başarılı', 'Örnek veriler başarıyla yüklendi!');
        // loadQuestionData çağrısına gerek yok, dinleyici otomatik güncelleyecek
      } else {
        Alert.alert('Hata', 'Örnek veriler yüklenemedi. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Örnek veri yükleme hatası:', error);
      Alert.alert('Hata', 'Örnek veriler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoadingData(false);
    }
  };

  // Menü öğesi bileşeni
  const MenuItem = ({ icon, title, color, onPress, disabled, isLoading }) => (
    <TouchableOpacity 
      style={[styles.menuItem, { backgroundColor: color }]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={styles.menuItemContent}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Icon name={icon} size={26} color="#fff" />
        )}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      
      {/* Üst Banner */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={handleDeveloperModeClick}>
            <Icon name="brain" size={48} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>SORU BİL</Text>
            <Text style={styles.subtitle}>Bilginizi Test Edin!</Text>
          </View>
        </View>
      </View>
      
      {/* İstatistik Kartları */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Icon name="help-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{questionCount}</Text>
          <Text style={styles.statLabel}>Toplam Soru</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="format-list-bulleted" size={24} color={theme.colors.primary} />
          <Text style={styles.statValue}>{Object.keys(categoryCounts).length}</Text>
          <Text style={styles.statLabel}>Kategori</Text>
        </View>
      </View>
      
      {/* Ana Menü */}
      <ScrollView style={styles.menuContainer}>
        <View style={styles.menuGrid}>
          <MenuItem 
            icon="play-circle-outline"
            title="Soru Çöz"
            color={theme.colors.primary} 
            onPress={handleStartGame}
          />
          
          <MenuItem 
            icon="database-edit"
            title="Soru Yönetimi"
            color="#FF5722"
            onPress={() => navigation.navigate('QuestionManagement')}
          />
          
          <MenuItem 
            icon="plus-circle-outline"
            title="Soru Ekle"
            color="#2196F3"
            onPress={() => navigation.navigate('AddQuestion')}
          />
          
          <MenuItem 
            icon="chart-bar"
            title="İstatistikler"
            color="#9C27B0"
            onPress={() => navigation.navigate('Statistics')}
          />
          
          <MenuItem 
            icon="cog-outline"
            title="Ayarlar"
            color="#607D8B"
            onPress={() => navigation.navigate('Settings')}
          />
          
          <MenuItem 
            icon="information-outline"
            title="Hakkında"
            color="#795548"
            onPress={() => navigation.navigate('About')}
          />
          
          {developerMode && (
            <MenuItem 
              icon="database-import"
              title={loadingData ? 'Yükleniyor...' : 'Örnek Veri Yükle'}
              color="#4CAF50"
              onPress={handleLoadSampleData}
              disabled={loadingData}
              isLoading={loadingData}
            />
          )}
        </View>
      </ScrollView>
      
      {/* Alt Bilgi */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Bilbakalım v1.0 © 2025
          {developerMode ? ' (Geliştirici Modu)' : ''}
        </Text>
      </View>
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
    marginTop: 10,
    color: theme.colors.text,
    fontSize: 16,
  },
  header: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 8,
  },
  statCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textMuted,
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
    padding: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  menuItemContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
});

export default HomeScreen; 