// app/requisitos.tsx
import * as Print from 'expo-print';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RequisitosScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <RequisitosContent />
    </>
  );
}

function RequisitosContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const requisitos = {
    title: t('requisitos.title'),
    vacantes: '5',
    formacion: t('requisitos.educationText'),
    experiencia: t('requisitos.experienceText'),
    cursos: t('requisitos.coursesText'),
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGeneratePDF = async () => {
    const html = `
      <html>
        <body>
          <h1>${requisitos.title}</h1>
          <p><strong>${t('requisitos.vacanciesTitle')}:</strong> ${requisitos.vacantes}</p>
          <h2>${t('requisitos.educationTitle')}</h2>
          <p>${requisitos.formacion}</p>
          <h2>${t('requisitos.experienceTitle')}</h2>
          <p>${requisitos.experiencia}</p>
          <h2>${t('requisitos.coursesTitle')}</h2>
          <p>${requisitos.cursos}</p>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error: any) {
      Alert.alert(t('requisitos.pdfError'), error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{requisitos.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vacantes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('requisitos.vacanciesTitle')}</Text>
          <Text style={styles.vacantesNumber}>{requisitos.vacantes}</Text>
        </View>

        {/* Formación académica */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('formacion')}
        >
          <Text style={styles.sectionTitle}>{t('requisitos.educationTitle')}</Text>
          <Text style={styles.arrow}>
            {expandedSection === 'formacion' ? '∨' : '>'}
          </Text>
        </TouchableOpacity>
        {expandedSection === 'formacion' && (
          <Text style={styles.sectionContent}>{requisitos.formacion}</Text>
        )}

        {/* Experiencia */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('experiencia')}
        >
          <Text style={styles.sectionTitle}>{t('requisitos.experienceTitle')}</Text>
          <Text style={styles.arrow}>
            {expandedSection === 'experiencia' ? '∨' : '>'}
          </Text>
        </TouchableOpacity>
        {expandedSection === 'experiencia' && (
          <Text style={styles.sectionContent}>{requisitos.experiencia}</Text>
        )}

        {/* Cursos */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('cursos')}
        >
          <Text style={styles.sectionTitle}>
            {t('requisitos.coursesTitle')}
          </Text>
          <Text style={styles.arrow}>
            {expandedSection === 'cursos' ? '∨' : '>'}
          </Text>
        </TouchableOpacity>
        {expandedSection === 'cursos' && (
          <Text style={styles.sectionContent}>{requisitos.cursos}</Text>
        )}
      </ScrollView>

      {/* Botones inferiores */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.pdfButton} onPress={handleGeneratePDF}>
          <Text style={styles.buttonText}>{t('requisitos.savePdfButton')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.postularButton}
          onPress={() => router.push('/postulacion-paso1')}
        >
          <Text style={styles.buttonText}>{t('requisitos.applyButton')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    paddingTop: 90,
    paddingBottom: 8,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backArrow: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
  },

  content: {
    paddingHorizontal: 35,
    paddingTop: 4,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  vacantesNumber: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#000',
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  pdfButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  postularButton: {
    backgroundColor: '#76d700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});