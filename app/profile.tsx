// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
;

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
    const [documentType, setDocumentType] = useState('');
    const [gender, setGender] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('');
    const [currentlyInRole, setCurrentlyInRole] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'formacion' | 'experiencia' | 'adicional'>('info');
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showComplementaryModal, setShowComplementaryModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showPublicationModal, setShowPublicationModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [academicStatus, setAcademicStatus] = useState<string>('Actualmente');

    // Modales para imágenes
    const [isBannerModalVisible, setIsBannerModalVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

    // Menús de cámara
    const [bannerMenuVisible, setBannerMenuVisible] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    const handleSettings = () => {
        router.push('/settings');
    };

    const handleAddInfo = () => {
        setShowPersonalInfoForm(true);
    };

    // Cargar fotos guardadas al iniciar
    useEffect(() => {
        const loadSavedData = async () => {
            const savedBanner = await AsyncStorage.getItem('userBannerURL');
            if (savedBanner) {
                setBannerImage(savedBanner);
            }
            const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
            if (savedPhoto) {
                setProfileImage(savedPhoto);
            }
        };
        loadSavedData();
    }, []);

    const pickImage = async (type: 'banner' | 'profile') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: type === 'banner' ? [16, 9] : [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            if (type === 'banner') {
                setBannerImage(uri);
                await AsyncStorage.setItem('userBannerURL', uri);
            } else {
                setProfileImage(uri);
                await AsyncStorage.setItem('userPhotoURL', uri);
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
            const uri = result.assets[0].uri;
            if (type === 'banner') {
                setBannerImage(uri);
                await AsyncStorage.setItem('userBannerURL', uri);
            } else {
                setProfileImage(uri);
                await AsyncStorage.setItem('userPhotoURL', uri);
            }
        }
    };

    // === Funciones para la portada ===
    const showBannerMenu = () => setBannerMenuVisible(true);
    const closeBannerMenu = () => setBannerMenuVisible(false);
    const viewBannerImage = () => {
        if (bannerImage) {
            setIsBannerModalVisible(true);
            closeBannerMenu();
        }
    };
    const changeBannerFromGallery = () => {
        pickImage('banner');
        closeBannerMenu();
    };
    const takeNewBannerPhoto = () => {
        takePhoto('banner');
        closeBannerMenu();
    };

    // === Funciones para el perfil ===
    const showProfileMenu = () => setProfileMenuVisible(true);
    const closeProfileMenu = () => setProfileMenuVisible(false);
    const viewProfileImage = () => {
        if (profileImage) {
            setIsProfileModalVisible(true);
            closeProfileMenu();
        }
    };
    const changeProfileFromGallery = () => {
        pickImage('profile');
        closeProfileMenu();
    };
    const takeNewProfilePhoto = () => {
        takePhoto('profile');
        closeProfileMenu();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Header */}
            <View
                style={[
                    styles.header,
                    { backgroundColor: isDark ? '#111' : '#fff', borderBottomColor: isDark ? '#333' : '#ddd' },
                ]}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>Profile</Text>
                <TouchableOpacity onPress={handleSettings}>
                    <Ionicons name="settings" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
            </View>

            {/* Banner con foto */}
            <View style={styles.bannerContainer}>
                <TouchableOpacity onPress={showBannerMenu}>
                    {bannerImage ? (
                        <Image source={{ uri: bannerImage }} style={styles.bannerImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                            <Text style={[styles.placeholderText, { color: isDark ? '#AAA' : '#666' }]}>📷 Portada</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity onPress={showProfileMenu}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profilePhoto} resizeMode="cover" />
                        ) : (
                            <View style={[styles.profilePhoto, styles.profilePlaceholder]}>
                                <Text style={[styles.placeholderText, { color: isDark ? '#AAA' : '#666' }]}>👤</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.cameraIcon}
                        onPress={showProfileMenu}
                    >
                        <Ionicons name="camera" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Información del usuario */}
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: isDark ? '#FFF' : '#333' }]}>Ethan Carter Murayari</Text>
                <Text style={[styles.userEmail, { color: isDark ? '#AAA' : '#666' }]}>etcar@gmail.com</Text>
            </View>

            {/* Pestañas */}
            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'info' && styles.activeTab]}
                    onPress={() => setActiveTab('info')}
                >
                    <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>Info</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'formacion' && styles.activeTab]}
                    onPress={() => setActiveTab('formacion')}
                >
                    <Text style={[styles.tabText, activeTab === 'formacion' && styles.activeTabText]}>Formación</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'experiencia' && styles.activeTab]}
                    onPress={() => setActiveTab('experiencia')}
                >
                    <Text style={[styles.tabText, activeTab === 'experiencia' && styles.activeTabText]}>Experiencia</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'adicional' && styles.activeTab]}
                    onPress={() => setActiveTab('adicional')}
                >
                    <Text style={[styles.tabText, activeTab === 'adicional' && styles.activeTabText]}>Adicional</Text>
                </TouchableOpacity>
            </View>

            {/* Contenido */}
            <ScrollView style={styles.content}>
                {activeTab === 'info' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                Información Personal
                            </Text>
                            <TouchableOpacity style={styles.addIconContainer} onPress={handleAddInfo}>
                                <Ionicons name="add" size={24} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                            No se visualiza ninguna información
                        </Text>
                    </View>
                )}
                {activeTab === 'formacion' && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Información académica
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowAcademicModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Formación técnica / especializada
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowTechnicalModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Formación Complementaria
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowComplementaryModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                    </>
                )}
                {activeTab === 'experiencia' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                Experiencia Laboral
                            </Text>
                            <TouchableOpacity
                                style={styles.addIconContainer}
                                onPress={() => setShowExperienceModal(true)}
                            >
                                <Ionicons name="add" size={24} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                            No se visualiza ninguna información
                        </Text>
                    </View>
                )}
                {activeTab === 'adicional' && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Voluntariados
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowVolunteerModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Publicaciones
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowPublicationModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                                    Idiomas
                                </Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowLanguageModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>
                                No se visualiza ninguna información
                            </Text>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* === Modal: Ver foto de portada === */}
            {isBannerModalVisible && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalClose} onPress={() => setIsBannerModalVisible(false)}>
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: bannerImage! }} style={styles.modalImage} resizeMode="contain" />
                </View>
            )}

            {/* === Modal: Ver foto de perfil === */}
            {isProfileModalVisible && (
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalClose} onPress={() => setIsProfileModalVisible(false)}>
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: profileImage! }} style={styles.modalImage} resizeMode="contain" />
                </View>
            )}

            {/* === Menú de portada === */}
            {bannerMenuVisible && (
                <View style={styles.bannerMenuOverlay}>
                    <View style={[styles.bannerMenuContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                        <Text style={[styles.bannerMenuTitle, { color: isDark ? '#FFF' : '#333' }]}>
                            Opciones de portada
                        </Text>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={viewBannerImage}>
                            <Ionicons name="eye" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Ver foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={changeBannerFromGallery}>
                            <Ionicons name="images" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Cambiar desde galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={takeNewBannerPhoto}>
                            <Ionicons name="camera" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Tomar nueva foto</Text>
                        </TouchableOpacity>
                        <View style={styles.bannerMenuDivider} />
                        <TouchableOpacity style={styles.bannerMenuItemCancel} onPress={closeBannerMenu}>
                            <Text style={[styles.bannerMenuCancelText, { color: isDark ? '#ff6b6b' : '#e74c3c' }]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* === Menú de perfil === */}
            {profileMenuVisible && (
                <View style={styles.bannerMenuOverlay}>
                    <View style={[styles.bannerMenuContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                        <Text style={[styles.bannerMenuTitle, { color: isDark ? '#FFF' : '#333' }]}>
                            Opciones de foto de perfil
                        </Text>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={viewProfileImage}>
                            <Ionicons name="eye" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Ver foto</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={changeProfileFromGallery}>
                            <Ionicons name="images" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Cambiar desde galería</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bannerMenuItem} onPress={takeNewProfilePhoto}>
                            <Ionicons name="camera" size={20} color="#10b981" />
                            <Text style={[styles.bannerMenuText, { color: isDark ? '#FFF' : '#333' }]}>Tomar nueva foto</Text>
                        </TouchableOpacity>
                        <View style={styles.bannerMenuDivider} />
                        <TouchableOpacity style={styles.bannerMenuItemCancel} onPress={closeProfileMenu}>
                            <Text style={[styles.bannerMenuCancelText, { color: isDark ? '#ff6b6b' : '#e74c3c' }]}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* === Modales de formularios (sin cambios) === */}
            {showAcademicModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir formación Académica</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Grado</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre de su grado"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre de su carrera"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese su país"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de inicio</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de fin</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Estado</Text>
                        <View style={styles.radioGroup}>
                            {['Actualmente', 'Graduado', 'Titulado'].map((option) => (
                                <TouchableOpacity key={option} style={styles.radioOption} onPress={() => setAcademicStatus(option)}>
                                    <View style={[styles.radioButton, academicStatus === option && styles.radioButtonSelected]} />
                                    <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#333' }]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAcademicModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Formación académica guardada correctamente');
                                    setShowAcademicModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* === Aquí van los demás modales (sin cambios) === */}
            {showTechnicalModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>
                            Añadir Formación Técnica / Especializada
                        </Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre del curso o certificación</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej: Curso de React Native"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución o plataforma</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej: Udemy, Coursera"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Duración (meses)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej: 6"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de finalización</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowTechnicalModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Formación técnica guardada correctamente');
                                    setShowTechnicalModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showComplementaryModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir Formación Complementaria</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre de la actividad</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej: Voluntariado, idiomas, talleres"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción breve</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Describe brevemente tu experiencia"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de realización</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="MM/YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowComplementaryModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Formación complementaria guardada correctamente');
                                    setShowComplementaryModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showPersonalInfoForm && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Información Personal</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre y Apellido</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Introduzca su nombre completo"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Celular N°</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Introducir número de celular"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Seleccione su tipo de documento:</Text>
                        <View style={styles.row}>
                            <View style={[styles.pickerWrapper, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                                <Picker
                                    selectedValue={documentType}
                                    onValueChange={(itemValue) => setDocumentType(itemValue)}
                                    style={[styles.picker, { color: isDark ? '#FFF' : '#333' }]}
                                >
                                    <Picker.Item label="Seleccionar" value="" />
                                    <Picker.Item label="DNI" value="dni" />
                                    <Picker.Item label="Pasaporte" value="pasaporte" />
                                </Picker>
                            </View>
                            <TextInput
                                style={[
                                    styles.input,
                                    { flex: 1, marginLeft: 10, backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' },
                                ]}
                                placeholder="N° de Documento"
                                placeholderTextColor={isDark ? '#AAA' : '#999'}
                            />
                        </View>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Género</Text>
                        <View style={styles.radioGroup}>
                            {['Masculino', 'Femenino', 'Otros'].map((option) => (
                                <TouchableOpacity key={option} style={styles.radioOption} onPress={() => setGender(option)}>
                                    <View style={[styles.radioButton, gender === option && styles.radioButtonSelected]} />
                                    <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#333' }]}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPersonalInfoForm(false)}>
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

            {showExperienceModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir experiencia Laboral</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Puesto</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre del puesto"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre de la Institución"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Área</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese su área"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese su país"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de inicio</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de fin</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowExperienceModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Experiencia laboral guardada correctamente');
                                    setShowExperienceModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showVolunteerModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir voluntariado</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Organización</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de la Organización"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Cargo</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre del cargo"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Causa benéfica / Área</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="National University of the Peruvian Amazon"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setCurrentlyInRole(!currentlyInRole)}
                            >
                                <View style={[styles.checkbox, currentlyInRole && styles.checkboxChecked]} />
                                <Text style={[styles.checkboxLabel, { color: isDark ? '#FFF' : '#333' }]}>
                                    Actualmente estoy en este cargo
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de inicio</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de fin</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Escribe un resumen de tu experiencia en voluntariado"
                            multiline
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowVolunteerModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Voluntariado guardado correctamente');
                                    setShowVolunteerModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showPublicationModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir publicación</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Título</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de publicación"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Publicación / Editorial</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej: España editorial"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Autor</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de Publicación</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Url</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese un breve resumen"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Resumen / Abstract</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese un breve resumen"
                            multiline
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPublicationModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Publicación guardada correctamente');
                                    setShowPublicationModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {showLanguageModal && (
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#e8d7d7' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir idioma</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Idioma</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Idioma"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Competencia</Text>
                        <View style={[styles.pickerWrapper, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                            <Picker
                                selectedValue={languageProficiency}
                                onValueChange={(itemValue) => setLanguageProficiency(itemValue)}
                                style={[styles.picker, { color: isDark ? '#FFF' : '#333' }]}
                            >
                                <Picker.Item label="Seleccionar" value="" />
                                <Picker.Item label="Basic" value="basic" />
                                <Picker.Item label="Intermediate" value="intermediate" />
                                <Picker.Item label="Advanced" value="advanced" />
                                <Picker.Item label="Native" value="native" />
                            </Picker>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowLanguageModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Idioma guardado correctamente');
                                    setShowLanguageModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    bannerContainer: { height: 200, position: 'relative' },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    bannerPlaceholder: { backgroundColor: '#c8e6c9', justifyContent: 'center', alignItems: 'center' },
    placeholderText: { fontSize: 16 },
    profilePhotoContainer: {
        position: 'absolute',
        top: 120,
        left: '50%',
        transform: [{ translateX: -50 }],
        alignItems: 'center',
    },
    profilePhoto: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#fff' },
    profilePlaceholder: { backgroundColor: '#e8f5e8', justifyContent: 'center', alignItems: 'center' },
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
    userInfo: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
    userName: { fontSize: 18, fontWeight: 'bold' },
    userEmail: { fontSize: 14 },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    tab: { paddingHorizontal: 12, paddingVertical: 8 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#10b981' },
    tabText: { fontSize: 14 },
    activeTabText: { color: '#10b981', fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
    section: { marginBottom: 20 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    addIconContainer: {
        backgroundColor: '#d4f5e0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noDataText: { fontSize: 16, textAlign: 'center', marginTop: 20 },

    // Modal de imagen grande
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
    modalClose: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    modalImage: {
        width: '90%',
        height: '80%',
        resizeMode: 'contain',
        borderRadius: 12,
    },

    // Menú moderno (reutilizable)
    bannerMenuOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 20,
    },
    bannerMenuContent: {
        width: '100%',
        maxHeight: 300,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    bannerMenuTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    bannerMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    bannerMenuText: {
        fontSize: 16,
        marginLeft: 12,
    },
    bannerMenuDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 12,
    },
    bannerMenuItemCancel: {
        paddingVertical: 12,
        alignItems: 'center',
    },
    bannerMenuCancelText: {
        fontSize: 17,
        fontWeight: '600',
    },

    // Estilos de formularios (sin cambios)
    modalContent: {
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
        minHeight: 200,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, marginBottom: 5, marginTop: 10 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        paddingHorizontal: 12,
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
    },
    picker: {
        height: 40,
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
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: '#aaa',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    checkboxLabel: {
        fontSize: 14,
    },
});