// app/account.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Redirect, usePathname, useRouter } from 'expo-router'; // 👈 usePathname añadido
import { useCallback, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal, // 👈 Importado
    ScrollView, // 👈 Importado
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
    const { user, loading, reloadUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // 👈 Nueva línea
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [isProfileImageVisible, setIsProfileImageVisible] = useState(false); // 👈 Nuevo estado para la imagen

    useFocusEffect(
        useCallback(() => {
            if (reloadUser) reloadUser();
        }, [reloadUser])
    );

    const [news] = useState([
        {
            id: 1,
            title: 'Monitoreo de carbono en bosques amazónicos',
            date: '12/10/2025, Hr: 00:00',
            endDate: '12/11/2025, Hr: 11:59',
            topics: ['Monitoreo de carbono', 'Servicios ecosistémicos', 'Cambio climático'],
            status: 'Abierto',
            color: '#4CAF50',
            image: require('../assets/images/news1.png'),
        },
        {
            id: 2,
            title: 'Monitoreo de carbono en bosques amazónicos',
            date: '12/10/2025, Hr: 00:00',
            endDate: '12/11/2025, Hr: 11:59',
            topics: ['Monitoreo de carbono', 'Servicios ecosistémicos', 'Cambio climático'],
            status: 'Cerrado',
            color: '#F44336',
            image: require('../assets/images/news2.jpeg'),
        },
        {
            id: 3,
            title: 'Monitoreo de carbono en bosques amazónicos',
            date: '12/10/2025, Hr: 00:00   12/11/20, Hr: 11:59',
            topics: [
                'Lineas temática: Monitoreo de carbono, Servicios ecosistématicos, Cambio climático',
            ],
            status: 'Abierto',
            color: '#4CAF50',
            image: require('../assets/images/news3.png'),
        },
        {
            id: 4,
            title: 'Monitoreo de carbono en bosques amazónicos',
            date: '12/10/2025, Hr: 00:00     12/11/20, Hr: 11:59',
            topics: [
                'Lineas temáticas: Monitoreo de carbono, Servicios ecosistématicos, Cambio climático',
            ],
            status: 'Cerrado',
            color: '#F44336',
            image: require('../assets/images/news4.png'),
        },
    ]);

    const [guides] = useState([
        { id: 1, image: require('../assets/images/tutorial1.jpg') },
        { id: 2, image: require('../assets/images/guia2.png') },
        { id: 3, image: require('../assets/images/guia3.png') },
        { id: 4, image: require('../assets/images/guia4.jpg') },
    ]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>Cargando...</Text>
            </SafeAreaView>
        );
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
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
                        {/* 👇 Imagen de perfil con zoom */}
                        <TouchableOpacity onPress={() => setIsProfileImageVisible(true)}>
                            <Image
                                source={
                                    user.photoURL
                                        ? { uri: user.photoURL }
                                        : require('../assets/images/avatar-default.png')
                                }
                                style={styles.avatar}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={toggleMenu}>
                            <Ionicons name="menu" size={24} color={isDark ? '#FFF' : '#333'} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Banner */}
                <View style={styles.banner}>
                    <Image source={require('../assets/images/banner.png')} style={styles.bannerImage} />
                    <View style={styles.bannerContent}>
                        <Text style={[styles.bannerTitle, { color: '#FFF' }]}>
                            Aquí comienza tu espacio exclusivo de usuario
                        </Text>
                        <Text style={[styles.bannerSubtitle, { color: '#FFF' }]}>
                            Bienvenido usuario se parte de este nuevo...
                        </Text>
                        <TouchableOpacity style={styles.bannerButton}>
                            <Text style={styles.bannerButtonText}>Conocer más</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Últimas noticias - HORIZONTAL */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    Últimas noticias
                </Text>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.newsContainerHorizontal}
                >
                    {news.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.newsCardHorizontal,
                                {
                                    backgroundColor: isDark ? '#111' : '#FFF',
                                    borderColor: isDark ? '#333' : '#DDD',
                                },
                            ]}
                        >
                            <Image source={item.image} style={styles.newsImage} />
                            <View style={styles.newsText}>
                                <Text style={[styles.newsDate, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.date}
                                </Text>
                                <Text style={[styles.newsEndDate, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.endDate}
                                </Text>
                                <Text style={[styles.newsTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {item.title}
                                </Text>
                                <Text style={[styles.newsTopics, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.topics.join(', ')}
                                </Text>
                                <View style={styles.newsStatusContainer}>
                                    {item.status === 'Abierto' ? (
                                        <>
                                            <TouchableOpacity
                                                style={[
                                                    styles.statusButton,
                                                    { backgroundColor: item.color, opacity: isDark ? 0.8 : 1 },
                                                ]}
                                            >
                                                <Text style={styles.statusText}>Abierto</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.statusButton,
                                                    { backgroundColor: '#4CAF50', opacity: isDark ? 0.8 : 1 },
                                                ]}
                                            >
                                                <Text style={styles.statusText}>Postular</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity
                                            style={[
                                                styles.statusButton,
                                                { backgroundColor: item.color, opacity: isDark ? 0.8 : 1 },
                                            ]}
                                        >
                                            <Text style={styles.statusText}>Cerrado</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={[
                                            styles.detailsButton,
                                            {
                                                borderColor: isDark ? '#AAA' : '#666',
                                            },
                                        ]}
                                    >
                                        <Text style={[styles.detailsText, { color: isDark ? '#AAA' : '#666' }]}>
                                            Detalles
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/* Guías y Tutoriales */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    Guías y Tutoriales
                </Text>
                <View style={styles.guidesContainer}>
                    {guides.map((guide) => (
                        <TouchableOpacity key={guide.id} style={styles.guideCard}>
                            <Image source={guide.image} style={styles.guideImage} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Enlaces rápidos */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    Enlaces rápidos
                </Text>
                <View style={styles.quickLinksContainer}>
                    <Image
                        source={require('../assets/images/logo-IIAP_enlaces.png')}
                        style={styles.quickLinksImage}
                    />
                </View>

                {/* Barra de navegación inferior */}
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
                                {
                                    backgroundColor: 'transparent', // 👈 Asegura que no haya fondo
                                    tintColor: pathname === '/account' ? '#4CAF50' : (isDark ? '#AAA' : '#666'), // 👈 Cambia el color según el estado
                                },
                                pathname === '/account' && styles.navIconActive,
                            ]}
                        />
                        <Text
                            style={[
                                styles.navLabel,
                                { color: isDark ? '#AAA' : '#666' },
                                pathname === '/account' && styles.navLabelActive,
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
                        />
                        <Text
                            style={[
                                styles.navLabel,
                                { color: isDark ? '#AAA' : '#666' },
                                pathname === '/areas' && styles.navLabelActive,
                            ]}
                        >
                            Áreas
                        </Text>
                    </TouchableOpacity>

                    {/* Convocatory */}
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
                        />
                        <Text
                            style={[
                                styles.navLabel,
                                { color: isDark ? '#AAA' : '#666' },
                                pathname === '/convocatoria' && styles.navLabelActive,
                            ]}
                        >
                            Convocatory
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
                        />
                        <Text
                            style={[
                                styles.navLabel,
                                { color: isDark ? '#AAA' : '#666' },
                                pathname === '/nosotros' && styles.navLabelActive,
                            ]}
                        >
                            Nosotros
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Menú desplegable + overlay */}
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
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Profile</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                                onPress={() => {
                                    router.push('/settings');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="settings" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Settings</Text>
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
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Log-out</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}

            {/* Modal para ver la foto de perfil con zoom */}
            <Modal
                visible={isProfileImageVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProfileImageVisible(false)}
            >
                <ImageViewer
                    imageUrls={[
                        {
                            url: user.photoURL
                                ? user.photoURL
                                : 'https://via.placeholder.com/400x400?text=Default+Avatar',
                        },
                    ]}
                    enableSwipeDown={true}
                    onSwipeDown={() => setIsProfileImageVisible(false)}
                    saveToLocalByLongPress={false}
                    backgroundColor="rgba(0,0,0,0.8)"
                    loadingRender={() => <Text style={{ color: '#FFF' }}>Cargando...</Text>}
                    onClick={() => setIsProfileImageVisible(false)} // 👈 Cierra al tocar
                />
            </Modal>
        </SafeAreaView>
    );
}

// 🎨 Estilos (con resaltado añadido al final)
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 70,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 999,
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    menuText: {
        marginLeft: 8,
        fontSize: 14,
    },
    banner: {
        position: 'relative',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        height: 150,
    },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    bannerContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bannerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bannerSubtitle: {
        fontSize: 12,
        marginBottom: 8,
    },
    bannerButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    bannerButtonText: { color: '#FFF', fontSize: 12 },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    newsContainerHorizontal: { paddingHorizontal: 16, paddingVertical: 8 },
    newsCardHorizontal: {
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        overflow: 'hidden',
        width: 400,
        height: 181,
        marginRight: 16,
        flexShrink: 0,
    },
    newsImage: {
        width: 180,
        height: 180,
        resizeMode: 'cover',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },
    newsText: {
        flex: 1,
        padding: 12,
    },
    newsDate: {
        fontSize: 10,
    },
    newsEndDate: {
        fontSize: 10,
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 44,
    },
    newsTopics: {
        fontSize: 12,
        marginBottom: 8,
    },
    newsStatusContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    statusButton: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: '#FFF',
        fontSize: 12,
    },
    detailsButton: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    detailsText: {
        fontSize: 12,
    },
    guidesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
        marginBottom: 16,
    },
    guideCard: {
        width: (width - 48) / 2,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
    },
    guideImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    quickLinksContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    quickLinksImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
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
    navItemActive: {
        borderTopWidth: 2,
        borderTopColor: '#4CAF50',
        backgroundColor: 'transparent', // 🔹 evita el fondo blanco
    },

    navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
    navIconActive: {
        tintColor: '#4CAF50',
    },
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
    navLabelActive: {
        color: '#4CAF50',
    },
    // 👇 Nuevos estilos para la modal de imagen
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});