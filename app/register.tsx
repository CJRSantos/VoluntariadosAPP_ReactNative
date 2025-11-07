import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const router = useRouter();

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        console.log('Registro:', email, password);
        router.replace('/login');
    };

    const handleLoginRedirect = () => {
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Título */}
                <Text style={styles.title}>Volunteer Intranet</Text>

                {/* Imagen superior */}
                <Image
                    source={require('../assets/images/Volunteer_account.png')}
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

                {/* Campo Confirm Password */}
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#999"
                />

                {/* Botón Regístrese */}
                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>Regístrese</Text>
                </TouchableOpacity>

                {/* Enlace "¿Ya tienes una cuenta?" */}
                <TouchableOpacity onPress={handleLoginRedirect}>
                    <Text style={styles.loginLink}>¿Ya tienes una cuenta?...</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
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