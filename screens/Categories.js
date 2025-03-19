import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar,
  Platform,
  BackHandler
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { wp, hp, fontSize, colors, categories as appCategories, spacing } from '../utils/theme';

// Doğrudan sabit bir genişlik belirtelim
const CARD_WIDTH = (wp(100) - wp(15)) / 2;

const CategoryCard = ({ title, icon, color, count, onPress }) => {
  const gradientColors = [
    color,
    color.replace('1)', '0.8)')
  ];
  
  return (
    <TouchableOpacity 
      style={styles.cardWrapper} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.categoryCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Icon name={icon} size={fontSize(8)} color={colors.white} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.categoryTitle}>{title}</Text>
          <Text style={styles.questionCount}>{count} Soru</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const Categories = ({ navigation }) => {
  // Back tuşu için handler eklenecek
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };
      
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      
      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  const handleCategoryPress = (category) => {
    navigation.navigate('Quiz', { category: category.title });
  };

  const handleBackPress = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Icon name="arrow-left" size={fontSize(6)} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kategoriler</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => navigation.navigate('AddQuestion')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.addButtonGradient}
          >
            <Icon name="plus" size={fontSize(5)} color={colors.white} />
            <Text style={styles.addButtonText}>Yeni Soru Ekle</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.categoriesGrid}>
            {appCategories.map((category, index) => (
              <CategoryCard 
                key={index} 
                {...category} 
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: wp(5),
    paddingVertical: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(3),
  },
  headerTitle: {
    fontSize: fontSize(7),
    fontWeight: '700',
    color: colors.white,
  },
  addButton: {
    marginHorizontal: wp(5),
    marginBottom: wp(3),
    height: hp(6),
    borderRadius: wp(3),
    overflow: 'hidden',
  },
  addButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: fontSize(4),
    marginLeft: wp(2),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp(5),
    paddingTop: 0,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: wp(5),
    borderRadius: wp(5),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  categoryCard: {
    height: hp(20),
    padding: wp(4),
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(4),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    marginTop: 'auto',
  },
  categoryTitle: {
    color: colors.white,
    fontSize: fontSize(4.5),
    fontWeight: '700',
    marginBottom: hp(0.5),
  },
  questionCount: {
    color: colors.whiteMutedDark,
    fontSize: fontSize(3.5),
    fontWeight: '500',
  },
});

export default Categories; 