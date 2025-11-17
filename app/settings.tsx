// app/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../app/providers/ThemeProvider';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [storageModalVisible, setStorageModalVisible] = useState(false); // Estado para controlar el modal de almacenamiento

    const handleBack = () => {
        router.back();
    };

    // Función para obtener el tamaño de almacenamiento (simplificada)
    const getStorageSize = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const values = await AsyncStorage.multiGet(keys);
            // Calcula el tamaño aproximado en bytes
            const size = values.reduce((total, [key, value]) => total + (value ? value.length : 0), 0);
            return `${(size / 1024).toFixed(2)} KB`; // Convierte a KB
        } catch (e) {
            console.error('Error obteniendo tamaño de almacenamiento', e);
            return 'Error';
        }
    };

    // Función para limpiar la caché de imágenes
    const clearImageCache = async () => {
        try {
            // Puedes añadir más claves si necesitas limpiar otras imágenes
            await AsyncStorage.removeItem('userBannerURL');
            await AsyncStorage.removeItem('userPhotoURL');
            Alert.alert('Éxito', 'Caché de imágenes limpiada.');
        } catch (e) {
            Alert.alert('Error', 'No se pudo limpiar la caché.');
        }
    };

    // Función para eliminar todos los datos locales
    const deleteAllData = async () => {
        Alert.alert(
            '¿Estás seguro?',
            'Esta acción eliminará TODOS tus datos guardados en este dispositivo. No se puede deshacer.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear(); // 👈 Borra TODO
                            Alert.alert('Éxito', 'Todos los datos han sido eliminados. La app se reiniciará.');
                            // Opcional: Forzar un reinicio de la app o redirigir a la pantalla de inicio
                            // router.replace('/'); // Ejemplo: ir a la pantalla inicial
                        } catch (e) {
                            Alert.alert('Error', 'No se pudieron eliminar los datos.');
                        }
                    },
                },
            ]
        );
    };

    // Función para exportar datos (Ejemplo básico)
    const exportData = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const values = await AsyncStorage.multiGet(keys);
            const data = Object.fromEntries(values);

            // Convertir a JSON y mostrarlo en un alert
            const json = JSON.stringify(data, null, 2);
            Alert.alert('Datos Exportados', `Tu información se ha exportado.\n\n${json}`);

        } catch (e) {
            Alert.alert('Error', 'No se pudieron exportar los datos.');
        }
    };

    // Componente para las opciones de Almacenamiento
    const StorageOptionsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={storageModalVisible}
            onRequestClose={() => setStorageModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Opciones de Almacenamiento</Text>

                    {/* 1. Ver Tamaño */}
                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={async () => {
                            const size = await getStorageSize();
                            Alert.alert('Espacio Utilizado', `La aplicación está usando ${size}.`);
                        }}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Ver tamaño de almacenamiento</Text>
                    </TouchableOpacity>

                    {/* 2. Limpiar Caché */}
                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={clearImageCache}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Limpiar caché de imágenes</Text>
                    </TouchableOpacity>

                    {/* 3. Eliminar Todos los Datos */}
                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={deleteAllData}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Eliminar todos los datos</Text>
                    </TouchableOpacity>

                    {/* 4. Exportar Datos (Opcional) */}
                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={exportData}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Exportar mis datos</Text>
                    </TouchableOpacity>

                    {/* Botón de Cerrar */}
                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={() => setStorageModalVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: isDark ? '#FFF' : '#333' }]}>Cerrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    {
                        backgroundColor: isDark ? '#111' : '#F8F8F8',
                        borderBottomColor: isDark ? '#333' : '#EEE',
                    },
                ]}
            >
                <TouchableOpacity onPress={handleBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>Configuración</Text>
            </View>

            {/* Contenido */}
            <View style={styles.content}>
                {/* Apariencia */}
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={() => {
                        // Aquí deberías llamar a toggleTheme si lo tienes en tu contexto.
                        // Como no lo importaste, puedes agregarlo o simplemente hacer un placeholder.
                        Alert.alert('Apariencia', 'Función de cambio de tema no implementada en este ejemplo.');
                    }}
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
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            Personaliza tus alertas
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Privacidad */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔒</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>Privacidad</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            Ajusta preferencias
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Almacenamiento - Ahora abre el modal */}
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={() => setStorageModalVisible(true)} // 👈 Cambiado para abrir el modal
                >
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>💾</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>Almacenamiento</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            Gestiona datos y espacio
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>

            {/* Renderizar el Modal de Almacenamiento */}
            <StorageOptionsModal />
        </SafeAreaView>
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
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
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
    // Estilos para el Modal de Almacenamiento
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalItem: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    modalItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});