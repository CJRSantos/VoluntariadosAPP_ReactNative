import { Ionicons } from '@expo/vector-icons';
import { Asset } from 'expo-asset';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
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
import areasData from '../assets/data/areas.json';
import { IMAGES } from '../assets/data/imageMap';
import uiData from '../assets/data/ui.json';
import { useTheme } from './providers/ThemeProvider';

export default function AreaDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const isDark = theme === 'dark';
    const currentLang = (i18n.language === 'en' ? 'en' : 'es') as 'es' | 'en';

    // Estado para controlar si se muestra el modal de imagen
    const [isImageVisible, setIsImageVisible] = useState(false);
    // Estado para almacenar la URL de la imagen seleccionada
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const areaId = Number(params.id);
    const area = areasData.find(item => item.id === areaId);

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

    if (!area) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{uiData.errors.areaNotFound}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#4CAF50' }}>{uiData.errors.goBack}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('areas.detailsTitle', 'Detalle del Área')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {area.image && IMAGES[area.image] && (
                    <TouchableOpacity onPress={async () => await openImage(IMAGES[area.image])}>
                        <Image
                            source={IMAGES[area.image]}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.detailsContainer}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                        {area.title[currentLang]}
                    </Text>

                    <Text style={[styles.direction, { color: isDark ? '#AAA' : '#666' }]}>
                        {area.direction[currentLang]}
                    </Text>

                    <Text style={[styles.description, { color: isDark ? '#DDD' : '#444' }]}>
                        {area.content[currentLang]}
                    </Text>
                </View>
            </ScrollView>

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
    image: {
        width: '100%',
        height: 250,
    },
    detailsContainer: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    direction: { fontSize: 14, marginBottom: 20, fontStyle: 'italic' },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
});
