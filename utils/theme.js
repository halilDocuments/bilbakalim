import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Responsive ölçüler için yardımcı fonksiyonlar
export const wp = (percentage) => {
  return width * (percentage / 100);
};

export const hp = (percentage) => {
  return height * (percentage / 100);
};

export const fontSize = (size) => {
  return Math.min(wp(size), hp(size / 1.5));
};

// Ana renkler
export const colors = {
  background: '#121212', // Daha koyu bir arka plan
  backgroundLight: '#1E1E1E', // Hafif açık bir arka plan
  backgroundLighter: '#2D2D2D', // Card arka planı için
  
  primary: '#4CAF50', // Ana renk
  primaryLight: '#81C784', // Ana renk açık tonu
  primaryDark: '#388E3C', // Ana renk koyu tonu
  
  secondary: '#FF5722', // İkincil renk
  secondaryLight: '#FF8A65', // İkincil renk açık tonu
  secondaryDark: '#E64A19', // İkincil renk koyu tonu
  
  // Metin renkleri
  text: '#FFFFFF', // Beyaz metin
  textMuted: 'rgba(255,255,255,0.7)', // Hafif soluk metin
  textSecondary: 'rgba(255,255,255,0.5)', // Daha soluk metin
  
  // UI renkleri
  white: '#FFFFFF',
  black: '#000000',
  card: '#262626', // Kart arka planı
  border: '#333333', // Kenar çizgileri
  
  // Durum renkleri
  success: '#4CAF50',
  successLight: 'rgba(76, 175, 80, 0.2)',
  
  warning: '#FFC107',
  warningLight: 'rgba(255, 193, 7, 0.2)',
  
  danger: '#F44336',
  dangerLight: 'rgba(244, 67, 54, 0.2)',
  
  info: '#2196F3',
  infoLight: 'rgba(33, 150, 243, 0.2)',
  
  // Eski temadan korunan değerler
  whiteMuted: 'rgba(255,255,255,0.7)',
  whiteMutedLight: 'rgba(255,255,255,0.5)',
  whiteMutedDark: 'rgba(255,255,255,0.9)',
  error: '#F44336',
  headerOverlayDark: 'rgba(0,0,0,0.5)',
  cardOverlay: 'rgba(0,0,0,0.2)',
  cardBackground: '#262626',
  cardBorder: '#333333',
  textPrimary: '#FFFFFF',
};

// Kategorileri doğrudan bir dizi olarak değil, hem string hem de kategoriye özel bilgileri içerecek şekilde güncelleyelim
export const categories = [
  'Coğrafya', 'Kimya', 'Bilim', 'Günlük', 'Spor', 'Tarih', 'Atasözleri', 'Oyunlar', 'Yeşilçam'
];

// Kategori detayları artık ayrı bir nesnede tutulacak
export const categoryDetails = {
  'Coğrafya': { icon: 'earth', color: '#4CAF50', count: 250 },
  'Kimya': { icon: 'flask', color: '#F44336', count: 180 },
  'Bilim': { icon: 'atom', color: '#2196F3', count: 200 },
  'Günlük': { icon: 'calendar-today', color: '#9C27B0', count: 150 },
  'Spor': { icon: 'soccer', color: '#FF9800', count: 120 },
  'Tarih': { icon: 'history', color: '#607D8B', count: 90 },
  'Atasözleri': { icon: 'chat-outline', color: '#00BCD4', count: 300 },
  'Oyunlar': { icon: 'controller-classic', color: '#795548', count: 160 },
  'Yeşilçam': { icon: 'film', color: '#E91E63', count: 140 },
};

// Genel stil ayarları
export const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 48,
};

// Kenar yuvarlaklığı
export const borderRadius = {
  small: 4,
  medium: 8,
  large: 16,
  xl: 24,
  round: 1000, // Tam yuvarlak için
};

// Tipografi
export const typography = {
  small: 12,
  body2: 14,
  body1: 16,
  h3: 18,
  h2: 22,
  h1: 28,
  title: 34,
};

// Gölgeler
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
};

export const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Kategori fonksiyonlarını yeni yapıya göre güncelleyelim
export const getCategoryColor = (categoryName) => {
  if (!categoryName) return colors.primary;
  const details = categoryDetails[categoryName];
  return details ? details.color : colors.primary;
};

export const getCategoryIcon = (categoryName) => {
  if (!categoryName) return 'help-circle';
  const details = categoryDetails[categoryName];
  return details ? details.icon : 'help-circle';
};

export const formatCategoryForDB = (categoryName) => {
  if (!categoryName) return '';
  return categoryName.trim();
};

// Zorluk seviyesi renkleri
export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Kolay': 
      return colors.success;
    case 'Orta': 
      return colors.warning;
    case 'Zor': 
      return colors.danger;
    default: 
      return colors.info;
  }
};

export const getDifficultyIcon = (difficulty) => {
  switch (difficulty) {
    case 'Kolay': 
      return 'star-outline';
    case 'Orta': 
      return 'star-half';
    case 'Zor': 
      return 'star';
    default: 
      return 'help-circle';
  }
};

export default {
  wp,
  hp,
  fontSize,
  colors,
  categories,
  spacing,
  borderRadius,
  typography,
  shadows,
  statusBarHeight,
  getCategoryColor,
  getCategoryIcon,
  formatCategoryForDB,
  getDifficultyColor,
  getDifficultyIcon
}; 

// deneme comit sdfsaf
//denememe 