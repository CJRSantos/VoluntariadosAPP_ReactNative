// app/profile.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 👈 Importa AsyncStorage
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

export default function ProfileScreen() {
    const router = useRouter();
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
    const [documentType, setDocumentType] = useState('');
    const [gender, setGender] = useState('');
    const [languageProficiency, setLanguageProficiency] = useState('');
    const [currentlyInRole, setCurrentlyInRole] = useState(false);

    // Estados para las pestañas
    const [activeTab, setActiveTab] = useState<'info' | 'formacion' | 'experiencia' | 'adicional'>('info');

    // Estados para los modales de formación
    const [showAcademicModal, setShowAcademicModal] = useState(false);
    const [showTechnicalModal, setShowTechnicalModal] = useState(false);
    const [showComplementaryModal, setShowComplementaryModal] = useState(false);
    const [showExperienceModal, setShowExperienceModal] = useState(false);

    // Estados para modales de "Adicional"
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);
    const [showPublicationModal, setShowPublicationModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    // Estado para el radio button de estado académico
    const [academicStatus, setAcademicStatus] = useState<string>('Actualmente');

    const handleSettings = () => {
        Alert.alert('Configuración', 'Funcionalidad no implementada aún');
    };

    const handleAddInfo = () => {
        setShowPersonalInfoForm(true);
    };

    // 👇 Cargar fotos guardadas al iniciar
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

    // 👇 MODIFICADO: Guarda la portada en AsyncStorage
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
                await AsyncStorage.setItem('userBannerURL', uri); // 👈 GUARDA LA PORTADA
            } else {
                setProfileImage(uri);
                await AsyncStorage.setItem('userPhotoURL', uri); // 👈 GUARDA LA FOTO DE PERFIL
            }
        }
    };

    // 👇 MODIFICADO: Guarda la portada en AsyncStorage
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
                await AsyncStorage.setItem('userBannerURL', uri); // 👈 GUARDA LA PORTADA
            } else {
                setProfileImage(uri);
                await AsyncStorage.setItem('userPhotoURL', uri); // 👈 GUARDA LA FOTO DE PERFIL
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
                            <Text style={styles.sectionTitle}>Información Personal</Text>
                            <TouchableOpacity style={styles.addIconContainer} onPress={handleAddInfo}>
                                <Ionicons name="add" size={24} color="#10b981" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                    </View>
                )}

                {activeTab === 'formacion' && (
                    <>
                        {/* Información Académica */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Información académica</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowAcademicModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>

                        {/* Formación Técnica / Especializada */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Formación técnica / especializada</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowTechnicalModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>

                        {/* Formación Complementaria */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Formación Complementaria</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowComplementaryModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>
                    </>
                )}

                {activeTab === 'experiencia' && (
                    <>
                        {/* Experiencia Académica */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Experiencia Laboral</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowExperienceModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>
                    </>
                )}

                {activeTab === 'adicional' && (
                    <>
                        {/* Voluntariados */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Voluntariados</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowVolunteerModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>

                        {/* Publicaciones */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Publicaciones</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowPublicationModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>

                        {/* Idiomas */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Idiomas</Text>
                                <TouchableOpacity
                                    style={styles.addIconContainer}
                                    onPress={() => setShowLanguageModal(true)}
                                >
                                    <Ionicons name="add" size={24} color="#10b981" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.noDataText}>No se visualiza ninguna información</Text>
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Modal: Agregar Formación Académica */}
            {showAcademicModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir formación Académica</Text>

                        <Text style={styles.label}>Grado</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el nombre de su grado"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Institución</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el nombre de su carrera"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>País</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su país"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Año de inicio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Año de fin</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Estado</Text>
                        <View style={styles.radioGroup}>
                            {['Actualmente', 'Graduado', 'Titulado'].map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.radioOption}
                                    onPress={() => setAcademicStatus(option)}
                                >
                                    <View style={[styles.radioButton, academicStatus === option && styles.radioButtonSelected]} />
                                    <Text style={styles.radioLabel}>{option}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowAcademicModal(false)}
                            >
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

            {/* Modal: Formación Técnica */}
            {showTechnicalModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir Formación Técnica / Especializada</Text>

                        <Text style={styles.label}>Nombre del curso o certificación</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Curso de React Native"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Institución o plataforma</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Udemy, Coursera"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Duración (meses)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: 6"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Año de finalización</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowTechnicalModal(false)}
                            >
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

            {/* Modal: Formación Complementaria */}
            {showComplementaryModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir Formación Complementaria</Text>

                        <Text style={styles.label}>Nombre de la actividad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: Voluntariado, idiomas, talleres"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Descripción breve</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Describe brevemente tu experiencia"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de realización</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/YYYY"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowComplementaryModal(false)}
                            >
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

            {/* Modal de Información Personal (ya existente) */}
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

            {/* Modal: Añadir Experiencia Laboral */}
            {showExperienceModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir experiencia Laboral</Text>

                        <Text style={styles.label}>Puesto</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el nombre del puesto"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Institución</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el nombre de la Institución"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Área</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su área"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>País</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su país"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de inicio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de fin</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowExperienceModal(false)}
                            >
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

            {/* Modal: Añadir Voluntariado */}
            {showVolunteerModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir publicación</Text>

                        <Text style={styles.label}>Título</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de publicación"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Publicación / Editorial</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ej: España editorial"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Autor</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese el nombre"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de Publicación</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Url</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese un breve resumen"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Resumen / Abstract</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Ingrese un breve resumen"
                            multiline
                            placeholderTextColor="#999"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowVolunteerModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Publicación guardada correctamente');
                                    setShowVolunteerModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Modal: Añadir Publicación */}
            {showPublicationModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir voluntariado</Text>

                        <Text style={styles.label}>Organización</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre de la Organización"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Cargo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nombre del cargo"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Causa benéfica / Área</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="National University of the Peruvian Amazon"
                            placeholderTextColor="#999"
                        />

                        <View style={styles.row}>
                            <TouchableOpacity
                                style={styles.checkboxContainer}
                                onPress={() => setCurrentlyInRole(!currentlyInRole)}
                            >
                                <View style={[styles.checkbox, currentlyInRole && styles.checkboxChecked]} />
                                <Text style={styles.checkboxLabel}>Actualmente estoy en este cargo</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Fecha de inicio</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Fecha de fin</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="dd/mm/yyyy"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            placeholder="Escribe un resumen de tu experiencia en voluntariado"
                            multiline
                            placeholderTextColor="#999"
                        />

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowPublicationModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButton]}
                                onPress={() => {
                                    Alert.alert('Éxito', 'Voluntariado guardado correctamente');
                                    setShowPublicationModal(false);
                                }}
                            >
                                <Text style={styles.buttonText}>Agregar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Modal: Añadir Idioma */}
            {showLanguageModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Añadir idioma</Text>

                        <Text style={styles.label}>Idioma</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Idioma"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.label}>Competencia</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={languageProficiency}
                                onValueChange={(itemValue) => setLanguageProficiency(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Seleccionar" value="" />
                                <Picker.Item label="Basic" value="basic" />
                                <Picker.Item label="Intermediate" value="intermediate" />
                                <Picker.Item label="Advanced" value="advanced" />
                                <Picker.Item label="Native" value="native" />
                            </Picker>
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setShowLanguageModal(false)}
                            >
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
        maxWidth: 400, // ⬅️ Límite máximo de ancho
        maxHeight: '80%',
        minHeight: 200, // ⬅️ Límite mínimo de alto
        backgroundColor: '#e8d7d7',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
        overflow: 'hidden', // ⬅️ Evita que el contenido se salga
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
        fontSize: 16, // ⬅️ Fija el tamaño de fuente
        paddingHorizontal: 12, // ⬅️ Consistencia en padding
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
        fontSize: 16, // ⬅️ Fija el tamaño de fuente
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
        color: '#333',
    },
});