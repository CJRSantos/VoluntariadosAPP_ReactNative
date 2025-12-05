import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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
import { IMAGES } from '../assets/data/imageMap';
import newsData from '../assets/data/news.json';
import uiData from '../assets/data/ui.json';
import { useTheme } from './providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function NewsDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isDark = theme === 'dark';

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const newsId = Number(params.id);
    const newsItem = newsData.find(item => item.id === newsId);

    const closeModal = () => setSelectedImageIndex(null);

    if (!newsItem) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                <Stack.Screen options={{ headerShown: false }} />
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{uiData.errors.newsNotFound}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#4CAF50' }}>{uiData.errors.goBack}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const { title, date, endDate, description, carouselImages } = newsItem;
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';
    const displayTitle = title[currentLang];
    const displayDate = date[currentLang];
    const displayEndDate = endDate[currentLang];
    const displayDescription = description[currentLang];

    const images = carouselImages ? carouselImages.map(imgKey => IMAGES[imgKey]) : [];
    // Prepare images for ImageViewer
    const viewerImages = images.map(img => ({
        url: '', // Local images don't need URL if props.source is provided
        props: {
            source: img
        }
    }));

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('account.news.details')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* CAROUSEL */}
                {images.length > 0 && (
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        style={{ width: '100%', height: 250 }}
                    >
                        {images.map((img, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => setSelectedImageIndex(index)}
                                activeOpacity={0.9}
                            >
                                <Image
                                    source={img}
                                    style={{ width, height: 250 }}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}

                <View style={styles.detailsContainer}>
                    {/* TÍTULO */}
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                        {displayTitle}
                    </Text>

                    {/* FECHA */}
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={16} color={isDark ? '#AAA' : '#666'} />
                        <Text style={[styles.date, { color: isDark ? '#AAA' : '#666' }]}>
                            {displayDate} - {displayEndDate}
                        </Text>
                    </View>

                    {/* CONTENIDO COMPLETO */}
                    <Text style={[styles.description, { color: isDark ? '#DDD' : '#444' }]}>
                        {displayDescription}
                    </Text>

                    <TouchableOpacity
                        style={[styles.applyButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => router.push('/postulacion-paso1')}
                    >
                        <Text style={styles.applyButtonText}>{t('account.news.apply')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* FULL-SCREEN SWIPEABLE MODAL */}
            <Modal
                visible={selectedImageIndex !== null}
                transparent={true}
                onRequestClose={closeModal}
            >
                <ImageViewer
                    imageUrls={viewerImages}
                    index={selectedImageIndex || 0}
                    onSwipeDown={closeModal}
                    enableSwipeDown={true}
                    backgroundColor="black"
                    renderHeader={() => (
                        <TouchableOpacity
                            onPress={closeModal}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={28} color="#FFF" />
                        </TouchableOpacity>
                    )}
                    renderIndicator={(currentIndex, allSize) => (
                        <View style={styles.indicatorContainer}>
                            <Text style={styles.indicatorText}>
                                {currentIndex} / {allSize}
                            </Text>
                        </View>
                    )}
                />
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { paddingBottom: 40 },
    detailsContainer: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    date: { fontSize: 14 },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 30,
        textAlign: 'justify',
    },
    applyButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    indicatorContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 10,
    },
    indicatorText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    }
});