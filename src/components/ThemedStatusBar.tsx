import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useTheme } from '../../app/providers/ThemeProvider';

export const ThemedStatusBar: React.FC = () => {
    const { theme } = useTheme();

    return <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />;
};
