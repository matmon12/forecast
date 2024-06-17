import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "@/router/router.js";
import directives from "@/directives";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import PrimeVue from "primevue/config";
import "./index.scss";
import "primevue/resources/themes/aura-light-green/theme.css";
import { VueQueryPlugin } from "vue-query";
import FocusTrap from "primevue/focustrap";
import Tooltip from "primevue/tooltip";
import anime from "animejs/lib/anime.es.js";
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
  BarElement
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

app.provide("plugins", { anime });

app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(PrimeVue)
  .use(VueQueryPlugin)
  .mount("#app");
