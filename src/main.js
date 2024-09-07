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
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import anime from "animejs/lib/anime.es.js";
import { VueMaskDirective } from 'v-mask';
import VueResize from 'vue-resize';
import 'vue-resize/dist/vue-resize.css';
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
app.directive('mask', VueMaskDirective);

app.provide("plugins", { anime });

app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .use(PrimeVue, {
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
  .use(VueFire, {
    firebaseApp,
    // modules: [
    //   VueFireAuth(),
    // ]
  })
  .mount("#app");
