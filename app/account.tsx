import { useAuth } from '@/hooks/useAuth';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Redirect, usePathname, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Clipboard,
    Dimensions,
    Image,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './providers/ThemeProvider';

const { width } = Dimensions.get('window');

// 👇 Definición de redes sociales del IIAP
const SOCIAL_LINKS = [
    { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', url: 'https://www.facebook.com/IIAPPeru' },
    { id: 'twitter', name: 'Twitter', icon: 'logo-twitter', color: '#1DA1F2', url: 'https://twitter.com/IIAPPeru' },
    { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F', url: 'https://www.instagram.com/iiapperu/' },
    { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000', url: 'https://www.youtube.com/@webiiap' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'logo-linkedin', color: '#0077B5', url: 'https://www.linkedin.com/company/iiap' },
    { id: 'web', name: 'Sitio Web', icon: 'globe-outline', color: '#4CAF50', url: 'https://www.gob.pe/iiap' },
    { id: 'tiktok', name: 'Tiktok', icon: 'logo-tiktok', color: '#000000', url: 'https://www.tiktok.com/@iiapperu?is_from_webapp=1&sender_device=pc' },
    { id: 'spotify', name: 'Spotify', icon: 'spotify', type: 'fontawesome', color: '#1DB954', url: 'https://open.spotify.com/show/22EKStrMUkA8MciXSj9EaE?si=3454d74d68a244b1' },
];

export default function AccountScreen() {
    const { user, loading, reloadUser } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [isProfileImageVisible, setIsProfileImageVisible] = useState(false);

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
            date: '12/10/2025, Hr: 00:00',
            endDate: '12/11/20, Hr: 11:59',
            topics: ['Lineas temática: Monitoreo de carbono, Servicios ecosistématicos, Cambio climático'],
            status: 'Abierto',
            color: '#4CAF50',
            image: require('../assets/images/news3.png'),
        },
        {
            id: 4,
            title: 'Monitoreo de carbono en bosques amazónicos',
            date: '12/10/2025, Hr: 00:00     12/11/20, Hr: 11:59',
            topics: ['Lineas temáticas: Monitoreo de carbono, Servicios ecosistématicos, Cambio climático'],
            status: 'Cerrado',
            color: '#F44336',
            image: require('../assets/images/news4.png'),
        },
    ]);

    // Videos //
    const [guides] = useState([
        {
            id: 1,
            title: 'Video 1: Bienvenidos al IIAP',
            videoUrl: 'https://youtu.be/HDSMeoQosN8?si=3b3Tn1Di6vx2bH_m',
        },
        {
            id: 2,
            title: 'Video 2: Mullaca - Ciencia a tu Alcance',
            videoUrl: 'https://youtu.be/cQaQjp4iX44?si=i4Mg4BOgkRRCwhdJ',
        },
        {
            id: 3,
            title: 'Video 3: 43 Años del IIAP',
            videoUrl: 'https://youtu.be/V5hnXID8TQc?si=o1wgt0Tb6W_j8k_R',
        },
        {
            id: 4,
            title: 'Video 4: Embajadora de Francia en el IIAP',
            videoUrl: 'https://youtu.be/JBvkA-ZgQDw?si=nHXErOW6Ug0h1Y5y',
        },
        {
            id: 5,
            title: 'Video 5: Inauguración de la IIAP',
            videoUrl: 'https://youtu.be/NMF_35Q4nCU?si=qcs466ORSvUM7Ewg',
        },
        {
            id: 6,
            title: 'Video 6: Los árboles, guardianes de la vida',
            videoUrl: 'https://youtu.be/1p4Vd_g8igo?si=ayi1RGJF64DpLlY_',
        },
        {
            id: 7,
            title: 'Video 7: Educacación ambiental - Astoria',
            videoUrl: 'https://youtu.be/MatQhCP9dCI?si=CbZGIM504jhUDoL6',
        },
        {
            id: 8,
            title: 'Video 8:Restauración de bosques Amazó nicos con Drones',
            videoUrl: 'https://youtu.be/MMGx5A3Olio?si=9DBF2AMQ5dI4gt23',
        },
        {
            id: 9,
            title: 'Video 9: IIAP y Ejército del Perú impulsan nuevas oportunidades para jóvenes soldados en Ucayali',
            videoUrl: 'https://youtu.be/u7EUUNYydiU?si=GKTcLguM2MvE-83U',
        },
        {
            id: 10,
            title: 'Video 10: Niños de Madre de Dios aprenden a cuidar la Amazonía',
            videoUrl: 'https://youtu.be/bnNYooo3gHw?si=TywKUckAVHjMp4rY',
        },
    ]);

    const openSocialLink = (url: string) => {
        Linking.openURL(url).catch((err) => {
            console.error('Error al abrir la URL:', err);
            Alert.alert('Error', 'No se pudo abrir el enlace. Intente más tarde.');
        });
    };

    // Función para extraer el ID del video de YouTube
    const extractVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : '';
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{t('account.loading')}</Text>
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
                        {t('account.headerTitle')}
                    </Text>
                    <View style={styles.headerRight}>
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
                            {t('account.banner.title')}
                        </Text>
                        <Text style={[styles.bannerSubtitle, { color: '#FFF' }]}>
                            {t('account.banner.subtitle')}
                        </Text>
                        <TouchableOpacity
                            style={styles.bannerButton}
                            onPress={() => router.push('/onboarding-info')}
                        >
                            <Text style={styles.bannerButtonText}>{t('account.banner.button')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Últimas noticias - HORIZONTAL */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('account.news.sectionTitle')}
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
                                <Text style={[styles.newsTitle, { color: isDark ? '#FFF' : '#333', marginBottom: 8 }]}>
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
                                                <Text style={styles.statusText}>{t('account.news.status.open')}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={[
                                                    styles.statusButton,
                                                    { backgroundColor: '#4CAF50', opacity: isDark ? 0.8 : 1 },
                                                ]}
                                            >
                                                <Text style={styles.statusText}>{t('account.news.apply')}</Text>
                                            </TouchableOpacity>
                                        </>
                                    ) : (
                                        <TouchableOpacity
                                            style={[
                                                styles.statusButton,
                                                { backgroundColor: item.color, opacity: isDark ? 0.8 : 1 },
                                            ]}
                                        >
                                            <Text style={styles.statusText}>{t('account.news.status.closed')}</Text>
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
                                            {t('account.news.details')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                {/*Videos */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('account.videos.sectionTitle')}
                </Text>
                <View style={styles.guidesContainer}>
                    {guides.map((guide) => (
                        <TouchableOpacity
                            key={guide.id}
                            style={styles.guideCard}
                            onPress={() => {
                                Linking.openURL(guide.videoUrl).catch((err) => {
                                    console.error('Error al abrir YouTube:', err);
                                    Alert.alert(
                                        t('account.videos.errorTitle'),
                                        t('account.videos.errorMessage'),
                                        [{ text: t('account.videos.copyLink'), onPress: () => Clipboard.setString(guide.videoUrl) }]
                                    );
                                });
                            }}
                        >
                            {/* Miniatura de YouTube */}
                            <View style={styles.guideImage}>
                                <Image
                                    source={{ uri: `https://img.youtube.com/vi/${extractVideoId(guide.videoUrl)}/mqdefault.jpg` }}
                                    style={styles.youtubeThumbnail}
                                />
                                {/* Icono de play */}
                                <View style={styles.playOverlay}>
                                    <Ionicons name="play-circle" size={48} color="#FFF" />
                                </View>
                            </View>
                            <Text style={[styles.guideTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                {guide.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Enlaces rápidos - AHORA CON REDES SOCIALES */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('account.quickLinks.sectionTitle')}
                </Text>
                <View style={styles.quickLinksContainer}>
                    <View style={styles.socialLinksRow}>
                        {SOCIAL_LINKS.map((social) => (
                            <TouchableOpacity
                                key={social.id}
                                style={styles.socialLinkButton}
                                onPress={() => openSocialLink(social.url)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.socialIconWrapper, { backgroundColor: social.color }]}>
                                    {/* 👇 Solo Spotify usa FontAwesome5 */}
                                    {social.type === 'fontawesome' ? (
                                        <FontAwesome5 name={social.icon} size={24} color="#FFF" />
                                    ) : (
                                        <Ionicons
                                            name={social.icon as any}
                                            size={24}
                                            color="#FFF"
                                        />
                                    )}
                                </View>
                                <Text style={[styles.socialLinkLabel, { color: isDark ? '#FFF' : '#333' }]}>
                                    {social.id === 'web' ? t('account.social.web') : social.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

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
                                backgroundColor: 'transparent',
                                tintColor: pathname === '/account' ? '#4CAF50' : (isDark ? '#AAA' : '#666'),
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
                        {t('account.nav.home')}
                    </Text>
                </TouchableOpacity>

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
                        {t('account.nav.areas')}
                    </Text>
                </TouchableOpacity>

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
                        {t('account.nav.convocatory')}
                    </Text>
                </TouchableOpacity>

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
                        {t('account.nav.about')}
                    </Text>
                </TouchableOpacity>
            </View>

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
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('account.menu.profile')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                                onPress={() => {
                                    router.push('/settings');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="settings" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('account.menu.settings')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                                onPress={() => {
                                    Alert.alert(t('account.menu.soon'), t('account.menu.helpSoon'));
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="help-circle" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('account.menu.help')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                                onPress={() => {
                                    router.push('/login');
                                    setIsMenuOpen(false);
                                }}
                            >
                                <Ionicons name="log-out" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('account.menu.logout')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}

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
                    loadingRender={() => <Text style={{ color: '#FFF' }}>{t('account.loading')}</Text>}
                    onClick={() => setIsProfileImageVisible(false)}
                />
            </Modal>
        </SafeAreaView>
    );
}

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
        backgroundColor: 'transparent',
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
        justifyContent: 'space-between',
        height: 180,
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
        marginBottom: 8,
    },
    newsTopics: {
        fontSize: 12,
        marginBottom: 8,
    },
    newsStatusContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 'auto',
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
        marginBottom: 16,
        alignItems: 'center',
    },
    guideImage: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    youtubeThumbnail: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    playOverlay: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        padding: 8,
    },
    guideTitle: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    quickLinksContainer: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    socialLinksRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 20,
    },
    socialLinkButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 80,
    },
    socialIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    socialLinkLabel: {
        fontSize: 10,
        textAlign: 'center',
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
        zIndex: 1000,
    },
    navItem: { alignItems: 'center', paddingVertical: 8 },
    navItemActive: {
        borderTopWidth: 2,
        borderTopColor: '#4CAF50',
        backgroundColor: 'transparent',
    },
    navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
    navIconActive: {
        tintColor: '#4CAF50',
    },
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
    navLabelActive: {
        color: '#4CAF50',
    },
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