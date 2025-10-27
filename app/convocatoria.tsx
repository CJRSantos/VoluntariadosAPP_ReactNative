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
  const pathname = usePathname(); // ✅ para saber en qué ruta estamos
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Datos simulados de convocatorias
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
      <View style={styles.loading}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>
        {/* Encabezado gris */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>volunteer account</Text>
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
              <Ionicons name="menu" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menú desplegable */}
        {isMenuOpen && (
          <View style={styles.menuOverlay}>
            <View style={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push('/profile');
                  setIsMenuOpen(false);
                }}>
                <Ionicons name="person" size={20} color="#333" />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert('Próximamente', 'Configuración estará disponible pronto');
                  setIsMenuOpen(false);
                }}>
                <Ionicons name="settings" size={20} color="#333" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  Alert.alert('Próximamente', 'Ayuda estará disponible pronto');
                  setIsMenuOpen(false);
                }}>
                <Ionicons name="help-circle" size={20} color="#333" />
                <Text style={styles.menuText}>Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  router.push('/login');
                  setIsMenuOpen(false);
                }}>
                <Ionicons name="log-out" size={20} color="#333" />
                <Text style={styles.menuText}>Log-out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contenido principal */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.content}>
            {convocatorias.map((convocatoria) => (
              <View key={convocatoria.id} style={styles.convocatoriaCard}>
                <Image
                  source={convocatoria.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{convocatoria.title}</Text>
                  <Text style={styles.cardInfo}>
                    {convocatoria.location} · {convocatoria.participants}
                  </Text>
                  <Text style={styles.cardDate}>
                    Inicio: {convocatoria.startDate}
                  </Text>
                  <Text style={styles.cardDate}>
                    Final: {convocatoria.endDate}
                  </Text>
                  <View style={styles.buttonGroup}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => router.push('/requisitos')}
                    >
                      <Text style={styles.buttonText}>Requisitos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button}>
                      <Text style={styles.buttonText}>Más Info...</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Barra inferior con resaltado */}
        <View style={styles.bottomNav}>
          {/* Inicio */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/inicio' && styles.navItemActive,
            ]}
            onPress={() => router.push('/account')}>
            <Image
              source={require('../assets/images/home-icon.png')}
              style={[
                styles.navIcon,
                pathname === '/inicio' && styles.navIconActive,
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.navLabel,
                pathname === '/inicio' && styles.navLabelActive,
              ]}>
              Inicio
            </Text>
          </TouchableOpacity>

          {/* Áreas */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/areas' && styles.navItemActive,
            ]}
            onPress={() => router.push('/areas')}>
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
              ]}>
              Áreas
            </Text>
          </TouchableOpacity>

          {/* Convocatoria */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/convocatoria' && styles.navItemActive,
            ]}
            onPress={() => router.push('/convocatoria')}>
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
              ]}>
              Convocatoria
            </Text>
          </TouchableOpacity>

          {/* Nosotros */}
          <TouchableOpacity
            style={[
              styles.navItem,
              pathname === '/nosotros' && styles.navItemActive,
            ]}
            onPress={() => router.push('/nosotros')}>
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
              ]}>
              Nosotros
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, backgroundColor: '#fff' },
  scrollViewContent: { paddingBottom: 80 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#E0E0E0',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
  },
  menuOverlay: {
    position: 'absolute',
    top: 60,
    right: 16,
    zIndex: 1000,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  menuContainer: { padding: 8, minWidth: 160 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  menuText: { marginLeft: 8, fontSize: 14, color: '#333' },
  content: { paddingHorizontal: 16, paddingTop: 20 },
  convocatoriaCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 200,
  },
  cardContent: { padding: 16 },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardInfo: { fontSize: 14, color: '#666', marginBottom: 4 },
  cardDate: { fontSize: 14, color: '#666', marginBottom: 8 },
  buttonGroup: { flexDirection: 'row', gap: 8 },
  button: {
    backgroundColor: '#673AB7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FFF',
    paddingVertical: 8,
  },
  navItem: { alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  navItemActive: {
    backgroundColor: '#E8F5E8', // Fondo verde claro
  },
  navIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
    resizeMode: 'contain',
    tintColor: '#777',
  },
  navIconActive: { tintColor: '#4CAF50' }, // Verde activo
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
    color: '#333',
  },
  navLabelActive: { color: '#4CAF50', fontWeight: '600' },
});