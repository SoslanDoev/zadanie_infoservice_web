<template>
    <header class="header">
        <div class="container">
            <div class="header__inner">
                <!-- Логотип -->
                <AppLogo />
                <!-- END Логотип -->
                
                <!-- Меню -->
                <nav class="header__menu">
                    <ul class="header__list">
                        <li class="header__item" v-for="item in linksList" :key="item.url">
                            <!-- Ссылка для авторизованных пользователей -->
                            <router-link 
                                v-if="store.state.user && item.meta.auth === 'auth'"
                                class="link header__link" 
                                :to="item.url">{{ item.name }}
                            </router-link>
                            
                            <!-- Ссылка для гостей -->
                            <router-link 
                                v-else-if="!store.state.user && item.meta.auth === 'guest'"
                                class="link header__link" 
                                :to="item.url">{{ item.name }}
                            </router-link>

                            <!-- Ссылка для всех пользователей -->
                            <router-link 
                                v-else-if="item.meta.auth === 'all'"
                                class="link header__link" 
                                :to="item.url">{{ item.name }}
                            </router-link>
                        </li>
                    </ul>
                </nav>
                <!-- END Меню -->

            </div>
        </div>
    </header>
</template>

<script setup>
    //  Логотип сайта
    import AppLogo from "@/Components/AppLogo.vue"
    import { ref } from "vue"

    import { useStore } from "vuex"
    const store = useStore()

    // === Переменные ===  
    const linksList = ref([
        { name: "Главная",  url: "/", meta: { auth: "all", }},
        { name: "Регистрация", url: "/register", meta: { auth: "guest", } },
        { name: "Войти", url: "/auth", meta: { auth: "guest", } },
        { name: "Пользователь", url: "/settings", meta: { auth: "auth", } },
        { name: "Выход", url: "/logout", meta: { auth: "auth", } },
    ])
</script>

<style>
    /* Шапка */
    .header__inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 0;
    }

    /* Меню */
    .header__list {
        display: flex;
        gap: 5px;
    }
    .header__link {
        font-weight: 600;
    }
</style>