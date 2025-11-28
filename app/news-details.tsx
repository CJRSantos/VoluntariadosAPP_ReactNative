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
import { useTheme } from './providers/ThemeProvider';

const { width, height } = Dimensions.get('window');

export default function NewsDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const title = params.title as string || 'Monitoreo de carbono en bosques amazónicos';
    const date = params.date as string || '';
    const endDate = params.endDate as string || '';

    const images = [
        require('../assets/images/iiap1.png'),
        require('../assets/images/iiap2.png'),
        require('../assets/images/iiap3.png'),
        require('../assets/images/iiap4.png'),
    ];

    const closeModal = () => setSelectedImageIndex(null);

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

                <View style={styles.detailsContainer}>
                    {/* TÍTULO */}
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                        Monitoreo de carbono en bosques amazónicos — IIAP
                    </Text>

                    {/* FECHA */}
                    <View style={styles.dateContainer}>
                        <Ionicons name="calendar-outline" size={16} color={isDark ? '#AAA' : '#666'} />
                        <Text style={[styles.date, { color: isDark ? '#AAA' : '#666' }]}>
                            {date} - {endDate}
                        </Text>
                    </View>

                    {/* CONTENIDO COMPLETO */}
                    <Text style={[styles.description, { color: isDark ? '#DDD' : '#444' }]}>
                        {`1) ¿Qué es el monitoreo de carbono en bosques amazónicos?
El monitoreo de carbono mide cuánto carbono almacenan los bosques amazónicos en su biomasa viva, madera muerta, hojarasca y suelo, además de cuantificar los flujos de CO₂ entre el bosque y la atmósfera. Permite estimar stocks, detectar pérdidas por deforestación o degradación, y verificar acciones de conservación o restauración.

2) ¿Por qué es relevante para la Amazonía peruana y para el IIAP?
La Amazonía peruana es una de las mayores reservas de carbono del planeta. Conservarla es clave para mitigar el cambio climático. El IIAP genera información científica, protocolos, campañas de campo y publicaciones que permiten monitorear estos cambios de forma estándar y confiable.

3) Objetivos de un programa de monitoreo del IIAP
• Estimar stocks de carbono (biomasa aérea, raíces, hojarasca, madera muerta, suelo).
• Medir flujos de CO₂ y variaciones temporales.
• Detectar pérdidas por deforestación, incendios o degradación.
• Generar datos para NDCs, inventarios nacionales y proyectos REDD+.

4) Métodos y herramientas
• Parcelas permanentes: DAP, altura, especie, biomasa → carbono.
• Muestreo de suelo y madera muerta.
• Torres Eddy Covariance: flujos directos de CO₂.
• Sensores satelitales + LiDAR para mapas y cambios.
• Modelos alométricos validados para especies amazónicas.
• Protocolos estandarizados Rainfor / IIAP.

5) Productos esperados
• Mapas de stocks y cambios de carbono.
• Series temporales de flujos de CO₂.
• Informes técnicos para inventarios y políticas climáticas.
• Bases de datos estandarizadas de parcelas permanentes.

6) Aplicaciones prácticas
• Cumplimiento de NDCs.
• Verificación de proyectos REDD+.
• Conservación y gestión territorial.
• Priorización de áreas vulnerables (aguajales, turberas).

7) Retos
• Alta heterogeneidad de la Amazonía.
• Costos de campo y acceso difícil.
• Humedales/turberas requieren métodos específicos.
• Integrar campo + torres + satélite en una sola plataforma.

8) Recomendaciones operativas
• Mantener una red de parcelas permanentes bien distribuidas.
• Contar con estaciones de flujo representativas.
• Integrar LiDAR + satélite para escalamiento regional.
• Priorizar turberas por su enorme almacenamiento de carbono.
• Publicar protocolos y datos abiertos.

9) Enfocado en el IIAP en Iquitos
El IIAP, ubicado en Iquitos, lidera investigaciones sobre carbono amazónico:
• Desarrollo de manuales técnicos.
• Inventarios forestales permanentes.
• Medición de suelos, madera muerta y ecosistemas especiales.
• Colaboraciones con Rainfor, MINAM, SERFOR y proyectos REDD+.
• Generación de mapas y reportes usados por el Gobierno del Perú.`}
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
                    {selectedImageIndex !== null && (
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