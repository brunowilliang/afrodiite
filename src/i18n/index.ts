import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './translations/en';
import { es } from './translations/es';
import { pt } from './translations/pt';

export const defaultNS = 'translation' as const;

export const resources = {
	pt: { translation: pt },
	en: { translation: en },
	es: { translation: es },
} as const;

i18n.use(initReactI18next).init({
	resources,
	fallbackLng: 'pt',
	interpolation: {
		escapeValue: false,
	},
	keySeparator: '.',
	nsSeparator: false,
	react: {
		useSuspense: false,
		bindI18n: 'languageChanged',
		bindI18nStore: '',
		transEmptyNodeValue: '',
		transSupportBasicHtmlNodes: true,
		transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
	},
});

export default i18n;
