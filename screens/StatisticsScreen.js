import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Ionicons } from '@expo/vector-icons';
import * as theme from '../utils/theme';
import QuestionService from '../services/QuestionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatisticsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGamesPlayed: 0,
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    avgScore: 0,
    categoryStats: {},
    difficultyStats: {},
    lastGames: []
  });

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      console.log('İstatistikler alınmaya çalışılıyor...');
      
      // QuestionService aracılığıyla kullanıcı istatistiklerini çek
      const userStats = await QuestionService.getUserStatistics('default');
      
      console.log('Alınan istatistikler:', JSON.stringify(userStats, null, 2));
      
      if (!userStats) {
        // Veri yoksa varsayılan boş bir istatistik kullan
        setStats({
          totalGamesPlayed: 0,
          totalQuestionsAnswered: 0,
          correctAnswers: 0,
          incorrectAnswers: 0,
          avgScore: 0,
          categoryStats: {},
          difficultyStats: {},
          lastGames: []
        });
        console.log('Boş istatistikler ayarlandı');
        setLoading(false);
        return;
      }
      
      // Ortalama skoru hesapla
      const avgScore = userStats.totalQuestionsAnswered > 0 
        ? Math.round((userStats.correctAnswers / userStats.totalQuestionsAnswered) * 100) 
        : 0;
        
      setStats({
        ...userStats,
        avgScore
      });
      
      console.log('İstatistikler başarıyla yüklendi');
    } catch (error) {
      console.error('İstatistikler yüklenirken hata:', error);
      console.error('Hata detayı:', error.stack || 'Stack bilgisi yok');
      
      // Hata durumunda boş istatistik göster
      setStats({
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        avgScore: 0,
        categoryStats: {},
        difficultyStats: {},
        lastGames: []
      });
    } finally {
      setLoading(false);
    }
  };

  const resetStatistics = async () => {
    try {
      console.log('İstatistikler sıfırlanıyor...');
      
      // Varsayılan boş istatistik
      const emptyStats = {
        totalGamesPlayed: 0,
        totalQuestionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        categoryStats: {},
        difficultyStats: {},
        lastGames: []
      };
      
      // QuestionService aracılığıyla boş istatistik verisini kaydet
      const result = await QuestionService.updateUserStatistics(emptyStats, 'default');
      
      if (result) {
        console.log('İstatistikler başarıyla sıfırlandı');
        // İstatistikleri tekrar yükle
        await loadStatistics();
      } else {
        throw new Error('İstatistikler sıfırlanamadı');
      }
    } catch (error) {
      console.error('İstatistikler sıfırlanırken hata:', error);
      Alert.alert('Hata', 'İstatistikler sıfırlanırken bir hata oluştu.');
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return theme.colors.success;
    if (accuracy >= 60) return theme.colors.primary;
    if (accuracy >= 40) return theme.colors.warning;
    return theme.colors.danger;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>İstatistikler yükleniyor...</Text>
      </View>
    );
  }

  // Kategori istatistikleri
  console.log('Kategori istatistikleri:', JSON.stringify(stats.categoryStats, null, 2));
  const categoryEntries = Object.entries(stats.categoryStats || {});

  // Zorluk seviyesi istatistikleri
  console.log('Zorluk seviyesi istatistikleri:', JSON.stringify(stats.difficultyStats, null, 2));
  const difficultyEntries = Object.entries(stats.difficultyStats || {});

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
        <Text style={styles.headerTitle}>İstatistikler</Text>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={() => {
            Alert.alert(
              'İstatistikler Sıfırlansın mı?',
              'Tüm istatistikleriniz silinecek. Bu işlem geri alınamaz.',
              [
                { text: 'İptal', style: 'cancel' },
                { text: 'Sıfırla', onPress: resetStatistics, style: 'destructive' }
              ]
            );
          }}
        >
          <Icon name="refresh" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryContainer}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryDark]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.totalGamesPlayed}</Text>
                <Text style={styles.summaryLabel}>Oyun</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.totalQuestionsAnswered}</Text>
                <Text style={styles.summaryLabel}>Soru</Text>
              </View>
              
              <View style={styles.summaryItem}>
                <Text style={styles.summaryValue}>{stats.avgScore}%</Text>
                <Text style={styles.summaryLabel}>Başarı</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Doğruluk Oranı</Text>
          <View style={styles.accuracyContainer}>
            <View style={styles.accuracyChart}>
              <View 
                style={[
                  styles.accuracyBar, 
                  { 
                    width: `${stats.avgScore}%`,
                    backgroundColor: getAccuracyColor(stats.avgScore)
                  }
                ]} 
              />
            </View>
            <View style={styles.accuracyStats}>
              <View style={styles.accuracyStat}>
                <Icon name="check-circle" size={16} color={theme.colors.success} />
                <Text style={styles.accuracyValue}>{stats.correctAnswers}</Text>
                <Text style={styles.accuracyLabel}>Doğru</Text>
              </View>
              <View style={styles.accuracyStat}>
                <Icon name="close-circle" size={16} color={theme.colors.danger} />
                <Text style={styles.accuracyValue}>{stats.incorrectAnswers}</Text>
                <Text style={styles.accuracyLabel}>Yanlış</Text>
              </View>
            </View>
          </View>
        </View>

        {categoryEntries.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Kategorilere Göre Performans</Text>
            <View style={styles.statsGrid}>
              {categoryEntries.map(([category, data]) => {
                const total = data.total || 0;
                const correct = data.correct || 0;
                const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
                  
                return (
                  <View key={category} style={styles.categoryCard}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <View style={styles.categoryStats}>
                      <Text style={styles.categoryValue}>{total}</Text>
                      <Text style={styles.categoryLabel}>Soru</Text>
                    </View>
                    <View style={styles.categoryAccuracy}>
                      <View 
                        style={[
                          styles.categoryAccuracyBar, 
                          { 
                            width: `${accuracy}%`,
                            backgroundColor: getAccuracyColor(accuracy)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.accuracyText}>{accuracy}%</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {difficultyEntries.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Zorluk Seviyesine Göre</Text>
            <View style={styles.difficultyContainer}>
              {difficultyEntries.map(([difficulty, data]) => {
                const total = data.total || 0;
                const correct = data.correct || 0;
                const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
                
                // Zorluk seviyesine göre renk
                let color;
                switch(difficulty) {
                  case 'Kolay': color = theme.colors.success; break;
                  case 'Orta': color = theme.colors.warning; break;
                  case 'Zor': color = theme.colors.danger; break;
                  default: color = theme.colors.primary;
                }
                
                return (
                  <View key={difficulty} style={styles.difficultyRow}>
                    <View style={styles.difficultyInfo}>
                      <Text style={[styles.difficultyName, { color }]}>{difficulty}</Text>
                      <Text style={styles.difficultyValue}>{total} soru</Text>
                    </View>
                    <View style={styles.difficultyAccuracy}>
                      <View 
                        style={[
                          styles.difficultyAccuracyBar, 
                          { 
                            width: `${accuracy}%`,
                            backgroundColor: color
                          }
                        ]} 
                      />
                      <Text style={styles.difficultyAccuracyText}>{accuracy}%</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {stats.lastGames.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Son Oyunlar</Text>
            <View style={styles.lastGamesContainer}>
              {stats.lastGames.slice(0, 5).map((game, index) => (
                <View key={index} style={styles.gameCard}>
                  <View style={styles.gameHeader}>
                    <Text style={styles.gameDate}>
                      {new Date(game.date).toLocaleDateString('tr-TR')}
                    </Text>
                    <Text style={styles.gameTime}>
                      {new Date(game.date).toLocaleTimeString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.gameStats}>
                    <Text style={styles.gameScore}>
                      {game.score} / {game.totalQuestions}
                    </Text>
                    <Text 
                      style={[
                        styles.gameAccuracy, 
                        { 
                          color: getAccuracyColor(
                            Math.round((game.score / game.totalQuestions) * 100)
                          ) 
                        }
                      ]}
                    >
                      {Math.round((game.score / game.totalQuestions) * 100)}%
                    </Text>
                  </View>
                  {game.category && (
                    <View style={styles.gameCategory}>
                      <Icon name="tag" size={12} color={theme.colors.textMuted} />
                      <Text style={styles.gameCategoryText}>{game.category}</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {stats.totalGamesPlayed === 0 && (
          <View style={styles.emptyState}>
            <Icon name="chart-line" size={80} color={theme.colors.textMuted} />
            <Text style={styles.emptyStateTitle}>Henüz İstatistik Yok</Text>
            <Text style={styles.emptyStateText}>
              Sorular çözmeye başladığınızda burada istatistikleriniz görünecek.
            </Text>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Game')}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.startButtonGradient}
              >
                <Icon name="play" size={20} color={theme.colors.white} />
                <Text style={styles.startButtonText}>Soru Çözmeye Başla</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
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
  summaryContainer: {
    marginBottom: theme.spacing.large,
  },
  summaryCard: {
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.large,
    ...theme.shadows.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: theme.typography.h1,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  summaryLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.whiteMuted,
    marginTop: theme.spacing.small,
  },
  sectionContainer: {
    marginBottom: theme.spacing.large,
  },
  sectionTitle: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.medium,
  },
  accuracyContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    ...theme.shadows.small,
  },
  accuracyChart: {
    height: 20,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: theme.spacing.medium,
  },
  accuracyBar: {
    height: '100%',
    borderRadius: 10,
  },
  accuracyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accuracyStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyValue: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.small,
  },
  accuracyLabel: {
    fontSize: theme.typography.body2,
    color: theme.colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.small,
  },
  categoryName: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.small,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.small,
  },
  categoryValue: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  categoryLabel: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.small,
  },
  categoryAccuracy: {
    height: 8,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.small,
  },
  categoryAccuracyBar: {
    height: '100%',
    borderRadius: 4,
  },
  accuracyText: {
    fontSize: theme.typography.small,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
  difficultyContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    ...theme.shadows.small,
  },
  difficultyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
  },
  difficultyInfo: {
    width: '30%',
  },
  difficultyName: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
  },
  difficultyValue: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
  },
  difficultyAccuracy: {
    width: '65%',
  },
  difficultyAccuracyBar: {
    height: 10,
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: theme.spacing.small,
  },
  difficultyAccuracyText: {
    fontSize: theme.typography.small,
    fontWeight: 'bold',
    color: theme.colors.textMuted,
    textAlign: 'right',
  },
  lastGamesContainer: {
    marginBottom: theme.spacing.medium,
  },
  gameCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    ...theme.shadows.small,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.small,
  },
  gameDate: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },
  gameTime: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  gameScore: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  gameAccuracy: {
    fontSize: theme.typography.h3,
    fontWeight: 'bold',
  },
  gameCategory: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gameCategoryText: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxl,
  },
  emptyStateTitle: {
    fontSize: theme.typography.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.medium,
  },
  emptyStateText: {
    fontSize: theme.typography.body1,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
  startButton: {
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    ...theme.shadows.small,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
  },
  startButtonText: {
    fontSize: theme.typography.body1,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginLeft: theme.spacing.small,
  },
});

export default StatisticsScreen; 