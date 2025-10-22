import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const handleSettings = () => {
        Alert.alert('Configuración', 'Funcionalidad no implementada aún');
    };

    const handleAddInfo = () => {
        Alert.alert('Agregar información', 'Próximamente podrás agregar tu información personal');
    };

    const pickImage = async (type: 'banner' | 'profile') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'banner' ? [16, 9] : [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            if (type === 'banner') {
                setBannerImage(result.assets[0].uri);
            } else {
                setProfileImage(result.assets[0].uri);
            }
        }
    };

    const takePhoto = async (type: 'banner' | 'profile') => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'banner' ? [16, 9] : [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            if (type === 'banner') {
                setBannerImage(result.assets[0].uri);
            } else {
                setProfileImage(result.assets[0].uri);
            }
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleSettings}>
                    <Text style={styles.settingsIcon}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Banner con foto */}
            <View style={styles.bannerContainer}>
                <TouchableOpacity onPress={() => pickImage('banner')}>
                    {bannerImage ? (
                        <Image
                            source={{ uri: bannerImage }}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                            <Text style={styles.placeholderText}>📷 Portada</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity onPress={() => pickImage('profile')}>
                        {profileImage ? (
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profilePhoto}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={[styles.profilePhoto, styles.profilePlaceholder]}>
                                <Text style={styles.placeholderText}>👤</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cameraIcon} onPress={() => takePhoto('profile')}>
                        <Text style={styles.cameraText}>📷</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Información del usuario */}
            <View style={styles.userInfo}>
                <Text style={styles.userName}>Ethan Carter Murayari</Text>
                <Text style={styles.userEmail}>etcar@gmail.com</Text>
            </View>

            {/* Pestañas */}
            <View style={styles.tabs}>
                <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                    <Text style={[styles.tabText, styles.activeTabText]}>Info</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Formación</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Experiencia</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Text style={styles.tabText}>Adicional</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Información Personal</Text>
                    <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                </View>
            </ScrollView>

            {/* Botón flotante + */}
            <TouchableOpacity style={styles.fab} onPress={handleAddInfo}>
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    backIcon: {
        fontSize: 20,
        color: '#333',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    settingsIcon: {
        fontSize: 20,
        color: '#333',
    },
    bannerContainer: {
        height: 200,
        position: 'relative',
        backgroundColor: '#d4f5e0', // Verde claro como en la imagen
    },
    bannerImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bannerPlaceholder: {
        backgroundColor: '#c8e6c9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    profilePhotoContainer: {
        position: 'absolute',
        top: 120,
        left: '50%',
        transform: [{ translateX: -50 }],
        alignItems: 'center',
    },
    profilePhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
    },
    profilePlaceholder: {
        backgroundColor: '#e8f5e8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#10b981',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraText: {
        color: '#fff',
        fontSize: 16,
    },
    userInfo: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#10b981', // Verde vibrante como en la imagen
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#10b981',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#d4f5e0', // Verde claro como en la imagen
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    fabText: {
        fontSize: 24,
        color: '#10b981', // Verde oscuro para el símbolo
        fontWeight: 'bold',
    },
});