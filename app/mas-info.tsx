import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IMAGES } from '../assets/data/imageMap';
import moreInfoData from '../assets/data/more-info.json';

import { useTheme } from '../app/providers/ThemeProvider';

export default function MasInfoScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Flecha para regresar */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={isDark ? '#FFF' : '#000'} />
        </TouchableOpacity>

        {/* Título */}
        <Text style={[styles.title, { color: isDark ? '#FFF' : '#000' }]}>{t('masInfo.title')}</Text>

        {/* Imagen */}
        <View style={styles.imageContainer}>
          <Image
            source={IMAGES[moreInfoData.image]}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>{t('masInfo.deadlineTitle')}</Text>
            <Text style={styles.overlaySubtitle}>{t('masInfo.deadlineDate')}</Text>
          </View>
        </View>

        {/* CÓMO POSTULAR */}
        <Text style={[styles.sectionTitle, { color: isDark ? '#FFF' : '#000' }]}>{t('masInfo.howToApplyTitle')}</Text>
        <Text style={[styles.sectionText, { color: isDark ? '#CCC' : '#333' }]}>
          {t('masInfo.howToApplyText')}
        </Text>

        {/* Opciones */}
        {moreInfoData.options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.optionCard, { backgroundColor: isDark ? '#222' : '#F5F5F5' }]}
            onPress={() => router.push(option.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? '#444' : '#E0E0E0' }]}>
              <Text style={[styles.icon, { color: isDark ? '#FFF' : '#333' }]}>{option.icon}</Text>
            </View>
            <View style={styles.optionContent}>
              <Text style={[styles.optionTitle, { color: isDark ? '#FFF' : '#000' }]}>{t(`masInfo.${option.id}Title`)}</Text>
              <Text style={[styles.optionDescription, { color: isDark ? '#AAA' : '#666' }]}>
                {t(`masInfo.${option.id}Text`)}
              </Text>
            </View>
            <Text style={[styles.arrow, { color: isDark ? '#FFF' : '#666' }]}>→</Text>
          </TouchableOpacity>
        ))}

        {/* Nota importante */}
        <Text style={[styles.noteTitle, { color: isDark ? '#FFF' : '#000' }]}>{t('masInfo.noteTitle')}</Text>
        <Text style={[styles.noteText, { color: isDark ? '#CCC' : '#333' }]}>
          {t('masInfo.noteText')}
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
    padding: 6,
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
