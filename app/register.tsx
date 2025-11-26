// app/register.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
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

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { t } = useTranslation();

    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            alert(t('register.errorMissingFields'));
            return;
        }
        if (password !== confirmPassword) {
            alert(t('register.errorPasswordMismatch'));
            return;
        }

        const newUser = {
            uid: `vol_${Date.now()}`,
            email: email,
            displayName: email.split('@')[0] || 'Voluntario',
            photoURL: 'https://via.placeholder.com/40/4CAF50/FFFFFF?text=V',
        };

        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        await AsyncStorage.setItem('@user_logged_in', 'true');

        console.log(t('register.successLog'), email);
        router.replace('/account');
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
                            placeholder={t('register.confirmPasswordPlaceholder')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#999"
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
                        <Text style={styles.registerButtonText}>{t('register.registerButton')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleLoginRedirect}>
                        <Text style={styles.loginLink}>{t('register.loginLink')}</Text>
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
    loginLink: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
});