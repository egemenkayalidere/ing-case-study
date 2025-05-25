import { translations } from './translations.js';

class I18nService {
  constructor() {
    this._language = localStorage.getItem('language') || 'tr';
  }

  get language() {
    return this._language;
  }

  set language(lang) {
    if (lang !== 'tr' && lang !== 'en') {
      throw new Error('Desteklenmeyen dil');
    }
    this._language = lang;
    localStorage.setItem('language', lang);
    // Dil değişikliği olayını yayınla
    window.dispatchEvent(new CustomEvent('language-changed', { detail: lang }));
  }

  t(key) {
    const currentTranslations = translations[this._language];
    return currentTranslations[key] || key;
  }
}

// Singleton instance
const i18nService = new I18nService();
export default i18nService;
