import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function PresencialInfoScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                {/* Contenido */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('presencialInfo.title')}</Text>
                    <Text style={styles.text}>
                        {t('presencialInfo.description')}
                    </Text>

                    <Text style={styles.subTitle}>{t('presencialInfo.step1.title')}</Text>
                    <Text style={styles.text}>
                        {t('presencialInfo.step1.text')}
                    </Text>

                    <Text style={styles.subTitle}>{t('presencialInfo.step2.title')}</Text>
                    <Text style={styles.text}>
                        {t('presencialInfo.step2.text')}
                    </Text>

                    <Text style={styles.subTitle}>{t('presencialInfo.step3.title')}</Text>
                    <Text style={styles.text}>
                        {t('presencialInfo.step3.text')}
                    </Text>
                </View>

                <View style={styles.noteContainer}>
                    <Text style={styles.noteTitle}>{t('presencialInfo.note.title')}</Text>
                    <Text style={styles.noteText}>
                        {t('presencialInfo.note.text')}
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#005f56',
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        color: '#444',
        lineHeight: 22,
    },
    noteContainer: {
        backgroundColor: '#FFF3E0',
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#E65100',
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        color: '#5D4037',
        lineHeight: 20,
    },
});
