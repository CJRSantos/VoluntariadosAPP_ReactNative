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
            Alert.alert(t('common.success', 'Éxito'), t('settings.storage.cacheCleared', 'Caché de imágenes limpiada.'));
        } catch (e) {
            Alert.alert(t('common.error', 'Error'), t('settings.storage.cacheError', 'No se pudo limpiar la caché.'));
        }
    };

    const deleteAllData = async () => {
        Alert.alert(
            t('common.warning', '¿Estás seguro?'),
            t('settings.storage.deleteWarning', 'Esta acción eliminará TODOS tus datos guardados en este dispositivo. No se puede deshacer.'),
            [
                { text: t('common.cancel', 'Cancelar'), style: 'cancel' },
                {
                    text: t('common.delete', 'Eliminar'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            Alert.alert(t('common.success', 'Éxito'), t('settings.storage.deleteSuccess', 'Todos los datos han sido eliminados. La app se reiniciará.'));
                        } catch (e) {
                            Alert.alert(t('common.error', 'Error'), t('settings.storage.deleteError', 'No se pudieron eliminar los datos.'));
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
            Alert.alert(t('settings.storage.exportTitle', 'Datos Exportados'), `${t('settings.storage.exportMessage', 'Tu información se ha exportado.')}\n\n${json}`);
        } catch (e) {
            Alert.alert(t('common.error', 'Error'), t('settings.storage.exportError', 'No se pudieron exportar los datos.'));
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
            <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.modalTitle')}</Text>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={async () => {
                            const size = await getStorageSize();
                            Alert.alert(t('settings.storage.sizeTitle', 'Tamaño de Almacenamiento'), size);
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
                        <Text style={[styles.modalItemText, { color: '#FF4444' }]}>{t('settings.storage.deleteAll')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalItem, { backgroundColor: isDark ? '#333' : '#EAEAEA' }]}
                        onPress={exportData}
                    >
                        <Text style={[styles.modalItemText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.export')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: isDark ? '#444' : '#DDD' }]}
                        onPress={() => setStorageModalVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.close')}</Text>
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
            <View style={[styles.modalContainer, { backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.modalContent, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                    <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.language.modalTitle')}</Text>

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
                        style={[styles.closeButton, { backgroundColor: isDark ? '#444' : '#DDD' }]}
                        onPress={() => setLanguageModalVisible(false)}
                    >
                        <Text style={[styles.closeButtonText, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.close')}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#FFF' }]}>
            <View style={[styles.header, { backgroundColor: isDark ? '#111' : '#F8F8F8', borderBottomColor: isDark ? '#333' : '#EEE' }]}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.title')}</Text>
            </View>

            <ScrollView style={styles.content}>
                {/* Appearance */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]} onPress={toggleTheme}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={isDark ? '#FFF' : '#333'} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.appearance.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('settings.appearance.subtitle')}</Text>
                    </View>
                    <Ionicons name={isDark ? 'toggle' : 'toggle-outline'} size={24} color={isDark ? '#4CAF50' : '#888'} />
                </TouchableOpacity>

                {/* Language */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]} onPress={() => setLanguageModalVisible(true)}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Ionicons name="language" size={20} color={isDark ? '#FFF' : '#333'} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.language.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('settings.language.subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#AAA' : '#888'} />
                </TouchableOpacity>

                {/* Notifications */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Ionicons name="notifications" size={20} color={isDark ? '#FFF' : '#333'} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.notifications.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('settings.notifications.subtitle')}</Text>
                    </View>
                    <Ionicons name="toggle" size={24} color="#4CAF50" />
                </TouchableOpacity>

                {/* Privacy */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Ionicons name="lock-closed" size={20} color={isDark ? '#FFF' : '#333'} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.privacy.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('settings.privacy.subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#AAA' : '#888'} />
                </TouchableOpacity>

                {/* Storage */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]} onPress={() => setStorageModalVisible(true)}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]}>
                        <Ionicons name="server" size={20} color={isDark ? '#FFF' : '#333'} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('settings.storage.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('settings.storage.subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? '#AAA' : '#888'} />
                </TouchableOpacity>
            </ScrollView>

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