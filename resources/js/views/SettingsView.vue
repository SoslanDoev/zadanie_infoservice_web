<template>
    <div class="settings" v-if="store.state.user.isAuthenticated">
        <div class="container">
            <div class="settings__inner">
                <AppAlert v-if="alertMessage.status === 'success'" :message="alertMessage.message" type="success" />
                <AppAlert v-if="alertMessage.status === 'error'" :message="alertMessage.message" type="error" />
                <AppAlert v-if="alertMessage.status === 'warning'" :message="alertMessage.message" type="warning" />
                
                <div class="settings__forms">
                    <div class="form">
                        <div class="form__header settings__form-header--1">
                            <p>{{ store.state.user.data.email }}</p>
                            <p v-if="!store.state.user.data.verification_token">Ваша почта подтверждена</p>
                            <div v-else>
                                <button class="btn" @click.prevent="submitEmail">Отправить письмо на почту для подтверждения</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form">
                        <!-- Шапка формы -->
                        <div class="form__header">
                            <h3 class="form__header-title">Смена пароля</h3>
                        </div>
                        <!-- END Шапка формы -->

                        <!-- Кнопки -->
                        <div class="form__box">
                            <label for="password_old" class="label">Введите старый пароль</label>
                            <input type="text" class="input" v-model.trim="form.fields.old_password" placeholder="Введите старый пароль" id="password_old">
                            <p>{{ errors['old_password'] }}</p>
                        </div>
                        <div class="form__box">
                            <label for="new_password" class="label">Введите новый пароль</label>
                            <input type="text" class="input" v-model.trim="form.fields.new_password" placeholder="Введите новый пароль" id="new_password">
                            <p>{{ errors['new_password'] }}</p>
                        </div>
                        <div class="form__box">
                            <label for="new_password_confirmation" class="label">Повторите новый пароль</label>
                            <input type="text" class="input" v-model.trim="form.fields.new_password_confirmation" placeholder="Повторите новый пароль" id="new_password_confirmation">
                            <p>{{ errors['new_password_confirmation'] }}</p>
                        </div>
                        <div class="form__box">
                            <button class="btn" @click="updatePassword">Обновить пароль</button>
                            <p>{{ errors["message"] }}</p>
                        </div>
                    </div>

                    <div class="form">
                        <div class="form__header settings__form-header--1">
                            <button class="btn" @click.prevent="logout">Выйти из аккаунта</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue"
    import axios from "axios"

    import { useStore } from "vuex"

    import AppAlert from "@/Components/AppAlert.vue"

    import { useRouter } from "vue-router"

    const alertMessage = ref({
        message: "",
        status: "", // success, error, warning
        clear: (() => {
            setTimeout(() => {
                alertMessage.value.message = null
                alertMessage.value.status = null
            }, 2000);
        }),
    })

    const store = useStore()

    const router = useRouter()

    const errors = ref({})

    const form = ref({
        fields: { old_password: "", new_password: "", new_password_confirmation: "" }
    })

    // Функция для подтверждения почты
    const submitEmail = async () => {
        try {
        // Route::get('/verify-email-message/{id}', [StoreController::class, 'verifyMessage']);
            const data = await axios.get(`/api/verify-email-message/${store.state.user.data.id}`)
            if (data.data.status >= 400) { 
                console.log(data.data.message);
                // Сообщение
                alertMessage.value.message = "Ошибка. Письмо не отправлено"
                alertMessage.value.status = "error"
                alertMessage.value.clear()
                return
            } 
            // Сообщение
            alertMessage.value.message = "Успешно. Письмо отправлено вам на почту"
            alertMessage.value.status = "success"
            alertMessage.value.clear()
        } catch (err) {
            // Сообщение
            alertMessage.value.message = "Ошибка. Письмо не отправлено"
            alertMessage.value.status = "error"
            alertMessage.value.clear()
            console.log(err)
        }
    }

    const updatePassword = async () => {
        store.commit("SET_LOADER", true)
        errors.value = {}
        try {
            const { old_password, new_password, new_password_confirmation } = form.value.fields

            if (!old_password || old_password.length < 3) { errors.value["old_password"] =  "Старый пароль должен содержать более 3 символов" }
            else if (old_password.length >= 50) { errors.value["old_password"] =  "Старый пароль должен содержать менее 50 символов" }
            
            if (!new_password || new_password.length < 3) { errors["new_password"] =  "Новый пароль должен содержать более 3 символов" }
            else if (new_password.length >= 50) { errors.value["new_password"] =  "Новый пароль должен содержать менее 50 символов" }

            if (!new_password_confirmation || new_password_confirmation.length < 3) { errors.value["new_password_confirmation"] =  "Повторный пароль должен должен содержать 3 символов" }
            else if (new_password_confirmation.length >= 50) { errors.value["new_password_confirmation"] =  "Повторный пароль должен содержать менее 50 символов" }

            if (new_password !== new_password_confirmation) {
                errors.value["new_password"] = "Пароли должны совпадать"
                errors.value["new_password_confirmation"] = "Пароли должны совпадать"
                store.commit("SET_LOADER", false)
                return 
            }

            if (Object.keys(errors.value).length > 0) { 
                store.commit("SET_LOADER", false)
                return
            }

            const token = localStorage.getItem("token")
            const data = await axios.post("/api/auth/password_change", { old_password, new_password, new_password_confirmation }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (data.data.status >= 400) {
                if (data.data.errors && typeof(data.data.errors) === "string") {
                    errors.value["message"] = data.data.errors
                } else if (data.data.errors && typeof(data.data.errors) === "object") {
                    for (const err in data.data.errors) {
                        errors.value[err] = data.data.errors[err]
                    }
                }
                alertMessage.value.message = "Ошибка. Пароль не изменен"
                alertMessage.value.status = "error"
                alertMessage.value.clear()
                store.commit("SET_LOADER", false)
                return 
            }
            console.log(data)
            alertMessage.value.message = "Успешно. Пароль изменен"
            alertMessage.value.status = "success"
            alertMessage.value.clear()
            store.commit("SET_LOADER", false)
        } catch (err) {
            alertMessage.value.message = "Ошибка. Пароль не изменен"
            alertMessage.value.status = "error"
            alertMessage.value.clear()
            store.commit("SET_LOADER", false)
            console.log(err)
        }
    }

    const logout = async () => {
        await store.dispatch("logout", { token: localStorage.getItem("token") })
        router.push("/")
    }
</script>

<style>
    .settings__forms {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    .settings__forms .form {
        width: 100%;
    }
    .settings__form-header--1 {
        display: flex;
        flex-direction: column;
        gap: 5px;
        text-align: center;
    }
</style>