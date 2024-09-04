import { createRouter, createWebHistory } from 'vue-router'
import store from "../store/index"

const routes = [
    // Главная страница 
    {
        path: '/', name: 'HomeView', meta: {
            header: true, footer: true, // Показывать шапку и подвал
            guard: "all", // Маршрут только для гостей 
        },
        component: () => import("../views/HomeView.vue")
    },
    // Регистрация 
    {
        path: '/register', name: 'RegisterView', meta: {
            header: true, footer: true, // Показывать шапку и подвал
            guard: "guest", // Маршрут только для гостей 
        },
        component: () => import("../views/RegisterView.vue")
    },
    // Авторизация 
    {
        path: '/auth', name: 'AuthView', meta: {
            header: true, footer: true, // Показывать шапку и подвал
            guard: "guest", // Маршрут только для гостей 
        },
        component: () => import("../views/AuthView.vue")
    },
    // Пользователь 
    {
        path: '/settings', name: 'SettingsView', meta: {
            header: true, footer: true, // Показывать шапку и подвал
            guard: "auth", // Маршрут только для гостей 
        },
        component: () => import("../views/SettingsView.vue")
    },
    //  Страница не найдена 
    {
        path: "/:pathMatch(.*)*", name: "NotFound", meta: {
            header: true, footer: true, // Показывать шапку и подвал
            guard: "all", // Маршрут только для гостей 
        },
        component: () => import("../views/NotFound.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

// Middleware для проверки авторизации
router.beforeEach(async (to, from, next) => {
    const isAuthenticated = store.state.user.isAuthenticated;
    // Проверяем, нужно ли выполнить проверку
    if (!isAuthenticated && localStorage.getItem("token")) {
        try {
            // Асинхронно запрашиваем данные пользователя
            await store.dispatch("auth", { token: localStorage.getItem("token") });
        } catch (error) {
            // Если возникла ошибка при получении данных, можно перенаправить на страницу входа
            localStorage.removeItem("token")
            return next({ name: 'AuthView' });
        }
    }

    // Проверка защиты маршрута
    if (to.meta.guard === "guest" && store.state.user.isAuthenticated) {
        // Если пользователь авторизован и пытается попасть на страницу для гостей
        return next({ name: 'HomeView' });
    }

    if (to.meta.guard === "auth" && !store.state.user.isAuthenticated) {
            // Если пользователь не авторизован и пытается попасть на страницу для авторизованных
            return next({ name: 'HomeView' });
    }


    // Продолжить переход к маршруту
    next();
});


export default router