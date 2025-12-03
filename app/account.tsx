import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { IMAGES } from '../assets/data/imageMap';
import newsData from '../assets/data/news.json';
import socialData from '../assets/data/social.json';
import videosData from '../assets/data/videos.json';
import { useAuth } from './providers/AuthProvider';
import { useTheme } from './providers/ThemeProvider';

const { width } = Dimensions.get('window');

// 👇 Definición de redes sociales del IIAP
const SOCIAL_LINKS = socialData;

export default function AccountScreen() {
    const { user, loading, reloadUser, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t, i18n } = useTranslation();
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [isProfileImageVisible, setIsProfileImageVisible] = useState(false);
    const [localProfileImage, setLocalProfileImage] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            if (reloadUser) reloadUser();
            const loadLocalImage = async () => {
                try {
                    const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                    if (savedPhoto) setLocalProfileImage(savedPhoto);
                } catch (error) {
                    console.error('Error loading local profile image:', error);
                }
            };
            loadLocalImage();
        }, [reloadUser])
    );

    const [news] = useState(newsData);

    // Videos
    const [guides] = useState(videosData);

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
                                    localProfileImage
                                        ? { uri: localProfileImage }
                                        : user.photoURL
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
                            <Image source={IMAGES[item.image]} style={styles.newsImage} />
                            <View style={styles.newsText}>
                                <Text style={[styles.newsDate, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.date[currentLang]}
                                </Text>
                                <Text style={[styles.newsEndDate, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.endDate[currentLang]}
                                </Text>
                                <Text style={[styles.newsTitle, { color: isDark ? '#FFF' : '#333', marginBottom: 8 }]}>
                                    {item.title[currentLang]}
                                </Text>
                                <Text style={[styles.newsTopics, { color: isDark ? '#AAA' : '#666' }]}>
                                    {item.topics[currentLang].join(', ')}
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
                                                onPress={() => router.push('/postulacion-paso1')}
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
                                        onPress={() => router.push({
                                            pathname: '/news-details',
                                            params: { id: item.id }
                                        })}
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
                                {t(`account.videos.items.${guide.id}`)}
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
            </ScrollView >

            {/* Barra de navegación inferior */}
            < View
                style={
                    [
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
            </View >

            {/* Menú desplegable + overlay */}
            {
                isMenuOpen && (
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
                                        signOut();
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <Ionicons name="log-out" size={20} color={isDark ? '#FFF' : '#333'} />
                                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('account.menu.logout')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                )
            }

            <Modal
                visible={isProfileImageVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsProfileImageVisible(false)}
            >
                <ImageViewer
                    imageUrls={[
                        {
                            url: localProfileImage || user.photoURL || 'https://via.placeholder.com/400x400?text=Default+Avatar',
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
        </SafeAreaView >
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
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: 'transparent', // Modern look
        // Shadow for depth
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#4CAF50', // Brand color accent
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
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        overflow: 'hidden',
        height: 180,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
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
        borderRadius: 16,
        borderWidth: 0, // Remove border for cleaner look
        overflow: 'hidden',
        width: 320, // Slightly smaller width for better carousel feel
        height: 180, // Restored height to fit buttons
        marginRight: 16,
        flexShrink: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
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
});