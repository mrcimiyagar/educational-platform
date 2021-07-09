import { addLocaleData } from 'react-intl';
import FaLang from './entries/fa-IR';
import enLang from './entries/en-US';
import esLang from './entries/es-ES';

const AppLocale = {
    fa: FaLang,
    en: enLang,
    es: esLang
};
addLocaleData(AppLocale.fa.data);
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.es.data);

export default AppLocale;
