// app/postulacion-confirmada.tsx
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

export default function PostulacionConfirmadaScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleVolverInicio = () => {
        router.push('/account'); // Cambia esto si tu inicio es otra ruta
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Icono de éxito */}
                <View style={styles.successIconContainer}>
                    <View style={[styles.successIcon, { borderColor: '#4CAF50' }]}>
                        <Text style={[styles.checkmark, { color: '#4CAF50' }]}>✓</Text>
                    </View>
                </View>

                {/* Título */}
                <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>
                    ¡Postulación confirmada!
                </Text>

                {/* Mensaje */}
                <Text style={[styles.message, { color: isDark ? '#FFF' : '#000' }]}>
                    Tu postulación ha sido recibida con éxito.
                    Te mantendremos informado sobre los próximos pasos.
                </Text>

                {/* Botón Volver al inicio */}
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: '#4CAF50' }]}
                    onPress={handleVolverInicio}
                >
                    <Text style={styles.backButtonText}>Volver al inicio</Text>
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