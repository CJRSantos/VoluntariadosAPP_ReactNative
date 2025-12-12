import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../app/providers/AuthProvider';
import { ThemeProvider } from '../app/providers/ThemeProvider';
import { ThemedStatusBar } from '../src/components/ThemedStatusBar';
import '../src/i18n/i18n';

import { useTheme } from '../app/providers/ThemeProvider';

function ThemedStack() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: isDark ? '#121212' : '#F5F5F5' },
        animation: 'none', // Disable animations globally to prevent flickering
      }}
    >
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="account" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="areas" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="convocatoria" options={{ headerShown: false, animation: 'none' }} />
      <Stack.Screen name="nosotros" options={{ headerShown: false, animation: 'none' }} />
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
  );
}

export default function RootLayout() {
  const { t } = useTranslation();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedStatusBar />
          <AuthProvider>
            <ThemedStack />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}