import Vue from "vue";
import VueRouter from "vue-router";
import Candidates from "@/views/Candidates.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Candidates",
        component: Candidates,
    }
];
const router = new VueRouter({
    mode: "history",
    routes,
  });

export default router;