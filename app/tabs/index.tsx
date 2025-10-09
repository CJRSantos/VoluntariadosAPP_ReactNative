// app/(tabs)/index.tsx
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView style={styles.container}>
            {/* Banner superior */}
            <View style={styles.banner}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/400x200?text=Volunteer+Account' }}
                    style={styles.bannerImage}
                    resizeMode="cover"
                />
                <Text style={styles.bannerTitle}>volunteer account</Text>
                <TouchableOpacity style={styles.bannerButton}>
                    <Text style={styles.bannerButtonText}>Conocer más</Text>
                </TouchableOpacity>
            </View>

            {/* Últimas noticias */}
            <Text style={styles.sectionTitle}>Últimas noticias</Text>
            <View style={styles.newsContainer}>
                <View style={styles.newsCard}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/300x150?text=Noticia+1' }}
                        style={styles.newsImage}
                    />
                    <Text style={styles.newsDate}>12/10/2025, Hr: 00:00</Text>
                    <Text style={styles.newsTitle}>Monitoreo de carbono en bosques amazónicos</Text>
                    <Text style={styles.newsDetails}>Líneas temáticas: Monitoreo de carbono, Servicios ecosistémicos, Cambio climático</Text>
                    <View style={styles.newsButtons}>
                        <TouchableOpacity style={styles.newsButtonOpen}>
                            <Text style={styles.newsButtonOpenText}>Abierto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.newsButtonPostulate}>
                            <Text style={styles.newsButtonPostulateText}>Postular</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.newsCard}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/300x150?text=Noticia+2' }}
                        style={styles.newsImage}
                    />
                    <Text style={styles.newsDate}>12/11/20, Hr: 11:59</Text>
                    <Text style={styles.newsTitle}>Monitoreo de carbono en bosques amazónicos</Text>
                    <Text style={styles.newsDetails}>Líneas temáticas: Monitoreo de carbono, Servicios ecosistémicos, Cambio climático</Text>
                    <View style={styles.newsButtons}>
                        <TouchableOpacity style={styles.newsButtonClosed}>
                            <Text style={styles.newsButtonClosedText}>Cerrado</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Guías y Tutoriales */}
            <Text style={styles.sectionTitle}>Guías y Tutoriales</Text>
            <View style={styles.tutorialsContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150x100?text=Guía+1' }}
                    style={styles.tutorialImage}
                />
                <Image
                    source={{ uri: 'https://via.placeholder.com/150x100?text=Guía+2' }}
                    style={styles.tutorialImage}
                />
                <Image
                    source={{ uri: 'https://via.placeholder.com/150x100?text=Guía+3' }}
                    style={styles.tutorialImage}
                />
            </View>

            {/* Espacio para más contenido */}
            <View style={styles.footerSpace} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    banner: {
        position: 'relative',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        marginBottom: 20,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.7,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
    },
    bannerButton: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    bannerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginVertical: 10,
        color: '#333',
    },
    newsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    newsCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    newsImage: {
        width: '100%',
        height: 100,
    },
    newsDate: {
        fontSize: 12,
        color: '#666',
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    newsTitle: {
        fontSize: 14,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingBottom: 5,
        color: '#333',
    },
    newsDetails: {
        fontSize: 12,
        color: '#666',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    newsButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    newsButtonOpen: {
        backgroundColor: '#10b981',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    newsButtonOpenText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    newsButtonPostulate: {
        backgroundColor: '#4f46e5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    newsButtonPostulateText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    newsButtonClosed: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
    },
    newsButtonClosedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    tutorialsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    tutorialImage: {
        width: 150,
        height: 100,
        borderRadius: 8,
    },
    footerSpace: {
        height: 80, // Espacio para la barra de tabs
    },
});