// app/nosotros.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
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
import { useTheme } from '../app/providers/ThemeProvider'; // 👈 Para modo oscuro

const { width } = Dimensions.get('window');

export const options = {
    headerShown: false,
};

export default function NosotrosScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const stats = [
        { value: '+4', label: 'publicaciones científicas internacionales' },
        { value: '+10', label: 'proyectos en desarrollo actualmente' },
        { value: '+500', label: 'beneficiarios directos en programas sociales' },
        { value: '+8', label: 'alianzas estratégicas con instituciones nacionales e internacionales' },
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
                            style={[styles.avatar, { marginRight: 12 }]}
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
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                            ¿Por qué unirte a nosotros?
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            Únete a nuestra institución y sé parte de un equipo que impulsa innovación,
                            sostenibilidad e impacto positivo.
                        </Text>

                        <View style={styles.iconsSection}>
                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
                                ]}
                            >
                                <Ionicons name="handshake" size={40} color="#FF5722" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Nuestra historia
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    Desde nuestros inicios, hemos trabajado en fortalecer la educación,
                                    la investigación y los proyectos sociales.
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
                                ]}
                            >
                                <Ionicons name="rocket" size={40} color="#FF9800" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Nuestra misión
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    Impulsar iniciativas que transformen vidas a través de la educación y la acción social.
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
                                ]}
                            >
                                <Ionicons name="water" size={40} color="#2196F3" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Lo que nos diferencia
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    Nos distingue nuestro enfoque integral, combinando conocimiento e innovación.
                                </Text>
                            </View>
                        </View>

                        <Image
                            source={require('../assets/images/tutorial1.jpg')}
                            style={styles.labImage}
                            resizeMode="cover"
                        />

                        <View style={styles.statsSection}>
                            {stats.map((stat, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.statCard,
                                        { backgroundColor: isDark ? '#222' : '#F5F5F5' },
                                    ]}
                                >
                                    <Text style={[styles.statValue, { color: isDark ? '#FFF' : '#333' }]}>
                                        {stat.value}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: isDark ? '#AAA' : '#666' }]}>
                                        {stat.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Barra inferior */}
                <View
                    style={[
                        styles.bottomNav,
                        {
                            borderTopColor: isDark ? '#333' : '#EEE',
                            backgroundColor: isDark ? '#111' : '#FFF',
                        },
                    ]}
                >
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/account')}>
                        <Image source={require('../assets/images/home-icon.png')} style={styles.navIcon} />
                        <Text style={[styles.navLabel, { color: isDark ? '#AAA' : '#666' }]}>Inicio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/areas')}>
                        <Image source={require('../assets/images/areas-icon.png')} style={styles.navIcon} />
                        <Text style={[styles.navLabel, { color: isDark ? '#AAA' : '#666' }]}>Áreas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/convocatoria')}>
                        <Image
                            source={require('../assets/images/convocatory-icon.png')}
                            style={styles.navIcon}
                        />
                        <Text style={[styles.navLabel, { color: isDark ? '#AAA' : '#666' }]}>Convocatory</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/nosotros')}>
                        <Image
                            source={require('../assets/images/nosotros-icon.png')}
                            style={styles.navIcon}
                        />
                        <Text style={[styles.navLabel, { color: isDark ? '#AAA' : '#666' }]}>Nosotros</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1 },
    scrollViewContent: { paddingBottom: 80 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 999,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerRight: { flexDirection: 'row', alignItems: 'center' },
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    menuContainer: { padding: 8, minWidth: 160 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 8 },
    menuText: { marginLeft: 8, fontSize: 14 },
    content: { paddingHorizontal: 16, paddingTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
    iconsSection: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: 20 },
    iconCard: {
        width: (width - 48) / 3,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    iconTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
    iconText: { fontSize: 12, textAlign: 'center', marginTop: 4 },
    labImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
    statsSection: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: 20 },
    statCard: {
        width: (width - 48) / 4,
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    statValue: { fontSize: 20, fontWeight: 'bold' },
    statLabel: { fontSize: 12, textAlign: 'center', marginTop: 4 },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        paddingVertical: 8,
    },
    navItem: { alignItems: 'center', paddingVertical: 8 },
    navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
});
