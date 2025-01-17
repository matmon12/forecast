import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/router.js";
import directives from "@/directives";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import { VueQueryPlugin } from "vue-query";
import FocusTrap from "primevue/focustrap";
import Tooltip from "primevue/tooltip";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import anime from "animejs/lib/anime.es.js";
import { VueMaskDirective } from "v-mask";
import VueResize from "vue-resize";
import { abilitiesPlugin } from "@casl/vue";
import { ability } from "@/services/ability";
import VueTelInput from "vue-tel-input";
import i18n from "@/i18n";
import en from "./i18n/primelocale/en.json";
import countries from "i18n-iso-countries";
import "vue-tel-input/vue-tel-input.css";
import "vue-resize/dist/vue-resize.css";
import "./index.scss";

/* firebase */
import { VueFire } from "vuefire";
import { firebaseApp } from "@/server/firebase.config";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Legend,
  Tooltip as TooltipChart,
  scales,
  RadialLinearScale,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Legend,
  TooltipChart,
  scales,
  RadialLinearScale,
  ArcElement,
  BarElement
);

const app = createApp(App);
const pinia = createPinia();

directives.forEach((directive) => {
  app.directive(directive.name, directive);
});
app.directive("focustrap", FocusTrap);
app.directive("tooltip", Tooltip);
app.directive("mask", VueMaskDirective);

app.provide("plugins", { anime });
app.provide("t", i18n.global.t);
app.provide("countries", countries);

app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .use(PrimeVue, {
    locale: { ...en.en },
    theme: {
      preset: Aura,
      options: {
        cssLayer: true,
        cssLayer: {
          name: "primevue",
          order: "reset, primevue",
        },
        darkModeSelector: "system",
      },
    },
  })
  .use(VueResize)
  .use(VueQueryPlugin)
  .use(VueTelInput)
  .use(VueFire, {
    firebaseApp,
  })
  .use(i18n)
  .use(abilitiesPlugin, ability)
  .mount("#app");
