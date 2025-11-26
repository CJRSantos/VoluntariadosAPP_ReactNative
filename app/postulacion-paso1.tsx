// app/postulacion-paso1.tsx
import { useAuth } from '@/hooks/useAuth';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from '../app/providers/ThemeProvider';

const { width } = Dimensions.get('window');

export default function PostulacionPaso1Screen() {
    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    const handleSubirArchivo = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            setSelectedFile(file);
            Alert.alert(t('postulacion.step1.fileSelected'), file.name || t('postulacion.step1.noName'));
        } catch (error) {
            console.error('Error al seleccionar archivo:', error);
            Alert.alert(t('login.errorTitle'), t('postulacion.step1.errorSelection'));
        }
    };

    const handleSiguiente = () => {
        if (!selectedFile) {
            Alert.alert(t('postulacion.step1.warning'), t('postulacion.step1.warningMessage'));
            return;
        }
        // ✅ Aquí podrías guardar temporalmente en contexto o AsyncStorage
        router.push('/postulacion-paso2');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step1.title')}
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                        {t('postulacion.step1.subtitle')}
                    </Text>
                    <View style={styles.stepIndicator}>
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={[styles.dot]} />
                        <View style={[styles.dot]} />
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: '33%' }]} />
                </View>

                {/* Step Content */}
                <View style={styles.stepContent}>
                    <Text style={[styles.stepTitle, { color: isDark ? '#FFF' : '#000' }]}>
                        {t('postulacion.step1.stepTitle')}
                    </Text>

                    <TouchableOpacity
                        style={[styles.uploadButton, { backgroundColor: isDark ? '#2A2A2A' : '#E8F5E8' }]}
                        onPress={handleSubirArchivo}
                        disabled={uploading}
                    >
                        <Text style={[styles.uploadButtonText, { color: isDark ? '#FFF' : '#333' }]}>
                            {uploading ? t('postulacion.step1.uploading') : t('postulacion.step1.uploadButton')}
                        </Text>
                    </TouchableOpacity>

                    {selectedFile && (
                        <Text style={{ color: isDark ? '#AAA' : '#666', marginTop: 8 }}>
                            {t('postulacion.step1.fileLabel')} {selectedFile.name || t('postulacion.step1.noName')}
                        </Text>
                    )}

                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: selectedFile ? '#4CAF50' : '#B0B0B0' }]}
                        onPress={handleSiguiente}
                        disabled={!selectedFile}
                    >
                        <Text style={styles.nextButtonText}>{t('postulacion.step1.nextButton')}</Text>
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
    uploadButton: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadButtonText: { fontSize: 16, fontWeight: '500' },
    nextButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});