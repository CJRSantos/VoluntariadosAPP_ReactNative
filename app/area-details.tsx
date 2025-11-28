import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import areasData from '../assets/data/areas.json';
import { IMAGES } from '../assets/data/imageMap';
import uiData from '../assets/data/ui.json';
import { useTheme } from './providers/ThemeProvider';

export default function AreaDetailsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { theme } = useTheme();
    const { t } = useTranslation();
    const isDark = theme === 'dark';

    const areaId = Number(params.id);
    const area = areasData.find(item => item.id === areaId);

    if (!area) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: isDark ? '#FFF' : '#333' }}>{uiData.errors.areaNotFound}</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: '#4CAF50' }}>{uiData.errors.goBack}</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#FFF' : '#333'} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('areas.detailsTitle', 'Detalle del Área')}
                </Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {area.image && IMAGES[area.image] && (
                    <Image
                        source={IMAGES[area.image]}
                        style={styles.image}
                        resizeMode="cover"
                    />
                )}
                <View style={styles.detailsContainer}>
                    <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
                        {area.title}
                    </Text>

                    <Text style={[styles.direction, { color: isDark ? '#AAA' : '#666' }]}>
                        {area.direction}
                    </Text>

                    <Text style={[styles.description, { color: isDark ? '#DDD' : '#444' }]}>
                        {area.content}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { paddingBottom: 40 },
    image: {
        width: '100%',
        height: 250,
    },
    detailsContainer: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    direction: { fontSize: 14, marginBottom: 20, fontStyle: 'italic' },
    description: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
});
