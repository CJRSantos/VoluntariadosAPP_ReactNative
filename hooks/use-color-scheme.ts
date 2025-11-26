import { useTheme } from '@/app/providers/ThemeProvider';

export function useColorScheme() {
    const { theme } = useTheme();
    return theme;
}