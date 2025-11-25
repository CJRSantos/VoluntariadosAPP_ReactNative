// app/postulacion-paso2.tsx
import { useAuth } from '@/hooks/useAuth';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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

export default function PostulacionPaso2Screen() {
    const router = useRouter();
    const { user } = useAuth();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [carta, setCarta] = useState<any>(null);
    const [cv, setCv] = useState<any>(null);

    const pickFile = async (type: 'carta' | 'cv') => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            if (type === 'carta') {
                setCarta(file);
                Alert.alert('Carta seleccionada', file.name || 'Sin nombre');
            } else {
                setCv(file);
                Alert.alert('CV seleccionado', file.name || 'Sin nombre');
            }
        } catch (error) {
            console.error(`Error al seleccionar ${type}:`, error);
            Alert.alert('Error', `No se pudo seleccionar el ${type === 'carta' ? 'archivo' : 'CV'}.`);
        }
    };

    const handleSiguiente = () => {
        if (!carta || !cv) {
            Alert.alert('Advertencia', 'Por favor, sube ambos documentos antes de continuar.');
            return;
        }
        router.push('/postulacion-paso3');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                        Aplica a la oportunidad
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                        Completa los siguientes pasos para aplicar a la oportunidad
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
                        Paso 2 de 3
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#000' }]}>
                            Carta de presentación
                        </Text>
                        <TouchableOpacity
                            style={[styles.fileInput, { borderColor: isDark ? '#444' : '#CCC' }]}
                            onPress={() => pickFile('carta')}
                        >
                            <Text style={[styles.fileInputText, { color: carta ? (isDark ? '#FFF' : '#000') : (isDark ? '#AAA' : '#666') }]}>
                                {carta ? (carta.name || 'Archivo seleccionado') : 'Sube tu carta de motivación'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#000' }]}>
                            CV
                        </Text>
                        <TouchableOpacity
                            style={[styles.fileInput, { borderColor: isDark ? '#444' : '#CCC' }]}
                            onPress={() => pickFile('cv')}
                        >
                            <Text style={[styles.fileInputText, { color: cv ? (isDark ? '#FFF' : '#000') : (isDark ? '#AAA' : '#666') }]}>
                                {cv ? (cv.name || 'Archivo seleccionado') : 'Sube tu CV'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: (carta && cv) ? '#4CAF50' : '#B0B0B0' }]}
                        onPress={handleSiguiente}
                        disabled={!carta || !cv}
                    >
                        <Text style={styles.nextButtonText}>Siguiente paso</Text>
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