// app/_layout.tsx
import { ThemeProvider } from '../app/providers/ThemeProvider';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="account" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen name="areas" options={{ headerShown: false }} />
          <Stack.Screen name="convocatoria" options={{ headerShown: false }} />
          <Stack.Screen name="nosotros" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}