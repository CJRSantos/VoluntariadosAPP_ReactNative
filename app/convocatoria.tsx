// app/convocatoria.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import { Header } from '../src/components/Header';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
import { useAuth } from './providers/AuthProvider';

const { width, height } = Dimensions.get('window');

export const options = {
  headerShown: false,
};

export default function ConvocatoriaScreen() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [postulaciones, setPostulaciones] = useState<Record<number, boolean>>({});
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const { composedGesture } = useSwipeNavigation({
    onSwipeLeft: () => router.push('/nosotros'),
    onSwipeRight: () => router.push('/areas'),
  });

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 🔁 Cargar estado de postulación y foto de perfil al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const savedPostulaciones = await AsyncStorage.getItem('postulaciones');
        if (savedPostulaciones) {
          setPostulaciones(JSON.parse(savedPostulaciones));
        }
        const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
        if (savedPhoto) {
          setProfileImage(savedPhoto);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  const convocatorias = [
    {
      id: 1,
      image: require('../assets/images/tutorial1.jpg'),
      title: t('convocatoria.items.1.title'),
      location: t('convocatoria.items.1.location'),
      participants: t('convocatoria.items.1.participants'),
      startDate: t('convocatoria.items.1.startDate'),
      endDate: t('convocatoria.items.1.endDate'),
    },
    {
      id: 2,
      image: require('../assets/images/bosques2.png'),
      title: t('convocatoria.items.2.title'),
      location: t('convocatoria.items.2.location'),
      participants: t('convocatoria.items.2.participants'),
      startDate: t('convocatoria.items.2.startDate'),
      endDate: t('convocatoria.items.2.endDate'),
    },
    {
      id: 3,
      image: require('../assets/images/bosques3.png'),
      title: t('convocatoria.items.3.title'),
      location: t('convocatoria.items.3.location'),
      participants: t('convocatoria.items.3.participants'),
      startDate: t('convocatoria.items.3.startDate'),
      endDate: t('convocatoria.items.3.endDate'),
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.loading}>
          <Text style={{ color: isDark ? '#FFF' : '#333' }}>{t('convocatoria.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureDetector gesture={composedGesture}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
          {/* Encabezado Moderno con Header Component */}
          <Header
            user={user}
            isDark={isDark}
            t={t}
            toggleMenu={toggleMenu}
            localProfileImage={profileImage}
          />

          {/* Menú desplegable */}
          {isMenuOpen && (
            <>
              <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={() => setIsMenuOpen(false)}
              />
              <View
                style={[
                  styles.menuOverlay,
                  { backgroundColor: isDark ? '#111' : '#FFF' },
                ]}
              >
                <View
                  style={[
                    styles.menuContainer,
                    { backgroundColor: isDark ? '#222' : '#FFF' },
                  ]}
                >
                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      router.push('/profile');
                      setIsMenuOpen(false);
                    }}
                  >
                    <Ionicons name="person" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                      {t('convocatoria.menu.profile')}
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
                      {t('convocatoria.menu.settings')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                    onPress={() => {
                      Alert.alert(t('convocatoria.menu.soon'), t('convocatoria.menu.helpSoon'));
                    }}
                  >
                    <Ionicons name="help-circle" size={20} color={isDark ? '#FFF' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                      {t('convocatoria.menu.help')}
                    </Text>
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
                      {t('convocatoria.menu.logout')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Contenido principal */}
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.content}>
              {convocatorias.map((convocatoria) => (
                <View
                  key={convocatoria.id}
                  style={[
                    styles.convocatoriaCard,
                    {
                      backgroundColor: isDark ? '#111' : '#FFF', // Cleaner white background
                      shadowColor: '#000',
                    },
                  ]}
                >
                  <TouchableOpacity onPress={() => setSelectedImage(convocatoria.image)}>
                    <Image
                      source={convocatoria.image}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>
                      {convocatoria.title}
                    </Text>
                    <Text style={[styles.cardInfo, { color: isDark ? '#AAA' : '#666' }]}>
                      {convocatoria.location} · {convocatoria.participants}
                    </Text>
                    <Text style={[styles.cardDate, { color: isDark ? '#AAA' : '#666' }]}>
                      {t('convocatoria.card.start')}: {convocatoria.startDate}
                    </Text>
                    <Text style={[styles.cardDate, { color: isDark ? '#AAA' : '#666' }]}>
                      {t('convocatoria.card.end')}: {convocatoria.endDate}
                    </Text>
                    <View style={styles.buttonGroup}>
                      <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => router.push('/requisitos')}
                      >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                          {t('convocatoria.card.requirements')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        onPress={() => router.push('/mas-info')}
                      >
                        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                          {t('convocatoria.card.moreInfo')}
                        </Text>
                      </TouchableOpacity>

                      {/* ✅ BOTÓN DE POSTULACIÓN CONDICIONAL */}
                      {postulaciones[convocatoria.id] ? (
                        <View
                          style={[
                            styles.button,
                            { backgroundColor: isDark ? '#444' : '#ccc' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              { color: isDark ? '#bbb' : '#666' },
                            ]}
                          >
                            {t('Postulado')}
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.button, { backgroundColor: '#4CAF50' }]}
                          onPress={() =>
                            router.push({
                              pathname: '/postulacion-paso1',
                              params: { convocatoriaId: convocatoria.id }
                            })
                          }
                        >
                          <Text style={styles.buttonText}>
                            {t('convocatoria.card.apply')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Barra inferior con resaltado */}
          <View
            style={[
              styles.bottomNav,
              {
                borderTopColor: isDark ? '#333' : '#EEE',
                backgroundColor: isDark ? '#111' : '#FFF',
              },
            ]}
          >
            {/* Inicio */}
            <TouchableOpacity
              style={[
                styles.navItem,
                pathname === '/account' && styles.navItemActive,
              ]}
              onPress={() => router.replace('/account')}
            >
              <Ionicons
                name="home"
                size={24}
                color={pathname === '/account' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text
                style={[
                  styles.navLabel,
                  pathname === '/account' && styles.navLabelActive,
                  { color: isDark ? '#AAA' : '#666' },
                ]}
              >
                {t('convocatoria.nav.home')}
              </Text>
            </TouchableOpacity>

            {/* Áreas */}
            <TouchableOpacity
              style={[styles.navItem, pathname === '/areas' && styles.navItemActive]}
              onPress={() => router.replace('/areas')}
            >
              <Ionicons
                name="grid-outline"
                size={24}
                color={pathname === '/areas' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text
                style={[
                  styles.navLabel,
                  pathname === '/areas' && styles.navLabelActive,
                  { color: isDark ? '#AAA' : '#666' },
                ]}
              >
                {t('convocatoria.nav.areas')}
              </Text>
            </TouchableOpacity>

            {/* Convocatoria */}
            <TouchableOpacity
              style={[
                styles.navItem,
                pathname === '/convocatoria' && styles.navItemActive,
              ]}
              onPress={() => router.replace('/convocatoria')}
            >
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={pathname === '/convocatoria' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text
                style={[
                  styles.navLabel,
                  pathname === '/convocatoria' && styles.navLabelActive,
                  { color: '#4CAF50' },
                ]}
              >
                {t('convocatoria.nav.convocatory')}
              </Text>
            </TouchableOpacity>

            {/* Nosotros */}
            <TouchableOpacity
              style={[
                styles.navItem,
                pathname === '/nosotros' && styles.navItemActive,
              ]}
              onPress={() => router.replace('/nosotros')}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={pathname === '/nosotros' ? '#4CAF50' : (isDark ? '#AAA' : '#666')}
              />
              <Text
                style={[
                  styles.navLabel,
                  pathname === '/nosotros' && styles.navLabelActive,
                  { color: isDark ? '#AAA' : '#666' },
                ]}
              >
                {t('convocatoria.nav.about')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zoom Modal */}
        <Modal
          isVisible={selectedImage !== null}
          onBackdropPress={() => setSelectedImage(null)}
          onBackButtonPress={() => setSelectedImage(null)}
          style={{ margin: 0 }}
          backdropOpacity={1}
          animationIn="fadeIn"
          animationOut="fadeOut"
        >
          <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setSelectedImage(null)}
              style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 8 }}
            >
              <Ionicons name="close" size={28} color="#FFF" />
            </TouchableOpacity>
            {selectedImage && (
              // @ts-ignore
              <ImageZoom
                cropWidth={width}
                cropHeight={height}
                imageWidth={width}
                imageHeight={height * 0.8}
                minScale={1}
                maxScale={3}
                pinchToZoom
              >
                <Image
                  source={selectedImage}
                  style={{ width: width, height: height * 0.8 }}
                  resizeMode="contain"
                />
              </ImageZoom>
            )}
          </View>
        </Modal>
      </SafeAreaView>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  scrollViewContent: { paddingBottom: 80 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuOverlay: {
    position: 'absolute',
    top: 70, // Updated from 60 to 70
    right: 16,
    zIndex: 1000,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuContainer: { padding: 8, minWidth: 160 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  menuText: { marginLeft: 8, fontSize: 14 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  convocatoriaCard: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingVertical: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navItem: { alignItems: 'center', paddingVertical: 8 },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: '#4CAF50',
    backgroundColor: 'transparent',
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  navLabelActive: { color: '#4CAF50', fontWeight: 'bold' },
});