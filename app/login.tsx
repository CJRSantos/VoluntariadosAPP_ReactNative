// app/login.tsx
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../app/providers/ThemeProvider';
import { auth } from '../src/config/firebaseConfig';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const router = useRouter();

  // 🔥 Autologin + cargar email/contraseña guardados
  useEffect(() => {
    const init = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('savedEmail');
        if (savedEmail) {
          setEmail(savedEmail);
        }

        const savedPassword = await SecureStore.getItemAsync('savedPassword');
        if (savedPassword) {
          setPassword(savedPassword);
          setRememberPassword(true);
        }
      } catch (e) {
        console.log('Error leyendo credenciales guardadas', e);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Ya está logueado → lo mandamos al home/principal
        router.replace('/');
      }
    });

    init();
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('login.errorTitle'), t('login.errorMissingFields'));
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Guardar siempre el email
      await AsyncStorage.setItem('savedEmail', email);

      // Si quiere recordar contraseña → guardamos en SecureStore
      if (rememberPassword) {
        await SecureStore.setItemAsync('savedPassword', password);
      } else {
        await SecureStore.deleteItemAsync('savedPassword');
      }

      // AuthProvider / onAuthStateChanged se encarga de redirigir
    } catch (error: any) {
      Alert.alert(t('login.errorTitle'), error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Image
              source={require('../assets/images/volunteer_intranet.png')}
              style={styles.headerImage}
              resizeMode="contain"
            />

            <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>
              {t('login.title')}
            </Text>
            <Text
              style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}
            >
              {t('login.subtitle', 'Bienvenido de nuevo')}
            </Text>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>
                {t('login.emailLabel')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#111' : '#f8f9fa',
                    borderColor: isDark ? '#333' : '#ddd',
                    color: isDark ? '#FFF' : '#333',
                  },
                ]}
                placeholder={t('login.emailPlaceholder')}
                placeholderTextColor={isDark ? '#666' : '#999'}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textContentType="username"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>
                {t('login.passwordLabel')}
              </Text>
              <View
                style={[
                  styles.passwordWrapper,
                  {
                    backgroundColor: isDark ? '#111' : '#f8f9fa',
                    borderColor: isDark ? '#333' : '#ddd',
                  },
                ]}
              >
                <TextInput
                  style={[styles.passwordInput, { color: isDark ? '#FFF' : '#333' }]}
                  placeholder={t('login.passwordPlaceholder')}
                  placeholderTextColor={isDark ? '#666' : '#999'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color={isDark ? '#AAA' : '#999'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Recordar contraseña */}
            <View style={styles.rememberRow}>
              <Switch
                value={rememberPassword}
                onValueChange={setRememberPassword}
              />
              <Text style={[styles.rememberText, { color: isDark ? '#FFF' : '#333' }]}>
                Recordar contraseña
              </Text>
            </View>

            {/* Botón login */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>
                {t('login.loginButton')}
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: isDark ? '#333' : '#ddd' },
                ]}
              />
              <Text
                style={[styles.dividerText, { color: isDark ? '#666' : '#999' }]}
              >
                {t('common.or', 'O')}
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: isDark ? '#333' : '#ddd' },
                ]}
              />
            </View>



            {/* Footer */}
            <View className="footer" style={styles.footer}>
              <Text
                style={[
                  styles.footerText,
                  { color: isDark ? '#AAA' : '#666' },
                ]}
              >
                {t('login.noAccount', '¿No tienes una cuenta?')}
              </Text>
              <Link href="/register" asChild>
                <TouchableOpacity>
                  <Text style={styles.createAccount}>
                    {t('login.createAccount')}
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  content: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  headerImage: { width: 120, height: 120, alignSelf: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },

  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    paddingRight: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeButton: { padding: 4 },

  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  rememberText: {
    fontSize: 14,
  },

  loginButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 14 },



  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  footerText: { fontSize: 14 },
  createAccount: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
});
