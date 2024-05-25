import {createRouter, createWebHistory} from "vue-router";
import Home from "@/pages/Home.vue";
import Error from "@/pages/Error.vue"

const routes = [
  { path: '/forecast/', name: "Home", component: Home },
  { path: '/forecast/error', name: "Error", component: Error }
]

const router  = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

export default router;