import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import errorCodes from "./errors/en.json";
import rules from "./validation/en.json";
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from "@/constants/index";
import pluralRules from "./rules/pluralization";
import numberFormats from "./rules/numbers";
import datetimeFormats from "./rules/datetime";

export default createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  globalInjection: true,
  messages: {
    en: {
      ...en,
      ...errorCodes,
      ...rules
      },
    },
    pluralRules,
    numberFormats,
  datetimeFormats,
});
