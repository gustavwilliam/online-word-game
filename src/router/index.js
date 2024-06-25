import { createRouter, createWebHistory } from "vue-router";

import GameView from "../views/GameView.vue";
import HomeView from "../views/HomeView.vue";
import CheckerView from "../views/CheckerView.vue";

const routes = [
  {
    path: "/",
    component: HomeView,
  },
  {
    path: "/game",
    component: GameView,
  },
  {
    path: "/checker",
    component: CheckerView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
