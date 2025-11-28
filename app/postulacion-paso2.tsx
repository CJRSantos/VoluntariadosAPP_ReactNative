// app/postulacion-paso2.tsx
import * as DocumentPicker from 'expo-document-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function PostulacionPaso2Screen() {
    const router = useRouter();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    // 👇 Recibir el ID de la convocatoria desde la URL
    const { convocatoriaId } = useLocalSearchParams();
    const convId = convocatoriaId
        ? parseInt(Array.isArray(convocatoriaId) ? convocatoriaId[0] : convocatoriaId)
        : null;

    const [carta, setCarta] = useState<any>(null);
    const [cv, setCv] = useState<any>(null);

    const pickFile = async (type: 'carta' | 'cv') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',
                    'image/*',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            if (type === 'carta') {
                setCarta(file);
                Alert.alert(t('postulacion.step2.alertTitle'), file.name || t('postulacion.step2.noName'));
            } else {
                setCv(file);
                Alert.alert(t('postulacion.step2.alertCvTitle'), file.name || t('postulacion.step2.noName'));
            }
        } catch (error) {
            console.error(`Error al seleccionar ${type}:`, error);
            Alert.alert(
                t('postulacion.step2.errorTitle'),
                `${t('postulacion.step2.errorSelection')} ${type === 'carta' ? 'archivo' : 'CV'}.`
            );
        }
    };

    const handleSiguiente = () => {
        if (!carta || !cv) {
            Alert.alert(t('postulacion.step2.warningTitle'), t('postulacion.step2.warningMessage'));
            return;
        }
        // 👉 Pasar el ID al siguiente paso
        router.push({
            pathname: '/postulacion-paso3',
            params: convId != null ? { convocatoriaId: convId } : {},
        });
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{ title: '', headerBackTitle: '', headerStyle: { backgroundColor: isDark ? '#000' : '#fff' }, headerTintColor: isDark ? '#fff' : '#000' }} />
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step2.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                        {t('postulacion.step2.subtitle')}
                    </Text>
                    <View style={styles.stepIndicator}>
                        <View style={[styles.dot]} />
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={[styles.dot]} />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '66%' }]} />
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step2.stepTitle')}
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#000' }]}>
                            {t('postulacion.step2.coverLetterLabel')}
                        </Text>
                        <TouchableOpacity
                            style={[styles.fileInput, { borderColor: isDark ? '#444' : '#CCC' }]}
                            onPress={() => pickFile('carta')}
                        >
                            <Text
                                style={[
                                    styles.fileInputText,
                                    {
                                        color: carta
                                            ? isDark
                                                ? '#FFF'
                                                : '#000'
                                            : isDark
                                                ? '#AAA'
                                                : '#666',
                                    },
                                ]}
                            >
                                {carta
                                    ? carta.name || t('postulacion.step2.fileSelected')
                                    : t('postulacion.step2.uploadCoverLetter')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#000' }]}>
                            {t('postulacion.step2.cvLabel')}
                        </Text>
                        <TouchableOpacity
                            style={[styles.fileInput, { borderColor: isDark ? '#444' : '#CCC' }]}
                            onPress={() => pickFile('cv')}
                        >
                            <Text
                                style={[
                                    styles.fileInputText,
                                    {
                                        color: cv
                                            ? isDark
                                                ? '#FFF'
                                                : '#000'
                                            : isDark
                                                ? '#AAA'
                                                : '#666',
                                    },
                                ]}
                            >
                                {cv
                                    ? cv.name || t('postulacion.step2.fileSelected')
                                    : t('postulacion.step2.uploadCv')}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.nextButton,
                            { backgroundColor: carta && cv ? '#4CAF50' : '#B0B0B0' },
                        ]}
                        onPress={handleSiguiente}
                        disabled={!carta || !cv}
                    >
                        <Text style={styles.nextButtonText}>{t('postulacion.step2.nextButton')}</Text>
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
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { fontSize: 16, marginBottom: 12 },
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
    stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    inputGroup: { gap: 8 },
    label: { fontSize: 16, fontWeight: '500' },
    fileInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    fileInputText: { fontSize: 16 },
    nextButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});