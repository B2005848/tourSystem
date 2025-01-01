import { createRouter, createWebHashHistory } from "vue-router";
import Admin from "./admin.router";
import { useAuthStore } from "@/stores/authenticate-login";
import PageNotFound from "@/pages/404page_not_found/index.vue";
const routes = [
  ...Admin,
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: PageNotFound,
    meta: {
      title: "404 - Page Not Found",
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  document.title = to.meta?.title ?? "No title page!!!";
  if (to.path.startsWith("/admin") && !authStore.isLogged) {
    next({ name: "admin.login" });
  } else {
    next();
  }
});
export default router;
