// app/postulacion-paso1.tsx
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

export default function PostulacionPaso1Screen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleSubirArchivo = () => {
        Alert.alert('Subir archivo', 'Funcionalidad de subida de archivo no implementada aún.');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                        Inicia tu Proceso de Postulación
                    </Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                        Programa de Voluntariado Ambiental 2025
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
                        Paso 1: Subida de Documentos | Otros requisitos
                    </Text>

                    <TouchableOpacity
                        style={[styles.uploadButton, { backgroundColor: isDark ? '#2A2A2A' : '#E8F5E8' }]}
                        onPress={handleSubirArchivo}
                    >
                        <Text style={[styles.uploadButtonText, { color: isDark ? '#FFF' : '#333' }]}>
                            Subir archivo
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.nextButton, { backgroundColor: '#4CAF50' }]}
                        onPress={() => router.push('/postulacion-paso2')}
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