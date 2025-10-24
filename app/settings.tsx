import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../app/providers/ThemeProvider';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme(); // 👈 Usa el contexto global

    const handleBack = () => {
        router.back();
    };

    return (
        <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#000' : '#FFF' }]}>
            <View style={[styles.header, {
                backgroundColor: theme === 'dark' ? '#111' : '#F8F8F8',
                borderBottomColor: theme === 'dark' ? '#333' : '#EEE'
            }]}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={[styles.backIcon, { color: theme === 'dark' ? '#FFF' : '#333' }]}>←</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme === 'dark' ? '#FFF' : '#333' }]}>Settings</Text>
            </View>

            <View style={styles.content}>
                {/* Apariencia */}
                <TouchableOpacity
                    style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}
                    onPress={toggleTheme} // 👈 Cambia el tema global
                >
                    <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme === 'dark' ? '#FFF' : '#333' }]}>
                            {theme === 'dark' ? 'Modo oscuro' : 'Modo claro'}
                        </Text>
                        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#AAA' : '#666' }]}>
                            {theme === 'dark' ? 'Desactivar modo oscuro' : 'Activar modo oscuro'}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Otros ítems (puedes dejarlos igual) */}
                <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔔</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme === 'dark' ? '#FFF' : '#333' }]}>Notificaciones</Text>
                        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#AAA' : '#666' }]}>Personaliza tus alertas</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>🔒</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme === 'dark' ? '#FFF' : '#333' }]}>Privacidad</Text>
                        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#AAA' : '#666' }]}>Ajusta preferencias</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.settingItem, { backgroundColor: theme === 'dark' ? '#222' : '#F5F5F5' }]}>
                    <View style={[styles.iconContainer, { backgroundColor: theme === 'dark' ? '#333' : '#E0E0E0' }]}>
                        <Text style={styles.icon}>💾</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { color: theme === 'dark' ? '#FFF' : '#333' }]}>Almacenamiento</Text>
                        <Text style={[styles.subtitle, { color: theme === 'dark' ? '#AAA' : '#666' }]}>Gestiona datos</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    backIcon: { fontSize: 24 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
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
    icon: { fontSize: 20 },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold' },
    subtitle: { fontSize: 14, marginTop: 2 },
});