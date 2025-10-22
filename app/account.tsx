// app/account.tsx
import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function AccountScreen() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [news] = useState([
        {
            id: 1,
            title: "Monitoreo de carbono en bosques amazónicos",
            date: "12/10/2025, Hr: 00:00",
            endDate: "12/11/2025, Hr: 11:59",
            topics: ["Monitoreo de carbono", "Servicios ecosistémicos", "Cambio climático"],
            status: "Abierto",
            color: "#4CAF50",
            image: require('../assets/images/news1.png'),
        },
        {
            id: 2,
            title: "Monitoreo de carbono en bosques amazónicos",
            date: "12/10/2025, Hr: 00:00",
            endDate: "12/11/2025, Hr: 11:59",
            topics: ["Monitoreo de carbono", "Servicios ecosistémicos", "Cambio climático"],
            status: "Cerrado",
            color: "#F44336",
            image: require('../assets/images/news2.jpeg'),
        },
    ]);

    const [guides] = useState([
        { id: 1, image: require('../assets/images/guia1.png') },
        { id: 2, image: require('../assets/images/guia2.png') },
    ]);

    if (loading) {
        return (
            <View style={styles.loading}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/login" />;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>volunteer account</Text>
                <View style={styles.headerRight}>
                    <Image
                        source={
                            user.photoURL
                                ? { uri: user.photoURL }
                                : require('../assets/images/avatar-default.png')
                        }
                        style={styles.avatar}
                        onError={(e) => console.log('Error al cargar avatar:', e.nativeEvent.error)}
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
                                router.push('/settings');
                                setIsMenuOpen(false);
                            }}
                        >
                            <Ionicons name="settings" size={20} color="#333" />
                            <Text style={styles.menuText}>Settings</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.menuItem}
                            onPress={() => {
                                router.push('/help');
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

            {/* Banner */}
            <View style={styles.banner}>
                <Image
                    source={require('../assets/images/banner.png')}
                    style={styles.bannerImage}
                />
                <View style={styles.bannerContent}>
                    <Text style={styles.bannerTitle}>Aquí comienza tu espacio exclusivo de usuario</Text>
                    <Text style={styles.bannerSubtitle}>Bienvenido/a usuario/a parte de este nuevo...</Text>
                    <TouchableOpacity style={styles.bannerButton}>
                        <Text style={styles.bannerButtonText}>Conocer más</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Últimas noticias */}
            <Text style={styles.sectionTitle}>Últimas noticias</Text>
            <View style={styles.newsContainer}>
                {news.map((item) => (
                    <View key={item.id} style={styles.newsCard}>
                        <Image
                            source={item.image}
                            style={styles.newsImage}
                        />
                        <View style={styles.newsText}>
                            <Text style={styles.newsDate}>{item.date}</Text>
                            <Text style={styles.newsEndDate}>{item.endDate}</Text>
                            <Text style={styles.newsTitle}>{item.title}</Text>
                            <Text style={styles.newsTopics}>{item.topics.join(', ')}</Text>
                            <View style={styles.newsStatusContainer}>
                                <TouchableOpacity style={[styles.statusButton, { backgroundColor: item.color }]}>
                                    <Text style={styles.statusText}>{item.status}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.detailsButton}>
                                    <Text style={styles.detailsText}>Detalles</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Guías y Tutoriales */}
            <Text style={styles.sectionTitle}>Guías y Tutoriales</Text>
            <View style={styles.guidesContainer}>
                {guides.map((guide) => (
                    <TouchableOpacity key={guide.id} style={styles.guideCard}>
                        <Image source={guide.image} style={styles.guideImage} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Barra de navegación inferior */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
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
    menuContainer: {
        padding: 8,
        minWidth: 160,
    },
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
        color: '#333',
    },
    banner: {
        position: 'relative',
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
        height: 150,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bannerSubtitle: {
        color: '#FFF',
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
    bannerButtonText: {
        color: '#FFF',
        fontSize: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    newsContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    newsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DDD',
        marginBottom: 16,
        overflow: 'hidden',
    },
    newsImage: {
        width: 100,
        height: 100,
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
        color: '#666',
    },
    newsEndDate: {
        fontSize: 10,
        color: '#666',
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    newsTopics: {
        fontSize: 12,
        color: '#666',
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
        borderColor: '#666',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    detailsText: {
        color: '#666',
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
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        backgroundColor: '#FFF',
        paddingVertical: 8,
    },
    navItem: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    navIcon: {
        width: 24,
        height: 24,
        marginBottom: 4,
        resizeMode: 'contain',
    },
    navLabel: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'center',
    },
});