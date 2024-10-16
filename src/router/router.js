import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Error from "@/pages/Error.vue";
import Tomorrow from "@/pages/Tomorrow.vue";
import History from "@/pages/History.vue";
import News from "@/pages/News.vue";
import CategoryNews from "@/pages/CategoryNews.vue";
import Dashboard from "@/pages/Dashboard.vue";
import Post from "@/pages/Post.vue";

const routes = [
  {
    path: "/",
    redirect: { name: 'Home' },
  },
  {
    path: "/forecast/",
    name: "Home",
    component: Home,
  },
  { path: "/forecast/error", name: "Error", component: Error },
  { path: "/forecast/tomorrow", name: "Tomorrow", component: Tomorrow },
  { path: "/forecast/history", name: "History", component: History },
  { path: "/forecast/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/forecast/news",
    name: "News",
    component: News,
    children: [
      {
        path: "",
        name: "CategoryAll",
        component: CategoryNews,
      },
      {
        path: ":category",
        name: "CategoryNews",
        component: CategoryNews,
      },
      {
        path: ":category/:name",
        name: "Post",
        component: Post,
      },
    ],
  },
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

export default router;
