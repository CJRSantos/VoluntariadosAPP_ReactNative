// app/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import { changeLanguage } from '../src/i18n/i18n';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const { t, i18n } = useTranslation();

    const [storageModalVisible, setStorageModalVisible] = useState(false);
    const [languageModalVisible, setLanguageModalVisible] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const getStorageSize = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const values = await AsyncStorage.multiGet(keys);
            const size = values.reduce((total, [key, value]) => total + (value ? value.length : 0), 0);
            return `${(size / 1024).toFixed(2)} KB`;
        } catch (e) {
            console.error('Error obteniendo tamaño de almacenamiento', e);
            return 'Error';
        }
    };

    const clearImageCache = async () => {
        try {
            await AsyncStorage.removeItem('userBannerURL');
            await AsyncStorage.removeItem('userPhotoURL');
            Alert.alert('Éxito', 'Caché de imágenes limpiada.');
        } catch (e) {
            Alert.alert('Error', 'No se pudo limpiar la caché.');
        }
    };

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
                            await AsyncStorage.clear();
                            Alert.alert('Éxito', 'Todos los datos han sido eliminados. La app se reiniciará.');
                        } catch (e) {
                            Alert.alert('Error', 'No se pudieron eliminar los datos.');
                        }
                    },
                },
            ]
        );
    };

    const exportData = async () => {
        try {
            const keys = await AsyncStorage.getAllKeys();
            const values = await AsyncStorage.multiGet(keys);
            const data = Object.fromEntries(values);
            const json = JSON.stringify(data, null, 2);
            Alert.alert('Datos Exportados', `Tu información se ha exportado.\n\n${json}`);
        } catch (e) {
            Alert.alert('Error', 'No se pudieron exportar los datos.');
        }
    };

    const handleLanguageChange = async (lang: string) => {
        await changeLanguage(lang);
        setLanguageModalVisible(false);
    };

    const StorageOptionsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={storageModalVisible}
            onRequestClose={() => setStorageModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.modalTitle')}</Text>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={async () => {
                            const size = await getStorageSize();
                            Alert.alert('Espacio Utilizado', `La aplicación está usando ${size}.`);
                        }}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.viewSize')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={clearImageCache}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.clearCache')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={deleteAllData}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.deleteAll')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={exportData}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.export')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={() => setStorageModalVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const LanguageOptionsModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={languageModalVisible}
            onRequestClose={() => setLanguageModalVisible(false)}
        >
            <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.language.modalTitle')}</Text>
                    <ScrollView style={{ maxHeight: 400 }}>
                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('es')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Español {i18n.language === 'es' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('en')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>English {i18n.language === 'en' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('en-US')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>English (US) {i18n.language === 'en-US' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('en-GB')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>English (UK) {i18n.language === 'en-GB' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('pt')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Português {i18n.language === 'pt' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('fr')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Français {i18n.language === 'fr' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('it')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>Italiano {i18n.language === 'it' && '✓'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                            onPress={() => handleLanguageChange('ja')}
                        >
                            <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>日本語 {i18n.language === 'ja' && '✓'}</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={() => setLanguageModalVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
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
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.title')}</Text>
            </View>

            <View style={styles.content}>
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={toggleTheme}
                >
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>{isDark ? '🌙' : '☀️'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                            {isDark ? t('settings.appearance.disableDark') : t('settings.appearance.enableDark')}
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('settings.appearance.title')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={() => setLanguageModalVisible(true)}
                >
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🌐</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.language.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('settings.language.subtitle')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔔</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.notifications.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('settings.notifications.subtitle')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔒</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.privacy.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('settings.privacy.subtitle')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
                    onPress={() => setStorageModalVisible(true)}
                >
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>💾</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('settings.storage.subtitle')}
                        </Text>
                    </View>
                </TouchableOpacity>

            </View>

            <StorageOptionsModal />
            <LanguageOptionsModal />
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