// app/register.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { Link, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // 🔐 Guardado seguro
import * as WebBrowser from 'expo-web-browser';
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithCredential,
    updateProfile
} from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../app/providers/ThemeProvider';
import { auth } from '../src/config/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { t } = useTranslation();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const router = useRouter();

    const [request, response, promptAsync] = Google.useAuthRequest({
        webClientId: "692067074723-7q6ds5tjnrsetu93s415kpm78r79231a.apps.googleusercontent.com",
        androidClientId: "692067074723-7q6ds5tjnrsetu93s415kpm78r79231a.apps.googleusercontent.com",
        iosClientId: "692067074723-7q6ds5tjnrsetu93s415kpm78r79231a.apps.googleusercontent.com",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .catch((error) => Alert.alert(t('register.errorTitle'), error.message));
        }
    }, [response]);

    const handleRegister = async () => {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            Alert.alert(t('register.errorTitle'), t('register.errorMissingFields'));
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(t('register.errorTitle'), t('register.errorPasswordMismatch'));
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Nombre en Firebase
            await updateProfile(user, {
                displayName: `${firstName} ${lastName}`.trim()
            });

            // Guardar datos básicos del usuario
            const personalInfo = {
                name: { es: `${firstName} ${lastName}`, en: `${firstName} ${lastName}` },
                email
            };
            await AsyncStorage.setItem("personalInfo", JSON.stringify(personalInfo));

            // Guardar email y contraseña para autologin
            await AsyncStorage.setItem("savedEmail", email);
            await SecureStore.setItemAsync("savedPassword", password); // 🔐 seguro

            Alert.alert("Cuenta creada", "Tu registro fue exitoso.");
            router.push("/login");

        } catch (error: any) {
            Alert.alert(t('register.errorTitle'), error.message);
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#000' : '#fff' }]}>
            <KeyboardAvoidingView
                style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.content}>
                        <Image source={require('../assets/images/Volunteer_account.png')} style={styles.headerImage} />

                        <Text style={[styles.title, { color: isDark ? '#FFF' : '#333' }]}>{t('register.title')}</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#AAA' : '#666' }]}>
                            {t('register.subtitle', 'Crea tu cuenta')}
                        </Text>

                        {/* Nombre */}
                        <Input label="Nombres" value={firstName} setValue={setFirstName} isDark={isDark} />
                        <Input label="Apellidos" value={lastName} setValue={setLastName} isDark={isDark} />

                        {/* Email */}
                        <Input label="Correo" value={email} setValue={setEmail} keyboardType="email-address" autoCapitalize="none" isDark={isDark} />

                        {/* Contraseña */}
                        <PasswordInput
                            label="Contraseña"
                            value={password}
                            setValue={setPassword}
                            show={showPassword}
                            setShow={setShowPassword}
                            isDark={isDark}
                        />

                        {/* Confirmar contraseña */}
                        <PasswordInput
                            label="Confirmar contraseña"
                            value={confirmPassword}
                            setValue={setConfirmPassword}
                            show={showConfirmPassword}
                            setShow={setShowConfirmPassword}
                            isDark={isDark}
                        />

                        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                            <Text style={styles.registerButtonText}>Registrarse</Text>
                        </TouchableOpacity>

                        <View style={styles.dividerContainer}>
                            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#333' : '#ddd' }]} />
                            <Text style={[styles.dividerText, { color: isDark ? '#666' : '#999' }]}>O</Text>
                            <View style={[styles.dividerLine, { backgroundColor: isDark ? '#333' : '#ddd' }]} />
                        </View>

                        {/* Google deshabilitado temporalmente */}
                        <TouchableOpacity
                            style={[styles.googleButton, { backgroundColor: isDark ? '#111' : '#FFF', borderColor: isDark ? '#333' : '#ddd' }]}
                            onPress={() => Alert.alert("Google no disponible", "Por ahora el registro con Google estará deshabilitado.")}
                        >
                            <Image source={require('../assets/images/Logo_Google.png')} style={styles.googleIcon} />
                            <Text style={[styles.googleButtonText, { color: isDark ? '#FFF' : '#333' }]}>
                                Registrarse con Google
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: isDark ? '#AAA' : '#666' }]}>¿Ya tienes cuenta?</Text>
                            <Link href="/login" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.loginLink}>Iniciar sesión</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* ===== COMPONENTES REUTILIZABLES ===== */

function Input({ label, value, setValue, isDark, ...props }: any) {
    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    { backgroundColor: isDark ? '#111' : '#f8f9fa', borderColor: isDark ? '#333' : '#ddd', color: isDark ? '#FFF' : '#333' }
                ]}
                value={value}
                onChangeText={setValue}
                placeholderTextColor={isDark ? '#666' : '#999'}
                {...props}
            />
        </View>
    );
}

function PasswordInput({ label, value, setValue, show, setShow, isDark }: any) {
    return (
        <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: isDark ? '#AAA' : '#666' }]}>{label}</Text>
            <View style={[styles.passwordWrapper, { backgroundColor: isDark ? '#111' : '#f8f9fa', borderColor: isDark ? '#333' : '#ddd' }]}>
                <TextInput
                    style={[styles.passwordInput, { color: isDark ? '#FFF' : '#333' }]}
                    value={value}
                    onChangeText={setValue}
                    secureTextEntry={!show}
                    placeholderTextColor={isDark ? '#666' : '#999'}
                />
                <TouchableOpacity onPress={() => setShow(!show)}>
                    <Icon name={show ? 'eye-off' : 'eye'} size={20} color={isDark ? '#AAA' : '#999'} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ===== ESTILOS ===== */

const styles = StyleSheet.create({
    safeArea: { flex: 1 }, container: { flex: 1 },
    scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
    content: { width: '100%', maxWidth: 400, alignSelf: 'center' },
    headerImage: { width: 120, height: 120, alignSelf: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 32 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
    input: { borderWidth: 1, padding: 16, borderRadius: 16, fontSize: 16 },
    passwordWrapper: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, alignItems: 'center', paddingRight: 16 },
    passwordInput: { flex: 1, padding: 16, fontSize: 16 },
    registerButton: { backgroundColor: '#4CAF50', paddingVertical: 18, borderRadius: 16, alignItems: 'center', marginTop: 8, elevation: 4 },
    registerButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
    dividerLine: { flex: 1, height: 1 },
    dividerText: { marginHorizontal: 16, fontSize: 14 },
    googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 1, marginBottom: 24 },
    googleIcon: { width: 24, height: 24, marginRight: 12 },
    googleButtonText: { fontSize: 16, fontWeight: '600' },
    footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    footerText: { fontSize: 14 }, loginLink: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
});
