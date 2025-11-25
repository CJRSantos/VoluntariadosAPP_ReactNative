import { useRouter } from 'expo-router';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MasInfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Flecha para regresar */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        {/* Título */}
        <Text style={styles.title}>Información adicional</Text>

        {/* Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/Tutorial2.png')}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>Plazo de postulación</Text>
            <Text style={styles.overlaySubtitle}>Hasta el 15 de Noviembre de 2025</Text>
          </View>
        </View>

        {/* CÓMO POSTULAR */}
        <Text style={styles.sectionTitle}>CÓMO POSTULAR</Text>
        <Text style={styles.sectionText}>
          Para postular a una vacante de voluntario en BOSQUES, puedes elegir entre dos modalidades de presentación: presencial o virtual.
        </Text>

        {/* Presencial */}
        <TouchableOpacity style={styles.optionCard} onPress={() => router.push('/presencial-info')}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🏢</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Presencial</Text>
            <Text style={styles.optionDescription}>
              Presenta tus documentos en la mesa de partes del IIAP.
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Virtual */}
        <TouchableOpacity
          style={styles.optionCard}
          onPress={() => router.push('/virtual-tutorial')}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🌐</Text>
          </View>
          <View style={styles.optionContent}>
            <Text style={styles.optionTitle}>Virtual</Text>
            <Text style={styles.optionDescription}>
              Envía tus documentos a través de la vista de postulación.
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>

        {/* Nota importante */}
        <Text style={styles.noteTitle}>Nota importante</Text>
        <Text style={styles.noteText}>
          Asegúrate de que tu archivo PDF no exceda los 10 MB y que todos los documentos estén correctamente ordenados y legibles.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 3,
  },
  backArrow: {
    fontSize: 22,
    color: '#000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 100,
    marginLeft: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  overlaySubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginTop: 20,
  },
  sectionText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 20,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
    color: '#333',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  arrow: {
    fontSize: 18,
    color: '#666',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    marginTop: 20,
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 20,
  },
});
