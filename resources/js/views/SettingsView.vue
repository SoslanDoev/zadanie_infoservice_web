<template>
    <div class="settings" v-if="store.state.user.isAuthenticated">
        <div class="container">
            <div class="settings__inner">
                
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
                        </div>
                        <div class="form__box">
                            <label for="new_password" class="label">Введите новый пароль</label>
                            <input type="text" class="input" v-model.trim="form.fields.new_password" placeholder="Введите новый пароль" id="new_password">
                        </div>
                        <div class="form__box">
                            <label for="new_password_confirmation" class="label">Повторите новый пароль</label>
                            <input type="text" class="input" v-model.trim="form.fields.new_password_confirmation" placeholder="Повторите новый пароль" id="new_password_confirmation">
                        </div>
                        <div class="form__box">
                            <button class="btn" @click="updatePassword">Обновить пароль</button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue"
    import { useStore } from "vuex"
    const store = useStore()
    import axios from "axios"

    const form = ref({
        fields: { old_password: "", new_password: "", new_password_confirmation: "" }
    })

    // Функция для подтверждения почты
    const submitEmail = async () => {
        try {
        // Route::get('/verify-email-message/{id}', [StoreController::class, 'verifyMessage']);
            const data = await axios.get(`/api/verify-email-message/${store.state.user.data.id}`)
            if (data.data.status >= 400) { console.log(data.data.message); return } 
            console.log("data123123123", data.data.message)
        } catch (err) {
            console.log(err)
        }
    }

    const updatePassword = async () => {
        try {
            const { old_password, new_password, new_password_confirmation } = form.value.fields
            const token = localStorage.getItem("token")
            const data = await axios.post("/api/auth/password_change", { old_password, new_password, new_password_confirmation }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(data)
        } catch (err) {
            console.log(err)
        }
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