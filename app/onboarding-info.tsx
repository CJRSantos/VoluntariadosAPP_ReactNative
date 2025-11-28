// app/onboarding-info.tsx
import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Clipboard, Image, Linking, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { IMAGES } from '../assets/data/imageMap';
import onboardingData from '../assets/data/onboarding.json';
import { useTheme } from './providers/ThemeProvider';

// 👇 Ocultar solo el título, mantener la flecha de retroceso
export const screenOptions = {
    headerTitle: '',
};

export default function OnboardingInfo() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    // Estado para controlar si se muestra el modal de imagen
    const [isImageVisible, setIsImageVisible] = useState(false);
    // Estado para almacenar la URL de la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Función para abrir la imagen en zoom (asíncrona)
    const openImage = async (imageSource: any) => {
        try {
            let asset;

            if (typeof imageSource === 'number') {
                asset = Asset.fromModule(imageSource);
            } else if (typeof imageSource === 'object' && imageSource.uri) {
                setSelectedImage(imageSource.uri);
                setIsImageVisible(true);
                return;
            } else if (typeof imageSource === 'string') {
                setSelectedImage(imageSource);
                setIsImageVisible(true);
                return;
            } else {
                throw new Error('Tipo de imagen no soportado');
            }

            await asset.downloadAsync();
            setSelectedImage(asset.localUri || asset.uri);
            setIsImageVisible(true);

        } catch (error) {
            console.error('Error al cargar la imagen:', error);
            Alert.alert(t('login.errorTitle'), 'No se pudo cargar la imagen. Intente más tarde.');
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{onboardingData.title}</Text>
                <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                    {onboardingData.subtitle}
                </Text>
            </View>

            {/* Sección 1: ¿Qué es Voluntariados IIAP? */}
            <View style={[styles.section, { borderColor: isDark ? '#333' : '#EEE' }]}>
                {/* Imagen ahora clickeable para zoom */}
                <TouchableOpacity onPress={async () => await openImage(IMAGES[onboardingData.sections[0].image!])}>
                    <Image
                        source={IMAGES[onboardingData.sections[0].image!]}
                        style={styles.sectionImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {onboardingData.sections[0].title}
                </Text>
                <Text style={[styles.sectionText, { color: isDark ? '#DDD' : '#444' }]}>
                    {onboardingData.sections[0].text}
                </Text>
            </View>

            {/* Sección 2: ¿Cómo funciona? */}
            <View style={[styles.section, { borderColor: isDark ? '#333' : '#EEE' }]}>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {onboardingData.sections[1].title}
                </Text>
                <Text style={[styles.sectionText, { color: isDark ? '#DDD' : '#444' }]}>
                    {onboardingData.sections[1].text}
                </Text>

                {/* Botón para abrir video de YouTube */}
                <TouchableOpacity
                    style={[styles.videoButton, { backgroundColor: '#FF0000', marginTop: 16 }]}
                    onPress={() => {
                        const youtubeUrl = onboardingData.sections[1].videoUrl!;
                        Linking.openURL(youtubeUrl).catch((err) => {
                            console.error('Error al abrir YouTube:', err);
                            Alert.alert(
                                t('login.errorTitle'),
                                t('account.videos.errorMessage'),
                                [{ text: t('account.videos.copyLink'), onPress: () => Clipboard.setString(youtubeUrl) }]
                            );
                        });
                    }}
                >
                    <Ionicons name="play-circle" size={24} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.videoButtonText}>{onboardingData.sections[1].buttonText}</Text>
                </TouchableOpacity>
            </View>

            {/* Sección 3: Beneficios */}
            <View style={[styles.section, { borderColor: isDark ? '#333' : '#EEE' }]}>
                {/* Imagen ahora clickeable para zoom */}
                <TouchableOpacity onPress={async () => await openImage(IMAGES[onboardingData.sections[2].image!])}>
                    <Image
                        source={IMAGES[onboardingData.sections[2].image!]}
                        style={styles.sectionImage}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {onboardingData.sections[2].title}
                </Text>
                <Text style={[styles.sectionText, { color: isDark ? '#DDD' : '#444' }]}>
                    {onboardingData.sections[2].text}
                </Text>
            </View>

            {/* Botón de acción final */}
            <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => router.push('/convocatoria')}
            >
                <Text style={styles.ctaButtonText}>{onboardingData.ctaButton}</Text>
            </TouchableOpacity>

            {/* Pie de página / Volver */}
            <TouchableOpacity
                style={[styles.backButton, { borderColor: isDark ? '#AAA' : '#666' }]}
                onPress={() => router.back()}
            >
            </TouchableOpacity>

            {/* Modal para ver imagen con zoom */}
            <Modal
                visible={isImageVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsImageVisible(false)}
            >
                <ImageViewer
                    imageUrls={[
                        {
                            url: selectedImage || '',
                        },
                    ]}
                    enableSwipeDown={true}
                    onSwipeDown={() => setIsImageVisible(false)}
                    saveToLocalByLongPress={false}
                    backgroundColor="rgba(0,0,0,0.8)"
                    loadingRender={() => <Text style={{ color: '#FFF' }}>{t('account.loading')}</Text>}
                    onClick={() => setIsImageVisible(false)}
                    renderHeader={() => (
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                top: 40,
                                left: 20,
                                zIndex: 1000,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                padding: 8,
                                borderRadius: 20,
                            }}
                            onPress={() => setIsImageVisible(false)}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                    )}
                />
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    sectionImage: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
        borderRadius: 8,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    sectionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    ctaButton: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    ctaButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        marginTop: 16,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 14,
    },
    videoButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    videoButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});