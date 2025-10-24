// app/providers/ThemeProvider.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light');

    // Cargar preferencia guardada
    useEffect(() => {
        const loadTheme = async () => {
            const saved = await AsyncStorage.getItem('@user_theme');
            if (saved === 'dark' || saved === 'light') {
                setTheme(saved);
            } else {
                // Si no hay preferencia, usa el sistema
                const systemTheme = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
                setTheme(systemTheme);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await AsyncStorage.setItem('@user_theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}