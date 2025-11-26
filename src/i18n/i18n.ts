import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import 'intl-pluralrules';
import { initReactI18next } from 'react-i18next';

import enGB from './locales/en-GB.json';
import enUS from './locales/en-US.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import pt from './locales/pt.json';

const resources = {
    en: { translation: en },
    es: { translation: es },
    pt: { translation: pt },
    fr: { translation: fr },
    it: { translation: it },
    ja: { translation: ja },
    'en-GB': { translation: enGB },
    'en-US': { translation: enUS },
};

const LANGUAGE_KEY = 'user-language';

const initI18n = async () => {
    let savedLanguage = null;
    try {
        savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    } catch (error) {
        console.log('Error loading language', error);
    }

    const locales = Localization.getLocales();
    const deviceLanguage = locales[0]?.languageCode ?? 'es';

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage || deviceLanguage,
            fallbackLng: 'es',
            interpolation: {
                escapeValue: false,
            },
        });
};

initI18n();

export const changeLanguage = async (language: string) => {
    try {
        await i18n.changeLanguage(language);
        await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
        console.log('Error saving language', error);
    }
};

export default i18n;
