// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageModal from 'react-native-image-modal'; // ✅ Para zoom
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_TABLET = SCREEN_WIDTH >= 768;
// === UTILIDADES DE VALIDACIÓN ===
const isValidDate = (dateStr: string): boolean => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};
const isValidYear = (yearStr: string): boolean => {
    const year = Number(yearStr);
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 5;
};
const isValidMonthYear = (str: string): boolean => /^\d{2}\/\d{4}$/.test(str);
const isNumeric = (str: string): boolean => /^\d+$/.test(str);
export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    // === Nuevos estados para menús y zoom ===
    const [showBannerMenu, setShowBannerMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showFullBanner, setShowFullBanner] = useState(false);
    const [showFullProfile, setShowFullProfile] = useState(false);
    // Estados de visibilidad de modales
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showComplementaryModal, setShowComplementaryModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showPublicationModal, setShowPublicationModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    // Estados de selección
    const [documentType, setDocumentType] = useState('');
    const [gender, setGender] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('');
    const [currentlyInRole, setCurrentlyInRole] = useState(false);
    const [academicStatus, setAcademicStatus] = useState('Actualmente');
    // Estados de formularios
    const [personalInfo, setPersonalInfo] = useState({ fullName: '', birthDate: '', phone: '', docNumber: '' });
    const [academicInfo, setAcademicInfo] = useState({ degree: '', institution: '', country: '', startYear: '', endYear: '' });
    const [technicalInfo, setTechnicalInfo] = useState({ courseName: '', institution: '', duration: '', endYear: '' });
    const [complementaryInfo, setComplementaryInfo] = useState({ name: '', description: '', date: '' });
    const [experienceInfo, setExperienceInfo] = useState({ position: '', institution: '', area: '', country: '', startDate: '', endDate: '' });
    const [volunteerInfo, setVolunteerInfo] = useState({ org: '', role: '', cause: '', startDate: '', endDate: '', description: '' });
    const [publicationInfo, setPublicationInfo] = useState({ title: '', publisher: '', author: '', date: '', url: '', abstract: '' });
    const [languageInfo, setLanguageInfo] = useState({ name: '' });
    // Errores
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<'info' | 'formacion' | 'experiencia' | 'adicional'>('info');
    // === FUNCIONES ===
    const handleSettings = () => router.push('/settings');
    const handleAddInfo = () => setShowPersonalInfoForm(true);
    useEffect(() => {
        const loadSavedData = async () => {
            const savedBanner = await AsyncStorage.getItem('userBannerURL');
            if (savedBanner) setBannerImage(savedBanner);
            const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
            if (savedPhoto) setProfileImage(savedPhoto);
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
        if (!result.canceled && result.assets?.[0]) {
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
        if (!result.canceled && result.assets?.[0]) {
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
    // === VALIDACIÓN ===
    const validate = (fields: Record<string, any>, rules: Record<string, (val: string) => boolean>, required: string[]) => {
        const newErrors: Record<string, string> = {};
        required.forEach((field) => {
            if (!fields[field]?.trim()) newErrors[field] = 'Este campo es obligatorio';
        });
        Object.keys(rules).forEach((field) => {
            if (fields[field] && !rules[field](fields[field])) newErrors[field] = 'Formato inválido';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // === MANEJADORES DE GUARDADO ===
    const savePersonalInfo = () => {
        const required = ['fullName', 'birthDate', 'phone', 'docNumber'];
        const rules = { birthDate: isValidDate, phone: isNumeric, docNumber: (v: string) => v.length >= 5 };
        if (!validate(personalInfo, rules, required)) return;
        Alert.alert('Éxito', 'Información personal guardada');
        setShowPersonalInfoForm(false);
        setErrors({});
    };
    const saveAcademic = () => {
        const required = ['degree', 'institution', 'country', 'startYear'];
        const rules = { startYear: (v: string) => isValidYear(v), endYear: (v: string) => !v || isValidYear(v) };
        if (!validate(academicInfo, rules, required)) return;
        Alert.alert('Éxito', 'Formación académica guardada');
        setShowAcademicModal(false);
        setErrors({});
    };
    const saveTechnical = () => {
        const required = ['courseName', 'institution', 'duration', 'endYear'];
        const rules = { duration: isNumeric, endYear: (v: string) => isValidYear(v) };
        if (!validate(technicalInfo, rules, required)) return;
        Alert.alert('Éxito', 'Formación técnica guardada');
        setShowTechnicalModal(false);
        setErrors({});
    };
    const saveComplementary = () => {
        const required = ['name', 'description', 'date'];
        const rules = { date: (v: string) => isValidMonthYear(v) };
        if (!validate(complementaryInfo, rules, required)) return;
        Alert.alert('Éxito', 'Formación complementaria guardada');
        setShowComplementaryModal(false);
        setErrors({});
    };
    const saveExperience = () => {
        const required = ['position', 'institution', 'area', 'country', 'startDate', 'endDate'];
        const rules = { startDate: isValidDate, endDate: isValidDate };
        if (!validate(experienceInfo, rules, required)) return;
        Alert.alert('Éxito', 'Experiencia laboral guardada');
        setShowExperienceModal(false);
        setErrors({});
    };
    const saveVolunteer = () => {
        const required = ['org', 'role', 'startDate', 'description'];
        const rules = { startDate: isValidDate, endDate: (v: string) => !v || isValidDate(v) };
        if (!validate(volunteerInfo, rules, required)) return;
        Alert.alert('Éxito', 'Voluntariado guardado');
        setShowVolunteerModal(false);
        setErrors({});
    };
    const savePublication = () => {
        const required = ['title', 'publisher', 'author', 'date', 'abstract'];
        const rules = { date: isValidDate };
        if (!validate(publicationInfo, rules, required)) return;
        Alert.alert('Éxito', 'Publicación guardada');
        setShowPublicationModal(false);
        setErrors({});
    };
    const saveLanguage = () => {
        if (!languageInfo.name.trim()) {
            setErrors({ name: 'Este campo es obligatorio' });
            return;
        }
        if (!languageProficiency) {
            setErrors({ proficiency: 'Seleccione una competencia' });
            return;
        }
        setErrors({});
        Alert.alert('Éxito', 'Idioma guardado');
        setShowLanguageModal(false);
    };
    // === RENDER MODAL REUTILIZABLE ===
    const renderModal = (
        isVisible: boolean,
        onClose: () => void,
        title: string,
        children: React.ReactNode
    ) => (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
            backdropOpacity={0.6}
        >
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalInner}>
                <View
                    style={[
                        styles.modalContent,
                        {
                            backgroundColor: isDark ? '#222' : '#e8d7d7',
                            width: IS_TABLET ? Math.min(500, SCREEN_WIDTH * 0.9) : '90%',
                        },
                    ]}
                >
                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{title}</Text>
                        {children}
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
    const ErrorText = ({ field }: { field: string }) =>
        errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null;
    // === Menús modernos ===
    const renderBannerMenu = () => (
        <Modal
            isVisible={showBannerMenu}
            onBackdropPress={() => setShowBannerMenu(false)}
            style={styles.menuModal}
        >
            <View style={[styles.menuContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowFullBanner(true); setShowBannerMenu(false); }}>
                    <Ionicons name="eye-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Ver portada</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { pickImage('banner'); setShowBannerMenu(false); }}>
                    <Ionicons name="images-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Cambiar foto de portada</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { takePhoto('banner'); setShowBannerMenu(false); }}>
                    <Ionicons name="camera-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Tomar foto</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowBannerMenu(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
    const renderProfileMenu = () => (
        <Modal
            isVisible={showProfileMenu}
            onBackdropPress={() => setShowProfileMenu(false)}
            style={styles.menuModal}
        >
            <View style={[styles.menuContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => { setShowFullProfile(true); setShowProfileMenu(false); }}>
                    <Ionicons name="eye-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Ver foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { pickImage('profile'); setShowProfileMenu(false); }}>
                    <Ionicons name="images-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Cambiar foto</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => { takePhoto('profile'); setShowProfileMenu(false); }}>
                    <Ionicons name="camera-outline" size={20} color="#10b981" />
                    <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>Tomar foto</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowProfileMenu(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: isDark ? '#111' : '#fff', borderBottomColor: isDark ? '#333' : '#ddd' }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>Profile</Text>
                <TouchableOpacity onPress={handleSettings}>
                    <Ionicons name="settings" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
            </View>
            {/* Banner y foto */}
            <View style={styles.bannerContainer}>
                <TouchableOpacity onPress={() => setShowBannerMenu(true)}>
                    {bannerImage ? (
                        <Image source={{ uri: bannerImage }} style={styles.bannerImage} resizeMode="cover" />
                    ) : (
                        <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
                            <Text style={[styles.placeholderText, { color: isDark ? '#AAA' : '#666' }]}>📷 Portada</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <View style={styles.profilePhotoContainer}>
                    <TouchableOpacity onPress={() => setShowProfileMenu(true)}>
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
                        onPress={() => takePhoto('profile')}
                        accessibilityLabel="Tomar foto de perfil"
                    >
                        <Ionicons name="camera" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: isDark ? '#FFF' : '#333' }]}>Ethan Carter Murayari</Text>
                <Text style={[styles.userEmail, { color: isDark ? '#AAA' : '#666' }]}>etcar@gmail.com</Text>
            </View>
            {/* Tabs */}
            <View style={styles.tabs}>
                {(['info', 'formacion', 'experiencia', 'adicional'] as const).map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                activeTab === tab && styles.activeTabText,
                                { color: activeTab === tab ? '#10b981' : isDark ? '#AAA' : '#666' },
                            ]}
                        >
                            {tab === 'info'
                                ? 'Info'
                                : tab === 'formacion'
                                    ? 'Formación'
                                    : tab === 'experiencia'
                                        ? 'Experiencia'
                                        : 'Adicional'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            {/* Contenido por pestaña */}
            <ScrollView style={styles.content}>
                {activeTab === 'info' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Información Personal</Text>
                            <TouchableOpacity style={styles.addIconContainer} onPress={handleAddInfo}>
                                <Ionicons name="add" size={24} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                    </View>
                )}
                {activeTab === 'formacion' && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Información académica</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowAcademicModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación técnica / especializada</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowTechnicalModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación Complementaria</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowComplementaryModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                    </>
                )}
                {activeTab === 'experiencia' && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Experiencia Laboral</Text>
                            <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowExperienceModal(true)}>
                                <Ionicons name="add" size={24} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                    </View>
                )}
                {activeTab === 'adicional' && (
                    <>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Voluntariados</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowVolunteerModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Publicaciones</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowPublicationModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Idiomas</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => setShowLanguageModal(true)}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                        </View>
                    </>
                )}
            </ScrollView>
            {/* === Menús === */}
            {renderBannerMenu()}
            {renderProfileMenu()}
           // === Visores con zoom ===
            {/* === Visores con zoom (usando expo-image) === */}
            // === Visores con zoom ===
            {showFullBanner && bannerImage && (
                <ImageModal
                    visible={showFullBanner} // ✅ Corregido: 'visible', no 'modalVisible'
                    imageUri={bannerImage}
                    onRequestClose={() => setShowFullBanner(false)}
                    resizeMode="contain"
                />
            )}
            {showFullProfile && profileImage && (
                <ImageModal
                    visible={showFullProfile} // ✅ Corregido: 'visible', no 'modalVisible'
                    imageUri={profileImage}
                    onRequestClose={() => setShowFullProfile(false)}
                    resizeMode="contain"
                />
            )}
            {/* === Modales de formularios === */}
            {renderModal(
                showPersonalInfoForm,
                () => setShowPersonalInfoForm(false),
                'Información Personal',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre y Apellido</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.fullName)}
                        value={personalInfo.fullName}
                        onChangeText={(t) => setPersonalInfo({ ...personalInfo, fullName: t })}
                        placeholder="Introduzca su nombre completo"
                    />
                    <ErrorText field="fullName" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de Nacimiento</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.birthDate)}
                        value={personalInfo.birthDate}
                        onChangeText={(t) => setPersonalInfo({ ...personalInfo, birthDate: t })}
                        placeholder="dd/mm/yyyy"
                    />
                    <ErrorText field="birthDate" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Celular N°</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.phone)}
                        value={personalInfo.phone}
                        onChangeText={(t) => setPersonalInfo({ ...personalInfo, phone: t })}
                        placeholder="Introducir número de celular"
                        keyboardType="phone-pad"
                    />
                    <ErrorText field="phone" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Tipo de documento</Text>
                    <View style={[styles.pickerWrapper, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                        <Picker
                            selectedValue={documentType}
                            onValueChange={setDocumentType}
                            style={[styles.picker, { color: isDark ? '#FFF' : '#333' }]}
                        >
                            <Picker.Item label="Seleccionar" value="" />
                            <Picker.Item label="DNI" value="dni" />
                            <Picker.Item label="Pasaporte" value="pasaporte" />
                        </Picker>
                    </View>
                    {documentType && (
                        <>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>N° de Documento</Text>
                            <TextInput
                                style={getInputStyle(isDark, !!errors.docNumber)}
                                value={personalInfo.docNumber}
                                onChangeText={(t) => setPersonalInfo({ ...personalInfo, docNumber: t })}
                                placeholder="N° de Documento"
                            />
                            <ErrorText field="docNumber" />
                        </>
                    )}
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Género</Text>
                    <View style={styles.radioGroup}>
                        {['Masculino', 'Femenino', 'Otros'].map((opt) => (
                            <TouchableOpacity key={opt} onPress={() => setGender(opt)}>
                                <View style={[styles.radioButton, gender === opt && styles.radioButtonSelected]} />
                                <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#333' }]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPersonalInfoForm(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={savePersonalInfo}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showAcademicModal,
                () => setShowAcademicModal(false),
                'Añadir formación Académica',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Grado</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.degree)}
                        value={academicInfo.degree}
                        onChangeText={(t) => setAcademicInfo({ ...academicInfo, degree: t })}
                        placeholder="Ingrese el nombre de su grado"
                    />
                    <ErrorText field="degree" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.institution)}
                        value={academicInfo.institution}
                        onChangeText={(t) => setAcademicInfo({ ...academicInfo, institution: t })}
                        placeholder="Ingrese el nombre de su carrera"
                    />
                    <ErrorText field="institution" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.country)}
                        value={academicInfo.country}
                        onChangeText={(t) => setAcademicInfo({ ...academicInfo, country: t })}
                        placeholder="Ingrese su país"
                    />
                    <ErrorText field="country" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de inicio</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.startYear)}
                        value={academicInfo.startYear}
                        onChangeText={(t) => setAcademicInfo({ ...academicInfo, startYear: t })}
                        placeholder="YYYY"
                        keyboardType="numeric"
                    />
                    <ErrorText field="startYear" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de fin</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.endYear)}
                        value={academicInfo.endYear}
                        onChangeText={(t) => setAcademicInfo({ ...academicInfo, endYear: t })}
                        placeholder="YYYY"
                        keyboardType="numeric"
                    />
                    <ErrorText field="endYear" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Estado</Text>
                    <View style={styles.radioGroup}>
                        {['Actualmente', 'Graduado', 'Titulado'].map((opt) => (
                            <TouchableOpacity key={opt} onPress={() => setAcademicStatus(opt)}>
                                <View style={[styles.radioButton, academicStatus === opt && styles.radioButtonSelected]} />
                                <Text style={[styles.radioLabel, { color: isDark ? '#FFF' : '#333' }]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowAcademicModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveAcademic}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showTechnicalModal,
                () => setShowTechnicalModal(false),
                'Añadir Formación Técnica / Especializada',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre del curso o certificación</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.courseName)}
                        value={technicalInfo.courseName}
                        onChangeText={(t) => setTechnicalInfo({ ...technicalInfo, courseName: t })}
                        placeholder="Ej: Curso de React Native"
                    />
                    <ErrorText field="courseName" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución o plataforma</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.institution)}
                        value={technicalInfo.institution}
                        onChangeText={(t) => setTechnicalInfo({ ...technicalInfo, institution: t })}
                        placeholder="Ej: Udemy, Coursera"
                    />
                    <ErrorText field="institution" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Duración (meses)</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.duration)}
                        value={technicalInfo.duration}
                        onChangeText={(t) => setTechnicalInfo({ ...technicalInfo, duration: t })}
                        placeholder="Ej: 6"
                        keyboardType="numeric"
                    />
                    <ErrorText field="duration" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de finalización</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.endYear)}
                        value={technicalInfo.endYear}
                        onChangeText={(t) => setTechnicalInfo({ ...technicalInfo, endYear: t })}
                        placeholder="YYYY"
                        keyboardType="numeric"
                    />
                    <ErrorText field="endYear" />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowTechnicalModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveTechnical}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showComplementaryModal,
                () => setShowComplementaryModal(false),
                'Añadir Formación Complementaria',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre de la actividad</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.name)}
                        value={complementaryInfo.name}
                        onChangeText={(t) => setComplementaryInfo({ ...complementaryInfo, name: t })}
                        placeholder="Ej: Voluntariado, idiomas, talleres"
                    />
                    <ErrorText field="name" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción breve</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.description)}
                        value={complementaryInfo.description}
                        onChangeText={(t) => setComplementaryInfo({ ...complementaryInfo, description: t })}
                        placeholder="Describe brevemente tu experiencia"
                    />
                    <ErrorText field="description" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de realización</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.date)}
                        value={complementaryInfo.date}
                        onChangeText={(t) => setComplementaryInfo({ ...complementaryInfo, date: t })}
                        placeholder="MM/YYYY"
                    />
                    <ErrorText field="date" />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowComplementaryModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveComplementary}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showExperienceModal,
                () => setShowExperienceModal(false),
                'Añadir experiencia Laboral',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Puesto</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.position)}
                        value={experienceInfo.position}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, position: t })}
                        placeholder="Ingrese el nombre del puesto"
                    />
                    <ErrorText field="position" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.institution)}
                        value={experienceInfo.institution}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, institution: t })}
                        placeholder="Ingrese el nombre de la Institución"
                    />
                    <ErrorText field="institution" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Área</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.area)}
                        value={experienceInfo.area}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, area: t })}
                        placeholder="Ingrese su área"
                    />
                    <ErrorText field="area" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.country)}
                        value={experienceInfo.country}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, country: t })}
                        placeholder="Ingrese su país"
                    />
                    <ErrorText field="country" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de inicio</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.startDate)}
                        value={experienceInfo.startDate}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, startDate: t })}
                        placeholder="dd/mm/yyyy"
                    />
                    <ErrorText field="startDate" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de fin</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.endDate)}
                        value={experienceInfo.endDate}
                        onChangeText={(t) => setExperienceInfo({ ...experienceInfo, endDate: t })}
                        placeholder="dd/mm/yyyy"
                    />
                    <ErrorText field="endDate" />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowExperienceModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveExperience}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showVolunteerModal,
                () => setShowVolunteerModal(false),
                'Añadir voluntariado',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Organización</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.org)}
                        value={volunteerInfo.org}
                        onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, org: t })}
                        placeholder="Nombre de la Organización"
                    />
                    <ErrorText field="org" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Cargo</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.role)}
                        value={volunteerInfo.role}
                        onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, role: t })}
                        placeholder="Nombre del cargo"
                    />
                    <ErrorText field="role" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Causa benéfica / Área</Text>
                    <TextInput
                        style={getInputStyle(isDark, false)}
                        value={volunteerInfo.cause}
                        onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, cause: t })}
                        placeholder="National University of the Peruvian Amazon"
                    />
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setCurrentlyInRole(!currentlyInRole)}>
                            <View style={[styles.checkbox, currentlyInRole && styles.checkboxChecked]} />
                            <Text style={[styles.checkboxLabel, { color: isDark ? '#FFF' : '#333' }]}>
                                Actualmente estoy en este cargo
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de inicio</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.startDate)}
                        value={volunteerInfo.startDate}
                        onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, startDate: t })}
                        placeholder="dd/mm/yyyy"
                    />
                    <ErrorText field="startDate" />
                    {!currentlyInRole && (
                        <>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de fin</Text>
                            <TextInput
                                style={getInputStyle(isDark, !!errors.endDate)}
                                value={volunteerInfo.endDate}
                                onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, endDate: t })}
                                placeholder="dd/mm/yyyy"
                            />
                            <ErrorText field="endDate" />
                        </>
                    )}
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.description)}
                        value={volunteerInfo.description}
                        onChangeText={(t) => setVolunteerInfo({ ...volunteerInfo, description: t })}
                        placeholder="Escribe un resumen de tu experiencia en voluntariado"
                        multiline
                    />
                    <ErrorText field="description" />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowVolunteerModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveVolunteer}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showPublicationModal,
                () => setShowPublicationModal(false),
                'Añadir publicación',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Título</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.title)}
                        value={publicationInfo.title}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, title: t })}
                        placeholder="Nombre de publicación"
                    />
                    <ErrorText field="title" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Publicación / Editorial</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.publisher)}
                        value={publicationInfo.publisher}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, publisher: t })}
                        placeholder="Ej: España editorial"
                    />
                    <ErrorText field="publisher" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Autor</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.author)}
                        value={publicationInfo.author}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, author: t })}
                        placeholder="Ingrese el nombre"
                    />
                    <ErrorText field="author" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de Publicación</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.date)}
                        value={publicationInfo.date}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, date: t })}
                        placeholder="dd/mm/yyyy"
                    />
                    <ErrorText field="date" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Url</Text>
                    <TextInput
                        style={getInputStyle(isDark, false)}
                        value={publicationInfo.url}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, url: t })}
                        placeholder="https://..."
                    />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Resumen / Abstract</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.abstract)}
                        value={publicationInfo.abstract}
                        onChangeText={(t) => setPublicationInfo({ ...publicationInfo, abstract: t })}
                        placeholder="Ingrese un breve resumen"
                        multiline
                    />
                    <ErrorText field="abstract" />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPublicationModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={savePublication}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
            {renderModal(
                showLanguageModal,
                () => setShowLanguageModal(false),
                'Añadir idioma',
                <>
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Idioma</Text>
                    <TextInput
                        style={getInputStyle(isDark, !!errors.name)}
                        value={languageInfo.name}
                        onChangeText={(t) => setLanguageInfo({ name: t })}
                        placeholder="Idioma"
                    />
                    <ErrorText field="name" />
                    <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Competencia</Text>
                    <View style={[styles.pickerWrapper, { backgroundColor: isDark ? '#333' : '#f9f9f9' }]}>
                        <Picker
                            selectedValue={languageProficiency}
                            onValueChange={setLanguageProficiency}
                            style={[styles.picker, { color: isDark ? '#FFF' : '#333' }]}
                        >
                            <Picker.Item label="Seleccionar" value="" />
                            <Picker.Item label="Basic" value="basic" />
                            <Picker.Item label="Intermediate" value="intermediate" />
                            <Picker.Item label="Advanced" value="advanced" />
                            <Picker.Item label="Native" value="native" />
                        </Picker>
                    </View>
                    {errors.proficiency && <Text style={styles.errorText}>{errors.proficiency}</Text>}
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowLanguageModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.addButton]} onPress={saveLanguage}>
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}
// === ESTILOS ===
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
        backgroundColor: '#fff',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tab: { paddingHorizontal: 12, paddingVertical: 8 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: '#10b981' },
    tabText: { fontSize: 14 },
    activeTabText: { fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
    section: { marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
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
    // --- Modales de formularios ---
    modal: { margin: 0, justifyContent: 'flex-end' },
    modalInner: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
    modalContent: {
        maxHeight: '90%',
        minHeight: 200,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, marginBottom: 5, marginTop: 10 },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    pickerWrapper: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
    picker: { height: 40 },
    radioGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    radioButton: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#aaa', marginRight: 8 },
    radioButtonSelected: { backgroundColor: '#10b981', borderColor: '#10b981' },
    radioLabel: { fontSize: 14 },
    buttonGroup: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
    cancelButton: { backgroundColor: '#aaa', marginRight: 10 },
    addButton: { backgroundColor: '#10b981', marginLeft: 10 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#aaa', marginRight: 10 },
    checkboxChecked: { backgroundColor: '#10b981', borderColor: '#10b981' },
    checkboxLabel: { fontSize: 14 },
    errorText: { color: '#ef4444', fontSize: 12, marginBottom: 8 },
    // --- Menús modernos ---
    menuModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    menuContent: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    menuText: {
        fontSize: 16,
        marginLeft: 12,
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
    cancelearButton: {
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 16,
        color: '#ef4444',
        fontWeight: '600',
    },
});
const getInputStyle = (isDark: boolean, hasError: boolean) => ({
    borderWidth: 1,
    borderColor: hasError ? '#ef4444' : '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: isDark ? '#333' : '#f9f9f9',
    color: isDark ? '#FFF' : '#333',
    marginBottom: 10,
    fontSize: 16,
    paddingHorizontal: 12,
});