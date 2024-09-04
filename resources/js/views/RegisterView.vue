<template>
    <div class="register">
        <div class="container">
            <div class="register__inner">
                <div class="form">
                    <!-- Шапка формы -->
                    <div class="form__header">
                        <h3 class="form__header-title">Регистрация</h3>
                        <router-link class="link" to="/auth">Авторизация</router-link>
                    </div>
                    <!-- END Шапка формы -->

                    <!-- Кнопки -->
                    <div class="form__box" v-for="item in forms.inputs" :key="item.id">
                        <label :for="item.id" class="label">{{ item.placeholder }}</label>
                        <input :type="item.type" :placeholder="item.placeholder" class="input" v-model.trim="forms.fields[item.id]">
                        <p>{{ errors[item.id] }}</p>
                    </div>

                    <div class="form__box">
                        <button @keyup.enter="register" @click.prevent="register" class="btn">Зарегистрироваться</button>
                    </div>
                    <p v-if="errors['message']">{{ errors['message'] }}</p>
                    <!-- END Кнопки -->
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue"

    // Router на vue
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
        const fields = { name: "", email: "", password: "", password_confirmation: "" };
        // Для создания кнопок
        const inputs = [
            { placeholder: "Введите имя", value: () => forms.value.fields.name, type: "text", id: "name" },
            { placeholder: "Введите почту", value: () => forms.value.fields.email, type: "text", id: "email" },
            { placeholder: "Введите пароль", value: () => forms.value.fields.password, type: "password", id: "password" },
            { placeholder: "Повторите пароль", value: () => forms.value.fields.password_confirmation, type: "password", id: "password_confirmation" },
        ];
        return { fields, inputs };
    }
    const forms = ref(createForm());

    const register = async () => {
        /*
            * Функция для запуска другой функции для регистрации пользователя
            * @returns {Object} - Результат регистрации
            *   - status: boolean - Статус регистрации (true - успешно, false - ошибка)
            *   - errors: Object - Объект с ошибками, если статус false
        */
        store.commit("SET_LOADER", true)
        errors.value = {}
        try {
            const { name, email, password, password_confirmation } = forms.value.fields
            const data = await store.dispatch("register", { name, email, password, password_confirmation, })
            // Получение если ошибка
            console.log(data)
            if (!data.status || data.status >= 400) {
                if (typeof(data.errors) === "string") {
                    errors.value['message'] = data.errors
                    console.log('da')
                } else if (typeof(data.errors) === "object") {
                    for (const err in data.errors) {
                        errors.value[err] = data.errors[err]
                    }
                }
                store.commit("SET_LOADER", false)
                return
            } 
            localStorage.setItem("token", data.data.access_token)
            await store.dispatch("auth", { token: data.data.access_token })
            router.push("/")
            store.commit("SET_LOADER", false)
        } catch (err) {
            store.commit("SET_LOADER", false)
            console.log(err)
        }
    }
    
</script>