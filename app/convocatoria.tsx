// app/convocatoria.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
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
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export const options = {
  headerShown: false,
};

export default function ConvocatoriaScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme(); // 👈 Usado
  const isDark = theme === 'dark';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const convocatorias = [
    {
      id: 1,
      image: require('../assets/images/tutorial1.jpg'),
      title: 'Ayuda a realizar investigaciones - Bosques',
      location: 'Iquitos, Perú',
      participants: '20 participantes',
      startDate: '31 de setiembre, 2025',
      endDate: '15 de octubre, 2025',
    },
    {
      id: 2,
      image: require('../assets/images/bosques2.png'),
      title: 'Ayuda a realizar investigaciones - Bosques',
      location: 'Iquitos, Perú',
      participants: '20 participantes',
      startDate: '31 de setiembre, 2025',
      endDate: '15 de octubre, 2025',
    },
    {
      id: 3,
      image: require('../assets/images/bosques3.png'),
      title: 'Voluntariado en un refugio de animales',
      location: 'Arequipa, Perú',
      participants: '10 participantes',
      startDate: '31 de setiembre, 2025',
      endDate: '15 de octubre, 2025',
    },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.loading}>
          <Text style={{ color: isDark ? '#FFF' : '#333' }}>Cargando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        {/* Encabezado gris */}
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
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {convocatorias.map((convocatoria) => (
              <View
                key={convocatoria.id}
                style={[
                  styles.convocatoriaCard,
                  {
                    backgroundColor: isDark ? '#111' : '#F5F5F5',
                    shadowColor: isDark ? '#000' : '#000',
                  },
                ]}
              >
                <Image
                  source={convocatoria.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {convocatoria.title}
                  </Text>
                  <Text style={[styles.cardInfo, { color: isDark ? '#AAA' : '#666' }]}>
                    {convocatoria.location} · {convocatoria.participants}
                  </Text>
                  <Text style={[styles.cardDate, { color: isDark ? '#AAA' : '#666' }]}>
                    Inicio: {convocatoria.startDate}
                  </Text>
                  <Text style={[styles.cardDate, { color: isDark ? '#AAA' : '#666' }]}>
                    Final: {convocatoria.endDate}
                  </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => router.push('/requisitos')}
                    >
                      <Text style={styles.buttonText}>Requisitos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => router.push('/mas-info')}
                    >
                      <Text style={styles.buttonText}>Más Info...</Text>
                    </TouchableOpacity>
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
            onPress={() => router.push('/account')}
          >
            <Image
              source={require('../assets/images/home-icon.png')}
              style={[
                styles.navIcon,
                pathname === '/account' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navLabel,
                pathname === '/account' && styles.navLabelActive,
                { color: isDark ? '#AAA' : '#333' },
              ]}
            >
              Inicio
            </Text>
          </TouchableOpacity>

          {/* Áreas */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/areas' && styles.navItemActive,
            ]}
            onPress={() => router.push('/areas')}
          >
            <Image
              source={require('../assets/images/areas-icon.png')}
              style={[
                styles.navIcon,
                pathname === '/areas' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navLabel,
                pathname === '/areas' && styles.navLabelActive,
                { color: isDark ? '#AAA' : '#333' },
              ]}
            >
              Áreas
            </Text>
          </TouchableOpacity>

          {/* Convocatoria */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/convocatoria' && styles.navItemActive,
            ]}
            onPress={() => router.push('/convocatoria')}
          >
            <Image
              source={require('../assets/images/convocatory-icon.png')}
              style={[
                styles.navIcon,
                pathname === '/convocatoria' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navLabel,
                pathname === '/convocatoria' && styles.navLabelActive,
                { color: isDark ? '#4CAF50' : '#4CAF50' },
              ]}
            >
              Convocatoria
            </Text>
          </TouchableOpacity>

          {/* Nosotros */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/nosotros' && styles.navItemActive,
            ]}
            onPress={() => router.push('/nosotros')}
          >
            <Image
              source={require('../assets/images/nosotros-icon.png')}
              style={[
                styles.navIcon,
                pathname === '/nosotros' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navLabel,
                pathname === '/nosotros' && styles.navLabelActive,
                { color: isDark ? '#AAA' : '#333' },
              ]}
            >
              Nosotros
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuOverlay: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuContainer: { padding: 8, minWidth: 160 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  menuText: { marginLeft: 8, fontSize: 14 },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  convocatoriaCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
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
    gap: 8,
  },
  button: {
    backgroundColor: '#673AB7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  },
  navItem: { alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  navItemActive: {
    backgroundColor: '#E8F5E8',
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: '#777',
  },
  navIconActive: { tintColor: '#4CAF50' },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  navLabelActive: { fontWeight: '600' },
});