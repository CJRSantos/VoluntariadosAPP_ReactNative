// app/nosotros.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export const options = {
    headerShown: false, // 🔹 Esto oculta completamente el encabezado "Nosotros"
};

export default function NosotrosScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();
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
            <View style={styles.loading}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 🔹 Oculta cualquier encabezado del stack */}
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
                                }}
                            >
                                <Ionicons name="person" size={20} color="#333" />
                                <Text style={styles.menuText}>Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    Alert.alert('Próximamente', 'Configuración estará disponible pronto');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="settings" size={20} color="#333" />
                                <Text style={styles.menuText}>Settings</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    Alert.alert('Próximamente', 'Ayuda estará disponible pronto');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="help-circle" size={20} color="#333" />
                                <Text style={styles.menuText}>Help</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    router.push('/login');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="log-out" size={20} color="#333" />
                                <Text style={styles.menuText}>Log-out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Contenido principal */}
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.content}>
                        <Text style={styles.sectionTitle}>¿Por qué unirte a nosotros?</Text>
                        <Text style={styles.subtitle}>
                            Únete a nuestra institución y sé parte de un equipo que impulsa innovación,
                            sostenibilidad e impacto positivo.
                        </Text>

                        <View style={styles.iconsSection}>
                            <View style={styles.iconCard}>
                                <Ionicons name="handshake" size={40} color="#FF5722" />
                                <Text style={styles.iconTitle}>Nuestra historia</Text>
                                <Text style={styles.iconText}>
                                    Desde nuestros inicios, hemos trabajado en fortalecer la educación,
                                    la investigación y los proyectos sociales.
                                </Text>
                            </View>

                            <View style={styles.iconCard}>
                                <Ionicons name="rocket" size={40} color="#FF9800" />
                                <Text style={styles.iconTitle}>Nuestra misión</Text>
                                <Text style={styles.iconText}>
                                    Impulsar iniciativas que transformen vidas a través de la educación y la acción social.
                                </Text>
                            </View>

                            <View style={styles.iconCard}>
                                <Ionicons name="water" size={40} color="#2196F3" />
                                <Text style={styles.iconTitle}>Lo que nos diferencia</Text>
                                <Text style={styles.iconText}>
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
                                <View key={i} style={styles.statCard}>
                                    <Text style={styles.statValue}>{stat.value}</Text>
                                    <Text style={styles.statLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Barra inferior */}
                <View style={styles.bottomNav}>
                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/account')}>
                        <Image source={require('../assets/images/home-icon.png')} style={styles.navIcon} />
                        <Text style={styles.navLabel}>Inicio</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/areas')}>
                        <Image source={require('../assets/images/areas-icon.png')} style={styles.navIcon} />
                        <Text style={styles.navLabel}>Áreas</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/convocatoria')}>
                        <Image source={require('../assets/images/convocatory-icon.png')} style={styles.navIcon} />
                        <Text style={styles.navLabel}>Convocatory</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.navItem} onPress={() => router.push('/nosotros')}>
                        <Image source={require('../assets/images/nosotros-icon.png')} style={styles.navIcon} />
                        <Text style={styles.navLabel}>Nosotros</Text>
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
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
    iconsSection: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: 20 },
    iconCard: {
        width: (width - 48) / 3,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    iconTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
    iconText: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 },
    labImage: { width: '100%', height: 200, borderRadius: 12, marginBottom: 20 },
    statsSection: { flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: 20 },
    statCard: {
        width: (width - 48) / 4,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    statLabel: { fontSize: 12, color: '#666', textAlign: 'center', marginTop: 4 },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
        paddingVertical: 8,
    },
    navItem: { alignItems: 'center', paddingVertical: 8 },
    navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
});
