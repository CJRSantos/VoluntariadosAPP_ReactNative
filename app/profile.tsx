import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
    const router = useRouter();
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);

    const [documentType, setDocumentType] = useState('');
    const [gender, setGender] = useState('');

    const handleSettings = () => {
        Alert.alert('Configuración', 'Funcionalidad no implementada aún');
    };

    const handleAddInfo = () => {
        setShowPersonalInfoForm(true);
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
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleSettings}>
                    <Ionicons name="settings" size={24} color="#333" />
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
                        <Ionicons name="camera" size={18} color="#fff" />
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
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Información Personal</Text>
                        <TouchableOpacity style={styles.addIconContainer} onPress={handleAddInfo}>
                            <Ionicons name="add" size={24} color="#10b981" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                </View>
            </ScrollView>

            {/* Modal de Información Personal */}
            {showPersonalInfoForm && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Información Personal</Text>

                        <Text style={styles.label}>Nombre y Apellido</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Introduzca su nombre completo"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Celular N°</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Introducir número de celular"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Seleccione su tipo de documento:</Text>
                        <View style={styles.row}>
                            <View style={styles.pickerWrapper}>
                                <Picker
                                    selectedValue={documentType}
                                    onValueChange={(itemValue) => setDocumentType(itemValue)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Seleccionar" value="" />
                                    <Picker.Item label="DNI" value="dni" />
                                    <Picker.Item label="Pasaporte" value="pasaporte" />
                                </Picker>
                            </View>
                            <TextInput
                                style={[styles.input, { flex: 1, marginLeft: 10 }]}
                                placeholder="N° de Documento"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <Text style={styles.label}>Género</Text>
                        <View style={styles.radioGroup}>
                            {['Masculino', 'Femenino', 'Otros'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.radioOption}
                                    onPress={() => setGender(option)}
                                >
                                    <View style={[styles.radioButton, gender === option && styles.radioButtonSelected]} />
                                    <Text style={styles.radioLabel}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowPersonalInfoForm(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Información guardada correctamente');
                                    setShowPersonalInfoForm(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    bannerContainer: {
        height: 200,
        position: 'relative',
        backgroundColor: '#d4f5e0',
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
        borderBottomColor: '#10b981',
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
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    addIconContainer: {
        backgroundColor: '#d4f5e0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },

    // Modal styles
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#e8d7d7',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#f9f9f9',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    pickerWrapper: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    picker: {
        height: 40,
        color: '#333',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#aaa',
        marginRight: 8,
    },
    radioButtonSelected: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    radioLabel: {
        fontSize: 14,
        color: '#333',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#aaa',
        marginRight: 10,
    },
    addButton: {
        backgroundColor: '#10b981',
        marginLeft: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});