// app/register.tsx
import * as Google from 'expo-auth-session/providers/google';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import React, { useState } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { auth } from '../src/config/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();
    const [request, response, promptAsync] = Google.useAuthRequest({
        // TODO: Add your Client IDs here
        androidClientId: 'YOUR_ANDROID_CLIENT_ID',
        iosClientId: 'YOUR_IOS_CLIENT_ID',
        webClientId: 'YOUR_WEB_CLIENT_ID',
    });

    const router = useRouter();

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    // AuthProvider will handle redirect
                })
                .catch((error) => {
                    Alert.alert(t('register.errorTitle'), error.message);
                });
        }
    }, [response]);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert(t('register.errorTitle'), t('register.errorMissingFields'));
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert(t('register.errorTitle'), t('register.errorPasswordMismatch'));
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // AuthProvider will handle redirect
        } catch (error: any) {
            Alert.alert(t('register.errorTitle'), error.message);
        }
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <Text style={styles.title}>{t('register.title')}</Text>
                    <Image
                        source={require('../assets/images/Volunteer_account.png')}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />

                    <Text style={styles.label}>{t('register.emailLabel')}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={t('register.emailPlaceholder')}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                        textContentType="username"
                        autoComplete="email"
                    />

                    <Text style={styles.label}>{t('register.passwordLabel')}</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput]}
                            placeholder={t('register.passwordPlaceholder')}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#999"
                            textContentType="newPassword"
                            autoComplete="password-new"
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Icon
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>{t('register.confirmPasswordLabel')}</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={[styles.input, styles.passwordInput]}
                            placeholder={t('Confirmar Contraseña')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#999"
                            textContentType="newPassword"
                            autoComplete="password-new"
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Icon
                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                size={20}
                                color="#999"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>{t('Registrarse')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.registerButton, { backgroundColor: '#DB4437', marginBottom: 16 }]}
                        onPress={() => promptAsync()}
                        disabled={!request}
                    >
                        <Text style={styles.registerButtonText}>Registrarse con Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLoginRedirect}>
                        <Text style={styles.login}>{t('register.loginLink')}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
        flexGrow: 1,
    },
    content: {
        width: '100%',
        maxWidth: 400,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 10,
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 14,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: '#f8f9fa',
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        marginBottom: 20,
    },
    passwordInput: {
        flex: 1,
        padding: 14,
        fontSize: 16,
    },
    eyeButton: {
        paddingHorizontal: 10,
    },
    registerButton: {
        backgroundColor: '#1e293b',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    login: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
});