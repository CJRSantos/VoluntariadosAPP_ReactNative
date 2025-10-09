// app/login.tsx
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }
        console.log('Login:', email, password);
        // router.replace('/home'); // descomenta cuando tengas la pantalla principal
    };

    const handleGoogleLogin = () => {
        Alert.alert('Google Login', 'Funcionalidad no implementada aún');
    };

    const handleForgotPassword = () => {
        Alert.alert('Recuperar contraseña', 'Pronto podrás recuperar tu contraseña');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Imagen superior */}
                <Text style={styles.title}>Volunteer Intranet</Text>
                <Image
                    source={require('../assets/images/Volunteer_Intranet.png')}
                    style={styles.headerImage}
                    resizeMode="cover"
                />

                

                {/* Campo Email */}
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#999"
                />

                {/* Campo Password */}
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                {/* Olvidó contraseña */}
                <TouchableOpacity onPress={handleForgotPassword}>
                    <Text style={styles.forgotPassword}>¿Olvidó su contraseña?</Text>
                </TouchableOpacity>

                {/* Botón Iniciar Sesión */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>

                {/* Crear cuenta - Usa Link */}
                <Link href="/register" style={styles.createAccount}>
                    Crear una cuenta
                </Link>

                {/* Separador "Or" */}
                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>Or</Text>
                    <View style={styles.line} />
                </View>

                {/* Botón Google */}
                <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                    <Image
                        source={require('../assets/images/Logo_Google.png')}
                        style={styles.googleIcon}
                    />
                    <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center', // 👈 Centra verticalmente
        alignItems: 'center',      // 👈 Centra horizontalmente
        padding: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400, // Mejor experiencia en tablets
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
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
    forgotPassword: {
        textAlign: 'right',
        color: '#666',
        fontSize: 14,
        marginBottom: 20,
    },
    loginButton: {
        backgroundColor: '#1e293b',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 16,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    createAccount: {
        textAlign: 'center',
        color: '#4f46e5',
        fontSize: 16,
        marginBottom: 20,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    orText: {
        marginHorizontal: 10,
        color: '#999',
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        fontSize: 16,
        color: '#333',
    },
});