// app/splash.tsx
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Animated, Image, StyleSheet, Text } from 'react-native';

export default function SplashScreen() {
    const router = useRouter();
    const [showText, setShowText] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const checkLoginStatus = async () => {
            const isLoggedIn = await AsyncStorage.getItem('@user_logged_in');

            if (isLoggedIn === 'true') {
                // 👇 Si ya está logueado, ve a la pantalla principal
                router.replace('/');
            } else {
                // 👇 Si no, ve al login
                router.replace('/login');
            }
        };

        // Mostrar texto después de 3 segundos
        const timer1 = setTimeout(() => {
            setShowText(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }, 3000);

        // Redirigir después de 4 segundos (solo si no se ha redirigido antes)
        const timer2 = setTimeout(() => {
            checkLoginStatus(); // 👈 Llama a la función de verificación
        }, 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [router, fadeAnim]);

    return (
        <LinearGradient
            colors={['#FFFFFF', '#4CAF50']}
            style={styles.container}
        >
            {/* 👇 LOGO: SIEMPRE VISIBLE */}
            <Image
                source={require('@/assets/images/logo-voluntariado3x.png')}
                style={styles.logo}
                resizeMode="contain"
            />

            {/* 👇 TEXTO: SOLO DESPUÉS DE 3 SEGUNDOS */}
            {showText && (
                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                    <Text style={styles.welcomeText}>WELCOME VOLUNTARY</Text>
                </Animated.View>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 40,
        resizeMode: 'contain',
    },
    textContainer: {
        position: 'absolute',
        bottom: '30%',
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
});