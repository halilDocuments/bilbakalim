import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ImageBackground, 
  SafeAreaView,
  StatusBar,
  Platform,
  BackHandler
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { wp, hp, fontSize, colors, spacing } from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  // Uygulama çıkışı için back tuşunu yönet
  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient
        colors={[colors.background, colors.backgroundLight]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Icon name="brain" size={fontSize(20)} color={colors.white} />
            <Text style={styles.title}>Bil Bakalım</Text>
            <Text style={styles.subtitle}>Bilgi Yarışması</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Categories')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>Başla</Text>
                <Icon name="arrow-right" size={fontSize(6)} color={colors.white} />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.aboutButton}
              activeOpacity={0.7}
            >
              <Text style={styles.aboutText}>Hakkında</Text>
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
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: wp(5),
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + hp(8) : hp(10),
    paddingBottom: hp(10),
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: fontSize(10),
    fontWeight: 'bold',
    color: colors.white,
    marginTop: hp(2),
  },
  subtitle: {
    fontSize: fontSize(4.5),
    color: colors.whiteMuted,
    marginTop: hp(1),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    height: hp(7),
    borderRadius: wp(8),
    overflow: 'hidden',
    marginBottom: hp(2),
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(5),
    fontWeight: 'bold',
    marginRight: wp(2),
  },
  aboutButton: {
    padding: wp(4),
  },
  aboutText: {
    color: colors.whiteMuted,
    fontSize: fontSize(4),
  },
});

export default HomeScreen; 