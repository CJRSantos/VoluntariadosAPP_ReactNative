// app/areas.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer'; // Added ImageViewer
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import areasData from '../assets/data/areas.json';
import { Header } from '../src/components/Header';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { useAuth } from './providers/AuthProvider';
const { width } = Dimensions.get('window');

export default function AreasScreen() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const isDark = theme === 'dark';
  const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isProfileImageVisible, setIsProfileImageVisible] = useState(false);

  const { composedGesture } = useSwipeNavigation({
    onSwipeLeft: () => router.push('/convocatoria'),
    onSwipeRight: () => router.push('/account'),
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 🔹 Redirigir si no hay usuario
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading]);

  // 🔹 Ubicación
  useEffect(() => {
    (async () => {
      try {
        const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
        if (savedPhoto) setProfileImage(savedPhoto);

        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(t('areas.locationPermissionDenied'));
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        const [reverseGeocode] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        if (reverseGeocode) {
          const cityName =
            reverseGeocode.city ||
            reverseGeocode.region ||
            reverseGeocode.country ||
            t('areas.unknownLocation');
          setAddress(cityName);
        }
      } catch (error) {
        console.log('Error obteniendo ubicación:', error);
        setErrorMsg(t('areas.locationError'));
      }
    })();
  }, []);

  const areas = areasData;

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.loading}>
          <Text style={{ color: isDark ? '#FFF' : '#333' }}>{t('areas.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={composedGesture}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          {/* Encabezado Moderno con Header Component */}
          <Header
            user={user}
            isDark={isDark}
            t={t}
            toggleMenu={toggleMenu}
            localProfileImage={profileImage}
            onImagePress={() => setIsProfileImageVisible(true)}
          />

          {/* Menú desplegable */}
          {isMenuOpen && (
            <>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsMenuOpen(false)}
              />
              <View style={[styles.menuOverlay, { backgroundColor: isDark ? '#111' : '#FFF' }]}>
                <View style={[styles.menuContainer, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      router.push('/profile');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Ionicons name="person" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                      {t('areas.menu.profile')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      router.push('/settings');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Ionicons name="settings" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                      {t('areas.menu.settings')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      Alert.alert(t('areas.menu.soon'), t('areas.menu.helpSoon'));
                      setIsMenuOpen(false);
                    }}
                  >
                    <Ionicons name="help-circle" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('areas.menu.help')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Ionicons name="log-out" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                      {t('areas.menu.logout')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Contenido principal */}
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
              {t('areas.sectionTitle')}
            </Text>

            {areas.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.areaCard,
                  {
                    backgroundColor: isDark ? '#111' : '#FFF',
                    shadowColor: '#000',
                  },
                ]}
                onPress={() => router.push({
                  pathname: '/area-details',
                  params: { id: area.id }
                })}
              >
                <View style={styles.areaHeader}>
                  <View style={styles.locationBadge}>
                    <Ionicons name="location" size={14} color="#fff" />
                    <Text style={styles.locationText}>
                      {errorMsg ? t('areas.noLocation') : address || t('areas.gettingLocation')}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.areaDirection, { color: isDark ? '#AAA' : '#666' }]}>
                  {area.direction?.[currentLang] || ''}
                </Text>
                <Text style={[styles.areaTitle, { color: isDark ? '#FFF' : '#333' }]}>
                  {area.title?.[currentLang] || ''}
                </Text>
                <Text style={[styles.areaDescription, { color: isDark ? '#AAA' : '#666' }]}>
                  {area.description?.[currentLang] || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Barra inferior */}
          <View style={[styles.bottomNav, { borderTopColor: isDark ? '#333' : '#EEE', backgroundColor: isDark ? '#111' : '#FFF' }]}>
            <TouchableOpacity
              style={[styles.navItem, pathname === '/account' && styles.navItemActive]}
              onPress={() => router.replace('/account')}
            >
              <Ionicons
                name="home"
                size={24}
                color={pathname === '/account' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text style={[styles.navLabel, pathname === '/account' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('areas.nav.home')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem, pathname === '/areas' && styles.navItemActive]}
              onPress={() => router.replace('/areas')}
            >
              <Ionicons
                name="grid-outline"
                size={24}
                color={pathname === '/areas' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text style={[styles.navLabel, pathname === '/areas' && styles.navLabelActive, { color: '#4CAF50' }]}>{t('areas.nav.areas')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem, pathname === '/convocatoria' && styles.navItemActive]}
              onPress={() => router.replace('/convocatoria')}
            >
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={pathname === '/convocatoria' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text style={[styles.navLabel, pathname === '/convocatoria' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('areas.nav.convocatory')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navItem, pathname === '/nosotros' && styles.navItemActive]}
              onPress={() => router.replace('/nosotros')}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={pathname === '/nosotros' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text style={[styles.navLabel, pathname === '/nosotros' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('areas.nav.about')}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal para ver la foto de perfil */}
        <Modal
          visible={isProfileImageVisible}
          transparent={true}
          onRequestClose={() => setIsProfileImageVisible(false)}
        >
          <ImageViewer
            imageUrls={[
              {
                url: profileImage || user?.photoURL || '',
                props: {
                  source: profileImage
                    ? { uri: profileImage }
                    : user?.photoURL
                      ? { uri: user.photoURL }
                      : require('../assets/images/avatar-default.png'),
                },
              },
            ]}
            onSwipeDown={() => setIsProfileImageVisible(false)}
            enableSwipeDown={true}
            renderHeader={() => (
              <TouchableOpacity
                style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}
                onPress={() => setIsProfileImageVisible(false)}
              >
                <Ionicons name="close" size={30} color="#fff" />
              </TouchableOpacity>
            )}
          />
        </Modal>
      </SafeAreaView>
    </GestureDetector>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', zIndex: 999 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // Removed old header styles
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 10, textAlign: 'center' },
  areaCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  areaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: { color: '#fff', fontSize: 12, marginLeft: 4, fontWeight: '600' },
  areaDirection: { fontSize: 12, marginBottom: 8, fontWeight: '500' },
  areaTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  areaDescription: { fontSize: 14, lineHeight: 20 },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: { alignItems: 'center', paddingVertical: 8 },
  navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
  navItemActive: { borderTopWidth: 2, borderTopColor: '#4CAF50' },
  navLabelActive: { color: '#4CAF50', fontWeight: 'bold' },

  menuOverlay: { position: 'absolute', top: 70, right: 16, zIndex: 1000, borderRadius: 8, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  menuContainer: { padding: 8, minWidth: 160 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  menuText: { marginLeft: 8, fontSize: 14 },
});
