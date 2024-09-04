<template>
    <div class="register">
        <div class="container">
            <div class="register__inner">

                <div class="form">
                    <!-- Шапка формы -->
                    <div class="form__header">
                        <h3 class="form__header-title">Авторизация</h3>
                        <router-link class="link" to="/register">Регистрация</router-link>
                    </div>
                    <!-- END Шапка формы -->

                    <!-- Кнопки -->
                    <div class="form__box" v-for="item in forms.inputs" :key="item.id">
                        <label :for="item.id" class="label">{{ item.placeholder }}</label>
                        <input :type="item.type" :placeholder="item.placeholder" class="input" v-model.trim="forms.fields[item.id]">
                        <p>{{ errors[item.id] }}</p>
                    </div>

                    <div class="form__box">
                        <button @keyup.enter="login" @click.prevent="login" class="btn">Войти</button>
                        <p>{{ errors['message'] }}</p>
                    </div>
                    <!-- END Кнопки -->
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue"
    // Подключение роутов vue
    import { useRouter } from "vue-router"
    const router = useRouter()
    
    // Вывод ошибок
    const errors = ref({})

    // Глобальное хранилище
    import { useStore } from "vuex"
    const store = useStore()
    
    const createForm = () => {
        /*
            Функция для удобной записи данных в один объект 
            * @returns {Object} - Результат регистрации
            *   - fields: Object - Значения кнопок
            *   - inputs: Array - Массив кнопок
        */
        // Значения кнопок
        const fields = { email: "", password: "", };
        // Для создания кнопок
        const inputs = [
            { placeholder: "Введите почту", value: () => forms.value.fields.email, type: "text", id: "email" },
            { placeholder: "Введите пароль", value: () => forms.value.fields.password, type: "password", id: "password" },
        ];
        return { fields, inputs };
    }
    const forms = ref(createForm());

    const login = async () => {
        /*
            * Функция для запуска другой функции для регистрации пользователя
            * @returns {Object} - Результат регистрации
            *   - status: boolean - Статус регистрации (true - успешно, false - ошибка)
            *   - errors: Object - Объект с ошибками, если статус false
        */
       errors.value = {}
       store.commit("SET_LOADER", true)
        try {
            const { name, email, password, password_confirmation } = forms.value.fields
            const data = await store.dispatch("login", { name, email, password, password_confirmation, })
            // Получение если ошибка
            if (!data.status) {
                errors.value = data.errors
               store.commit("SET_LOADER", false)
                return
            }
            localStorage.setItem("token", data.data.access_token)
            await store.dispatch("auth", { token: data.data.access_token })
            store.commit("SET_LOADER", false)
            router.push("/")
        } catch (err) {
            store.commit("SET_LOADER", false)
            console.log(err)
        }
    }
    
</script>