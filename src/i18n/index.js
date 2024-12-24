import { createI18n } from "vue-i18n";
import gbr from "./locales/gbr.json";
import { DEFAULT_LOCALE, FALLBACK_LOCALE } from "@/constants/index";
import pluralRules from "./rules/pluralization";
import numberFormats from "./rules/numbers";
import datetimeFormats from "./rules/datetime";

export default createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: FALLBACK_LOCALE,
  messages: {
    gbr,
  },
  pluralRules,
  numberFormats,
  datetimeFormats,
});
