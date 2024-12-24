import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/constants/index";
import i18n from "./index";
import { nextTick } from "vue";

const Trans = {
  get defaultLocale() {
    return DEFAULT_LOCALE;
  },
  get supportedLocales() {
    return SUPPORTED_LOCALES;
  },
  set currentLocale(newLocale) {
    i18n.global.locale.value = newLocale;
  },
  isLocaleSupported(locale) {
    return Trans.supportedLocales.includes(locale);
  },
  getUserLocale() {
    const locale =
      window.navigator.language ||
      window.navigator.userLanguage ||
      Trans.defaultLocale;

    return {
      locale: locale,
      localeNoRegion: locale.split("-")[0],
    };
  },
  getPersistedLanguage() {
    const persistedLocale = localStorage.getItem("user-locale");

    if (Trans.isLocaleSupported(persistedLocale)) {
      return persistedLocale;
    } else {
      return null;
    }
  },
  guessDefaultLocale() {
    // localstorage
    const userPersistedLocale = Trans.getPersistedLanguage();
    if (userPersistedLocale) {
      return userPersistedLocale;
    }

    // browser recomendation
    const userPreferredLocale = Trans.getUserLocale();

    if (Trans.isLocaleSupported(userPreferredLocale.locale)) {
      return userPreferredLocale.locale;
    }
    if (Trans.isLocaleSupported(userPreferredLocale.localeNoRegion)) {
      return userPreferredLocale.localeNoRegion;
    }

    // default
    return Trans.defaultLocale;
  },
  async switchLanguage(newLocale) {
    // ленивая загрузка файла для локали
    await Trans.loadLocaleMessages(newLocale);

    Trans.currentLocale = newLocale;
    document.querySelector("html").setAttribute("lang", newLocale);

    // сохранять локаль для следующего посещения
    localStorage.setItem("user-locale", newLocale);
  },
  async loadLocaleMessages(locale) {
    if (!i18n.global.availableLocales.includes(locale)) {
      const messages = await import(`@/i18n/locales/${locale}.json`);
      i18n.global.setLocaleMessage(locale, messages.default);
    }

    return nextTick();
  },
  async routeMiddleware(to, from, next) {
    const paramLocale = to.params.locale;

    if (!Trans.isLocaleSupported(paramLocale)) {
      return next(Trans.guessDefaultLocale());
    }

    await Trans.switchLanguage(paramLocale);

    return next();
  },
};

export default Trans;
