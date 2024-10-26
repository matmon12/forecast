import { createRouter, createWebHistory } from "vue-router";
import { useStaticStore } from "@/stores/static";

const Home = () => import("@/pages/Home.vue");
const Error = () => import("@/pages/Error.vue");
const Tomorrow = () => import("@/pages/Tomorrow.vue");
const History = () => import("@/pages/History.vue");
const News = () => import("@/pages/News.vue");
const CategoryNews = () => import("@/pages/CategoryNews.vue");
const Dashboard = () => import("@/pages/Dashboard.vue");
const Post = () => import("@/pages/Post.vue");
const NotFound = () => import("@/pages/NotFound.vue");

const routes = [
  // {
  //   path: "/",
  //   redirect: { name: "Home" },
  // },
  {
    path: "/forecast/",
    name: "Home",
    component: Home,
    alias: "/",
  },
  { path: "/forecast/error", name: "Error", component: Error, alias: "/error" },
  {
    path: "/forecast/tomorrow",
    name: "Tomorrow",
    component: Tomorrow,
    alias: "/tomorrow",
  },
  {
    path: "/forecast/history",
    name: "History",
    component: History,
    alias: "/history",
  },
  {
    path: "/forecast/dashboard",
    name: "Dashboard",
    component: Dashboard,
    alias: "/dashboard",
  },
  {
    path: "/forecast/news",
    name: "News",
    component: News,
    alias: "/news",
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
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  // {
  //   path: '/forecast/:afterForecast(.*)',
  //   redirect: {name: "Tomorrow"}
  // }
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

export default router;

// const router1 = new Router({
//   routes: [
//     {
//       path: "/",
//       component: HelloWorld,
//       meta: {
//         breadCrumbs: [
//           {
//             to: "/", // hyperlink
//             text: "Hello World", // crumb text
//           },
//         ],
//       },
//     },
//     {
//       path: "/earth",
//       component: HelloEarth,
//       meta: {
//         breadCrumbs: [
//           {
//             to: "/earth", // hyperlink
//             text: "Earth", // crumb text
//           },
//         ],
//       },
//       children: [
//         {
//           path: "moon",
//           component: HelloMoon,
//           meta: {
//             breadCrumb: [
//               {
//                 to: "/earth", // hyperlink
//                 text: "Earth", // crumb text
//               },
//               {
//                 to: "/earth/moon", // hyperlink
//                 text: "Moon", // crumb text
//               },
//             ],
//           },
//         },
//       ],
//     },
//     {
//       path: "/saturn",
//       component: HelloSaturn,
//       meta: {
//         breadCrumb: [
//           {
//             to: "/saturn", // hyperlink
//             text: "Saturn", // crumb text
//           },
//         ],
//       },
//       children: [
//         {
//           path: ":moon",
//           component: HelloSaturnMoon,
//           props: true,
//         },
//       ],
//     },
//   ],
// });
