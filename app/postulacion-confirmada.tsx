// app/postulacion-confirmada.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function PostulacionConfirmadaScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    // 👇 Recibir el ID de la convocatoria
    const { convocatoriaId } = useLocalSearchParams();
    const convId = convocatoriaId
        ? parseInt(Array.isArray(convocatoriaId) ? convocatoriaId[0] : convocatoriaId)
        : null;

    // ✅ Guardar en AsyncStorage cuando se monte la pantalla
    useEffect(() => {
        if (convId !== null) {
            const guardarPostulacion = async () => {
                try {
                    const saved = await AsyncStorage.getItem('postulaciones');
                    const postulaciones = saved ? JSON.parse(saved) : {};
                    postulaciones[convId] = true;
                    await AsyncStorage.setItem('postulaciones', JSON.stringify(postulaciones));
                    console.log(`✅ Marcada como postulada: convocatoria ID ${convId}`);
                } catch (error) {
                    console.error('❌ Error al guardar postulación:', error);
                }
            };
            guardarPostulacion();
        }
    }, [convId]);

    const handleVolverInicio = () => {
        router.push('/convocatoria'); // 👈 Cambiado a '/convocatoria' para ver el estado actualizado
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{ title: '', headerBackTitle: '', headerStyle: { backgroundColor: isDark ? '#000' : '#fff' }, headerTintColor: isDark ? '#fff' : '#000' }} />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Icono de éxito */}
                <View style={styles.successIconContainer}>
                    <View style={[styles.successIcon, { borderColor: '#4CAF50' }]}>
                        <Text style={[styles.checkmark, { color: '#4CAF50' }]}>✓</Text>
                    </View>
                </View>

                {/* Título */}
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                    {t('postulacion.confirmation.title')}
                </Text>

                {/* Mensaje */}
                <Text style={[styles.message, { color: isDark ? '#FFF' : '#000' }]}>
                    {t('postulacion.confirmation.message')}
                </Text>

                {/* Botón Volver al inicio */}
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: '#4CAF50' }]}
                    onPress={handleVolverInicio}
                >
                    <Text style={styles.backButtonText}>
                        {t('postulacion.confirmation.backButton')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: {
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    successIconContainer: {
        marginBottom: 20,
    },
    successIcon: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    backButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 200,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});