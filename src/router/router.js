import { createRouter, createWebHistory, RouterView } from "vue-router";
import { useStaticStore } from "@/stores/static";
import { useAuthStore } from "@/stores/auth";
import { ability } from "../services/ability";
import { useSettingStore } from "@/stores/setting";
import { useSearchStore } from "@/stores/search";
import Tr from "@/i18n/translation";

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
const ProfileUser = () => import("@/pages/ProfileUser.vue");
const SettingUser = () => import("@/pages/SettingUser.vue");

const routes = [
  {
    path: "/:locale?",
    component: RouterView,
    beforeEnter: Tr.routeMiddleware,
    children: [
      {
        path: "",
        redirect: { name: "Home" },
      },
      {
        path: "forecast/",
        name: "Home",
        component: Home,
      },
      { path: "forecast/error", name: "Error", component: Error },
      {
        path: "forecast/tomorrow",
        name: "Tomorrow",
        component: Tomorrow,
      },
      {
        path: "forecast/history",
        name: "History",
        component: History,
      },
      {
        path: "forecast/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          resource: "Dashboard",
          redirect: "Home",
        },
      },
      {
        path: "forecast/news",
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
        path: "forecast/signup",
        name: "SignUp",
        component: SignUp,
        meta: {
          resource: "SignUp",
          redirect: "Home",
        },
      },
      {
        path: "forecast/signin",
        name: "SignIn",
        component: SignIn,
        meta: {
          resource: "SignIn",
          redirect: "Home",
        },
      },
      {
        path: "forecast/profile",
        name: "ProfileUser",
        component: ProfileUser,
        meta: {
          resource: "Profile",
          redirect: "SignIn",
        },
      },
      {
        path: "forecast/setting",
        name: "SettingUser",
        component: SettingUser,
        meta: {
          resource: "Setting",
          redirect: "SignIn",
        },
      },
      {
        path: ":pathMatch(.*)*",
        name: "NotFound",
        component: NotFound,
      },
    ],
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

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const settingStore = useSettingStore();
  const searchStore = useSearchStore();

  // получение данных пользователя
  if (authStore.uid && !authStore.user) {
    await authStore.getUserInfo();
    settingStore.getUnitsUser(authStore.user?.units);
    settingStore.getAddressUser(authStore.user?.address);
    settingStore.getOrderUser(authStore.user?.order);
    searchStore.setCityDefault(authStore.user?.address?.city);
  }

  const canNavigate = () => {
    if (to.meta.resource) {
      return ability.can("visit", to.meta.resource);
    } else {
      return true;
    }
  };

  if (!canNavigate()) {
    next({ name: to.meta.redirect, params: { locale: to.params.locale } });
  } else {
    next();
  }
});

export default router;
