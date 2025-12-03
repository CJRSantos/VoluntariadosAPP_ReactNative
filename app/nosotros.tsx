// app/nosotros.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useAuth } from '../app/providers/AuthProvider';
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export const options = {
    headerShown: false,
};

export default function NosotrosScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname(); // 👈 Detecta la ruta actual
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        {t('nosotros.headerTitle')}
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
                                        router.push('/login');
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
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
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
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
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
                                    { backgroundColor: isDark ? '#222' : '#F5F5F5' },
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

                {/* Barra inferior con resaltado verde */}
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
                        style={[styles.navItem, pathname === '/inicio' && styles.navItemActive]}
                        onPress={() => router.push('/account')}
                    >
                        <Image
                            source={require('../assets/images/home-icon.png')}
                            style={[styles.navIcon, pathname === '/inicio' && styles.navIconActive]}
                        />
                        <Text
                            style={[styles.navLabel, pathname === '/inicio' && styles.navLabelActive]}
                        >
                            {t('nosotros.nav.home')}
                        </Text>
                    </TouchableOpacity>

                    {/* Áreas */}
                    <TouchableOpacity
                        style={[styles.navItem, pathname === '/areas' && styles.navItemActive]}
                        onPress={() => router.push('/areas')}
                    >
                        <Image
                            source={require('../assets/images/areas-icon.png')}
                            style={[styles.navIcon, pathname === '/areas' && styles.navIconActive]}
                        />
                        <Text
                            style={[styles.navLabel, pathname === '/areas' && styles.navLabelActive]}
                        >
                            {t('nosotros.nav.areas')}
                        </Text>
                    </TouchableOpacity>

                    {/* Convocatoria */}
                    <TouchableOpacity
                        style={[styles.navItem, pathname === '/convocatoria' && styles.navItemActive]}
                        onPress={() => router.push('/convocatoria')}
                    >
                        <Image
                            source={require('../assets/images/convocatory-icon.png')}
                            style={[styles.navIcon, pathname === '/convocatoria' && styles.navIconActive]}
                        />
                        <Text
                            style={[styles.navLabel, pathname === '/convocatoria' && styles.navLabelActive]}
                        >
                            {t('nosotros.nav.convocatory')}
                        </Text>
                    </TouchableOpacity>

                    {/* Nosotros */}
                    <TouchableOpacity
                        style={[styles.navItem, pathname === '/nosotros' && styles.navItemActive]}
                        onPress={() => router.push('/nosotros')}
                    >
                        <Image
                            source={require('../assets/images/nosotros-icon.png')}
                            style={[styles.navIcon, pathname === '/nosotros' && styles.navIconActive]}
                        />
                        <Text
                            style={[styles.navLabel, pathname === '/nosotros' && styles.navLabelActive]}
                        >
                            {t('nosotros.nav.about')}
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

    // 🔹 Estilos para el resaltado verde
    navItemActive: { borderTopWidth: 2, borderTopColor: '#00C853' },
    navIconActive: { tintColor: '#00C853' },
    navLabelActive: { color: '#00C853', fontWeight: 'bold' },
});
