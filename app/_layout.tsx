import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../app/providers/ThemeProvider';
import '../src/i18n/i18n';

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="account" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="areas" options={{ headerShown: false }} />
          <Stack.Screen name="convocatoria" options={{ headerShown: false }} />
          <Stack.Screen name="nosotros" options={{ headerShown: false }} />
          <Stack.Screen name="mas-info" options={{ headerShown: false }} />
          <Stack.Screen name="presencial-info" options={{ headerTitle: '' }} />
          <Stack.Screen name="virtual-tutorial" options={{ headerTitle: '' }} />
          <Stack.Screen
            name="onboarding-info"
            options={({ navigation }) => ({
              headerTitle: '',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
              ),
            })}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}