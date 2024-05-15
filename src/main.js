import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from "@/router/router.js";
import directives from "@/directives";
import {autoAnimatePlugin} from "@formkit/auto-animate/vue";
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'
import './index.scss';
import { VueQueryPlugin  } from "vue-query";
// import { ValidationProvider } from 'vee-validate';

const app = createApp(App);
const pinia = createPinia();


directives.forEach((directive) => {
  app.directive(directive.name, directive);
});

// app.component('ValidationProvider', ValidationProvider);

app
  .use(autoAnimatePlugin)
  .use(pinia)
  .use(router)
  .use(PrimeVue, { unstyled: true })
  .use(VueQueryPlugin )
  .mount('#app')
