import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, usePathname, useRouter } from 'expo-router'; // <--- Agregado useFocusEffect
import { useCallback, useEffect, useState } from 'react'; // <--- Agregado useCallback
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    Image,
    Linking,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { FlatList, GestureDetector, ScrollView } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../assets/data/imageMap';
import newsData from '../assets/data/news.json';
import socialData from '../assets/data/social.json';
import videosData from '../assets/data/videos.json';
import { Header } from '../src/components/Header';
import { useSwipeNavigation } from './hooks/useSwipeNavigation';
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

    const { composedGesture } = useSwipeNavigation({
        onSwipeLeft: () => router.push('/areas'),
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const [isProfileImageVisible, setIsProfileImageVisible] = useState(false);
    const [localProfileImage, setLocalProfileImage] = useState<string | null>(null);

    // Optimized: Reemplazado useEffect por useFocusEffect para recargar la imagen al volver
    useFocusEffect(
        useCallback(() => {
            const loadLocalImage = async () => {
                try {
                    const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                    if (savedPhoto) {
                        setLocalProfileImage(savedPhoto);
                    } else if (user?.photoURL) {
                        setLocalProfileImage(user.photoURL);
                    }
                } catch (error) {
                    console.error('Error loading local profile image:', error);
                }
            };
            loadLocalImage();
        }, [user])
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

    const renderNewsItem = ({ item }: { item: any }) => {
        if (!item) return null;
        const displayTitle = item.title?.[currentLang] || item.title?.es || '';
        const displayDate = item.date?.[currentLang] || item.date?.es || '';
        const displayDescription = item.description?.[currentLang] || item.description?.es || '';
        const imageSource = IMAGES[item.image] || IMAGES['banner']; // Fallback image

        return (
            <View
                style={[
                    styles.newsCardHorizontal,
                    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' },
                ]}
            >
                <Image source={imageSource} style={styles.newsImage} />
                <View style={styles.newsText}>
                    <View>
                        <Text
                            style={[styles.newsTitle, { color: isDark ? '#FFF' : '#333' }]}
                            numberOfLines={2}
                        >
                            {displayTitle}
                        </Text>
                        <Text style={[styles.newsDate, { color: isDark ? '#AAA' : '#666' }]}>
                            {displayDate}
                        </Text>
                        <Text
                            style={[
                                styles.newsDescription,
                                { color: isDark ? '#CCC' : '#555' },
                            ]}
                            numberOfLines={3}
                        >
                            {displayDescription}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.readMoreButton}
                        onPress={() => router.push(`/news-details?id=${item.id}`)}
                    >
                        <Text style={styles.readMoreText}>{t('common.readMore')}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderVideoItem = ({ item }: { item: any }) => {
        if (!item || !item.videoUrl) return null;
        const videoId = extractVideoId(item.videoUrl);
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;

        return (
            <TouchableOpacity
                style={[styles.videoCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}
                onPress={() => Linking.openURL(item.videoUrl)}
            >
                <View style={styles.thumbnailContainer}>
                    <Image
                        source={{ uri: thumbnailUrl }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                        resizeMethod="resize"
                    />
                    <View style={styles.playIconContainer}>
                        <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.9)" />
                    </View>
                </View>
                <View style={styles.videoInfo}>
                    <Text
                        style={[styles.videoTitle, { color: isDark ? '#FFF' : '#333' }]}
                        numberOfLines={2}
                    >
                        {t('common.video')} {item.id}
                    </Text>
                    <Text style={[styles.videoDuration, { color: isDark ? '#AAA' : '#666' }]}>
                        {t('account.videos.clickToWatch')}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user]);

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{t('account.loading')}</Text>
            </SafeAreaView>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <GestureDetector gesture={composedGesture}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#121212' : '#F5F5F5' }]}>
                <View style={styles.container}>
                    <Header
                        user={user}
                        isDark={isDark}
                        t={t}
                        toggleMenu={toggleMenu}
                        localProfileImage={localProfileImage}
                        onImagePress={() => setIsProfileImageVisible(true)}
                    />

                    {isMenuOpen && (
                        <TouchableOpacity
                            style={styles.menuOverlay}
                            activeOpacity={1}
                            onPress={() => setIsMenuOpen(false)}
                        />
                    )}

                    {isMenuOpen && (
                        <View style={[styles.dropdownMenu, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    toggleMenu();
                                    router.push('/profile');
                                }}
                            >
                                <Ionicons name="person-outline" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('account.menu.profile')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    toggleMenu();
                                    router.push('/settings');
                                }}
                            >
                                <Ionicons name="settings-outline" size={20} color={isDark ? '#FFF' : '#333'} />
                                <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('account.menu.settings')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    toggleMenu();
                                    signOut();
                                }}
                            >
                                <Ionicons name="log-out-outline" size={20} color="#FF5252" />
                                <Text style={[styles.menuText, { color: '#FF5252' }]}>
                                    {t('account.menu.logout')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <ScrollView contentContainerStyle={styles.scrollContent}>
                        {/* Banner */}
                        <View style={styles.bannerContainer}>
                            <Image
                                source={require('../assets/images/banner.png')}
                                style={styles.bannerImage}
                                resizeMode="cover"
                            />
                            <View style={styles.bannerOverlay}>
                                <Text style={styles.bannerTitle}>{t('account.banner.title')}</Text>
                                <Text style={styles.bannerSubtitle}>{t('account.banner.subtitle', { name: user?.displayName || t('account.user') })}</Text>
                                <TouchableOpacity style={styles.bannerButton} onPress={() => router.push('/mas-info')}>
                                    <Text style={styles.bannerButtonText}>{t('account.banner.button')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Accesos Rápidos */}
                        <View style={styles.quickAccessContainer}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                {t('account.quickAccess')}
                            </Text>
                            <View style={styles.quickAccessGrid}>
                                <TouchableOpacity
                                    style={[styles.quickAccessItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}
                                    onPress={() => router.replace('/areas')}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                                        <Ionicons name="grid-outline" size={24} color="#4CAF50" />
                                    </View>
                                    <Text style={[styles.quickAccessText, { color: isDark ? '#FFF' : '#333' }]}>
                                        {t('account.nav.areas')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.quickAccessItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}
                                    onPress={() => router.replace('/convocatoria')}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                                        <Ionicons name="briefcase-outline" size={24} color="#2196F3" />
                                    </View>
                                    <Text style={[styles.quickAccessText, { color: isDark ? '#FFF' : '#333' }]}>
                                        {t('account.nav.convocatory')}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.quickAccessItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}
                                    onPress={() => router.replace('/nosotros')}
                                >
                                    <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                                        <Ionicons name="people-outline" size={24} color="#FF9800" />
                                    </View>
                                    <Text style={[styles.quickAccessText, { color: isDark ? '#FFF' : '#333' }]}>
                                        {t('account.nav.about')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Últimas Noticias */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('account.newsSection')}
                                </Text>
                            </View>
                            <FlatList
                                data={news}
                                renderItem={renderNewsItem}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.newsContainerHorizontal}
                            />
                        </View>

                        {/* Videos y Guías */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('account.videosSection')}
                                </Text>
                            </View>
                            <FlatList
                                data={guides}
                                renderItem={renderVideoItem}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.videoScrollContainer}
                            />
                        </View>

                        {/* Redes Sociales */}
                        <View style={styles.sectionContainer}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('account.socialSection')}
                                </Text>
                            </View>
                            <View style={styles.socialGrid}>
                                {SOCIAL_LINKS.map((social) => (
                                    <TouchableOpacity
                                        key={social.id}
                                        style={[styles.socialCard, { backgroundColor: social.color }]}
                                        onPress={() => openSocialLink(social.url)}
                                    >
                                        <Ionicons name={social.icon as any} size={24} color="#FFF" />
                                        <Text style={styles.socialName}>{social.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>

                    {/* Barra de Navegación Inferior */}
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
                            <Text style={[styles.navLabel, pathname === '/account' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('account.nav.home')}</Text>
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
                            <Text style={[styles.navLabel, pathname === '/areas' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('account.nav.areas')}</Text>
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
                            <Text style={[styles.navLabel, pathname === '/convocatoria' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('account.nav.convocatory')}</Text>
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
                            <Text style={[styles.navLabel, pathname === '/nosotros' && styles.navLabelActive, { color: isDark ? '#AAA' : '#666' }]}>{t('account.nav.about')}</Text>
                        </TouchableOpacity>
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
                                    url: localProfileImage || user?.photoURL || '',
                                    props: {
                                        source: localProfileImage
                                            ? { uri: localProfileImage }
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
                                    style={styles.closeButton}
                                    onPress={() => setIsProfileImageVisible(false)}
                                >
                                    <Ionicons name="close" size={30} color="#fff" />
                                </TouchableOpacity>
                            )}
                        />
                    </Modal>
                </View>
            </SafeAreaView>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 10, // Adjusted since header is outside scrollview
        right: 20,
        borderRadius: 12,
        padding: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex: 1000,
        minWidth: 150,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    menuText: {
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '500',
    },
    bannerContainer: {
        margin: 20,
        borderRadius: 16,
        overflow: 'hidden',
        height: 160,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    bannerSubtitle: {
        color: '#FFF',
        fontSize: 14,
        opacity: 0.9,
    },
    bannerButton: {
        backgroundColor: '#FFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'flex-start',
    },
    bannerButtonText: {
        color: '#4CAF50',
        fontWeight: 'bold',
        fontSize: 12,
    },
    quickAccessContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    quickAccessItem: {
        width: '31%',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickAccessText: {
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '600',
    },
    newsContainerHorizontal: { paddingHorizontal: 16, paddingVertical: 8 },
    newsCardHorizontal: {
        flexDirection: 'row',
        borderRadius: 16,
        borderWidth: 0, // Remove border for cleaner look
        overflow: 'hidden',
        width: 360, // Slightly smaller width for better carousel feel
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
        width: 130,
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
    newsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
        lineHeight: 20,
    },
    newsDate: {
        fontSize: 10,
        marginBottom: 4,
    },
    newsDescription: {
        fontSize: 11,
        lineHeight: 16,
    },
    readMoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    readMoreText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 4,
    },
    videoScrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    videoCard: {
        width: 280,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    thumbnailContainer: {
        position: 'relative',
        height: 157,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playIconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    videoInfo: {
        padding: 12,
    },
    videoTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    videoDuration: {
        fontSize: 12,
    },
    socialGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 12,
    },
    socialCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    socialName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 12,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
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
    navIcon: { width: 24, height: 24, marginBottom: 4, resizeMode: 'contain' },
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
    navItemActive: { borderTopWidth: 2, borderTopColor: '#4CAF50' },
    navIconActive: { tintColor: '#4CAF50' },
    navLabelActive: { color: '#4CAF50', fontWeight: 'bold' },
    menuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'transparent',
    },
});