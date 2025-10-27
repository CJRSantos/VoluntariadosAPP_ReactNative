// app/requisitos.tsx
import * as Print from 'expo-print';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
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
  const router = useRouter(); // ✅ Ahora se usa aquí, no como prop

  const requisitos = {
    title: 'Realizar investigaciones - Bosques',
    vacantes: '5',
    formacion:
      'Egresado(a) Universitario de Archivística y Gestión Documental, Administración, Ingeniería Industrial, Ingeniería de Sistemas',
    experiencia:
      'General: 2 años\n\nEspecífica: 1 año en la función o materia, 1 año a nivel de practicante, 1 año en el sector público',
    cursos:
      'Gestión de archivos, gestión documental, sistema de gestión documental, trámite documentario o gobierno digital, con duración mínima de 60 horas acumulables',
  };

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleGeneratePDF = async () => {
    try {
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; font-size: 24px; margin-bottom: 16px; }
              h3 { color: #444; margin-top: 20px; margin-bottom: 8px; font-size: 18px; }
              p { line-height: 1.6; color: #333; font-size: 14px; }
            </style>
          </head>
          <body>
            <h1>${requisitos.title}</h1>
            <h3>Vacantes: ${requisitos.vacantes}</h3>
            <h3>Formación académica</h3>
            <p>${requisitos.formacion}</p>
            <h3>Experiencia</h3>
            <p>${requisitos.experiencia.replace(/\n/g, '<br>')}</p>
            <h3>Cursos y programas de especialización</h3>
            <p>${requisitos.cursos}</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Guardar o compartir PDF',
        });
      } else {
        Alert.alert('PDF generado', `URI: ${uri}`);
      }
    } catch (error) {
      console.error('Error al generar PDF:', error);
      Alert.alert('Error', 'No se pudo generar el PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{requisitos.title}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Vacantes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Vacantes</Text>
          <Text style={styles.vacantesNumber}>{requisitos.vacantes}</Text>
        </View>

        {/* Formación académica */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection('formacion')}
        >
          <Text style={styles.sectionTitle}>Formación académica</Text>
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
          <Text style={styles.sectionTitle}>Experiencia</Text>
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
            Cursos y programas de especialización
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
          <Text style={styles.buttonText}>Guardar PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.postularButton}>
          <Text style={styles.buttonText}>Postular</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// 🎨 Estilos (sin cambios)
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