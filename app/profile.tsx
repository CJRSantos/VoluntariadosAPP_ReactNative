import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as FileSystem from 'expo-file-system';
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
import Autocomplete from 'react-native-autocomplete-input';
import ImageViewer from 'react-native-image-zoom-viewer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import { auth } from '../src/config/firebaseConfig';
import institutionsData from '../src/constants/Institutions.json';
import countriesData from '../src/constants/countries.json';

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

    // Auto-complete Data
    const [filteredInstitutions, setFilteredInstitutions] = useState<string[]>([]);
    const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
    const [hideResultsInstitution, setHideResultsInstitution] = useState(true);
    const [hideResultsCountry, setHideResultsCountry] = useState(true);

    const findInstitution = (query: string) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredInstitutions(institutionsData.filter((item) => item.search(regex) >= 0));
        } else {
            setFilteredInstitutions([]);
        }
    };

    const findCountry = (query: string) => {
        if (query) {
            const regex = new RegExp(`${query.trim()}`, 'i');
            setFilteredCountries(countriesData.filter((item) => item.search(regex) >= 0));
        } else {
            setFilteredCountries([]);
        }
    };



    useEffect(() => {
        const loadAllData = async () => {
            try {
                const savedBanner = await AsyncStorage.getItem('userBannerURL');
                if (savedBanner) setBannerImage(savedBanner);
                const savedPhoto = await AsyncStorage.getItem('userPhotoURL');
                if (savedPhoto) setProfileImage(savedPhoto);

                const safeParse = (data: string | null, fallback: any = []) => {
                    try {
                        return data ? JSON.parse(data) : fallback;
                    } catch (e) {
                        console.warn('Error parsing data:', e);
                        return fallback;
                    }
                };

                const savedPersonal = await AsyncStorage.getItem('personalInfo');
                if (savedPersonal) {
                    setPersonalInfo(safeParse(savedPersonal, {}));
                } else if (auth.currentUser) {
                    // Fallback to auth data if no local data
                    setPersonalInfo({
                        name: { es: auth.currentUser.displayName || '', en: auth.currentUser.displayName || '' },
                        email: auth.currentUser.email || '',
                        // Keep other fields empty or default
                        birthDate: '',
                        phone: '',
                        documentType: '',
                        documentNumber: '',
                        gender: ''
                    });
                }
                const savedAcademic = await AsyncStorage.getItem('academicRecords');
                if (savedAcademic) setAcademicRecords(safeParse(savedAcademic));
                const savedTechnical = await AsyncStorage.getItem('technicalRecords');
                if (savedTechnical) setTechnicalRecords(safeParse(savedTechnical));
                const savedComplementary = await AsyncStorage.getItem('complementaryRecords');
                if (savedComplementary) setComplementaryRecords(safeParse(savedComplementary));
                const savedExperience = await AsyncStorage.getItem('experienceRecords');
                if (savedExperience) setExperienceRecords(safeParse(savedExperience));
                const savedVolunteer = await AsyncStorage.getItem('volunteerRecords');
                if (savedVolunteer) setVolunteerRecords(safeParse(savedVolunteer));
                const savedPublication = await AsyncStorage.getItem('publicationRecords');
                if (savedPublication) setPublicationRecords(safeParse(savedPublication));
                const savedLanguage = await AsyncStorage.getItem('languageRecords');
                if (savedLanguage) setLanguageRecords(safeParse(savedLanguage));
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

    const saveImageToPermanentStorage = async (uri: string, targetFilename: string): Promise<string> => {
        try {
            const documentDirectory = (FileSystem as any).documentDirectory;

            if (!documentDirectory) {
                console.warn('documentDirectory is null');
                return uri;
            }

            // Make sure the images directory exists
            const extractPath = documentDirectory + 'images/';
            const dirInfo = await FileSystem.getInfoAsync(extractPath);
            if (!dirInfo.exists) {
                await FileSystem.makeDirectoryAsync(extractPath, { intermediates: true });
            }

            const newPath = extractPath + targetFilename;

            // Delete existing file if it exists (cleanup/overwrite)
            const fileInfo = await FileSystem.getInfoAsync(newPath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(newPath, { idempotent: true });
            }

            await FileSystem.copyAsync({
                from: uri,
                to: newPath
            });

            return newPath;
        } catch (error) {
            console.error('Error saving image:', error);
            Alert.alert(t('common.error'), t('profile.errorSavingImage'));
            return uri; // Return original URI if save fails, but user is warned
        }
    };

    const confirmImage = async () => {
        if (pendingImage) {
            // Use fixed filenames to prevent duplication and ensure consistency
            const filename = pendingImage.type === 'banner' ? 'banner.jpg' : 'profile.jpg';
            const permanentUri = await saveImageToPermanentStorage(pendingImage.uri, filename);

            if (pendingImage.type === 'banner') {
                setBannerImage(permanentUri);
                await AsyncStorage.setItem('userBannerURL', permanentUri);
            } else {
                setProfileImage(permanentUri);
                await AsyncStorage.setItem('userPhotoURL', permanentUri);
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
            Alert.alert("", `${t('profile.missingFieldsMessage')}: ${missingField}`);
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
        <View style={[styles.personalInfoCard, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
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
                <Ionicons name="pencil" size={20} color="#4CAF50" />
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
            <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="school" size={24} color="#4CAF50" />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.degree)}</Text>
                    <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}: {getLocalizedValue(record.institution)}</Text>
                    <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || t('profile.status.current')}</Text>
                    <View style={styles.statusContainer}>
                        <Text style={[styles.statusText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.statusLabel')}:</Text>
                        <View style={[styles.statusBadge, { backgroundColor: ['Graduado', 'GRADUATED', 'Titulado', 'TITLED'].includes(record.status) ? '#4CAF50' : '#f59e0b' }]}>
                            <Text style={styles.statusBadgeText}>{getStatusLabel(record.status)}</Text>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.editButtonCircle} onPress={() => openAcademicModal(record)}>
                    <Ionicons name="pencil" size={18} color="#4CAF50" />
                </TouchableOpacity>
            </View>
        );
    };

    const renderTechnicalItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="construct" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.course)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.platformLabel')}: {getLocalizedValue(record.platform)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.durationLabel')}: {getLocalizedValue(record.duration)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.finished')}: {record.endDate}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openTechnicalModal(record)}>
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    const renderComplementaryItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="newspaper" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.activity)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.descriptionLabel')}: {getLocalizedValue(record.description)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.dateLabel')}: {record.date}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openComplementaryModal(record)}>
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    const renderExperienceItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="briefcase" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.position)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}: {getLocalizedValue(record.institution)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.areaLabel')}: {getLocalizedValue(record.area)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || t('profile.status.current')}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openExperienceModal(record)}>
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    const renderVolunteerItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="people" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.role)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.organizationLabel')}: {getLocalizedValue(record.organization)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.causeLabel')}: {getLocalizedValue(record.cause)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.timeLabel')}: {record.startDate} - {record.endDate || (record.currentlyInRole ? t('profile.status.current') : '')}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openVolunteerModal(record)}>
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    const renderPublicationItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="book" size={24} color="#4CAF50" />
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
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    const renderLanguageItem = (record: any) => (
        <View key={record.id} style={[styles.card, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#E0E0E0' }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="language" size={24} color="#4CAF50" />
            </View>
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(record.language)}</Text>
                <Text style={[styles.cardSubtitle, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.proficiencyLabel')}: {getLocalizedValue(record.proficiency)}</Text>
            </View>
            <TouchableOpacity style={styles.editButtonCircle} onPress={() => openLanguageModal(record)}>
                <Ionicons name="pencil" size={18} color="#4CAF50" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <View style={[styles.header, { backgroundColor: isDark ? '#111' : '#E0E0E0', borderBottomColor: isDark ? '#333' : '#CCC' }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('Perfil')}</Text>
                <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
                    <Ionicons name="settings-outline" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
            </View>

            <SectionList
                sections={sectionsData}
                keyExtractor={(item, index) => item.id || index.toString()}
                renderItem={renderSpecificItem}
                renderSectionHeader={({ section: { title, onAdd } }) => (
                    <View style={[styles.sectionHeaderContainer, { backgroundColor: isDark ? '#000' : '#fff' }]}>
                        <Text style={[styles.sectionHeader, { color: isDark ? '#FFF' : '#333' }]}>{title}</Text>
                        {onAdd && (
                            <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                                <Ionicons name="add" size={24} color="#FFF" />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                ListHeaderComponent={
                    <View>
                        <View style={styles.bannerContainer}>
                            <TouchableOpacity onPress={showBannerMenu} style={styles.bannerTouchable}>
                                <Image
                                    source={bannerImage ? { uri: bannerImage } : require('../assets/images/banner.png')}
                                    style={styles.bannerImage}
                                />
                                <View style={styles.cameraIconContainer}>
                                    <Ionicons name="camera" size={20} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileImageContainer}>
                            <TouchableOpacity onPress={showProfileMenu} style={styles.profileTouchable}>
                                <Image
                                    source={profileImage ? { uri: profileImage } : require('../assets/images/avatar_default.png')}
                                    style={[styles.profileImage, { borderColor: isDark ? '#000' : '#fff' }]}
                                />
                                <View style={styles.profileCameraIcon}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.nameContainer}>
                            <Text style={[styles.nameText, { color: isDark ? '#FFF' : '#333' }]}>{getLocalizedValue(personalInfo?.name) || t('profile.defaultName')}</Text>
                            <Text style={[styles.emailText, { color: isDark ? '#AAA' : '#666' }]}>{personalInfo?.email || t('profile.defaultEmail')}</Text>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
                            <TouchableOpacity onPress={() => setActiveTab('info')} style={[styles.tabButton, activeTab === 'info' && styles.tabButtonActive]}>
                                <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.tab.info')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('formacion')} style={[styles.tabButton, activeTab === 'formacion' && styles.tabButtonActive]}>
                                <Text style={[styles.tabText, activeTab === 'formacion' && styles.tabTextActive, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.tab.education')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('experiencia')} style={[styles.tabButton, activeTab === 'experiencia' && styles.tabButtonActive]}>
                                <Text style={[styles.tabText, activeTab === 'experiencia' && styles.tabTextActive, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.tab.experience')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setActiveTab('adicional')} style={[styles.tabButton, activeTab === 'adicional' && styles.tabButtonActive]}>
                                <Text style={[styles.tabText, activeTab === 'adicional' && styles.tabTextActive, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.tab.additional')}</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                }
                contentContainerStyle={styles.listContent}
            />

            {/* Modales de Menú de Imágenes */}
            <Modal visible={bannerMenuVisible} transparent animationType="fade" onRequestClose={closeBannerMenu}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeBannerMenu}>
                    <View style={[styles.menuModalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <TouchableOpacity style={styles.menuOption} onPress={viewBannerImage}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.viewImage')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuOption} onPress={changeBannerFromGallery}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('Abrir Galería')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuOption} onPress={takeNewBannerPhoto}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.takePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            <Modal visible={profileMenuVisible} transparent animationType="fade" onRequestClose={closeProfileMenu}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={closeProfileMenu}>
                    <View style={[styles.menuModalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <TouchableOpacity style={styles.menuOption} onPress={viewProfileImage}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.viewImage')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuOption} onPress={changeProfileFromGallery}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('Abrir Galería')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.menuOption} onPress={takeNewProfilePhoto}>
                            <Text style={[styles.menuOptionText, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.takePhoto')}</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Visores de Imagen */}
            <Modal visible={isBannerZoomVisible} transparent={true} onRequestClose={() => setIsBannerZoomVisible(false)}>
                <ImageViewer imageUrls={[{ url: bannerImage || '' }]} onSwipeDown={() => setIsBannerZoomVisible(false)} enableSwipeDown={true} />
            </Modal>
            <Modal visible={isProfileZoomVisible} transparent={true} onRequestClose={() => setIsProfileZoomVisible(false)}>
                <ImageViewer imageUrls={[{ url: profileImage || '' }]} onSwipeDown={() => setIsProfileZoomVisible(false)} enableSwipeDown={true} />
            </Modal>

            {/* Confirmación de Imagen */}
            <Modal visible={showImageConfirmation} transparent animationType="slide">
                <View style={styles.confirmationOverlay}>
                    <View style={[styles.confirmationContainer, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <Text style={[styles.confirmationTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.confirmImageTitle')}</Text>
                        {pendingImage && (
                            <Image source={{ uri: pendingImage.uri }} style={styles.previewImage} />
                        )}
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity style={[styles.confirmButton, styles.cancelButton]} onPress={cancelImage}>
                                <Text style={styles.confirmButtonText}>{t('common.cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={confirmImage}>
                                <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modales de Formularios - Simplificados para brevedad, pero con estilos actualizados */}
            {/* Personal Info Modal */}
            <Modal visible={showPersonalInfoForm} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('profile.editPersonalTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.nameLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={nameInput} onChangeText={setNameInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.birthDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{birthDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowDatePicker(false);
                                        if (date) setBirthDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.phoneLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={phoneInput} onChangeText={setPhoneInput} keyboardType="phone-pad" />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.documentTypeLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Picker selectedValue={documentType} onValueChange={setDocumentType} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label="DNI" value="DNI" />
                                    <Picker.Item label="Pasaporte" value="Pasaporte" />
                                    <Picker.Item label="CE" value="CE" />
                                </Picker>
                            </View>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.documentNumberLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={documentNumberInput} onChangeText={setDocumentNumberInput} keyboardType="numeric" />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.genderLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Picker selectedValue={gender} onValueChange={setGender} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label="Masculino" value="Masculino" />
                                    <Picker.Item label="Femenino" value="Femenino" />
                                    <Picker.Item label="Otro" value="Otro" />
                                </Picker>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowPersonalInfoForm(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validatePersonalFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newInfo = {
                                        ...personalInfo,
                                        name: updateLocalizedField(personalInfo, 'name', nameInput),
                                        birthDate: birthDateInput,
                                        phone: phoneInput,
                                        documentType,
                                        documentNumber: documentNumberInput,
                                        gender
                                    };
                                    setPersonalInfo(newInfo);
                                    saveToStorage('personalInfo', newInfo);
                                    setShowPersonalInfoForm(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Academic Modal */}
            <Modal visible={showAcademicModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView keyboardShouldPersistTaps="always">
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingAcademic ? t('profile.editAcademicTitle') : t('profile.addAcademicTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.degreeLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={degreeInput} onChangeText={setDegreeInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}</Text>
                            <View style={styles.autocompleteContainer}>
                                <Autocomplete
                                    data={filteredInstitutions}
                                    defaultValue={institutionInput}
                                    onChangeText={(text) => {
                                        setInstitutionInput(text);
                                        findInstitution(text);
                                        setHideResultsInstitution(false);
                                    }}
                                    hideResults={hideResultsInstitution}
                                    renderResultList={({ data }) => (
                                        data && data.length > 0 ? (
                                            <View style={{ maxHeight: 150, borderWidth: 1, borderColor: '#DDD' }}>
                                                {(data as string[]).map((item: string, idx: number) => (
                                                    <TouchableOpacity key={idx} onPress={() => {
                                                        setInstitutionInput(item);
                                                        setHideResultsInstitution(true);
                                                    }}>
                                                        <Text style={styles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ) : null
                                    )}
                                    inputContainerStyle={[styles.input, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9', borderWidth: 0 }]}
                                    style={{ backgroundColor: 'transparent', color: isDark ? '#FFF' : '#333' }}
                                />
                            </View>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.countryLabel')}</Text>
                            <View style={styles.autocompleteContainer}>
                                <Autocomplete
                                    data={filteredCountries}
                                    defaultValue={countryInput}
                                    onChangeText={(text) => {
                                        setCountryInput(text);
                                        findCountry(text);
                                        setHideResultsCountry(false);
                                    }}
                                    hideResults={hideResultsCountry}
                                    renderResultList={({ data }) => (
                                        data && data.length > 0 ? (
                                            <View style={{ maxHeight: 150, borderWidth: 1, borderColor: '#DDD' }}>
                                                {(data as string[]).map((item: string, idx: number) => (
                                                    <TouchableOpacity key={idx} onPress={() => {
                                                        setCountryInput(item);
                                                        setHideResultsCountry(true);
                                                    }}>
                                                        <Text style={styles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ) : null
                                    )}
                                    inputContainerStyle={[styles.input, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9', borderWidth: 0 }]}
                                    style={{ backgroundColor: 'transparent', color: isDark ? '#FFF' : '#333' }}
                                />
                            </View>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowAcademicStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showAcademicStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowAcademicStartDatePicker(false);
                                        if (date) setStartDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowAcademicEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showAcademicEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowAcademicEndDatePicker(false);
                                        if (date) setEndDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.statusLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Picker selectedValue={academicStatus} onValueChange={setAcademicStatus} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label="Actualmente" value="Actualmente" />
                                    <Picker.Item label="Graduado" value="Graduado" />
                                    <Picker.Item label="Titulado" value="Titulado" />
                                    <Picker.Item label="Trunco" value="Trunco" />
                                </Picker>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowAcademicModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateAcademicFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        degree: editingAcademic ? updateLocalizedField(editingAcademic, 'degree', degreeInput) : { [i18n.language]: degreeInput },
                                        institution: editingAcademic ? updateLocalizedField(editingAcademic, 'institution', institutionInput) : { [i18n.language]: institutionInput },
                                        country: editingAcademic ? updateLocalizedField(editingAcademic, 'country', countryInput) : { [i18n.language]: countryInput },
                                        startDate: startDateInput,
                                        endDate: endDateInput,
                                        status: academicStatus
                                    };
                                    if (editingAcademic) {
                                        updateRecord(academicRecords, setAcademicRecords, { ...editingAcademic, ...newRecord }, 'academicRecords');
                                    } else {
                                        addRecord(academicRecords, setAcademicRecords, newRecord, 'academicRecords');
                                    }
                                    setShowAcademicModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Technical Modal */}
            <Modal visible={showTechnicalModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingTechnical ? t('profile.editTechnicalTitle') : t('profile.addTechnicalTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.courseLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={courseInput} onChangeText={setCourseInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.platformLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={platformInput} onChangeText={setPlatformInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.durationLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={durationInput} onChangeText={setDurationInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowTechnicalEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showTechnicalEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowTechnicalEndDatePicker(false);
                                        if (date) setEndDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowTechnicalModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateTechnicalFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        course: editingTechnical ? updateLocalizedField(editingTechnical, 'course', courseInput) : { [i18n.language]: courseInput },
                                        platform: editingTechnical ? updateLocalizedField(editingTechnical, 'platform', platformInput) : { [i18n.language]: platformInput },
                                        duration: editingTechnical ? updateLocalizedField(editingTechnical, 'duration', durationInput) : { [i18n.language]: durationInput },
                                        endDate: endDateInput
                                    };
                                    if (editingTechnical) {
                                        updateRecord(technicalRecords, setTechnicalRecords, { ...editingTechnical, ...newRecord }, 'technicalRecords');
                                    } else {
                                        addRecord(technicalRecords, setTechnicalRecords, newRecord, 'technicalRecords');
                                    }
                                    setShowTechnicalModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Complementary Modal */}
            <Modal visible={showComplementaryModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingComplementary ? t('profile.editComplementaryTitle') : t('profile.addComplementaryTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.activityLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={activityInput} onChangeText={setActivityInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.descriptionLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={descriptionInput} onChangeText={setDescriptionInput} multiline />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.dateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowComplementaryDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{dateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showComplementaryDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowComplementaryDatePicker(false);
                                        if (date) setDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowComplementaryModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateComplementaryFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        activity: editingComplementary ? updateLocalizedField(editingComplementary, 'activity', activityInput) : { [i18n.language]: activityInput },
                                        description: editingComplementary ? updateLocalizedField(editingComplementary, 'description', descriptionInput) : { [i18n.language]: descriptionInput },
                                        date: dateInput
                                    };
                                    if (editingComplementary) {
                                        updateRecord(complementaryRecords, setComplementaryRecords, { ...editingComplementary, ...newRecord }, 'complementaryRecords');
                                    } else {
                                        addRecord(complementaryRecords, setComplementaryRecords, newRecord, 'complementaryRecords');
                                    }
                                    setShowComplementaryModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Experience Modal */}
            <Modal visible={showExperienceModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView keyboardShouldPersistTaps="always">
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingExperience ? t('profile.editExperienceTitle') : t('profile.addExperienceTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.positionLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={positionInput} onChangeText={setPositionInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.institutionLabel')}</Text>
                            <View style={styles.autocompleteContainer}>
                                <Autocomplete
                                    data={filteredInstitutions}
                                    defaultValue={institutionInput}
                                    onChangeText={(text) => {
                                        setInstitutionInput(text);
                                        findInstitution(text);
                                        setHideResultsInstitution(false);
                                    }}
                                    hideResults={hideResultsInstitution}
                                    renderResultList={({ data }) => (
                                        data && data.length > 0 ? (
                                            <View style={{ maxHeight: 150, borderWidth: 1, borderColor: '#DDD' }}>
                                                {(data as string[]).map((item: string, idx: number) => (
                                                    <TouchableOpacity key={idx} onPress={() => {
                                                        setInstitutionInput(item);
                                                        setHideResultsInstitution(true);
                                                    }}>
                                                        <Text style={styles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ) : null
                                    )}
                                    inputContainerStyle={[styles.input, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9', borderWidth: 0 }]}
                                    style={{ backgroundColor: 'transparent', color: isDark ? '#FFF' : '#333' }}
                                />
                            </View>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.areaLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={areaInput} onChangeText={setAreaInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.countryLabel')}</Text>
                            <View style={styles.autocompleteContainer}>
                                <Autocomplete
                                    data={filteredCountries}
                                    defaultValue={countryInput}
                                    onChangeText={(text) => {
                                        setCountryInput(text);
                                        findCountry(text);
                                        setHideResultsCountry(false);
                                    }}
                                    hideResults={hideResultsCountry}
                                    renderResultList={({ data }) => (
                                        data && data.length > 0 ? (
                                            <View style={{ maxHeight: 150, borderWidth: 1, borderColor: '#DDD' }}>
                                                {(data as string[]).map((item: string, idx: number) => (
                                                    <TouchableOpacity key={idx} onPress={() => {
                                                        setCountryInput(item);
                                                        setHideResultsCountry(true);
                                                    }}>
                                                        <Text style={styles.itemText}>{item}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        ) : null
                                    )}
                                    inputContainerStyle={[styles.input, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9', borderWidth: 0 }]}
                                    style={{ backgroundColor: 'transparent', color: isDark ? '#FFF' : '#333' }}
                                />
                            </View>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowExperienceStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showExperienceStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowExperienceStartDatePicker(false);
                                        if (date) setStartDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowExperienceEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showExperienceEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowExperienceEndDatePicker(false);
                                        if (date) setEndDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowExperienceModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateExperienceFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        position: editingExperience ? updateLocalizedField(editingExperience, 'position', positionInput) : { [i18n.language]: positionInput },
                                        institution: editingExperience ? updateLocalizedField(editingExperience, 'institution', institutionInput) : { [i18n.language]: institutionInput },
                                        area: editingExperience ? updateLocalizedField(editingExperience, 'area', areaInput) : { [i18n.language]: areaInput },
                                        country: editingExperience ? updateLocalizedField(editingExperience, 'country', countryInput) : { [i18n.language]: countryInput },
                                        startDate: startDateInput,
                                        endDate: endDateInput
                                    };
                                    if (editingExperience) {
                                        updateRecord(experienceRecords, setExperienceRecords, { ...editingExperience, ...newRecord }, 'experienceRecords');
                                    } else {
                                        addRecord(experienceRecords, setExperienceRecords, newRecord, 'experienceRecords');
                                    }
                                    setShowExperienceModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Volunteer Modal */}
            <Modal visible={showVolunteerModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingVolunteer ? t('profile.editVolunteerTitle') : t('profile.addVolunteerTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.organizationLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={orgInput} onChangeText={setOrgInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.roleLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={roleInput} onChangeText={setRoleInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.causeLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={causeInput} onChangeText={setCauseInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.startDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{startDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showStartDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowStartDatePicker(false);
                                        if (date) setStartDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.endDateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{endDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showEndDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowEndDatePicker(false);
                                        if (date) setEndDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowVolunteerModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateVolunteerFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        organization: editingVolunteer ? updateLocalizedField(editingVolunteer, 'organization', orgInput) : { [i18n.language]: orgInput },
                                        role: editingVolunteer ? updateLocalizedField(editingVolunteer, 'role', roleInput) : { [i18n.language]: roleInput },
                                        cause: editingVolunteer ? updateLocalizedField(editingVolunteer, 'cause', causeInput) : { [i18n.language]: causeInput },
                                        startDate: startDateInput,
                                        endDate: endDateInput,
                                        currentlyInRole
                                    };
                                    if (editingVolunteer) {
                                        updateRecord(volunteerRecords, setVolunteerRecords, { ...editingVolunteer, ...newRecord }, 'volunteerRecords');
                                    } else {
                                        addRecord(volunteerRecords, setVolunteerRecords, newRecord, 'volunteerRecords');
                                    }
                                    setShowVolunteerModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Publication Modal */}
            <Modal visible={showPublicationModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingPublication ? t('profile.editPublicationTitle') : t('profile.addPublicationTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.titleLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={pubTitleInput} onChangeText={setPubTitleInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.editorialLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={pubEditorialInput} onChangeText={setPubEditorialInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.authorLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={pubAuthorInput} onChangeText={setPubAuthorInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.dateLabel')}</Text>
                            <TouchableOpacity onPress={() => setShowPubDatePicker(true)} style={[styles.input, { justifyContent: 'center', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{pubDateInput || 'DD/MM/YYYY'}</Text>
                            </TouchableOpacity>
                            {showPubDatePicker && (
                                <DateTimePicker
                                    value={new Date()}
                                    mode="date"
                                    display="default"
                                    onChange={(event, date) => {
                                        setShowPubDatePicker(false);
                                        if (date) setPubDateInput(date.toLocaleDateString('es-ES'));
                                    }}
                                />
                            )}

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.urlLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={pubUrlInput} onChangeText={setPubUrlInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.abstractLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={pubAbstractInput} onChangeText={setPubAbstractInput} multiline />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowPublicationModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validatePublicationFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        title: editingPublication ? updateLocalizedField(editingPublication, 'title', pubTitleInput) : { [i18n.language]: pubTitleInput },
                                        editorial: editingPublication ? updateLocalizedField(editingPublication, 'editorial', pubEditorialInput) : { [i18n.language]: pubEditorialInput },
                                        author: editingPublication ? updateLocalizedField(editingPublication, 'author', pubAuthorInput) : { [i18n.language]: pubAuthorInput },
                                        date: pubDateInput,
                                        url: pubUrlInput,
                                        abstract: editingPublication ? updateLocalizedField(editingPublication, 'abstract', pubAbstractInput) : { [i18n.language]: pubAbstractInput }
                                    };
                                    if (editingPublication) {
                                        updateRecord(publicationRecords, setPublicationRecords, { ...editingPublication, ...newRecord }, 'publicationRecords');
                                    } else {
                                        addRecord(publicationRecords, setPublicationRecords, newRecord, 'publicationRecords');
                                    }
                                    setShowPublicationModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Language Modal */}
            <Modal visible={showLanguageModal} animationType="slide" transparent>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#FFF' }]}>
                        <ScrollView>
                            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>{editingLanguage ? t('profile.editLanguageTitle') : t('profile.addLanguageTitle')}</Text>

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.languageLabel')}</Text>
                            <TextInput style={[styles.input, { color: isDark ? '#FFF' : '#333', borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]} value={languageInput} onChangeText={setLanguageInput} />

                            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{t('profile.proficiencyLabel')}</Text>
                            <View style={[styles.pickerContainer, { borderColor: isDark ? '#444' : '#DDD', backgroundColor: isDark ? '#333' : '#F9F9F9' }]}>
                                <Picker selectedValue={languageProficiency} onValueChange={setLanguageProficiency} style={{ color: isDark ? '#FFF' : '#333' }}>
                                    <Picker.Item label="Básico" value="Básico" />
                                    <Picker.Item label="Intermedio" value="Intermedio" />
                                    <Picker.Item label="Avanzado" value="Avanzado" />
                                    <Picker.Item label="Nativo" value="Nativo" />
                                </Picker>
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLanguageModal(false)}>
                                    <Text style={styles.modalButtonText}>{t('common.cancel')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => {
                                    const error = validateLanguageFields();
                                    if (showAlertIfMissingFields(error)) return;
                                    const newRecord = {
                                        language: editingLanguage ? updateLocalizedField(editingLanguage, 'language', languageInput) : { [i18n.language]: languageInput },
                                        proficiency: editingLanguage ? updateLocalizedField(editingLanguage, 'proficiency', languageProficiency) : { [i18n.language]: languageProficiency }
                                    };
                                    if (editingLanguage) {
                                        updateRecord(languageRecords, setLanguageRecords, { ...editingLanguage, ...newRecord }, 'languageRecords');
                                    } else {
                                        addRecord(languageRecords, setLanguageRecords, newRecord, 'languageRecords');
                                    }
                                    setShowLanguageModal(false);
                                }}>
                                    <Text style={styles.modalButtonText}>{t('common.save')}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    backButton: { padding: 4 },
    settingsButton: { padding: 4 },
    listContent: { paddingBottom: 40 },
    sectionHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginTop: 10,
    },
    sectionHeader: { fontSize: 18, fontWeight: 'bold' },
    addButton: {
        backgroundColor: '#4CAF50',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerContainer: { height: 150, position: 'relative' },
    bannerTouchable: { width: '100%', height: '100%' },
    bannerImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    profileImageContainer: { alignItems: 'center', marginTop: -50 },
    profileTouchable: { position: 'relative' },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
    },
    profileCameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        padding: 6,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    nameContainer: { alignItems: 'center', marginTop: 10, marginBottom: 20 },
    nameText: { fontSize: 20, fontWeight: 'bold' },
    emailText: { fontSize: 14 },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginRight: 10,
    },
    tabButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#4CAF50',
    },
    tabText: { fontSize: 14, fontWeight: '500' },
    tabTextActive: { color: '#4CAF50', fontWeight: 'bold' },

    // Cards
    personalInfoCard: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        padding: 16,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    personalInfoRow: { flexDirection: 'row', marginBottom: 8, flexWrap: 'wrap' },
    personalInfoLabel: { fontWeight: 'bold', marginRight: 8, width: 100 },
    personalInfoValue: { flex: 1 },
    editIconAbsolute: { position: 'absolute', top: 10, right: 10, padding: 4 },

    card: {
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    cardSubtitle: { fontSize: 12, marginBottom: 2 },
    cardLink: { fontSize: 12, textDecorationLine: 'underline', marginTop: 4 },
    cardAbstract: { fontSize: 12, fontStyle: 'italic', marginTop: 4 },
    statusContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    statusText: { fontSize: 12, marginRight: 6 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    statusBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
    editButtonCircle: { padding: 8 },

    // Modals
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    menuModalContent: { width: '80%', borderRadius: 12, padding: 16, elevation: 5 },
    menuOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    menuOptionText: { fontSize: 16 },

    confirmationOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
    confirmationContainer: { width: '80%', borderRadius: 12, padding: 20, alignItems: 'center' },
    confirmationTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    previewImage: { width: 200, height: 200, borderRadius: 8, marginBottom: 20 },
    confirmationButtons: { flexDirection: 'row', gap: 16 },
    confirmButton: { backgroundColor: '#4CAF50', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    cancelButton: { backgroundColor: '#F44336' },
    confirmButtonText: { color: '#FFF', fontWeight: 'bold' },

    modalContainer: { flex: 1, justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%', elevation: 10 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    label: { fontSize: 14, marginBottom: 6, fontWeight: '500' },
    input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
    pickerContainer: { borderWidth: 1, borderRadius: 8, marginBottom: 16, overflow: 'hidden' },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 40 },
    modalButton: { flex: 1, backgroundColor: '#4CAF50', padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
    modalButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

    // Autocomplete
    autocompleteContainer: {
        marginBottom: 16,
        zIndex: 1,
    },
    itemText: {
        fontSize: 15,
        margin: 2,
        padding: 5,
    },
});
