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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImageType, setModalImageType] = useState<'profile' | 'banner' | null>(null); // 👈 clave

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleAddInfo = () => {
    setShowPersonalInfoForm(true);
  };

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

  const showCameraMenu = () => {
    Alert.alert(
      "Cambiar foto de perfil",
      "¿Cómo quieres cambiar tu foto?",
      [
        { text: "Elegir de la galería", onPress: () => pickImage('profile') },
        { text: "Tomar nueva foto", onPress: () => takePhoto('profile') },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  const showBannerMenu = () => {
    Alert.alert(
      "Foto de portada",
      "¿Qué quieres hacer?",
      [
        { text: "Tomar nueva foto", onPress: () => takePhoto('banner') },
        { text: "Subir foto", onPress: () => pickImage('banner') },
        {
          text: "Ver foto de portada",
          onPress: () => {
            if (bannerImage) {
              setModalImageType('banner');
              setIsModalVisible(true);
            }
          },
        },
        { text: "Cancelar", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f0f0f' : '#ffffff' }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: isDark ? '#1a1a1a' : '#fff', borderBottomColor: isDark ? '#2a2a2a' : '#eee' }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={isDark ? '#e0e0e0' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#f0f0f0' : '#222' }]}>Perfil</Text>
        <TouchableOpacity onPress={handleSettings}>
          <Ionicons name="settings-outline" size={24} color={isDark ? '#e0e0e0' : '#333'} />
        </TouchableOpacity>
      </View>

      {/* Banner con foto */}
      <View style={styles.bannerContainer}>
        <TouchableOpacity onPress={showBannerMenu}>
          {bannerImage ? (
            <Image source={{ uri: bannerImage }} style={styles.bannerImage} resizeMode="cover" />
          ) : (
            <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
              <Text style={[styles.placeholderText, { color: isDark ? '#aaa' : '#777' }]}>📷 Foto de portada</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.profilePhotoContainer}>
          <TouchableOpacity
            onPress={() => {
              if (profileImage) {
                setModalImageType('profile');
                setIsModalVisible(true);
              }
            }}
            activeOpacity={0.9}
          >
            <View style={styles.profilePhotoWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profilePhoto} resizeMode="cover" />
              ) : (
                <View style={[styles.profilePhoto, styles.profilePlaceholder]}>
                  <Text style={styles.placeholderIcon}>👤</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraIcon} onPress={showCameraMenu} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: isDark ? '#ffffff' : '#111111' }]}>Ethan Carter Murayari</Text>
        <Text style={[styles.userEmail, { color: isDark ? '#bbbbbb' : '#666666' }]}>etcar@gmail.com</Text>
      </View>

      {/* Pestañas */}
      <View style={[styles.tabs, { backgroundColor: isDark ? '#1a1a1a' : '#fafafa' }]}>
        {(['info', 'formacion', 'experiencia', 'adicional'] as const).map((tab) => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? (isDark ? '#4ade80' : '#10b981') : (isDark ? '#aaaaaa' : '#777777') },
              ]}
            >
              {tab === 'info' ? 'Info' : tab === 'formacion' ? 'Formación' : tab === 'experiencia' ? 'Experiencia' : 'Adicional'}
            </Text>
            {activeTab === tab && <View style={[styles.tabIndicator, { backgroundColor: isDark ? '#4ade80' : '#10b981' }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Contenido */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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

      {/* Modal: Foto grande */}
      {isModalVisible && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => {
              setIsModalVisible(false);
              setModalImageType(null);
            }}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image
            source={
              modalImageType === 'profile'
                ? profileImage
                  ? { uri: profileImage }
                  : require('../assets/images/avatar-default.png')
                : bannerImage
                  ? { uri: bannerImage }
                  : require('../assets/images/banner.png')
            }
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      )}

      {/* === Resto de modales (sin cambios funcionales, solo estilos modernizados) === */}
      {showAcademicModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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

      {/* Modal: Formación Técnica */}
      {showTechnicalModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#FFF' : '#333' }]}>Añadir Formación Técnica / Especializada</Text>
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

      {/* Modal: Formación Complementaria */}
      {showComplementaryModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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

      {/* Modal: Información Personal */}
      {showPersonalInfoForm && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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

      {/* Modal: Experiencia Laboral */}
      {showExperienceModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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

      {/* Modal: Voluntariado */}
      {showVolunteerModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setCurrentlyInRole(!currentlyInRole)}>
                <View style={[styles.checkbox, currentlyInRole && styles.checkboxChecked]} />
                <Text style={[styles.checkboxLabel, { color: isDark ? '#FFF' : '#333' }]}>Actualmente estoy en este cargo</Text>
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

      {/* Modal: Publicación */}
      {showPublicationModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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
              placeholder="Ingrese la URL"
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

      {/* Modal: Idioma */}
      {showLanguageModal && (
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#222' : '#fff' }]}>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'system-ui',
  },
  bannerContainer: {
    height: 220,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    backgroundColor: isDark ? '#2a2a2a' : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: isDark ? '#888' : '#777',
  },
  profilePhotoContainer: {
    position: 'absolute',
    bottom: -50,
    left: '50%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  profilePhotoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  profilePhoto: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    backgroundColor: isDark ? '#333' : '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 40,
    color: isDark ? '#888' : '#aaa',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#10b981',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'system-ui',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  userEmail: {
    fontSize: 15,
    fontFamily: 'system-ui',
    marginTop: 6,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    fontFamily: 'system-ui',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 40,
    height: 2,
    borderRadius: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'system-ui',
  },
  addIconContainer: {
    backgroundColor: isDark ? '#2a2a2a' : '#f0fdf4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 15,
    color: isDark ? '#999' : '#777',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'system-ui',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  modalImage: {
    width: '94%',
    height: '82%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    minHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
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
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 44,
    color: '#333',
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
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
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#10b981',
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
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