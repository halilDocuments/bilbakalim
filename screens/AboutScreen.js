import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Linking,
  Image,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as theme from '../utils/theme';


const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '1';
const RELEASE_DATE = '2025';

const AboutScreen = ({ navigation }) => {
  // Linkler için yardımcı fonksiyon
  const openLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("URL açılamıyor: " + url);
      }
    } catch (error) {
      console.error("URL açılırken hata oluştu:", error);
    }
  };

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
        <Text style={styles.headerTitle}>Hakkında</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Logo ve App Bilgisi */}
        <View style={styles.logoContainer}>
          <Icon name="help-box" size={80} color={theme.colors.primary} />
          <Text style={styles.appName}>Bilbakalım</Text>
          <Text style={styles.versionText}>Sürüm {APP_VERSION} (Build {BUILD_NUMBER})</Text>
        </View>

        {/* Uygulama Açıklaması */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Hakkında</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.descriptionText}>
              Bu uygulama Meslek Lisesi Proje Geliştirme Dersi 2.Dönem 1.Sınav için Değil Uzun Dönem Portfolyo için Geliştirilmekte Olan Hala Eksikleri Olan Bir Mobil Uygulamadır
            </Text>
            <Text style={styles.descriptionText}>
              Bu uygulama React Native ile JavaScript Kullanılarak Yapılmıştır 
            </Text>
          </View>
        </View>

        {/* Özellikler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          <View style={styles.sectionContent}>
            <FeatureItem icon="category" text="Çeşitli kategorilerde sorular" />
            <FeatureItem icon="star-outline" text="Farklı zorluk seviyeleri" />
            <FeatureItem icon="timer-outline" text="Zamanlı oyun modu" />
            <FeatureItem icon="chart-line" text="Detaylı istatistikler" />
            <FeatureItem icon="playlist-edit" text="Kendiniz soru ekleyebilme" />
            <FeatureItem icon="cog-outline" text="Özelleştirilebilir ayarlar" />
          </View>
        </View>

        {/* İletişim */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>İletişim</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => openLink('mailto:info@halilharman.com')}
            >
              <Icon name="email-outline" size={22} color={theme.colors.primary} />
              <Text style={styles.contactText}>info@halilharman.com</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => openLink('https://halilharman.com')}
            >
              <Icon name="web" size={22} color={theme.colors.primary} />
              <Text style={styles.contactText}>www.HALİLHARMAN.com</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Yasal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yasal</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Text style={styles.legalText}>Gizlilik Politikası</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <Text style={styles.legalText}>Kullanım Koşulları</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => openLink('')}
            >
              <Text style={styles.legalText}>Açık Kaynak Lisansları</Text>
              <Icon name="chevron-right" size={20} color={theme.colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {RELEASE_DATE} SORU BİL. Tüm hakları saklıdır.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Özellik Liste Öğesi Bileşeni
const FeatureItem = ({ icon, text }) => (
  <View style={styles.featureItem}>
    <Icon name={icon} size={20} color={theme.colors.primary} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.medium,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.xlarge,
  },
  appLogo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.medium,
  },
  appName: {
    fontSize: theme.typography.h1,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.medium,
  },
  versionText: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.small,
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
    padding: theme.spacing.medium,
    ...theme.shadows.small,
  },
  descriptionText: {
    fontSize: theme.typography.body1,
    color: theme.colors.text,
    lineHeight: 22,
    marginBottom: theme.spacing.medium,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.small,
  },
  featureText: {
    marginLeft: theme.spacing.medium,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contactText: {
    marginLeft: theme.spacing.medium,
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  legalText: {
    fontSize: theme.typography.body2,
    color: theme.colors.text,
  },
  footer: {
    marginTop: theme.spacing.large,
    marginBottom: theme.spacing.xlarge,
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.small,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});

export default AboutScreen; 