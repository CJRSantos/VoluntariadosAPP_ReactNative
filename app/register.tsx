// app/register.tsx
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 👈 Importa Icon

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // 👈 Estado para mostrar/ocultar contraseña
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈 Para confirmar contraseña

    const router = useRouter();

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
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

        console.log('Registro exitoso:', email);
        router.replace('/account');
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

                {/* Campo Password con ojo */}
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Enter your password"
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

                {/* Campo Confirm Password con ojo */}
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={[styles.input, styles.passwordInput]}
                        placeholder="Confirm your password"
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