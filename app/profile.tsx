// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Imágenes
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    // Estados para los modales
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showComplementaryModal, setShowComplementaryModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showPublicationModal, setShowPublicationModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Estado para el picker de idiomas
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    // Estados para los formularios (aquí van las declaraciones únicas)
    const [documentType, setDocumentType] = useState('');
    const [gender, setGender] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('');
    const [currentlyInRole, setCurrentlyInRole] = useState(false);
    const [academicStatus, setAcademicStatus] = useState<string>('Actualmente');

    // Pestañas
    const [activeTab, setActiveTab] = useState<'info' | 'formacion' | 'experiencia' | 'adicional'>('info');

    // Modales de imagen
    const [isBannerModalVisible, setIsBannerModalVisible] = useState(false);
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);

    // Menús
    const [bannerMenuVisible, setBannerMenuVisible] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    // === Estados para los datos (CRUD) ===
    const [personalInfo, setPersonalInfo] = useState<any>(null);
    const [academicRecords, setAcademicRecords] = useState<any[]>([]);
    const [technicalRecords, setTechnicalRecords] = useState<any[]>([]);
    const [complementaryRecords, setComplementaryRecords] = useState<any[]>([]);
    const [experienceRecords, setExperienceRecords] = useState<any[]>([]);
    const [volunteerRecords, setVolunteerRecords] = useState<any[]>([]);
    const [publicationRecords, setPublicationRecords] = useState<any[]>([]);
    const [languageRecords, setLanguageRecords] = useState<any[]>([]);

    // === Estados de edición ===
    const [editingPersonal, setEditingPersonal] = useState<any>(null);
    const [editingAcademic, setEditingAcademic] = useState<any>(null);
    const [editingTechnical, setEditingTechnical] = useState<any>(null);
    const [editingComplementary, setEditingComplementary] = useState<any>(null);
    const [editingExperience, setEditingExperience] = useState<any>(null);
    const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
    const [editingPublication, setEditingPublication] = useState<any>(null);
    const [editingLanguage, setEditingLanguage] = useState<any>(null);

    // === Estados de los inputs ===
    const [nameInput, setNameInput] = useState('');
    const [birthDateInput, setBirthDateInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [documentNumberInput, setDocumentNumberInput] = useState('');
    const [degreeInput, setDegreeInput] = useState('');
    const [institutionInput, setInstitutionInput] = useState('');
    const [countryInput, setCountryInput] = useState('');
    const [startDateInput, setStartDateInput] = useState('');
    const [endDateInput, setEndDateInput] = useState('');
    const [courseInput, setCourseInput] = useState('');
    const [platformInput, setPlatformInput] = useState('');
    const [durationInput, setDurationInput] = useState('');
    const [activityInput, setActivityInput] = useState('');
    const [descriptionInput, setDescriptionInput] = useState('');
    const [dateInput, setDateInput] = useState('');
    const [positionInput, setPositionInput] = useState('');
    const [areaInput, setAreaInput] = useState('');
    const [orgInput, setOrgInput] = useState('');
    const [roleInput, setRoleInput] = useState('');
    const [causeInput, setCauseInput] = useState('');
    const [pubTitleInput, setPubTitleInput] = useState('');
    const [pubEditorialInput, setPubEditorialInput] = useState('');
    const [pubAuthorInput, setPubAuthorInput] = useState('');
    const [pubDateInput, setPubDateInput] = useState('');
    const [pubUrlInput, setPubUrlInput] = useState('');
    const [pubAbstractInput, setPubAbstractInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');

    // Estado para el date picker genérico
    const [datePickerVisible, setDatePickerVisible] = useState(false);
    const [datePickerField, setDatePickerField] = useState<string | null>(null);

    // Cargar datos guardados
    useEffect(() => {
        const loadAllData = async () => {
            try {
                // Imágenes
                const savedBanner = await AsyncStorage.getItem('userBannerURL');
                if (savedBanner) setBannerImage(savedBanner);
                const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                if (savedPhoto) setProfileImage(savedPhoto);
                // Información personal
                const savedPersonal = await AsyncStorage.getItem('personalInfo');
                if (savedPersonal) setPersonalInfo(JSON.parse(savedPersonal));
                // Formación académica
                const savedAcademic = await AsyncStorage.getItem('academicRecords');
                if (savedAcademic) setAcademicRecords(JSON.parse(savedAcademic));
                // Formación técnica
                const savedTechnical = await AsyncStorage.getItem('technicalRecords');
                if (savedTechnical) setTechnicalRecords(JSON.parse(savedTechnical));
                // Formación complementaria
                const savedComplementary = await AsyncStorage.getItem('complementaryRecords');
                if (savedComplementary) setComplementaryRecords(JSON.parse(savedComplementary));
                // Experiencia laboral
                const savedExperience = await AsyncStorage.getItem('experienceRecords');
                if (savedExperience) setExperienceRecords(JSON.parse(savedExperience));
                // Voluntariados
                const savedVolunteer = await AsyncStorage.getItem('volunteerRecords');
                if (savedVolunteer) setVolunteerRecords(JSON.parse(savedVolunteer));
                // Publicaciones
                const savedPublication = await AsyncStorage.getItem('publicationRecords');
                if (savedPublication) setPublicationRecords(JSON.parse(savedPublication));
                // Idiomas
                const savedLanguage = await AsyncStorage.getItem('languageRecords');
                if (savedLanguage) setLanguageRecords(JSON.parse(savedLanguage));
            } catch (error) {
                console.log('Error cargando datos:', error);
            }
        };
        loadAllData();
    }, []);

    const handleSettings = () => {
        router.push('/settings');
    };

    // === Funciones CRUD genéricas ===
    const saveToStorage = async (key: string, data: any) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.log('Error guardando', key, e);
        }
    };

    const addRecord = (records: any[], setRecords: any, newRecord: any, key: string) => {
        const updated = [...records, { ...newRecord, id: Date.now().toString() }];
        setRecords(updated);
        saveToStorage(key, updated);
    };

    const updateRecord = (records: any[], setRecords: any, updatedRecord: any, key: string) => {
        const updated = records.map(r => r.id === updatedRecord.id ? updatedRecord : r);
        setRecords(updated);
        saveToStorage(key, updated);
    };

    const deleteRecord = (records: any[], setRecords: any, id: string, key: string) => {
        const updated = records.filter(r => r.id !== id);
        setRecords(updated);
        saveToStorage(key, updated);
    };

    // === Funciones para imágenes ===
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

    // === Manejo de modales ===
    const openPersonalModal = () => {
        if (personalInfo) {
            setNameInput(personalInfo.name || '');
            setBirthDateInput(personalInfo.birthDate || '');
            setPhoneInput(personalInfo.phone || '');
            setDocumentType(personalInfo.documentType || '');
            setDocumentNumberInput(personalInfo.documentNumber || '');
            setGender(personalInfo.gender || '');
        } else {
            setNameInput('');
            setBirthDateInput('');
            setPhoneInput('');
            setDocumentType('');
            setDocumentNumberInput('');
            setGender('');
        }
        setEditingPersonal(personalInfo);
        setShowPersonalInfoForm(true);
    };

    const openAcademicModal = (record: any = null) => {
        if (record) {
            setDegreeInput(record.degree || '');
            setInstitutionInput(record.institution || '');
            setCountryInput(record.country || '');
            setStartDateInput(record.startDate || '');
            setEndDateInput(record.endDate || '');
            setAcademicStatus(record.status || 'Actualmente');
            setEditingAcademic(record);
        } else {
            setDegreeInput('');
            setInstitutionInput('');
            setCountryInput('');
            setStartDateInput('');
            setEndDateInput('');
            setAcademicStatus('Actualmente');
            setEditingAcademic(null);
        }
        setShowAcademicModal(true);
    };

    const openTechnicalModal = (record: any = null) => {
        if (record) {
            setCourseInput(record.course || '');
            setPlatformInput(record.platform || '');
            setDurationInput(record.duration || '');
            setEndDateInput(record.endDate || '');
            setEditingTechnical(record);
        } else {
            setCourseInput('');
            setPlatformInput('');
            setDurationInput('');
            setEndDateInput('');
            setEditingTechnical(null);
        }
        setShowTechnicalModal(true);
    };

    const openComplementaryModal = (record: any = null) => {
        if (record) {
            setActivityInput(record.activity || '');
            setDescriptionInput(record.description || '');
            setDateInput(record.date || '');
            setEditingComplementary(record);
        } else {
            setActivityInput('');
            setDescriptionInput('');
            setDateInput('');
            setEditingComplementary(null);
        }
        setShowComplementaryModal(true);
    };

    const openExperienceModal = (record: any = null) => {
        if (record) {
            setPositionInput(record.position || '');
            setInstitutionInput(record.institution || '');
            setAreaInput(record.area || '');
            setCountryInput(record.country || '');
            setStartDateInput(record.startDate || '');
            setEndDateInput(record.endDate || '');
            setEditingExperience(record);
        } else {
            setPositionInput('');
            setInstitutionInput('');
            setAreaInput('');
            setCountryInput('');
            setStartDateInput('');
            setEndDateInput('');
            setEditingExperience(null);
        }
        setShowExperienceModal(true);
    };

    const openVolunteerModal = (record: any = null) => {
        if (record) {
            setOrgInput(record.organization || '');
            setRoleInput(record.role || '');
            setCauseInput(record.cause || '');
            setCurrentlyInRole(record.currentlyInRole || false);
            setStartDateInput(record.startDate || '');
            setEndDateInput(record.endDate || '');
            setDescriptionInput(record.description || '');
            setEditingVolunteer(record);
        } else {
            setOrgInput('');
            setRoleInput('');
            setCauseInput('');
            setCurrentlyInRole(false);
            setStartDateInput('');
            setEndDateInput('');
            setDescriptionInput('');
            setEditingVolunteer(null);
        }
        setShowVolunteerModal(true);
    };

    const openPublicationModal = (record: any = null) => {
        if (record) {
            setPubTitleInput(record.title || '');
            setPubEditorialInput(record.editorial || '');
            setPubAuthorInput(record.author || '');
            setPubDateInput(record.date || '');
            setPubUrlInput(record.url || '');
            setPubAbstractInput(record.abstract || '');
            setEditingPublication(record);
        } else {
            setPubTitleInput('');
            setPubEditorialInput('');
            setPubAuthorInput('');
            setPubDateInput('');
            setPubUrlInput('');
            setPubAbstractInput('');
            setEditingPublication(null);
        }
        setShowPublicationModal(true);
    };

    const openLanguageModal = (record: any = null) => {
        if (record) {
            setLanguageInput(record.language || '');
            setLanguageProficiency(record.proficiency || '');
            setEditingLanguage(record);
        } else {
            setLanguageInput('');
            setLanguageProficiency('');
            setEditingLanguage(null);
        }
        setShowLanguageModal(true);
    };

    // === Validación de campos ===
    const validatePersonalFields = () => {
        if (!nameInput.trim()) return 'Nombre y Apellido';
        if (!birthDateInput.trim()) return 'Fecha de Nacimiento';
        if (!phoneInput.trim()) return 'Celular N°';
        if (!documentType) return 'Tipo de documento';
        if (!documentNumberInput.trim()) return 'Número de Documento';
        if (!gender) return 'Género';
        return null;
    };

    const validateAcademicFields = () => {
        if (!degreeInput.trim()) return 'Grado';
        if (!institutionInput.trim()) return 'Institución';
        if (!countryInput.trim()) return 'País';
        if (!startDateInput.trim()) return 'Año de inicio';
        if (!endDateInput.trim()) return 'Año de fin';
        if (!academicStatus) return 'Estado';
        return null;
    };

    const validateTechnicalFields = () => {
        if (!courseInput.trim()) return 'Curso';
        if (!platformInput.trim()) return 'Plataforma';
        if (!durationInput.trim()) return 'Duración';
        if (!endDateInput.trim()) return 'Año de finalización';
        return null;
    };

    const validateComplementaryFields = () => {
        if (!activityInput.trim()) return 'Actividad';
        if (!descriptionInput.trim()) return 'Descripción';
        if (!dateInput.trim()) return 'Fecha';
        return null;
    };

    const validateExperienceFields = () => {
        if (!positionInput.trim()) return 'Cargo';
        if (!institutionInput.trim()) return 'Institución';
        if (!areaInput.trim()) return 'Área';
        if (!countryInput.trim()) return 'País';
        if (!startDateInput.trim()) return 'Año de inicio';
        if (!endDateInput.trim()) return 'Año de fin';
        return null;
    };

    const validateVolunteerFields = () => {
        if (!orgInput.trim()) return 'Organización';
        if (!roleInput.trim()) return 'Rol';
        if (!causeInput.trim()) return 'Causa';
        if (!startDateInput.trim()) return 'Año de inicio';
        if (!endDateInput.trim()) return 'Año de fin';
        return null;
    };

    const validatePublicationFields = () => {
        if (!pubTitleInput.trim()) return 'Título';
        if (!pubEditorialInput.trim()) return 'Editorial';
        if (!pubAuthorInput.trim()) return 'Autor(es)';
        if (!pubDateInput.trim()) return 'Fecha';
        return null;
    };

    const validateLanguageFields = () => {
        if (!languageInput.trim()) return 'Idioma';
        if (!languageProficiency) return 'Nivel de dominio';
        return null;
    };

    const showAlertIfMissingFields = (missingField: string | null) => {
        if (missingField) {
            Alert.alert('Campos incompletos', `Por favor, complete el campo: ${missingField}`);
            return true;
        }
        return false;
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
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>Perfil</Text>
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
                            <Text style={[styles.placeholderText, { color: isDark ? '#AAA' : '#666' }]}>📷 Foto de portada</Text>
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
                    <TouchableOpacity style={styles.cameraIcon} onPress={showProfileMenu}>
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
            {/* Contenido con KeyboardAvoidingView */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingContainer}
            >
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {activeTab === 'info' && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Información Personal</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={openPersonalModal}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            {personalInfo ? (
                                <View style={[styles.recordItem, { backgroundColor: isDark ? '#222' : '#f9f9f9' }]}>
                                    <Text style={{ color: isDark ? '#FFF' : '#333' }}>{personalInfo.name}</Text>
                                    <Text style={{ color: isDark ? '#AAA' : '#666' }}>F.n: {personalInfo.birthDate}</Text>
                                    <Text style={{ color: isDark ? '#AAA' : '#666' }}>Celular: {personalInfo.phone}</Text>
                                    <Text style={{ color: isDark ? '#AAA' : '#666' }}>
                                        {personalInfo.documentType === 'dni'
                                            ? `DNI: ${personalInfo.documentNumber}`
                                            : personalInfo.documentType === 'carnet de extranjeria'
                                                ? `Carnet de Extranjería: ${personalInfo.documentNumber}`
                                                : 'Tipo de documento no especificado'}
                                    </Text>
                                    <Text style={{ color: isDark ? '#AAA' : '#666' }}>Género: {personalInfo.gender}</Text>
                                    <View style={styles.editDeleteContainer}>
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => openPersonalModal()}
                                        >
                                            <Ionicons name="pencil" size={20} color="#10b981" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => {
                                                Alert.alert('Confirmar', '¿Eliminar información personal?', [
                                                    { text: 'Cancelar', style: 'cancel' },
                                                    {
                                                        text: 'Eliminar', style: 'destructive', onPress: () => {
                                                            setPersonalInfo(null);
                                                            AsyncStorage.removeItem('personalInfo');
                                                        }
                                                    }
                                                ]);
                                            }}
                                        >
                                            <Ionicons name="trash" size={20} color="#e74c3c" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                            )}
                        </View>
                    )}
                    {activeTab === 'formacion' && (
                        <>
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Información académica</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openAcademicModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {academicRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    academicRecords.map((record) => (
                                        <View key={record.id} style={[styles.academicCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="school" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.degree}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Institución: {record.institution}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Carrera: {record.institution}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Tiempo: {record.startDate} - {record.endDate || 'Actualmente'}</Text>
                                                <View style={styles.statusContainer}>
                                                    <Text style={[styles.statusText, { color: isDark ? '#FFF' : '#333' }]}>Estado:</Text>
                                                    <View style={[styles.statusBadge, { backgroundColor: record.status === 'Graduado' ? '#10b981' : record.status === 'Titulado' ? '#3b82f6' : '#f59e0b' }]}>
                                                        <Text style={styles.statusBadgeText}>{record.status}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openAcademicModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación técnica / especializada</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openTechnicalModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {technicalRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    technicalRecords.map((record) => (
                                        <View key={record.id} style={[styles.technicalCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="construct" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.course}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Plataforma: {record.platform}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Duración: {record.duration}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Finalizado: {record.endDate}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openTechnicalModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación Complementaria</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openComplementaryModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {complementaryRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    complementaryRecords.map((record) => (
                                        <View key={record.id} style={[styles.complementaryCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="newspaper" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.activity}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Descripción: {record.description}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Fecha: {record.date}</Text>
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openComplementaryModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>
                        </>
                    )}
                    {activeTab === 'experiencia' && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Experiencia Laboral</Text>
                                <TouchableOpacity style={styles.addIconContainer} onPress={() => openExperienceModal()}>
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            {experienceRecords.length === 0 ? (
                                <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                            ) : (
                                experienceRecords.map((record) => (
                                    <View key={record.id} style={[styles.experienceCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                        <View style={styles.iconContainer}>
                                            <Ionicons name="briefcase" size={24} color="#10b981" />
                                        </View>
                                        <View style={styles.cardContent}>
                                            <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.position} - {record.institution}</Text>
                                            <View style={styles.experienceDetails}>
                                                <View style={styles.detailRow}>
                                                    <Ionicons name="person" size={18} color="#10b981" />
                                                    <Text style={[styles.detailLabel, { color: isDark ? '#FFF' : '#333' }]}>Puesto:</Text>
                                                </View>
                                                <Text style={[styles.detailValue, { color: isDark ? '#AAA' : '#666' }]}>{record.area || 'No especificado'}</Text>
                                                <View style={styles.detailRow}>
                                                    <Ionicons name="list" size={18} color="#10b981" />
                                                    <Text style={[styles.detailLabel, { color: isDark ? '#FFF' : '#333' }]}>Funciones:</Text>
                                                </View>
                                                <Text style={[styles.detailValue, { color: isDark ? '#AAA' : '#666' }]}>
                                                    {record.description || 'No especificadas'}
                                                </Text>
                                                <View style={styles.dateRow}>
                                                    <View style={styles.dateContainer}>
                                                        <Ionicons name="play-circle" size={16} color="#10b981" />
                                                        <Text style={[styles.dateLabel, { color: isDark ? '#FFF' : '#333' }]}>Inicio:</Text>
                                                        <Text style={[styles.dateValue, { color: isDark ? '#AAA' : '#666' }]}>
                                                            {record.startDate}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.dateContainer}>
                                                        <Ionicons name="stop-circle" size={16} color="#3b82f6" />
                                                        <Text style={[styles.dateLabel, { color: isDark ? '#FFF' : '#333' }]}>Final:</Text>
                                                        <Text style={[styles.dateValue, { color: isDark ? '#AAA' : '#666' }]}>
                                                            {record.endDate || 'Actualmente'}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                        <TouchableOpacity style={styles.editButtonCircle} onPress={() => openExperienceModal(record)}>
                                            <Ionicons name="pencil" size={18} color="#10b981" />
                                        </TouchableOpacity>
                                    </View>
                                ))
                            )}
                        </View>
                    )}
                    {activeTab === 'adicional' && (
                        <>
                            {/* Voluntariados */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Voluntariados</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openVolunteerModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {volunteerRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    volunteerRecords.map((record) => (
                                        <View key={record.id} style={[styles.volunteerCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="people" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.organization}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                                                    {record.role} • {record.cause}
                                                </Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                                                    {record.country} - {record.startDate} - {record.endDate || 'Actualmente'}
                                                </Text>
                                                <View style={styles.statusContainer}>
                                                    <Text style={[styles.statusText, { color: isDark ? '#FFF' : '#333' }]}>Estado:</Text>
                                                    <View style={[styles.statusBadge, { backgroundColor: record.currentlyInRole ? '#3b82f6' : '#e74c3c' }]}>
                                                        <Text style={styles.statusBadgeText}>{record.currentlyInRole ? 'En curso' : 'Finalizado'}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openVolunteerModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>

                            {/* Publicaciones */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Publicaciones</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openPublicationModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {publicationRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    publicationRecords.map((record) => (
                                        <View key={record.id} style={[styles.publicationCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="book" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.title}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Revista: {record.editorial}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>Autores: {record.author}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                                                    {record.country} - {record.date}
                                                </Text>
                                                {record.url && (
                                                    <Text style={[styles.cardLink, { color: '#10b981' }]}>
                                                        {record.url}
                                                    </Text>
                                                )}
                                                {record.abstract && (
                                                    <Text style={[styles.cardAbstract, { color: isDark ? '#AAA' : '#666' }]}>
                                                        "{record.abstract}"
                                                    </Text>
                                                )}
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openPublicationModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>

                            {/* Idiomas */}
                            <View style={styles.section}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>Idiomas</Text>
                                    <TouchableOpacity style={styles.addIconContainer} onPress={() => openLanguageModal()}>
                                        <Ionicons name="add" size={24} color="#10b981" />
                                    </TouchableOpacity>
                                </View>
                                {languageRecords.length === 0 ? (
                                    <Text style={[styles.noDataText, { color: isDark ? '#AAA' : '#666' }]}>No se visualiza ninguna información</Text>
                                ) : (
                                    languageRecords.map((record) => (
                                        <View key={record.id} style={[styles.languageCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                                            <View style={styles.iconContainer}>
                                                <Ionicons name="globe" size={24} color="#10b981" />
                                            </View>
                                            <View style={styles.cardContent}>
                                                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{record.language}</Text>
                                                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>
                                                    {record.proficiency}
                                                </Text>
                                            </View>
                                            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openLanguageModal(record)}>
                                                <Ionicons name="pencil" size={18} color="#10b981" />
                                            </TouchableOpacity>
                                        </View>
                                    ))
                                )}
                            </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
            {/* Modales de imagen */}
            {isBannerModalVisible && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsBannerModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalClose} onPress={() => setIsBannerModalVisible(false)}>
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: bannerImage! }} style={styles.modalImage} resizeMode="contain" />
                </TouchableOpacity>
            )}
            {isProfileModalVisible && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsProfileModalVisible(false)}
                >
                    <TouchableOpacity style={styles.modalClose} onPress={() => setIsProfileModalVisible(false)}>
                        <Ionicons name="close" size={32} color="#fff" />
                    </TouchableOpacity>
                    <Image source={{ uri: profileImage! }} style={styles.modalImage} resizeMode="contain" />
                </TouchableOpacity>
            )}
            {/* Menús */}
            {bannerMenuVisible && (
                <View style={styles.bannerMenuOverlay}>
                    <View style={[styles.bannerMenuContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                        <Text style={[styles.bannerMenuTitle, { color: isDark ? '#FFF' : '#333' }]}>Opciones de portada</Text>
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
                            <Text style={[styles.bannerMenuCancelText, { color: isDark ? '#ff6b6b' : '#e74c3c' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {profileMenuVisible && (
                <View style={styles.bannerMenuOverlay}>
                    <View style={[styles.bannerMenuContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                        <Text style={[styles.bannerMenuTitle, { color: isDark ? '#FFF' : '#333' }]}>Opciones de foto de perfil</Text>
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
                            <Text style={[styles.bannerMenuCancelText, { color: isDark ? '#ff6b6b' : '#e74c3c' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {/* Modales de formularios */}
            {showPersonalInfoForm && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowPersonalInfoForm(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Información Personal</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nombre y Apellido</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Introduzca su nombre completo"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={nameInput}
                            onChangeText={setNameInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de Nacimiento</Text>
                        <TouchableOpacity
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', justifyContent: 'center' }]}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: birthDateInput ? (isDark ? '#FFF' : '#333') : (isDark ? '#AAA' : '#999') }}>
                                {birthDateInput || 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={birthDateInput ? new Date(birthDateInput.split('/').reverse().join('-')) : new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, selectedDate) => {
                                    setShowDatePicker(false);
                                    if (selectedDate) {
                                        const d = selectedDate;
                                        const formatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                                        setBirthDateInput(formatted);
                                    }
                                }}
                            />
                        )}
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Celular N°</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Introducir número de celular"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={phoneInput}
                            onChangeText={setPhoneInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Seleccione su tipo de documento:</Text>
                        <View style={styles.row}>
                            <View style={[styles.pickerWrapper, { backgroundColor: isDark ? '#333' : '#f9f9f9', justifyContent: 'center' }]}>
                                <Picker
                                    selectedValue={documentType}
                                    onValueChange={(itemValue) => setDocumentType(itemValue)}
                                    style={[
                                        styles.picker,
                                        {
                                            color: isDark ? '#FFF' : '#333',
                                            textAlign: 'center',
                                            paddingTop: 6,
                                            paddingBottom: 6,
                                            height: 48,
                                        },
                                    ]}
                                    itemStyle={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                    }}
                                >
                                    <Picker.Item label="Seleccionar" value="" />
                                    <Picker.Item label="DNI" value="dni" />
                                    <Picker.Item label="Carnet de Extranjería" value="carnet de extranjeria" />
                                </Picker>
                            </View>
                            <TextInput
                                style={[
                                    styles.input,
                                    { flex: 1, marginLeft: 10, backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' },
                                ]}
                                placeholder="N° de Documento"
                                placeholderTextColor={isDark ? '#AAA' : '#999'}
                                value={documentNumberInput}
                                onChangeText={setDocumentNumberInput}
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
                                onPress={async () => {
                                    const missingField = validatePersonalFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const data = {
                                        name: nameInput,
                                        birthDate: birthDateInput,
                                        phone: phoneInput,
                                        documentType,
                                        documentNumber: documentNumberInput,
                                        gender,
                                    };
                                    setPersonalInfo(data);
                                    await AsyncStorage.setItem('personalInfo', JSON.stringify(data));
                                    Alert.alert('Éxito', editingPersonal ? 'Información actualizada' : 'Información guardada');
                                    setShowPersonalInfoForm(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingPersonal ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showAcademicModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowAcademicModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación Académica</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Grado</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre de su grado"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={degreeInput}
                            onChangeText={setDegreeInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese el nombre de su carrera"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={institutionInput}
                            onChangeText={setInstitutionInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ingrese su país"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={countryInput}
                            onChangeText={setCountryInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de inicio</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={startDateInput}
                            onChangeText={setStartDateInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de fin</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={endDateInput}
                            onChangeText={setEndDateInput}
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
                                    const missingField = validateAcademicFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        degree: degreeInput,
                                        institution: institutionInput,
                                        country: countryInput,
                                        startDate: startDateInput,
                                        endDate: endDateInput,
                                        status: academicStatus,
                                    };
                                    if (editingAcademic) {
                                        updateRecord(academicRecords, setAcademicRecords, { ...editingAcademic, ...newRecord }, 'academicRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(academicRecords, setAcademicRecords, newRecord, 'academicRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowAcademicModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingAcademic ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showTechnicalModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowTechnicalModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación Técnica / Especializada</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Curso</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre del curso"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={courseInput}
                            onChangeText={setCourseInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Plataforma</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Plataforma o institución"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={platformInput}
                            onChangeText={setPlatformInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Duración</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej. 6 meses"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={durationInput}
                            onChangeText={setDurationInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de finalización</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={endDateInput}
                            onChangeText={setEndDateInput}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowTechnicalModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validateTechnicalFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        course: courseInput,
                                        platform: platformInput,
                                        duration: durationInput,
                                        endDate: endDateInput,
                                    };
                                    if (editingTechnical) {
                                        updateRecord(technicalRecords, setTechnicalRecords, { ...editingTechnical, ...newRecord }, 'technicalRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(technicalRecords, setTechnicalRecords, newRecord, 'technicalRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowTechnicalModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingTechnical ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showComplementaryModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowComplementaryModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Formación Complementaria</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Actividad</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de la actividad"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={activityInput}
                            onChangeText={setActivityInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Breve descripción"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={descriptionInput}
                            onChangeText={setDescriptionInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={dateInput}
                            onChangeText={setDateInput}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowComplementaryModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validateComplementaryFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        activity: activityInput,
                                        description: descriptionInput,
                                        date: dateInput,
                                    };
                                    if (editingComplementary) {
                                        updateRecord(complementaryRecords, setComplementaryRecords, { ...editingComplementary, ...newRecord }, 'complementaryRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(complementaryRecords, setComplementaryRecords, newRecord, 'complementaryRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowComplementaryModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingComplementary ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showExperienceModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowExperienceModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Experiencia Laboral</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Cargo</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre del cargo"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={positionInput}
                            onChangeText={setPositionInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Institución</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de la empresa u organización"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={institutionInput}
                            onChangeText={setInstitutionInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Área</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Área o departamento"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={areaInput}
                            onChangeText={setAreaInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>País</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="País"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={countryInput}
                            onChangeText={setCountryInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de inicio</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={startDateInput}
                            onChangeText={setStartDateInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Año de fin</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="YYYY o 'Actualmente'"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={endDateInput}
                            onChangeText={setEndDateInput}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowExperienceModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validateExperienceFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        position: positionInput,
                                        institution: institutionInput,
                                        area: areaInput,
                                        country: countryInput,
                                        startDate: startDateInput,
                                        endDate: endDateInput,
                                    };
                                    if (editingExperience) {
                                        updateRecord(experienceRecords, setExperienceRecords, { ...editingExperience, ...newRecord }, 'experienceRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(experienceRecords, setExperienceRecords, newRecord, 'experienceRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowExperienceModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingExperience ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showVolunteerModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowVolunteerModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Voluntariado</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Organización</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de la organización"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={orgInput}
                            onChangeText={setOrgInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Rol</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Rol desempeñado"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={roleInput}
                            onChangeText={setRoleInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Causa</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Causa o propósito"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={causeInput}
                            onChangeText={setCauseInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Descripción</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Breve descripción"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={descriptionInput}
                            onChangeText={setDescriptionInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de inicio</Text>
                        <TouchableOpacity
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', justifyContent: 'center' }]}
                            onPress={() => {
                                setDatePickerField('volunteerStart');
                                setDatePickerVisible(true);
                            }}
                        >
                            <Text style={{ color: startDateInput ? (isDark ? '#FFF' : '#333') : (isDark ? '#AAA' : '#999') }}>
                                {startDateInput || 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>

                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha de fin</Text>
                        <TouchableOpacity
                            style={[
                                styles.input,
                                { backgroundColor: isDark ? '#333' : '#f9f9f9', justifyContent: 'center' },
                                currentlyInRole && { opacity: 0.5 } // ✅ Correcto: aplica opacidad dentro del estilo
                            ]}
                            onPress={() => {
                                setDatePickerField('volunteerEnd');
                                setDatePickerVisible(true);
                            }}
                            disabled={currentlyInRole}
                        >
                            <Text style={{ color: endDateInput ? (isDark ? '#FFF' : '#333') : (isDark ? '#AAA' : '#999') }}>
                                {currentlyInRole ? 'Actualmente' : endDateInput || 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.checkboxContainer}>
                            <TouchableOpacity
                                style={[styles.checkbox, currentlyInRole && styles.checkboxChecked]}
                                onPress={() => setCurrentlyInRole(!currentlyInRole)}
                            >
                                {currentlyInRole && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </TouchableOpacity>
                            <Text style={[styles.checkboxLabel, { color: isDark ? '#FFF' : '#333' }]}>Actualmente en este rol</Text>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowVolunteerModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validateVolunteerFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        organization: orgInput,
                                        role: roleInput,
                                        cause: causeInput,
                                        description: descriptionInput,
                                        startDate: startDateInput,
                                        endDate: endDateInput,
                                        currentlyInRole,
                                    };
                                    if (editingVolunteer) {
                                        updateRecord(volunteerRecords, setVolunteerRecords, { ...editingVolunteer, ...newRecord }, 'volunteerRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(volunteerRecords, setVolunteerRecords, newRecord, 'volunteerRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowVolunteerModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingVolunteer ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showPublicationModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowPublicationModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Publicación</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Título</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Título de la publicación"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={pubTitleInput}
                            onChangeText={setPubTitleInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Editorial</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Nombre de la editorial"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={pubEditorialInput}
                            onChangeText={setPubEditorialInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Autor(es)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Autores"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={pubAuthorInput}
                            onChangeText={setPubAuthorInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Fecha</Text>
                        <TouchableOpacity
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', justifyContent: 'center' }]}
                            onPress={() => {
                                setDatePickerField('publicationDate');
                                setDatePickerVisible(true);
                            }}
                        >
                            <Text style={{ color: pubDateInput ? (isDark ? '#FFF' : '#333') : (isDark ? '#AAA' : '#999') }}>
                                {pubDateInput || 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>URL (opcional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Enlace a la publicación"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={pubUrlInput}
                            onChangeText={setPubUrlInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Resumen</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Resumen o abstract"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={pubAbstractInput}
                            onChangeText={setPubAbstractInput}
                            multiline
                            numberOfLines={3}
                        />
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowPublicationModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validatePublicationFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        title: pubTitleInput,
                                        editorial: pubEditorialInput,
                                        author: pubAuthorInput,
                                        date: pubDateInput,
                                        url: pubUrlInput,
                                        abstract: pubAbstractInput,
                                    };
                                    if (editingPublication) {
                                        updateRecord(publicationRecords, setPublicationRecords, { ...editingPublication, ...newRecord }, 'publicationRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(publicationRecords, setPublicationRecords, newRecord, 'publicationRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowPublicationModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingPublication ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {showLanguageModal && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowLanguageModal(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Idioma</Text>
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Idioma</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: isDark ? '#333' : '#f9f9f9', color: isDark ? '#FFF' : '#333' }]}
                            placeholder="Ej. Inglés, Francés"
                            placeholderTextColor={isDark ? '#AAA' : '#999'}
                            value={languageInput}
                            onChangeText={setLanguageInput}
                        />
                        <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>Nivel de dominio</Text>
                        {/* Reemplazamos el Picker por un TouchableOpacity que abre el modal personalizado */}
                        <TouchableOpacity
                            style={[
                                styles.input,
                                {
                                    backgroundColor: isDark ? '#333' : '#f9f9f9',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }
                            ]}
                            onPress={() => setShowLanguagePicker(true)} // 👈 Abre el modal personalizado
                        >
                            <Text style={{ color: languageProficiency ? (isDark ? '#FFF' : '#333') : (isDark ? '#AAA' : '#999') }}>
                                {languageProficiency || 'Seleccionar'}
                            </Text>
                            <Ionicons name="chevron-down" size={20} color={isDark ? '#AAA' : '#666'} />
                        </TouchableOpacity>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setShowLanguageModal(false)}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    const missingField = validateLanguageFields();
                                    if (showAlertIfMissingFields(missingField)) return;
                                    const newRecord = {
                                        language: languageInput,
                                        proficiency: languageProficiency,
                                    };
                                    if (editingLanguage) {
                                        updateRecord(languageRecords, setLanguageRecords, { ...editingLanguage, ...newRecord }, 'languageRecords');
                                        Alert.alert('Éxito', 'Registro actualizado');
                                    } else {
                                        addRecord(languageRecords, setLanguageRecords, newRecord, 'languageRecords');
                                        Alert.alert('Éxito', 'Registro guardado');
                                    }
                                    setShowLanguageModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>{editingLanguage ? 'Actualizar' : 'Agregar'}</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {/* Modal personalizado para seleccionar Nivel de dominio */}
            {showLanguagePicker && (
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setShowLanguagePicker(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={[styles.languagePickerModal, { backgroundColor: isDark ? '#222' : '#fff' }]}
                    >
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Nivel de dominio</Text>
                        {['Básico', 'Intermedio', 'Avanzado', 'Nativo'].map((level) => (
                            <TouchableOpacity
                                key={level}
                                style={[
                                    styles.languageOption,
                                    {
                                        backgroundColor: isDark ? '#333' : '#f9f9f9',
                                        marginVertical: 4,
                                        borderWidth: 1,
                                        borderColor: level === languageProficiency ? '#10b981' : 'transparent',
                                    }
                                ]}
                                onPress={() => {
                                    setLanguageProficiency(level);
                                    setShowLanguagePicker(false);
                                }}
                            >
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{level}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.languageOption,
                                { backgroundColor: isDark ? '#333' : '#f9f9f9', marginTop: 10, borderColor: 'transparent' }
                            ]}
                            onPress={() => {
                                setLanguageProficiency('');
                                setShowLanguagePicker(false);
                            }}
                        >
                            <Text style={{ color: isDark ? '#AAA' : '#666', fontStyle: 'italic' }}>Limpiar selección</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </TouchableOpacity>
            )}
            {/* DatePicker reutilizable */}
            {datePickerVisible && (
                <DateTimePicker
                    value={
                        datePickerField === 'volunteerStart' && startDateInput
                            ? new Date(startDateInput.split('/').reverse().join('-'))
                            : datePickerField === 'volunteerEnd' && endDateInput
                                ? new Date(endDateInput.split('/').reverse().join('-'))
                                : datePickerField === 'publicationDate' && pubDateInput
                                    ? new Date(pubDateInput.split('/').reverse().join('-'))
                                    : new Date()
                    }
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setDatePickerVisible(false);
                        if (selectedDate) {
                            const d = selectedDate;
                            const formatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
                            if (datePickerField === 'volunteerStart') {
                                setStartDateInput(formatted);
                            } else if (datePickerField === 'volunteerEnd') {
                                setEndDateInput(formatted);
                            } else if (datePickerField === 'publicationDate') {
                                setPubDateInput(formatted);
                            }
                        }
                        setDatePickerField(null);
                    }}
                />
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
    keyboardAvoidingContainer: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
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
    recordItem: {
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        position: 'relative',
    },
    recordActions: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
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
    editDeleteContainer: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    editButton: {
        backgroundColor: '#e8fbe8',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    deleteButton: {
        backgroundColor: '#fde8e8',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Estilos para el modal personalizado de idiomas
    languagePickerModal: {
        width: '80%',
        maxWidth: 300,
        maxHeight: 300,
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    languageOption: {
        width: '100%',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 2, // 👈 Añadido para resaltar la opción seleccionada
    },
    // === Estilos nuevos para las tarjetas de formación ===
    academicCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    technicalCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    complementaryCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        marginBottom: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    editButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d4f5e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // === Estilo nuevo para la tarjeta de experiencia laboral ===
    experienceCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    experienceDetails: {
        flex: 1,
        marginLeft: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 8,
    },
    detailValue: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 24,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 4,
    },
    dateValue: {
        fontSize: 12,
    },

    // === Estilos nuevos para la sección "Adicional" (Voluntariados, Publicaciones, Idiomas) ===
    volunteerCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    publicationCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    languageCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    cardLink: {
        fontSize: 14,
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
    cardAbstract: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 4,
    },
    // === Estilos nuevos para las tarjetas de formación ===
    academicCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    technicalCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    complementaryCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    iconContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        marginBottom: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    editButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#d4f5e0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // === Estilo nuevo para la tarjeta de experiencia laboral ===
    experienceCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    experienceDetails: {
        flex: 1,
        marginLeft: 12,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 8,
    },
    detailValue: {
        fontSize: 14,
        marginBottom: 8,
        marginLeft: 24,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 4,
    },
    dateValue: {
        fontSize: 12,
    },
});