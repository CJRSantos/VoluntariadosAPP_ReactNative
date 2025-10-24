// app/hooks/use-color-scheme.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type ColorSchemeName = 'light' | 'dark';

const STORAGE_KEY = '@user_color_scheme';

export function useColorScheme() {
    const [isDark, setIsDark] = useState<boolean>(false);
    const [scheme, setScheme] = useState<ColorSchemeName | null>(null);

    useEffect(() => {
        const load = async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === 'dark') {
                setIsDark(true);
                setScheme('dark');
            } else if (saved === 'light') {
                setIsDark(false);
                setScheme('light');
            } else {
                // Por defecto, sigue el sistema
                const systemScheme = Appearance.getColorScheme();
                if (systemScheme === 'dark') {
                    setIsDark(true);
                    setScheme('dark');
                } else {
                    setIsDark(false);
                    setScheme('light');
                }
            }
        };
        load();
    }, []);

    const toggleColorScheme = async () => {
        if (scheme === 'dark') {
            await AsyncStorage.setItem(STORAGE_KEY, 'light');
            setIsDark(false);
            setScheme('light');
        } else {
            await AsyncStorage.setItem(STORAGE_KEY, 'dark');
            setIsDark(true);
            setScheme('dark');
        }
    };

    // Escuchar cambios del sistema (opcional)
    useEffect(() => {
        if (scheme === 'dark' || scheme === 'light') return; // Si el usuario eligió manualmente, no seguimos el sistema

        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorScheme === 'dark') {
                setIsDark(true);
                setScheme('dark');
            } else {
                setIsDark(false);
                setScheme('light');
            }
        });
        return () => subscription.remove();
    }, [scheme]);

    return { isDark, toggleColorScheme };
}