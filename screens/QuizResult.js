import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const QuizResult = ({ route, navigation }) => {
  const { score, total, category } = route.params;
  const percentage = Math.round((score / total) * 100);

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

  let resultMessage = '';
  let resultIcon = '';
  
  if (percentage >= 80) {
    resultMessage = 'Mükemmel!';
    resultIcon = 'trophy';
  } else if (percentage >= 60) {
    resultMessage = 'Çok İyi!';
    resultIcon = 'thumb-up';
  } else if (percentage >= 40) {
    resultMessage = 'İyi!';
    resultIcon = 'emoticon';
  } else {
    resultMessage = 'Geliştirebilirsin!';
    resultIcon = 'school';
  }

  const categoryColor = getCategoryColor(category);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <LinearGradient
        colors={[categoryColor, categoryColor.replace('1)', '0.7)')]}
        style={styles.gradient}
      >
        <View style={styles.resultContainer}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scorePercentage}>{percentage}%</Text>
            <Text style={styles.scoreText}>{score}/{total}</Text>
          </View>
          
          <Text style={styles.resultMessage}>{resultMessage}</Text>
          <Icon name={resultIcon} size={fontSize(15)} color="white" style={styles.resultIcon} />
          
          <Text style={styles.categoryText}>Kategori: {category}</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Quiz', { category })}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.buttonGradient}
              >
                <Icon name="reload" size={fontSize(5)} color="white" />
                <Text style={styles.buttonText}>Tekrar Dene</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => navigation.navigate('Categories')}
            >
              <LinearGradient
                colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                style={styles.buttonGradient}
              >
                <Icon name="format-list-bulleted" size={fontSize(5)} color="white" />
                <Text style={styles.buttonText}>Kategorilere Dön</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  gradient: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5),
  },
  resultContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: wp(5),
    padding: wp(6),
    alignItems: 'center',
  },
  scoreCircle: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(3),
  },
  scorePercentage: {
    color: 'white',
    fontSize: fontSize(10),
    fontWeight: 'bold',
  },
  scoreText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize(5),
    marginTop: hp(1),
  },
  resultMessage: {
    color: 'white',
    fontSize: fontSize(8),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  resultIcon: {
    marginBottom: hp(3),
  },
  categoryText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: fontSize(4.5),
    marginBottom: hp(4),
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    width: '100%',
    height: hp(6),
    borderRadius: wp(3),
    overflow: 'hidden',
    marginBottom: hp(2),
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: fontSize(4),
    fontWeight: '600',
    marginLeft: wp(2),
  },
});

export default QuizResult; 