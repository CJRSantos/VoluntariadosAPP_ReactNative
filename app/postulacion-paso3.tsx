// app/postulacion-paso3.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function PostulacionPaso3Screen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    // 👇 Recibir el ID de la convocatoria desde la URL
    const { convocatoriaId } = useLocalSearchParams();
    const convId = convocatoriaId
        ? parseInt(Array.isArray(convocatoriaId) ? convocatoriaId[0] : convocatoriaId)
        : null;

    const handleEnviarPostulacion = () => {
        // Simulamos envío exitoso
        setTimeout(() => {
            // 👉 Pasar el ID a la pantalla de confirmación
            router.push({
                pathname: '/postulacion-confirmada',
                params: convId != null ? { convocatoriaId: convId } : {},
            });
        }, 500);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step3.title')}
                    </Text>
                    <View style={styles.stepIndicator}>
                        <View style={[styles.dot]} />
                        <View style={[styles.dot]} />
                        <View style={[styles.dot, styles.activeDot]} />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '100%' }]} />
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step3.stepTitle')}
                    </Text>

                    <View style={styles.checklist}>
                        <View style={styles.checkItem}>
                            <Text style={[styles.checkIcon, { color: isDark ? '#4CAF50' : '#4CAF50' }]}>✓</Text>
                            <View style={styles.checkTextContainer}>
                                <Text style={[styles.checkLabel, { color: isDark ? '#FFF' : '#000' }]}>
                                    {t('postulacion.step3.personalData')}
                                </Text>
                                <Text style={[styles.checkStatus, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('postulacion.step3.completed')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.checkItem}>
                            <Text style={[styles.checkIcon, { color: isDark ? '#4CAF50' : '#4CAF50' }]}>✓</Text>
                            <View style={styles.checkTextContainer}>
                                <Text style={[styles.checkLabel, { color: isDark ? '#FFF' : '#000' }]}>
                                    {t('postulacion.step3.documents')}
                                </Text>
                                <Text style={[styles.checkStatus, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('postulacion.step3.completed')}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.checkItem}>
                            <Text style={[styles.checkIcon, { color: isDark ? '#777' : '#777' }]}>•</Text>
                            <View style={styles.checkTextContainer}>
                                <Text style={[styles.checkLabel, { color: isDark ? '#FFF' : '#000' }]}>
                                    {t('postulacion.step3.confirmation')}
                                </Text>
                                <Text style={[styles.checkStatus, { color: isDark ? '#AAA' : '#666' }]}>
                                    {t('postulacion.step3.currentStep')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.submitButton, { backgroundColor: '#4CAF50' }]}
                        onPress={handleEnviarPostulacion}
                    >
                        <Text style={styles.submitButtonText}>{t('postulacion.step3.submitButton')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { paddingHorizontal: 20, paddingTop: 20 },
    header: { marginBottom: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginBottom: 16 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#CCC' },
    activeDot: { backgroundColor: '#4CAF50' },
    progressBar: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        marginBottom: 20,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#4CAF50',
    },
    stepContent: { gap: 16 },
    stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    checklist: { gap: 12 },
    checkItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    checkIcon: { fontSize: 20, fontWeight: 'bold', marginTop: 2 },
    checkTextContainer: { flex: 1 },
    checkLabel: { fontSize: 16, fontWeight: '500' },
    checkStatus: { fontSize: 14 },
    submitButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});