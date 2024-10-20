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
    name: "Home",
    component: Home,
  },
  {
    path: "/forecast",
    redirect: { name: "Home" },
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
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Home" },
  },
];

const router = createRouter({
  mode: history,
  history: createWebHistory(),
  routes,
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
