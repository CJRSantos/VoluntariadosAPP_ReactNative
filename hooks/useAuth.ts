// hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

// Evento personalizado
const USER_PHOTO_UPDATED = 'userPhotoUpdated';

export const useAuth = () => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUser = useCallback(async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (!storedUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            const savedPhotoURL = await AsyncStorage.getItem('userPhotoURL');

            setUser({
                ...parsedUser,
                photoURL: savedPhotoURL || parsedUser.photoURL,
            });
        } catch (e) {
            console.warn('Error al cargar usuario:', e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();

        // Escuchar cambios en la foto
        const handlePhotoUpdate = () => {
            loadUser(); // Recargar usuario
        };

        // Suscribirse al evento
        const eventListener = () => handlePhotoUpdate();
        // En React Native, usamos un "truco" con AppState o directamente llamamos desde profile
        // Pero la forma más simple: exponer una función para recargar

        return () => {
            // cleanup
        };
    }, [loadUser]);

    // 👇 Exponer una función para recargar manualmente
    const reloadUser = () => {
        loadUser();
    };

    return { user, loading, reloadUser };
};