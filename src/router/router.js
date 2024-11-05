import { createRouter, createWebHistory } from "vue-router";
import { useStaticStore } from "@/stores/static";
import { useAuthStore } from "@/stores/auth";
import { getAuth } from "firebase/auth";

const Home = () => import("@/pages/Home.vue");
const Error = () => import("@/pages/Error.vue");
const Tomorrow = () => import("@/pages/Tomorrow.vue");
const History = () => import("@/pages/History.vue");
const News = () => import("@/pages/News.vue");
const CategoryNews = () => import("@/pages/CategoryNews.vue");
const Dashboard = () => import("@/pages/Dashboard.vue");
const Post = () => import("@/pages/Post.vue");
const NotFound = () => import("@/pages/NotFound.vue");
const SignUp = () => import("@/pages/authentication/SignUp.vue");
const SignIn = () => import("@/pages/authentication/SignIn.vue");

const routes = [
  {
    path: "/",
    redirect: { name: "Home" },
  },
  {
    path: "/forecast/",
    name: "Home",
    component: Home,
  },
  { path: "/forecast/error", name: "Error", component: Error },
  {
    path: "/forecast/tomorrow",
    name: "Tomorrow",
    component: Tomorrow,
  },
  {
    path: "/forecast/history",
    name: "History",
    component: History,
  },
  {
    path: "/forecast/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/forecast/news",
    name: "News",
    component: News,
    beforeEnter: (to, from) => {
      const staticStore = useStaticStore();
      if (
        to.params.category &&
        !staticStore.categories.includes(to.params.category)
      ) {
        return {
          name: "NotFound",
          params: {
            pathMatch: to.path.split("/").slice(1),
          },
          query: to.query,
          hash: to.hash,
        };
      }
    },
    children: [
      {
        path: ":category?",
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
  {
    path: "/forecast/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/forecast/signin",
    name: "SignIn",
    component: SignIn,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: "smooth" };
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.user) {
    next({ name: "SignIn" });
  } else if (to.meta.requiresAuth === false && authStore.user) {
    next({path: "/forecast/"})
  } else {
    next();
  }
});

export default router;
