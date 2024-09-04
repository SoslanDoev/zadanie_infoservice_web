<template>
    <div class="wrapper">

        <!-- Шапка сайта -->
        <AppHeader />
        <!-- END Шапка сайта -->
        
        <!-- VueRouter -->
         <main id="main">
             <router-view />
        </main>

        <!-- Подвал сайта  -->
        <AppFooter />
        <!-- END Подвал сайта  -->
        
    </div>
</template>

<script setup>
    import AppHeader from "@/Components/Header/AppHeader.vue"
    import AppFooter from "@/Components/Footer/AppFooter.vue"
</script>

<style>
    /* Базовые стили */
    *, *::after, *::before {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :root {
        /* Цвета */
        --clr-primary: #d8dee9;
        --clr-secondary: #eceff4;
        --clr-text: #333;
        /* END Цвета */
        
        /* Контейнер */
        --container-width: 1130px;
        --container-padding: 0 10px;
        --container-margin: 0 auto;
        /* End Контейнер */

        /* Анимация */
        --transition-default: all 200ms linear;
    }
    html, body {
        height: 100%;
    }
    body {
        color: var(--clr-text);
        background-color: var(--clr-primary);
    }
    .container {
        max-width: var(--container-width);
        padding: var(--container-padding);
        margin: var(--container-margin);
    }
    .wrapper, #app {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
    }
    ul, ol, li {
        list-style: none;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    /* END Базовые стили*/

    /* main */
    #main {
        flex: 1 1 auto;
    }
    /* END main */

    /* Дополнительные стили */
    .link {
        transition: var(--transition-default);
    }
    .link:hover {
        opacity: 0.5;
        transition: var(--transition-default);
    }
    /* END Дополнительные стили */

    /* Форма */
    .form {
        max-width: 400px;
        margin: 0 auto;
        background: var(--clr-secondary);
        padding: 25px;
        border-radius: 4px;
    }
    .form__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .input, .textarea {
        width: 100%;
        padding: 5px;
        padding-left: 5px;
        height: 40px;
        border-radius: 3px;
        margin: 5px 0;
        outline: none;
        border: none;
        font-weight: 600;
        font-family: inherit;
        font-size: 0.875rem;
        background-color: var(--clr-primary);
        color: var(--clr-text);
    }
    .input::placeholder {
        color: var(--clr-text);
    }
    .textarea {
        resize: none;
        height: 150px;
    }
    .btn {
        width: 100%;
        padding: 5px;
        padding-left: 5px;
        height: 40px;
        border-radius: 3px;
        margin: 5px 0;
        outline: none;
        border: none;
        background-color: var(--clr-text);
        color: var(--clr-primary);
        cursor: pointer;
        display: inline-block;
    }
    /* END Форма */
</style>