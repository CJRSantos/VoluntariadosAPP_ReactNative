// app/nosotros.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import { Header } from '../src/components/Header';

import { useAuth } from './providers/AuthProvider';

const { width } = Dimensions.get('window');

export const options = {
    headerShown: false,
};

export default function NosotrosScreen() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isProfileImageVisible, setIsProfileImageVisible] = useState(false);



    useEffect(() => {
        const loadProfileImage = async () => {
            try {
                const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                if (savedPhoto) setProfileImage(savedPhoto);
            } catch (error) {
                console.log('Error loading profile image:', error);
            }
        };
        loadProfileImage();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const stats = [
        { value: '+4', label: t('nosotros.stats.publications') },
        { value: '+10', label: t('nosotros.stats.projects') },
        { value: '+500', label: t('nosotros.stats.beneficiaries') },
        { value: '+8', label: t('nosotros.stats.alliances') },
    ];

    if (loading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                <View style={styles.loading}>
                    <Text style={{ color: isDark ? '#FFF' : '#333' }}>{t('common.loading', 'Cargando...')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
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
                    onImagePress={() => setIsProfileImageVisible(true)}
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
                                        {t('nosotros.menu.profile')}
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
                                        {t('nosotros.menu.settings')}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, { backgroundColor: isDark ? '#222' : '#FFF' }]}
                                    onPress={() => {
                                        Alert.alert(t('nosotros.menu.soon'), t('nosotros.menu.helpSoon'));
                                        setIsMenuOpen(false);
                                    }}
                                >
                                    <Ionicons name="help-circle" size={20} color={isDark ? '#FFF' : '#333'} />
                                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('nosotros.menu.help')}</Text>
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
                                        {t('nosotros.menu.logout')}
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
                            {t('nosotros.whyJoin')}
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('nosotros.joinDescription')}
                        </Text>

                        <View style={styles.iconsSection}>
                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#111' : '#FFF' },
                                ]}
                            >
                                <Ionicons name="people" size={40} color="#FF5722" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('nosotros.ourHistory')}
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('nosotros.historyDescription')}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#111' : '#FFF' },
                                ]}
                            >
                                <Ionicons name="rocket" size={40} color="#FF9800" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('nosotros.ourMission')}
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('nosotros.missionDescription')}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.iconCard,
                                    { backgroundColor: isDark ? '#111' : '#FFF' },
                                ]}
                            >
                                <Ionicons name="water" size={40} color="#2196F3" />
                                <Text style={[styles.iconTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    {t('nosotros.difference')}
                                </Text>
                                <Text style={[styles.iconText, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('nosotros.differenceDescription')}
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
                                        { backgroundColor: isDark ? '#111' : '#FFF' },
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
                        style={[styles.navItem, pathname === '/account' && styles.navItemActive]}
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
                                { color: isDark ? '#AAA' : '#666' }
                            ]}
                        >
                            {t('nosotros.nav.home')}
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
                                { color: isDark ? '#AAA' : '#666' }
                            ]}
                        >
                            {t('nosotros.nav.areas')}
                        </Text>
                    </TouchableOpacity>

                    {/* Convocatoria */}
                    <TouchableOpacity
                        style={[styles.navItem, pathname === '/convocatoria' && styles.navItemActive]}
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
                                { color: isDark ? '#AAA' : '#666' }
                            ]}
                        >
                            {t('nosotros.nav.convocatory')}
                        </Text>
                    </TouchableOpacity>

                    {/* Nosotros */}
                    <TouchableOpacity
                        style={[styles.navItem, pathname === '/nosotros' && styles.navItemActive]}
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
                                { color: '#4CAF50' }
                            ]}
                        >
                            {t('nosotros.nav.about')}
                        </Text>
                    </TouchableOpacity>
                </View>
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
                            url: profileImage || user?.photoURL || '',
                            props: {
                                source: profileImage
                                    ? { uri: profileImage }
                                    : user?.photoURL
                                        ? { uri: user.photoURL }
                                        : require('../assets/images/avatar_default.png'),
                            },
                        },
                    ]}
                    onSwipeDown={() => setIsProfileImageVisible(false)}
                    enableSwipeDown={true}
                    renderHeader={() => (
                        <TouchableOpacity
                            style={{ position: 'absolute', top: 40, right: 20, zIndex: 1 }}
                            onPress={() => setIsProfileImageVisible(false)}
                        >
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>
                    )}
                />
            </Modal>
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
    menuOverlay: {
        position: 'absolute',
        top: 70,
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
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    subtitle: { fontSize: 16, marginBottom: 24, textAlign: 'center', lineHeight: 24 },
    iconsSection: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 24 },
    iconCard: {
        width: (width - 48) / 3,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 12, textAlign: 'center' },
    iconText: { fontSize: 11, textAlign: 'center', marginTop: 6, lineHeight: 16 },
    labImage: { width: '100%', height: 220, borderRadius: 20, marginBottom: 24 },
    statsSection: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: 20 },
    statCard: {
        width: (width - 60) / 4,
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    statLabel: { fontSize: 10, textAlign: 'center', marginTop: 4 },
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
    navLabel: { fontSize: 10, marginTop: 4, textAlign: 'center' },
    navItemActive: { borderTopWidth: 2, borderTopColor: '#4CAF50' },
    navLabelActive: { color: '#4CAF50', fontWeight: 'bold' },
});
