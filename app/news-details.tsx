import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IMAGES } from '../assets/data/imageMap';
import newsData from '../assets/data/news.json';
import uiData from '../assets/data/ui.json';
import { useTheme } from './providers/ThemeProvider';

const { width, height } = Dimensions.get('window');

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

            {/* FULL-SCREEN ZOOM MODAL */}
            <Modal
                isVisible={selectedImageIndex !== null}
                onBackdropPress={closeModal}
                onBackButtonPress={closeModal}
                style={styles.modal}
                backdropOpacity={1}
                animationIn="fadeIn"
                animationOut="fadeOut"
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color="#FFF" />
                    </TouchableOpacity>
                    {selectedImageIndex !== null && images.length > 0 && (
                        // @ts-ignore
                        <ImageZoom
                            cropWidth={width}
                            cropHeight={height}
                            imageWidth={width}
                            imageHeight={height * 0.8}
                            minScale={1}
                            maxScale={3}
                            pinchToZoom
                        >
                            <Image
                                source={images[selectedImageIndex]}
                                style={{ width, height: height * 0.8 }}
                                resizeMode="contain"
                            />
                        </ImageZoom>
                    )}
                </View>
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
    modal: {
        margin: 0,
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        padding: 8,
    },
});