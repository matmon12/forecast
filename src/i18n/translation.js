import {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  FLAG_LOCALES,
} from "@/constants/index";
import i18n from "./index";
import { nextTick, inject } from "vue";
import { useLocalesStore } from "@/stores/locales";
import countries from "i18n-iso-countries";

const Trans = {
  get defaultLocale() {
    return DEFAULT_LOCALE;
  },
  get supportedLocales() {
    return SUPPORTED_LOCALES;
  },
  get flagsLocales() {
    return FLAG_LOCALES;
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
      const errors = await import(`@/i18n/errors/${locale}.json`);
      const rules = await import(`@/i18n/validation/${locale}.json`);
      const allMessages = Object.assign(
        {},
        messages.default,
        errors.default,
        rules.default
      );
      i18n.global.setLocaleMessage(locale, allMessages);
    }

    return nextTick();
  },
  async loadLocaleMessagesPrime(locale) {
    const localesStore = useLocalesStore();
    if (!localesStore.locales[locale]) {
      const messagesPrime = await import(`./primelocale/${locale}.json`);
      Object.assign(localesStore.locales, messagesPrime.default);
    }

    return nextTick();
  },
  async loadLocaleCountries(locale) {
    if (!countries.langs().includes(locale)) {
      const messages = await import(`@/i18n/countries/${locale}.json`);
      countries.registerLocale(messages.default);
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
