import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme'; // 👈 Importa el hook existente

export default function SettingsScreen() {
    const router = useRouter();
    const { isDark, toggleColorScheme } = useColorScheme(); // 👈 Usa el hook

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            {/* Header */}
            <View style={[styles.header, {
                backgroundColor: isDark ? '#111' : '#F8F8F8',
                borderBottomColor: isDark ? '#333' : '#EEE'
            }]}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={[styles.backIcon, { color: isDark ? '#FFF' : '#333' }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>Settings</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Apariencia - Cambia el tema */}
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={toggleColorScheme} // 👈 Cambia el tema
                >
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                            {isDark ? 'Modo oscuro' : 'Modo claro'}
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {isDark ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Notificaciones */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔔</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>Notificaciones</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>Personaliza tus alertas</Text>
                    </View>
                </TouchableOpacity>

                {/* Privacidad */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔒</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>Privacidad y Seguridad</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>Ajusta tus preferencias</Text>
                    </View>
                </TouchableOpacity>

                {/* Almacenamiento */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>💾</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>Almacenamiento y Datos</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>Gestiona el uso de datos</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        fontSize: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 20,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
});