import { ResizeMode, Video } from 'expo-av';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './providers/ThemeProvider';

export default function VirtualTutorialScreen() {
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

            {/* Video Content */}
            <View style={styles.content}>
                <Text style={[styles.description, { color: isDark ? '#FFF' : '#333' }]}>
                    {t('virtualTutorial.description')}
                </Text>

                <View style={[styles.videoContainer, { backgroundColor: isDark ? '#111' : '#f0f0f0', borderColor: isDark ? '#333' : '#ddd' }]}>
                    <Video
                        source={require('../assets/videos/tutorial.mp4')}
                        style={styles.video}
                        shouldPlay={true}
                        resizeMode={ResizeMode.CONTAIN}
                        isLooping={false}
                        useNativeControls={false}
                        onError={(error) => console.error('Error al reproducir video:', error)}
                    />
                </View>

                <Text style={[styles.note, { color: isDark ? '#AAA' : '#666' }]}>
                    {t('Tutorial de como Postular')}
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 9 / 16,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
        borderWidth: 1,
    },
    video: {
        width: '100%',
        height: '100%',
    },
    note: {
        fontSize: 14,
        fontStyle: 'italic',
    },
});