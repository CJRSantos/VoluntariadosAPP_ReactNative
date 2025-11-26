import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function VirtualTutorialScreen() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header removed to use default navigation header */}

            {/* Video/Animation Content */}
            <View style={styles.content}>
                <Text style={styles.description}>
                    {t('virtualTutorial.description')}
                </Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../assets/images/tutorial.webp')}
                        style={styles.image}
                        contentFit="contain"
                    // WebP animation plays automatically by default in expo-image
                    />
                </View>

                <Text style={styles.note}>
                    {t('virtualTutorial.note')}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 9 / 16, // Enforce mobile aspect ratio
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    note: {
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
    },
});
