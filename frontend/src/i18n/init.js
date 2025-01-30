import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ru from './resources/ru';

const i18nextInstance = i18next.createInstance();

i18nextInstance
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources: {
      ru,
    },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18nextInstance;
