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
  background: '#1a1a1a',
  backgroundLight: '#2d2d2d',
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  white: '#FFFFFF',
  whiteMuted: 'rgba(255,255,255,0.7)',
  whiteMutedLight: 'rgba(255,255,255,0.5)',
  whiteMutedDark: 'rgba(255,255,255,0.8)',
  error: '#F44336',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  headerOverlayDark: 'rgba(0,0,0,0.3)',
  cardOverlay: 'rgba(0,0,0,0.1)',
};

// Kategori renkleri ve ikonları
export const categories = [
  { title: 'Coğrafya', icon: 'earth', color: 'rgba(76, 175, 80, 1)', count: 250 },
  { title: 'Kimya', icon: 'flask', color: 'rgba(244, 67, 54, 1)', count: 180 },
  { title: 'Bilim', icon: 'atom', color: 'rgba(33, 150, 243, 1)', count: 200 },
  { title: 'Günlük', icon: 'calendar-today', color: 'rgba(156, 39, 176, 1)', count: 150 },
  { title: 'Spor', icon: 'soccer', color: 'rgba(255, 152, 0, 1)', count: 120 },
  { title: 'Etkinlik', icon: 'star', color: 'rgba(96, 125, 139, 1)', count: 90 },
  { title: 'Söz ve Deyiş', icon: 'chat', color: 'rgba(0, 188, 212, 1)', count: 300 },
  { title: 'Spor ve Oyun', icon: 'basketball', color: 'rgba(121, 85, 72, 1)', count: 160 },
  { title: 'Yeşilçam', icon: 'movie', color: 'rgba(233, 30, 99, 1)', count: 140 },
];

// Genel stil ayarları
export const spacing = {
  xs: wp(2),
  sm: wp(3),
  md: wp(5),
  lg: wp(7),
  xl: wp(10),
};

export const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;

// Yardımcı metotlar
export const getCategoryColor = (categoryName) => {
  const category = categories.find(c => c.title === categoryName);
  return category ? category.color : colors.background;
};

export const getCategoryIcon = (categoryName) => {
  const category = categories.find(c => c.title === categoryName);
  return category ? category.icon : 'help-circle';
};

export const formatCategoryForDB = (categoryName) => {
  return categoryName.toLowerCase().replace(/\s+/g, '');
};

export default {
  wp,
  hp,
  fontSize,
  colors,
  categories,
  spacing,
  statusBarHeight,
  getCategoryColor,
  getCategoryIcon,
  formatCategoryForDB
}; 