import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './providers/ThemeProvider';

export default function PresencialInfoScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{
                title: '',
                headerBackTitle: '',
                headerStyle: { backgroundColor: isDark ? '#000' : '#fff' },
                headerTintColor: isDark ? '#fff' : '#000',
            }} />
            <ScrollView contentContainerStyle={styles.content}>
                {/* Contenido */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#4CAF50' : '#005f56' }]}>{t('presencialInfo.title')}</Text>
                    <Text style={[styles.text, { color: isDark ? '#CCC' : '#444' }]}>
                        {t('presencialInfo.description')}
                    </Text>

                    <Text style={[styles.subTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('presencialInfo.step1.title')}</Text>
                    <Text style={[styles.text, { color: isDark ? '#CCC' : '#444' }]}>
                        {t('presencialInfo.step1.text')}
                    </Text>

                    <Text style={[styles.subTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('presencialInfo.step2.title')}</Text>
                    <Text style={[styles.text, { color: isDark ? '#CCC' : '#444' }]}>
                        {t('presencialInfo.step2.text')}
                    </Text>

                    <Text style={[styles.subTitle, { color: isDark ? '#FFF' : '#333' }]}>{t('presencialInfo.step3.title')}</Text>
                    <Text style={[styles.text, { color: isDark ? '#CCC' : '#444' }]}>
                        {t('presencialInfo.step3.text')}
                    </Text>
                </View>

                <View style={[styles.noteContainer, { backgroundColor: isDark ? '#332b00' : '#FFF3E0', borderLeftColor: '#FF9800' }]}>
                    <Text style={[styles.noteTitle, { color: isDark ? '#FFB74D' : '#E65100' }]}>{t('presencialInfo.note.title')}</Text>
                    <Text style={[styles.noteText, { color: isDark ? '#FFE0B2' : '#5D4037' }]}>
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
        marginBottom: 12,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 4,
    },
    text: {
        fontSize: 15,
        lineHeight: 22,
    },
    noteContainer: {
        padding: 16,
        borderRadius: 8,
        marginTop: 10,
        borderLeftWidth: 4,
    },
    noteTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    noteText: {
        fontSize: 14,
        lineHeight: 20,
    },
});
