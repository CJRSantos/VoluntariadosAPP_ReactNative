// app/_layout.tsx
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../app/providers/ThemeProvider';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack>
          {/* 👇 Primera pantalla: splash */}
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
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}