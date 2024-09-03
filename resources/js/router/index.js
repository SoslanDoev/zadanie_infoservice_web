import { createRouter, createWebHistory } from 'vue-router'
import { useStore } from 'vuex'; // Импорт store

const routes = [
    // Главная страница 
    {
        path: '/', name: 'HomeView', meta: {
            header: true, footer: true,
            guard: "all", // Маршрут только для гостей 
        },
        component: () => import("../views/HomeView.vue")
    },
    // Регистрация 
    {
        path: '/register', name: 'RegisterView', meta: {
            header: true, footer: true,
            guard: "guest", // Маршрут только для гостей 
        },
        component: () => import("../views/RegisterView.vue")
    },
    // Авторизация 
    {
        path: '/auth', name: 'AuthView', meta: {
            header: true, footer: true,
            guard: "guest", // Маршрут только для гостей 
        },
        component: () => import("../views/AuthView.vue")
    },
    //  Страница не найдена 
    {
        path: "/:pathMatch(.*)*", name: "NotFound", meta: {
            header: true, footer: true,
        },
        component: () => import("../views/NotFound.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Middleware для проверки авторизации
router.beforeEach((to, from, next) => {
    next()
});

export default router