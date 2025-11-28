import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    SectionList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import CountryInput from '../components/CountryInput';
import InstitutionsInput from '../components/InstitutionsInput';

interface Section {
    title: string;
    data: any[];
    key: string;
    component: (item: any) => React.ReactElement | null;
    onAdd?: () => void;
}

export default function ProfileScreen() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { t } = useTranslation();
    const { i18n } = useTranslation();

    const getLocalizedValue = (val: any) => {
        if (!val) return '';
        if (typeof val === 'object') {
            return val[i18n.language] || val['es'] || val['en'] || '';
        }
        return val;
    };

    const updateLocalizedField = (originalRecord: any, fieldName: string, newValue: string) => {
        const originalValue = originalRecord ? originalRecord[fieldName] : {};
        const valueObj = typeof originalValue === 'object' && originalValue !== null ? originalValue : { es: originalValue };
        return { ...valueObj, [i18n.language]: newValue };
    };

    // Imágenes
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [isBannerZoomVisible, setIsBannerZoomVisible] = useState(false);
    const [isProfileZoomVisible, setIsProfileZoomVisible] = useState(false);
    const [pendingImage, setPendingImage] = useState<{ uri: string, type: 'banner' | 'profile' } | null>(null);
    const [showImageConfirmation, setShowImageConfirmation] = useState(false);

    // Modales
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showComplementaryModal, setShowComplementaryModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showPublicationModal, setShowPublicationModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);

    // Date Pickers
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showPubDatePicker, setShowPubDatePicker] = useState(false);
    const [showAcademicStartDatePicker, setShowAcademicStartDatePicker] = useState(false);
    const [showAcademicEndDatePicker, setShowAcademicEndDatePicker] = useState(false);
    const [showTechnicalEndDatePicker, setShowTechnicalEndDatePicker] = useState(false);
    const [showComplementaryDatePicker, setShowComplementaryDatePicker] = useState(false);
    const [showExperienceStartDatePicker, setShowExperienceStartDatePicker] = useState(false);
    const [showExperienceEndDatePicker, setShowExperienceEndDatePicker] = useState(false);

    // Inputs
    const [nameInput, setNameInput] = useState('');
    const [birthDateInput, setBirthDateInput] = useState('');
    const [phoneInput, setPhoneInput] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documentNumberInput, setDocumentNumberInput] = useState('');
    const [gender, setGender] = useState('');
    const [degreeInput, setDegreeInput] = useState('');
    const [institutionInput, setInstitutionInput] = useState('');
    const [countryInput, setCountryInput] = useState('');
    const [startDateInput, setStartDateInput] = useState('');
    const [endDateInput, setEndDateInput] = useState('');
    const [academicStatus, setAcademicStatus] = useState<string>('Actualmente');
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
    const [currentlyInRole, setCurrentlyInRole] = useState(false);
    const [pubTitleInput, setPubTitleInput] = useState('');
    const [pubEditorialInput, setPubEditorialInput] = useState('');
    const [pubAuthorInput, setPubAuthorInput] = useState('');
    const [pubDateInput, setPubDateInput] = useState('');
    const [pubUrlInput, setPubUrlInput] = useState('');
    const [pubAbstractInput, setPubAbstractInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('');

    // Tabs & Menus
    const [activeTab, setActiveTab] = useState<'info' | 'formacion' | 'experiencia' | 'adicional'>('info');
    const [bannerMenuVisible, setBannerMenuVisible] = useState(false);
    const [profileMenuVisible, setProfileMenuVisible] = useState(false);

    // Data
    const [personalInfo, setPersonalInfo] = useState<any>({
        name: "Ethan Carter Murayari",
        birthDate: "12/03/1998",
        phone: "909882234",
        documentType: "DNI",
        documentNumber: "76456734",
        gender: "Masculino",
        email: "etcar@gmail.com"
    });
    const [academicRecords, setAcademicRecords] = useState<any[]>([]);
    const [technicalRecords, setTechnicalRecords] = useState<any[]>([]);
    const [complementaryRecords, setComplementaryRecords] = useState<any[]>([]);
    const [experienceRecords, setExperienceRecords] = useState<any[]>([]);
    const [volunteerRecords, setVolunteerRecords] = useState<any[]>([]);
    const [publicationRecords, setPublicationRecords] = useState<any[]>([]);
    const [languageRecords, setLanguageRecords] = useState<any[]>([]);
    const [sectionsData, setSectionsData] = useState<any[]>([]);

    // Editing
    const [editingPersonal, setEditingPersonal] = useState<any>(null);
    const [editingAcademic, setEditingAcademic] = useState<any>(null);
    const [editingTechnical, setEditingTechnical] = useState<any>(null);
    const [editingComplementary, setEditingComplementary] = useState<any>(null);
    const [editingExperience, setEditingExperience] = useState<any>(null);
    const [editingVolunteer, setEditingVolunteer] = useState<any>(null);
    const [editingPublication, setEditingPublication] = useState<any>(null);
    const [editingLanguage, setEditingLanguage] = useState<any>(null);

    useEffect(() => {
        const loadAllData = async () => {
            try {
                const savedBanner = await AsyncStorage.getItem('userBannerURL');
                if (savedBanner) setBannerImage(savedBanner);
                const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                if (savedPhoto) setProfileImage(savedPhoto);
                const savedPersonal = await AsyncStorage.getItem('personalInfo');
                if (savedPersonal) setPersonalInfo(JSON.parse(savedPersonal));
                const savedAcademic = await AsyncStorage.getItem('academicRecords');
                if (savedAcademic) setAcademicRecords(JSON.parse(savedAcademic));
                const savedTechnical = await AsyncStorage.getItem('technicalRecords');
                if (savedTechnical) setTechnicalRecords(JSON.parse(savedTechnical));
                const savedComplementary = await AsyncStorage.getItem('complementaryRecords');
                if (savedComplementary) setComplementaryRecords(JSON.parse(savedComplementary));
                const savedExperience = await AsyncStorage.getItem('experienceRecords');
                if (savedExperience) setExperienceRecords(JSON.parse(savedExperience));
                const savedVolunteer = await AsyncStorage.getItem('volunteerRecords');
                if (savedVolunteer) setVolunteerRecords(JSON.parse(savedVolunteer));
                const savedPublication = await AsyncStorage.getItem('publicationRecords');
                if (savedPublication) setPublicationRecords(JSON.parse(savedPublication));
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

    const pickImage = async (type: 'banner' | 'profile') => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: type === 'banner' ? [16, 9] : [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets?.[0]) {
            const uri = result.assets[0].uri;
            setPendingImage({ uri, type });
            setShowImageConfirmation(true);
        }
    };

    const takePhoto = async (type: 'banner' | 'profile') => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: type === 'banner' ? [16, 9] : [1, 1],
            quality: 1,
        });
        if (!result.canceled && result.assets?.[0]) {
            const uri = result.assets[0].uri;
            setPendingImage({ uri, type });
            setShowImageConfirmation(true);
        }
    };

    const confirmImage = async () => {
        if (pendingImage) {
            if (pendingImage.type === 'banner') {
                setBannerImage(pendingImage.uri);
                await AsyncStorage.setItem('userBannerURL', pendingImage.uri);
            } else {
                setProfileImage(pendingImage.uri);
                await AsyncStorage.setItem('userPhotoURL', pendingImage.uri);
            }
            setPendingImage(null);
            setShowImageConfirmation(false);
        }
    };

    const cancelImage = () => {
        setPendingImage(null);
        setShowImageConfirmation(false);
    };

    const showBannerMenu = () => setBannerMenuVisible(true);
    const closeBannerMenu = () => setBannerMenuVisible(false);
    const viewBannerImage = () => {
        if (bannerImage) {
            setIsBannerZoomVisible(true);
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

    const showProfileMenu = () => setProfileMenuVisible(true);
    const closeProfileMenu = () => setProfileMenuVisible(false);
    const viewProfileImage = () => {
        if (profileImage) {
            setIsProfileZoomVisible(true);
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

    const openPersonalModal = () => {
        if (personalInfo) {
            setNameInput(getLocalizedValue(personalInfo.name) || '');
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
            setDegreeInput(getLocalizedValue(record.degree) || '');
            setInstitutionInput(getLocalizedValue(record.institution) || '');
            setCountryInput(getLocalizedValue(record.country) || '');
            setStartDateInput(record.startDate || '');
            setEndDateInput(record.endDate || '');
            setAcademicStatus(record.status || 'CURRENT');
            setEditingAcademic(record);
        } else {
            setDegreeInput('');
            setInstitutionInput('');
            setCountryInput('');
            setStartDateInput('');
            setEndDateInput('');
            setAcademicStatus('CURRENT');
            setEditingAcademic(null);
        }
        setShowAcademicModal(true);
    };

    const openTechnicalModal = (record: any = null) => {
        if (record) {
            setCourseInput(getLocalizedValue(record.course) || '');
            setPlatformInput(getLocalizedValue(record.platform) || '');
            setDurationInput(getLocalizedValue(record.duration) || '');
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
            setActivityInput(getLocalizedValue(record.activity) || '');
            setDescriptionInput(getLocalizedValue(record.description) || '');
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
            setPositionInput(getLocalizedValue(record.position) || '');
            setInstitutionInput(getLocalizedValue(record.institution) || '');
            setAreaInput(getLocalizedValue(record.area) || '');
            setCountryInput(getLocalizedValue(record.country) || '');
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
            setOrgInput(getLocalizedValue(record.organization) || '');
            setRoleInput(getLocalizedValue(record.role) || '');
            setCauseInput(getLocalizedValue(record.cause) || '');
            setCurrentlyInRole(record.currentlyInRole || false);
            setStartDateInput(record.startDate || '');
            setEndDateInput(record.endDate || '');
            setDescriptionInput(getLocalizedValue(record.description) || '');
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
            setPubTitleInput(getLocalizedValue(record.title) || '');
            setPubEditorialInput(getLocalizedValue(record.editorial) || '');
            setPubAuthorInput(getLocalizedValue(record.author) || '');
            setPubDateInput(record.date || '');
            setPubUrlInput(record.url || '');
            setPubAbstractInput(getLocalizedValue(record.abstract) || '');
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
            setLanguageInput(getLocalizedValue(record.language) || '');
            setLanguageProficiency(getLocalizedValue(record.proficiency) || '');
            setEditingLanguage(record);
        } else {
            setLanguageInput('');
            setLanguageProficiency('');
            setEditingLanguage(null);
        }
        setShowLanguageModal(true);
    };

    const validatePersonalFields = () => {
        if (!nameInput.trim()) return t('profile.nameLabel');
        if (!birthDateInput.trim()) return t('profile.birthDateLabel');
        if (!phoneInput.trim()) return t('profile.phoneLabel');
        if (!documentType) return t('profile.documentTypeLabel');
        if (!documentNumberInput.trim()) return t('profile.documentNumberLabel');
        if (!gender) return t('profile.genderLabel');
        return null;
    };

    const validateAcademicFields = () => {
        if (!degreeInput.trim()) return t('profile.degreeLabel');
        if (!institutionInput.trim()) return t('profile.institutionLabel');
        if (!countryInput.trim()) return t('profile.countryLabel');
        if (!startDateInput.trim()) return t('profile.startDateLabel');
        if (!endDateInput.trim()) return t('profile.endDateLabel');
        if (!academicStatus) return t('profile.statusLabel');
        return null;
    };

    const validateTechnicalFields = () => {
        if (!courseInput.trim()) return t('profile.courseLabel');
        if (!platformInput.trim()) return t('profile.platformLabel');
        if (!durationInput.trim()) return t('profile.durationLabel');
        if (!endDateInput.trim()) return t('profile.endDateLabel');
        return null;
    };

    const validateComplementaryFields = () => {
        if (!activityInput.trim()) return t('profile.activityLabel');
        if (!descriptionInput.trim()) return t('profile.descriptionLabel');
        if (!dateInput.trim()) return t('profile.dateLabel');
        return null;
    };

    const validateExperienceFields = () => {
        if (!positionInput.trim()) return t('profile.positionLabel');
        if (!institutionInput.trim()) return t('profile.institutionLabel');
        if (!areaInput.trim()) return t('profile.areaLabel');
        if (!countryInput.trim()) return t('profile.countryLabel');
        if (!startDateInput.trim()) return t('profile.startDateLabel');
        if (!endDateInput.trim()) return t('profile.endDateLabel');
        return null;
    };

    const validateVolunteerFields = () => {
        if (!orgInput.trim()) return t('profile.organizationLabel');
        if (!roleInput.trim()) return t('profile.roleLabel');
        if (!causeInput.trim()) return t('profile.causeLabel');
        if (!startDateInput.trim()) return t('profile.startDateLabel');
        if (!endDateInput.trim()) return t('profile.endDateLabel');
        return null;
    };

    const validatePublicationFields = () => {
        if (!pubTitleInput.trim()) return t('profile.titleLabel');
        if (!pubEditorialInput.trim()) return t('profile.editorialLabel');
        if (!pubAuthorInput.trim()) return t('profile.authorLabel');
        if (!pubDateInput.trim()) return t('profile.dateLabel');
        return null;
    };

    const validateLanguageFields = () => {
        if (!languageInput.trim()) return t('profile.languageLabel');
        if (!languageProficiency) return t('profile.proficiencyLabel');
        return null;
    };

    const showAlertIfMissingFields = (missingField: string | null) => {
        if (missingField) {
            Alert.alert(t('profile.incompleteFieldsTitle'), `${t('profile.incompleteFieldsMessage')}: ${missingField}`);
            return true;
        }
        return false;
    };

    const renderSpecificItem = ({ section, item }: { section: Section; item: any }): React.ReactElement | null => {
        // Asegúrate de que section.component exista y sea una función.
        if (section.component && typeof section.component === 'function') {
            const rendered = section.component(item);
            // Siempre devuelve un elemento válido o null.
            return rendered as React.ReactElement | null;
        }
        // Si no hay componente, devuelve null para cumplir con el tipo esperado.
        return null;
    };

    useEffect(() => {
        let sections: Section[] = [];
        if (activeTab === 'info') {
            sections = [
                {
                    title: t('profile.personalSection'),
                    data: personalInfo ? [personalInfo] : [],
                    key: 'personal',
                    component: renderPersonalItem,
                    onAdd: () => openPersonalModal(),
                },
            ]
        } else if (activeTab === 'formacion') {
            sections = [
                {
                    title: t('profile.academicSection'),
                    data: academicRecords,
                    key: 'academic',
                    component: renderAcademicItem,
                    onAdd: () => openAcademicModal(),
                },
                {
                    title: t('profile.technicalSection'),
                    data: technicalRecords,
                    key: 'technical',
                    component: renderTechnicalItem,
                    onAdd: () => openTechnicalModal(),
                },
                {
                    title: t('profile.complementarySection'),
                    data: complementaryRecords,
                    key: 'complementary',
                    component: renderComplementaryItem,
                    onAdd: () => openComplementaryModal(),
                },
            ];
        } else if (activeTab === 'experiencia') {
            sections = [
                {
                    title: t('profile.experienceSection'),
                    data: experienceRecords,
                    key: 'experience',
                    component: renderExperienceItem,
                    onAdd: () => openExperienceModal(),
                },
            ];
        } else if (activeTab === 'adicional') {
            sections = [
                {
                    title: t('profile.volunteerSection'),
                    data: volunteerRecords,
                    key: 'volunteer',
                    component: renderVolunteerItem,
                    onAdd: () => openVolunteerModal(),
                },
                {
                    title: t('profile.publicationSection'),
                    data: publicationRecords,
                    key: 'publication',
                    component: renderPublicationItem,
                    onAdd: () => openPublicationModal(),
                },
                {
                    title: t('profile.languageSection'),
                    data: languageRecords,
                    key: 'language',
                    component: renderLanguageItem,
                    onAdd: () => openLanguageModal(),
                },
            ];
        }
        setSectionsData(sections);
    }, [
        activeTab,
        personalInfo,
        academicRecords,
        technicalRecords,
        complementaryRecords,
        experienceRecords,
        volunteerRecords,
        publicationRecords,
        languageRecords,
        isDark,
        t
    ]);

    // Render functions for items
    const renderPersonalItem = (record: any) => (
        <View style={[styles.personalInfoCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd', borderWidth: 1 }]}>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.nameLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.name)}</Text>
            </View>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.birthDateLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{record.birthDate}</Text>
            </View>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.phoneLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{record.phone}</Text>
            </View>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.documentTypeLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{record.documentType}</Text>
            </View>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.documentNumberLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{record.documentNumber}</Text>
            </View>
            <View style={styles.personalInfoRow}>
                <Text style={[styles.personalInfoLabel, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.genderLabel')}:</Text>
                <Text style={[styles.personalInfoValue, { color: isDark ? '#FFF' : '#333' }]}>{record.gender}</Text>
            </View>
            <TouchableOpacity style={styles.editIconAbsolute} onPress={() => openPersonalModal()}>
                <Ionicons name="pencil" size={20} color="#10b981" />
            </TouchableOpacity>
        </View>
    );
    const renderAcademicItem = (record: any) => {
        const getStatusLabel = (status: string) => {
            const map: { [key: string]: string } = {
                'Actualmente': 'current', 'CURRENT': 'current',
                'Graduado': 'graduated', 'GRADUATED': 'graduated',
                'Titulado': 'titled', 'TITLED': 'titled',
                'Trunco': 'truncated', 'TRUNCATED': 'truncated'
            };
            const key = map[status] || 'current';
            return t(`profile.status.${key}`);
        };

        return (
            <View key={record.id} style={[styles.academicCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="school" size={24} color="#10b981" />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.degree)}</Text>
                    <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}: {getLocalizedValue(record.institution)}</Text>
                    <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || t('profile.status.current')}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.statusLabel')}:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: ['Graduado', 'GRADUATED', 'Titulado', 'TITLED'].includes(record.status) ? '#10b981' : '#f59e0b' }]}>
                            <Text style={styles.statusBadgeText}>{getStatusLabel(record.status)}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.editButtonCircle} onPress={() => openAcademicModal(record)}>
                    <Ionicons name="pencil" size={18} color="#10b981" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderTechnicalItem = (record: any) => (
        <View key={record.id} style={[styles.technicalCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="construct" size={24} color="#10b981" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.course)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.platformLabel')}: {getLocalizedValue(record.platform)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.durationLabel')}: {getLocalizedValue(record.duration)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.finished')}: {record.endDate}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openTechnicalModal(record)}>
                <Ionicons name="pencil" size={18} color="#10b981" />
            </TouchableOpacity>
        </View>
    );

    const renderComplementaryItem = (record: any) => (
        <View key={record.id} style={[styles.complementaryCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="newspaper" size={24} color="#10b981" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.activity)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.descriptionLabel')}: {getLocalizedValue(record.description)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.dateLabel')}: {record.date}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openComplementaryModal(record)}>
                <Ionicons name="pencil" size={18} color="#10b981" />
            </TouchableOpacity>
        </View>
    );

    const renderExperienceItem = (record: any) => (
        <View key={record.id} style={[styles.experienceCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="briefcase" size={24} color="#10b981" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.position)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}: {getLocalizedValue(record.institution)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.areaLabel')}: {getLocalizedValue(record.area)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || t('profile.status.current')}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openExperienceModal(record)}>
                <Ionicons name="pencil" size={18} color="#10b981" />
            </TouchableOpacity>
        </View>
    );

    const renderVolunteerItem = (record: any) => (
        <View key={record.id} style={[styles.volunteerCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="people" size={24} color="#10b981" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.role)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.organizationLabel')}: {getLocalizedValue(record.organization)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.causeLabel')}: {getLocalizedValue(record.cause)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || (record.currentlyInRole ? t('profile.status.current') : '')}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openVolunteerModal(record)}>
                <Ionicons name="pencil" size={18} color="#10b981" />
            </TouchableOpacity>
        </View>
    );

    const renderPublicationItem = (record: any) => (
        <View key={record.id} style={[styles.publicationCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="book" size={24} color="#10b981" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.title)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.authorLabel')}: {getLocalizedValue(record.author)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.editorialLabel')}: {getLocalizedValue(record.editorial)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.dateLabel')}: {record.date}</Text>
                {record.url ? <Text style={[styles.cardLink, { color: isDark ? '#4fc3f7' : '#1976d2' }]}>{record.url}</Text> : null}
                {record.abstract ? <Text style={[styles.cardAbstract, { color: isDark ? '#AAA' : '#666' }]}>{getLocalizedValue(record.abstract)}</Text> : null}
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openPublicationModal(record)}>
                <Ionicons name="pencil" size={18} color="#10b981" />
            </TouchableOpacity>
        </View>
    );

    const renderLanguageItem = (record: any) => {
        const getProficiencyLabel = (code: string) => {
            const map: { [key: string]: string } = {
                'Básico': 'basic', 'BASIC': 'basic',
                'Intermedio': 'intermediate', 'INTERMEDIATE': 'intermediate',
                'Avanzado': 'advanced', 'ADVANCED': 'advanced',
                'Nativo': 'native', 'NATIVE': 'native'
            };
            const key = map[code];
            return key ? t(`profile.${key}`) : code;
        };

        return (
            <View key={record.id} style={[styles.languageCard, { backgroundColor: isDark ? '#222' : '#f9f9f9', borderColor: isDark ? '#444' : '#ddd' }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="language" size={24} color="#10b981" />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.language)}</Text>
                    <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.proficiencyLabel')}: {getProficiencyLabel(record.proficiency)}</Text>
                </View>
                <TouchableOpacity style={styles.editButtonCircle} onPress={() => openLanguageModal(record)}>
                    <Ionicons name="pencil" size={18} color="#10b981" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
            <View style={[styles.header, { backgroundColor: isDark ? '#111' : '#f5f5f5', borderBottomColor: isDark ? '#333' : '#ddd' }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSettings}>
                    <Ionicons name="settings" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={sectionsData}
                keyExtractor={(item) => item.id || Math.random().toString()}
                renderItem={renderSpecificItem}
                renderSectionHeader={({ section }) => (
                    <View style={styles.sectionHeaderContainer}>
                        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#333' }]}>
                            {section.title}
                        </Text>
                        {section.onAdd && (
                            <TouchableOpacity onPress={section.onAdd} style={styles.sectionAddButton}>
                                <Ionicons name="document-text-outline" size={20} color="#333" />
                                <View style={styles.plusBadge}>
                                    <Ionicons name="add" size={10} color="#333" />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                renderSectionFooter={({ section }) => {
                    if (section.data.length === 0) {
                        return <Text style={[styles.emptySectionText, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.emptySection')}</Text>;
                    }
                    return null;
                }}
                ListHeaderComponent={
                    <>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity onPress={showBannerMenu} style={styles.bannerContainer}>
                                <Image
                                    source={bannerImage ? { uri: bannerImage } : require('../assets/images/banner-volunteer.png')}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.editBannerButton}>
                                    <Ionicons name="camera" size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={showProfileMenu} style={styles.profileImageContainer}>
                                <Image
                                    source={profileImage ? { uri: profileImage } : require('../assets/images/avatar-default.png')}
                                    style={styles.profileImage}
                                />
                                <View style={styles.editProfileButton}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={[styles.fullName, { color: isDark ? '#FFF' : '#333' }]}>
                                {personalInfo?.name || t('profile.guestUser')}
                            </Text>
                            <Text style={[styles.roleText, { color: isDark ? '#AAA' : '#666' }]}>
                                {personalInfo?.role || t('profile.volunteerRole')}
                            </Text>
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                            <TouchableOpacity onPress={() => setActiveTab('info')} style={[styles.tabButton, activeTab === 'info' && styles.activeTabButton]}>
                                <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>{t('profile.personalInfo')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('formacion')} style={[styles.tabButton, activeTab === 'formacion' && styles.activeTabButton]}>
                                <Text style={[styles.tabText, activeTab === 'formacion' && styles.activeTabText]}>{t('profile.education')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('experiencia')} style={[styles.tabButton, activeTab === 'experiencia' && styles.activeTabButton]}>
                                <Text style={[styles.tabText, activeTab === 'experiencia' && styles.activeTabText]}>{t('profile.experience')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('adicional')} style={[styles.tabButton, activeTab === 'adicional' && styles.activeTabButton]}>
                                <Text style={[styles.tabText, activeTab === 'adicional' && styles.activeTabText]}>{t('profile.additional')}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                        <View style={styles.actionButtonsContainer}>
                            {activeTab === 'formacion' && (
                                <>
                                    {/* Buttons moved to section headers */}
                                </>
                            )}
                            {activeTab === 'experiencia' && (
                                <>
                                    {/* Buttons moved to section headers */}
                                </>
                            )}
                        </View>
                    </>
                }
            />

            {/* Banner Menu Modal */}
            <Modal visible={bannerMenuVisible} transparent={true} animationType="fade" onRequestClose={closeBannerMenu}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeBannerMenu}>
                    <View style={[styles.menuContainer, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <TouchableOpacity style={styles.menuItem} onPress={viewBannerImage}>
                            <Ionicons name="eye" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.viewImage')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={changeBannerFromGallery}>
                            <Ionicons name="images" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.chooseFromGallery')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={takeNewBannerPhoto}>
                            <Ionicons name="camera" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.takePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Profile Menu Modal */}
            <Modal visible={profileMenuVisible} transparent={true} animationType="fade" onRequestClose={closeProfileMenu}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeProfileMenu}>
                    <View style={[styles.menuContainer, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <TouchableOpacity style={styles.menuItem} onPress={viewProfileImage}>
                            <Ionicons name="eye" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.viewImage')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={changeProfileFromGallery}>
                            <Ionicons name="images" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.chooseFromGallery')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuItem} onPress={takeNewProfilePhoto}>
                            <Ionicons name="camera" size={20} color={isDark ? '#FFF' : '#333'} />
                            <Text style={[styles.menuText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.takePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* All Modals */}
            {/* Personal Info Modal */}
            <Modal visible={showPersonalInfoForm} animationType="slide" transparent={true} onRequestClose={() => setShowPersonalInfoForm(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.editPersonalInfo')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.nameLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={nameInput} onChangeText={setNameInput} placeholder={t('profile.namePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.birthDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{birthDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            setBirthDateInput(selectedDate.toISOString().split('T')[0]);
                                        }
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.phoneLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={phoneInput} onChangeText={setPhoneInput} placeholder={t('profile.phonePlaceholder')} keyboardType="phone-pad" placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.documentTypeLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Picker selectedValue={documentType} onValueChange={(itemValue) => setDocumentType(itemValue)} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label={t('profile.select')} value="" />
                                    <Picker.Item label="DNI" value="DNI" />
                                    <Picker.Item label="Pasaporte" value="Pasaporte" />
                                    <Picker.Item label="CE" value="CE" />
                                </Picker>
                            </View>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.documentNumberLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={documentNumberInput} onChangeText={setDocumentNumberInput} placeholder={t('profile.documentNumberPlaceholder')} keyboardType="numeric" placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.genderLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label={t('profile.select')} value="" />
                                    <Picker.Item label={t('profile.male')} value="Masculino" />
                                    <Picker.Item label={t('profile.female')} value="Femenino" />
                                    <Picker.Item label={t('profile.other')} value="Otro" />
                                </Picker>
                            </View>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowPersonalInfoForm(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validatePersonalFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newPersonal = {
                                        ...personalInfo,
                                        name: updateLocalizedField(personalInfo, 'name', nameInput),
                                        birthDate: birthDateInput,
                                        phone: phoneInput,
                                        documentType,
                                        documentNumber: documentNumberInput,
                                        gender
                                    };
                                    setPersonalInfo(newPersonal);
                                    saveToStorage('personalInfo', newPersonal);
                                    setShowPersonalInfoForm(false);
                                }}>
                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>


                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Academic Modal */}
            <Modal visible={showAcademicModal} animationType="slide" transparent={true} onRequestClose={() => setShowAcademicModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingAcademic ? t('profile.editAcademic') : t('profile.addAcademic')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.degreeLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={degreeInput} onChangeText={setDegreeInput} placeholder={t('profile.degreePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.institutionLabel')}</Text>
                            <InstitutionsInput value={institutionInput} onValueChange={setInstitutionInput} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.countryLabel')}</Text>
                            <CountryInput value={countryInput} onValueChange={setCountryInput} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowAcademicStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showAcademicStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowAcademicStartDatePicker(false);
                                        if (selectedDate) setStartDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowAcademicEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showAcademicEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowAcademicEndDatePicker(false);
                                        if (selectedDate) setEndDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.statusLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Picker selectedValue={academicStatus} onValueChange={(itemValue) => setAcademicStatus(itemValue)} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label={t('profile.currently')} value="CURRENT" />
                                    <Picker.Item label={t('profile.graduated')} value="GRADUATED" />
                                    <Picker.Item label={t('profile.titled')} value="TITLED" />
                                    <Picker.Item label={t('profile.truncated')} value="TRUNCATED" />
                                </Picker>
                            </View>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAcademicModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateAcademicFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = { degree: degreeInput, institution: institutionInput, country: countryInput, startDate: startDateInput, endDate: endDateInput, status: academicStatus };
                                    if (editingAcademic) updateRecord(academicRecords, setAcademicRecords, { ...editingAcademic, ...record }, 'academicRecords');
                                    else addRecord(academicRecords, setAcademicRecords, record, 'academicRecords');
                                    setShowAcademicModal(false);
                                }}>
                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Technical Modal */}
            <Modal visible={showTechnicalModal} animationType="slide" transparent={true} onRequestClose={() => setShowTechnicalModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingTechnical ? t('profile.editTechnical') : t('profile.addTechnical')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.courseLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={courseInput} onChangeText={setCourseInput} placeholder={t('profile.coursePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.platformLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={platformInput} onChangeText={setPlatformInput} placeholder={t('profile.platformPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.durationLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={durationInput} onChangeText={setDurationInput} placeholder={t('profile.durationPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowTechnicalEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showTechnicalEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowTechnicalEndDatePicker(false);
                                        if (selectedDate) setEndDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowTechnicalModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateTechnicalFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = {
                                        course: updateLocalizedField(editingTechnical, 'course', courseInput),
                                        platform: updateLocalizedField(editingTechnical, 'platform', platformInput),
                                        duration: updateLocalizedField(editingTechnical, 'duration', durationInput),
                                        endDate: endDateInput
                                    };
                                    if (editingTechnical) updateRecord(technicalRecords, setTechnicalRecords, { ...editingTechnical, ...record }, 'technicalRecords');
                                    else addRecord(technicalRecords, setTechnicalRecords, record, 'technicalRecords');
                                    setShowTechnicalModal(false);
                                }}>


                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Complementary Modal */}
            <Modal visible={showComplementaryModal} animationType="slide" transparent={true} onRequestClose={() => setShowComplementaryModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingComplementary ? t('profile.editComplementary') : t('profile.addComplementary')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.activityLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={activityInput} onChangeText={setActivityInput} placeholder={t('profile.activityPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.descriptionLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd', height: 80 }]} value={descriptionInput} onChangeText={setDescriptionInput} placeholder={t('profile.descriptionPlaceholder')} multiline placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.dateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowComplementaryDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{dateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showComplementaryDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowComplementaryDatePicker(false);
                                        if (selectedDate) setDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowComplementaryModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateComplementaryFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = { activity: activityInput, description: descriptionInput, date: dateInput };
                                    if (editingComplementary) updateRecord(complementaryRecords, setComplementaryRecords, { ...editingComplementary, ...record }, 'complementaryRecords');
                                    else addRecord(complementaryRecords, setComplementaryRecords, record, 'complementaryRecords');
                                    setShowComplementaryModal(false);
                                }}>
                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Experience Modal */}
            <Modal visible={showExperienceModal} animationType="slide" transparent={true} onRequestClose={() => setShowExperienceModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingExperience ? t('profile.editExperience') : t('profile.addExperience')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.positionLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={positionInput} onChangeText={setPositionInput} placeholder={t('profile.positionPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.institutionLabel')}</Text>
                            <InstitutionsInput value={institutionInput} onValueChange={setInstitutionInput} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.areaLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={areaInput} onChangeText={setAreaInput} placeholder={t('profile.areaPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.countryLabel')}</Text>
                            <CountryInput value={countryInput} onValueChange={setCountryInput} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowExperienceStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showExperienceStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowExperienceStartDatePicker(false);
                                        if (selectedDate) setStartDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowExperienceEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showExperienceEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowExperienceEndDatePicker(false);
                                        if (selectedDate) setEndDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowExperienceModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateExperienceFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = {
                                        position: updateLocalizedField(editingExperience, 'position', positionInput),
                                        institution: updateLocalizedField(editingExperience, 'institution', institutionInput),
                                        area: updateLocalizedField(editingExperience, 'area', areaInput),
                                        country: updateLocalizedField(editingExperience, 'country', countryInput),
                                        startDate: startDateInput,
                                        endDate: endDateInput
                                    };
                                    if (editingExperience) updateRecord(experienceRecords, setExperienceRecords, { ...editingExperience, ...record }, 'experienceRecords');
                                    else addRecord(experienceRecords, setExperienceRecords, record, 'experienceRecords');
                                    setShowExperienceModal(false);
                                }}>


                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Volunteer Modal */}
            <Modal visible={showVolunteerModal} animationType="slide" transparent={true} onRequestClose={() => setShowVolunteerModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingVolunteer ? t('profile.editVolunteer') : t('profile.addVolunteer')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.organizationLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={orgInput} onChangeText={setOrgInput} placeholder={t('profile.organizationPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.roleLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={roleInput} onChangeText={setRoleInput} placeholder={t('profile.rolePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.causeLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={causeInput} onChangeText={setCauseInput} placeholder={t('profile.causePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartDatePicker(false);
                                        if (selectedDate) setStartDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndDatePicker(false);
                                        if (selectedDate) setEndDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowVolunteerModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateVolunteerFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = { organization: orgInput, role: roleInput, cause: causeInput, startDate: startDateInput, endDate: endDateInput, currentlyInRole };
                                    if (editingVolunteer) updateRecord(volunteerRecords, setVolunteerRecords, { ...editingVolunteer, ...record }, 'volunteerRecords');
                                    else addRecord(volunteerRecords, setVolunteerRecords, record, 'volunteerRecords');
                                    setShowVolunteerModal(false);
                                }}>
                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Publication Modal */}
            <Modal visible={showPublicationModal} animationType="slide" transparent={true} onRequestClose={() => setShowPublicationModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingPublication ? t('profile.editPublication') : t('profile.addPublication')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.titleLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={pubTitleInput} onChangeText={setPubTitleInput} placeholder={t('profile.titlePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.editorialLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={pubEditorialInput} onChangeText={setPubEditorialInput} placeholder={t('profile.editorialPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.authorLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={pubAuthorInput} onChangeText={setPubAuthorInput} placeholder={t('profile.authorPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.dateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowPubDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{pubDateInput || t('profile.selectDate')}</Text>
                            </TouchableOpacity>
                            {showPubDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowPubDatePicker(false);
                                        if (selectedDate) setPubDateInput(selectedDate.toISOString().split('T')[0]);
                                    }}
                                />
                            )}
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.urlLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={pubUrlInput} onChangeText={setPubUrlInput} placeholder={t('profile.urlPlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.abstractLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd', height: 80 }]} value={pubAbstractInput} onChangeText={setPubAbstractInput} placeholder={t('profile.abstractPlaceholder')} multiline placeholderTextColor={isDark ? '#666' : '#999'} />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowPublicationModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validatePublicationFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = {
                                        title: updateLocalizedField(editingPublication, 'title', pubTitleInput),
                                        editorial: updateLocalizedField(editingPublication, 'editorial', pubEditorialInput),
                                        author: updateLocalizedField(editingPublication, 'author', pubAuthorInput),
                                        date: pubDateInput,
                                        url: pubUrlInput,
                                        abstract: updateLocalizedField(editingPublication, 'abstract', pubAbstractInput)
                                    };
                                    if (editingPublication) updateRecord(publicationRecords, setPublicationRecords, { ...editingPublication, ...record }, 'publicationRecords');
                                    else addRecord(publicationRecords, setPublicationRecords, record, 'publicationRecords');
                                    setShowPublicationModal(false);
                                }}>


                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Language Modal */}
            <Modal visible={showLanguageModal} animationType="slide" transparent={true} onRequestClose={() => setShowLanguageModal(false)}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingLanguage ? t('profile.editLanguage') : t('profile.addLanguage')}</Text>
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.languageLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#ddd' }]} value={languageInput} onChangeText={setLanguageInput} placeholder={t('profile.languagePlaceholder')} placeholderTextColor={isDark ? '#666' : '#999'} />
                            <Text style={[styles.label, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.proficiencyLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#ddd' }]}>
                                <Picker selectedValue={languageProficiency} onValueChange={(itemValue) => setLanguageProficiency(itemValue)} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label={t('profile.select')} value="" />
                                    <Picker.Item label={t('profile.basic')} value="BASIC" />
                                    <Picker.Item label={t('profile.intermediate')} value="INTERMEDIATE" />
                                    <Picker.Item label={t('profile.advanced')} value="ADVANCED" />
                                    <Picker.Item label={t('profile.native')} value="NATIVE" />
                                </Picker>
                            </View>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLanguageModal(false)}>
                                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={() => {
                                    const error = validateLanguageFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const record = { language: languageInput, proficiency: languageProficiency };
                                    if (editingLanguage) updateRecord(languageRecords, setLanguageRecords, { ...editingLanguage, ...record }, 'languageRecords');
                                    else addRecord(languageRecords, setLanguageRecords, record, 'languageRecords');
                                    setShowLanguageModal(false);
                                }}>
                                    <Text style={styles.saveButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Image Zoom Viewers */}
            {isBannerZoomVisible && bannerImage && (
                <Modal visible={true} transparent={true} onRequestClose={() => setIsBannerZoomVisible(false)}>
                    <ImageViewer imageUrls={[{ url: bannerImage }]} enableSwipeDown onSwipeDown={() => setIsBannerZoomVisible(false)} />
                </Modal>
            )}
            {isProfileZoomVisible && profileImage && (
                <Modal visible={true} transparent={true} onRequestClose={() => setIsProfileZoomVisible(false)}>
                    <ImageViewer imageUrls={[{ url: profileImage }]} enableSwipeDown onSwipeDown={() => setIsProfileZoomVisible(false)} />
                </Modal>
            )}

            {/* Image Confirmation Modal */}
            <Modal visible={showImageConfirmation} transparent={true} animationType="fade" onRequestClose={cancelImage}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF', alignItems: 'center' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333', marginBottom: 20 }]}>
                            {t('common.warning')}
                        </Text>
                        {pendingImage && (
                            <Image
                                source={{ uri: pendingImage.uri }}
                                style={{
                                    width: 200,
                                    height: pendingImage.type === 'banner' ? 112 : 200,
                                    borderRadius: pendingImage.type === 'banner' ? 8 : 100,
                                    marginBottom: 20,
                                    resizeMode: 'cover'
                                }}
                            />
                        )}
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelImage}>
                                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={confirmImage}>
                                <Text style={styles.saveButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    headerContainer: { height: 200, position: 'relative' },
    bannerContainer: { height: 200 },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    editBannerButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: '#10b981',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageContainer: {
        position: 'absolute',
        bottom: -50,
        left: 16,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#fff',
    },
    editProfileButton: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        backgroundColor: '#10b981',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        marginTop: 60,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    fullName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    roleText: {
        fontSize: 16,
    },
    tabsContainer: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    tabButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
    },
    activeTabButton: {
        backgroundColor: '#10b981',
    },
    tabText: {
        fontSize: 14,
        color: '#333',
    },
    activeTabText: {
        color: '#fff',
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 6,
    },
    content: {
        paddingBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#f9f9f9',
        marginHorizontal: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
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
    experienceCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
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
    cardLink: {
        fontSize: 14,
        color: '#1976d2',
        textDecorationLine: 'underline',
        marginBottom: 4,
    },
    cardAbstract: {
        fontSize: 14,
        fontStyle: 'italic',
        marginTop: 4,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontSize: 16,
        paddingHorizontal: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    saveButton: {
        backgroundColor: '#10b981',
    },
    cancelButtonText: {
        color: '#333',
        fontWeight: 'bold',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    menuContainer: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
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
    },
    personalInfoCard: {
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        marginHorizontal: 16,
        position: 'relative',
    },
    personalInfoRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    personalInfoLabel: {
        fontSize: 14,
        width: 80,
        fontWeight: '600',
    },
    personalInfoValue: {
        fontSize: 14,
        flex: 1,
    },
    editIconAbsolute: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    sectionAddButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#e6f4ea', // Light green background
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    plusBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: 'transparent',
    },
    emptySectionText: {
        paddingHorizontal: 16,
        marginBottom: 16,
        fontSize: 14,
        fontStyle: 'italic',
    },
});
