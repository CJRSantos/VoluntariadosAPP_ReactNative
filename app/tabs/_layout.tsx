// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';

// Tipamos las props del ícono
type TabIconProps = {
    source: string;
    color: string;
    size: number;
};

const TabIcon = ({ source, color, size }: TabIconProps) => (
    <Image
        source={{ uri: source }}
        style={{
            width: size,
            height: size,
            tintColor: color,
        }}
    />
);

export default function TabLayout() {
    const { t } = useTranslation();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#4f46e5',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#ddd',
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('nosotros.nav.home'),
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon
                            source="https://via.placeholder.com/24x24?text=🏠"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="areas"
                options={{
                    title: t('nosotros.nav.areas'),
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon
                            source="https://via.placeholder.com/24x24?text=📊"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="convocatory"
                options={{
                    title: t('nosotros.nav.convocatory'),
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon
                            source="https://via.placeholder.com/24x24?text=📣"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="nosotros"
                options={{
                    title: t('nosotros.nav.about'),
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon
                            source="https://via.placeholder.com/24x24?text=👥"
                            color={color}
                            size={size}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}