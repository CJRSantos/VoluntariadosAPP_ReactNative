// app/help.tsx
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

export default function HelpScreen() {
    const { t } = useTranslation();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{t('help.title')}</Text>
        </View>
    );
}