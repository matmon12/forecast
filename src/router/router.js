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
  { path: process.env.NODE_ENV === "production" ? "/forecast/" : "/", name: "Home", component: Home },
  { path: "/error", name: "Error", component: Error },
  { path: "/tomorrow", name: "Tomorrow", component: Tomorrow },
  { path: "/history", name: "History", component: History },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/news",
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
      }
    ],
  },
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
});

export default router;
