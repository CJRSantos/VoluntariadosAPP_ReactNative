// app/areas.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider'; // 👈 Importado

const { width } = Dimensions.get('window');

export default function AreasScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'dark'; // ✅ Corregido
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // 🔹 Redirigir si no hay usuario
  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading]);

  // 🔹 Ubicación
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permiso de ubicación denegado');
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
            'Ubicación desconocida';
          setAddress(cityName);
        }
      } catch (error) {
        console.log('Error obteniendo ubicación:', error);
        setErrorMsg('No se pudo obtener la ubicación');
      }
    })();
  }, []);

  const areas = [
    {
      id: 1,
      direction: 'Dirección de Investigación en Ecosistemas y Cambio Climático',
      title: 'Área de Recursos Forestales y Cambio Climático',
      description:
        'Área encargada de estudios ecológicos, monitoreo ambiental y estrategias de conservación en la Amazonía peruana.',
    },
    {
      id: 2,
      direction: 'Dirección de Investigaciones Ambientales',
      title: 'Área de Ecología y Conservación',
      description:
        'Área encargada de estudios ecológicos, monitoreo ambiental y estrategias de conservación en la Amazonía peruana.',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#E0E0E0' }]}>
        <View style={styles.loading}>
          <Text style={{ color: isDark ? '#FFF' : '#333' }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#E0E0E0' }]}>
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        {/* Encabezado */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: isDark ? '#111' : '#E0E0E0',
              borderBottomColor: isDark ? '#333' : '#CCC',
            },
          ]}
        >
          <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>
            volunteer account
          </Text>
          <View style={styles.headerRight}>
            <Image
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : require('../assets/images/avatar-default.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="menu" size={24} color={isDark ? '#FFF' : '#333'} />
            </TouchableOpacity>
          </View>
        </View>

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
                    Profile
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
                    Settings
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                  onPress={() => {
                    Alert.alert('Próximamente', 'Ayuda estará disponible pronto');
                    setIsMenuOpen(false);
                  }}
                >
                  <Ionicons name="help-circle" size={20} color={isDark ? '#FFF' : '#333'} />
                  <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Help</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                  onPress={() => {
                    router.push('/login');
                    setIsMenuOpen(false);
                  }}
                >
                  <Ionicons name="log-out" size={20} color={isDark ? '#FFF' : '#333'} />
                  <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                    Log-out
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Contenido principal */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
            Nuestras Áreas y Unidades
          </Text>

          {areas.map((area) => (
            <View
              key={area.id}
              style={[
                styles.areaCard,
                {
                  backgroundColor: isDark ? '#111' : '#F5F5F5',
                  shadowColor: isDark ? '#000' : '#000',
                },
              ]}
            >
              <View style={styles.areaHeader}>
                <View style={styles.locationBadge}>
                  <Ionicons name="location" size={16} color="#fff" />
                  <Text style={styles.locationText}>
                    {errorMsg ? 'Sin ubicación' : address || 'Obteniendo ubicación...'}
                  </Text>
                </View>
              </View>
              <Text style={[styles.areaDirection, { color: isDark ? '#AAA' : '#666' }]}>
                {area.direction}
              </Text>
              <Text style={[styles.areaTitle, { color: isDark ? '#FFF' : '#333' }]}>
                {area.title}
              </Text>
              <Text style={[styles.areaDescription, { color: isDark ? '#AAA' : '#666' }]}>
                {area.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Barra inferior */}
        <View style={[styles.bottomNav, { borderTopColor: isDark ? '#333' : '#EEE', backgroundColor: isDark ? '#111' : '#FFF' }]}>
          <TouchableOpacity
            style={[styles.navItem, pathname === '/account' && styles.navItemActive]}
            onPress={() => router.push('/account')}
          >
            <Image source={require('../assets/images/home-icon.png')} style={[styles.navIcon, pathname === '/account' && styles.navIconActive]} />
            <Text style={[styles.navLabel, pathname === '/account' && styles.navLabelActive]}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, pathname === '/areas' && styles.navItemActive]}
            onPress={() => router.push('/areas')}
          >
            <Image source={require('../assets/images/areas-icon.png')} style={[styles.navIcon, pathname === '/areas' && styles.navIconActive]} />
            <Text style={[styles.navLabel, pathname === '/areas' && styles.navLabelActive]}>Áreas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, pathname === '/convocatoria' && styles.navItemActive]}
            onPress={() => router.push('/convocatoria')}
          >
            <Image source={require('../assets/images/convocatory-icon.png')} style={[styles.navIcon, pathname === '/convocatoria' && styles.navIconActive]} />
            <Text style={[styles.navLabel, pathname === '/convocatoria' && styles.navLabelActive]}>Convocatory</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navItem, pathname === '/nosotros' && styles.navItemActive]}
            onPress={() => router.push('/nosotros')}
          >
            <Image source={require('../assets/images/nosotros-icon.png')} style={[styles.navIcon, pathname === '/nosotros' && styles.navIconActive]} />
            <Text style={[styles.navLabel, pathname === '/nosotros' && styles.navLabelActive]}>Nosotros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// 🎨 Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'transparent', zIndex: 999 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#ddd' },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 10, textAlign: 'center' },
  areaCard: { borderRadius: 12, padding: 16, marginBottom: 16, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  areaHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4CAF50', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  locationText: { color: '#fff', fontSize: 12, marginLeft: 4 },
  areaDirection: { fontSize: 12, marginBottom: 4 },
  areaTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  areaDescription: { fontSize: 14 },

  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, paddingVertical: 8, position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { alignItems: 'center', paddingVertical: 8 },
  navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
  navLabel: { fontSize: 10, textAlign: 'center', color: '#333' },
  navItemActive: { borderTopWidth: 2, borderTopColor: '#4CAF50' },
  navIconActive: { tintColor: '#4CAF50' },
  navLabelActive: { color: '#4CAF50', fontWeight: 'bold' },

  menuOverlay: { position: 'absolute', top: 60, right: 16, zIndex: 1000, borderRadius: 8, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
  menuContainer: { padding: 8, minWidth: 160 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  menuText: { marginLeft: 8, fontSize: 14 },
});
