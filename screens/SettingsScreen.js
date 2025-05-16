import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as theme from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseService } from '../services/firebase';

const SettingsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    darkMode: false,
    soundEffects: true,
    vibration: true,
    notifications: true,
    autoSaveProgress: true,
    timerEnabled: true,
    timerDuration: 30, // saniye cinsinden
    showExplanations: true,
    questionCount: 10,
  });
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settingsJson = await AsyncStorage.getItem('appSettings');
      if (settingsJson) {
        setSettings(JSON.parse(settingsJson));
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings) => {
    try {
      setSettings(newSettings);
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      Alert.alert('Hata', 'Ayarlar kaydedilemedi. Lütfen tekrar deneyin.');
    }
  };

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetAllSettings = async () => {
    try {
      const defaultSettings = {
        darkMode: false,
        soundEffects: true,
        vibration: true,
        notifications: true,
        autoSaveProgress: true,
        timerEnabled: true,
        timerDuration: 30,
        showExplanations: true,
        questionCount: 10,
      };
      
      await saveSettings(defaultSettings);
      Alert.alert('Başarılı', 'Tüm ayarlar varsayılan değerlere sıfırlandı.');
    } catch (error) {
      console.error('Ayarlar sıfırlanırken hata:', error);
      Alert.alert('Hata', 'Ayarlar sıfırlanamadı. Lütfen tekrar deneyin.');
    }
  };

  const deleteAllData = async () => {
    try {
      setOperationLoading(true);
      
      // AsyncStorage'dan tüm verileri sil
      await AsyncStorage.multiRemove([
        'appSettings',
        'userStats',
        'gameProgress'
      ]);
      
      Alert.alert('Başarılı', 'Tüm kullanıcı verileri silindi.');
      await loadSettings();
    } catch (error) {
      console.error('Veriler silinirken hata:', error);
      Alert.alert('Hata', 'Veriler silinemedi. Lütfen tekrar deneyin.');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteAllQuestions = async () => {
    try {
      setOperationLoading(true);
      
      Alert.alert(
        'Emin misiniz?',
        'Tüm sorular kalıcı olarak silinecek. Bu işlem geri alınamaz.',
        [
          { text: 'İptal', style: 'cancel' },
          {
            text: 'Sil',
            style: 'destructive',
            onPress: async () => {
              try {
                await firebaseService.deleteAllQuestions();
                Alert.alert('Başarılı', 'Tüm sorular silindi.');
              } catch (error) {
                console.error('Sorular silinirken hata:', error);
                Alert.alert('Hata', 'Sorular silinemedi. Lütfen tekrar deneyin.');
              } finally {
                setOperationLoading(false);
              }
            }
          }
        ]
      );
    } catch (error) {
      console.error('İşlem başlatılırken hata:', error);
      setOperationLoading(false);
    }
  };

  // Ayarlar öğesi
  const SettingsItem = ({ icon, title, description, value, onToggle, type = 'switch' }) => (
    <View style={styles.settingsItem}>
      <View style={styles.settingsItemIcon}>
        <Icon name={icon} size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={styles.settingsItemTitle}>{title}</Text>
        {description && <Text style={styles.settingsItemDescription}>{description}</Text>}
      </View>
      <View style={styles.settingsItemControl}>
        {type === 'switch' && (
          <Switch
            value={value}
            onValueChange={onToggle}
            trackColor={{ 
              false: theme.colors.backgroundLight, 
              true: theme.colors.primary 
            }}
            thumbColor={value ? theme.colors.white : theme.colors.text}
          />
        )}
      </View>
    </View>
  );

  // Select List Item
  const SelectListItem = ({ title, options, value, onChange }) => (
    <View style={styles.selectListContainer}>
      <Text style={styles.selectListTitle}>{title}</Text>
      <View style={styles.selectList}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.selectListItem,
              value === option.value && styles.selectListItemSelected
            ]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[
              styles.selectListItemText,
              value === option.value && styles.selectListItemTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Ayarlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={theme.colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ayarlar</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            Alert.alert(
              'Ayarları Sıfırla',
              'Tüm ayarlar varsayılan değerlere dönecek. Devam etmek istiyor musunuz?',
              [
                { text: 'İptal', style: 'cancel' },
                { text: 'Sıfırla', onPress: resetAllSettings }
              ]
            );
          }}
        >
          <Icon name="refresh" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Arayüz</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="theme-light-dark"
              title="Karanlık Mod"
              description="Koyu tema kullan"
              value={settings.darkMode}
              onToggle={(value) => updateSetting('darkMode', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Oyun Ayarları</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="timer-outline"
              title="Zamanlayıcı"
              description="Sorular için süre sınırı"
              value={settings.timerEnabled}
              onToggle={(value) => updateSetting('timerEnabled', value)}
            />
            
            {settings.timerEnabled && (
              <SelectListItem
                title="Süre (saniye)"
                options={[
                  { label: '10', value: 10 },
                  { label: '15', value: 15 },
                  { label: '30', value: 30 },
                  { label: '45', value: 45 },
                  { label: '60', value: 60 },
                ]}
                value={settings.timerDuration}
                onChange={(value) => updateSetting('timerDuration', value)}
              />
            )}
            
            <SettingsItem
              icon="information-outline"
              title="Açıklamaları Göster"
              description="Cevap sonrası açıklamaları göster"
              value={settings.showExplanations}
              onToggle={(value) => updateSetting('showExplanations', value)}
            />
            
            <SelectListItem
              title="Oyun Başına Soru Sayısı"
              options={[
                { label: '5', value: 5 },
                { label: '10', value: 10 },
                { label: '15', value: 15 },
                { label: '20', value: 20 },
              ]}
              value={settings.questionCount}
              onChange={(value) => updateSetting('questionCount', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ses ve Titreşim</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="volume-high"
              title="Ses Efektleri"
              description="Oyun sırasında ses efektlerini çal"
              value={settings.soundEffects}
              onToggle={(value) => updateSetting('soundEffects', value)}
            />
            
            <SettingsItem
              icon="vibrate"
              title="Titreşim"
              description="Dokunmatik geri bildirim"
              value={settings.vibration}
              onToggle={(value) => updateSetting('vibration', value)}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Veri</Text>
          <View style={styles.sectionContent}>
            <SettingsItem
              icon="content-save-outline"
              title="İlerlemeyi Otomatik Kaydet"
              description="Oyun ilerlemesini kaydet"
              value={settings.autoSaveProgress}
              onToggle={(value) => updateSetting('autoSaveProgress', value)}
            />
          </View>
          
          <View style={styles.dangerSection}>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => {
                Alert.alert(
                  'Tüm Verileri Sil',
                  'Tüm kullanıcı verileriniz silinecek. Bu işlem geri alınamaz.',
                  [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Sil', onPress: deleteAllData, style: 'destructive' }
                  ]
                );
              }}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <>
                  <Icon name="delete" size={20} color={theme.colors.white} />
                  <Text style={styles.dangerButtonText}>Tüm Kullanıcı Verilerini Sil</Text>
                </>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDeleteAllQuestions}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <>
                  <Icon name="database-remove" size={20} color={theme.colors.white} />
                  <Text style={styles.dangerButtonText}>Tüm Soruları Sil</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.large,
    backgroundColor: theme.colors.primary,
  },
  backButton: {
    padding: theme.spacing.small,
  },
  headerTitle: {
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  resetButton: {
    padding: theme.spacing.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.medium,
    color: theme.colors.text,
    fontSize: theme.typography.body1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  sectionContent: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.large,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingsItemIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: theme.spacing.medium,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  settingsItemDescription: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  settingsItemControl: {
    marginLeft: theme.spacing.medium,
  },
  selectListContainer: {
    padding: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectListTitle: {
    fontSize: theme.typography.body2,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.small,
  },
  selectList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.small,
  },
  selectListItem: {
    paddingHorizontal: theme.spacing.medium,
    paddingVertical: theme.spacing.small,
    borderRadius: theme.borderRadius.small,
    backgroundColor: theme.colors.backgroundLight,
    marginRight: theme.spacing.small,
    marginBottom: theme.spacing.small,
  },
  selectListItemSelected: {
    backgroundColor: theme.colors.primary,
  },
  selectListItemText: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
  },
  selectListItemTextSelected: {
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  dangerSection: {
    marginTop: theme.spacing.medium,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.small,
  },
  dangerButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    marginLeft: theme.spacing.small,
  },
});

export default SettingsScreen; 