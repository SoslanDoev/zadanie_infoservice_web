import { createStore } from 'vuex'
// Запросы
import axios from "axios"
// Валидация 
import { isValidEmail } from "@/helper/validation"

export default createStore({
  state: {
    user: null, // Переменная пользователя будет как Object
  },
  getters: {
  },
  mutations: {
    SET_USER(state, user) {
        /**
         * Мутация для обновления состояния пользователя в Vuex.
         *
         * @param {Object} state - Состояние Vuex-хранилища.
         * @param {Object} user - Данные пользователя.
        */
        state.user = user
    }
  },
  actions: {
    async register({ commit }, { name, email, password, password_confirmation }) {
        /*
            * Функция для регистрации пользователя
            *
            * @param {Object} { commit } - Функция для изменения состояния Vuex.
            * @param {Object} { name, email, password, password_confirmation } - Данные пользователя для регистрации.
            * @returns {Promise<Object>} - Возвращает результат регистрации.
            *   - status: boolean - Статус регистрации (true - успешно, false - ошибка).
            *   - errors: Object - Объект с ошибками, если статус false.
        */
        let errors = {}
    
        if (!name || name.length < 3) { errors["name"] =  "Имя должно содержать более 3 символов" }
        else if (name.length >= 50) { errors["name"] =  "Имя должно содержать менее 50 символов" }
        // =====
        if (!email || email.length < 3) { errors["email"] =  "Почта должна содержать более 3 символов" }
        else if (email.length >= 50) { errors["email"] =  "Почта должна содержать менее 50 символов" }
        else if (!isValidEmail(email)) { errors["email"] = "Почта не соответствует действительности" }
        // =====
        if (!password || password.length < 3) { errors["password"] = "Пароль должен содержать более 3 символов" }
        else if (password.length >= 50) { errors["password"] =  "Пароль должен содержать менее 50 символов" }
        // =====
        if (!password_confirmation || password_confirmation.length < 3) { errors["password_confirmation"] = "Повторный пароль должен содержать более 3 символов" }
        else if (password_confirmation.length >= 50) { errors["password_confirmation"] =  "Повторный пароль должен содержать менее 50 символов" }
        // =====
        if (password !== password_confirmation) {
            errors["password"] =  "Пароли не совпадают"
            errors["password_confirmation"] =  "Пароли не совпадают"
        }
        // =====
        if (Object.keys(errors).length > 0) { return { status: false, errors } }
    
        try {
            const response = await axios.post('/api/users/', { name, email, password, password_confirmation });
            // Успешный ответ
            console.log('Success:', response.data);
            return { status: true, data: response.data };
        } catch (error) {
            // Обработка ошибок
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                // Преобразуем ошибки в объект errors
                for (const [field, messages] of Object.entries(validationErrors)) {
                    errors[field] = messages.join(', ');
                }
            }
            console.log('Validation Errors:', errors);
            return { status: false, errors: errors };
        }
    },
    async login({ commit }, { email, password }) {
        /*
            * Функция для получения JWT_TOKEN пользователя
            *
            * @param {Object} { commit } - Функция для изменения состояния Vuex.
            * @param {Object} { email, password } - Данные пользователя для авторизации.
            * @returns {Promise<Object>} - Возвращает JWT_TOKEN.
            *   - status: boolean - Статус получения токена (true - успешно, false - ошибка).
            *   - errors: Object - Объект с ошибками, если статус false.
        */
        let errors = {} // Ошибки
        if (!email || email.length < 3) { errors["email"] =  "Почта должна содержать более 3 символов" }
        else if (email.length >= 50) { errors["email"] =  "Почта должна содержать менее 50 символов" }
        else if (!isValidEmail(email)) { errors["email"] = "Почта не соответствует действительности" }
        // =====
        if (!password || password.length < 3) { errors["password"] = "Пароль должен содержать более 3 символов" }
        else if (password.length >= 50) { errors["password"] =  "Пароль должен содержать менее 50 символов" }
        // =====
        if (Object.keys(errors).length > 0) { return { status: false, errors } }
        try { 
            const response = await axios.post("/api/auth/login", { email, password })
            return { status: true, data: response.data };
        } catch (error) {
            // Обработка ошибок
            console.log(error)
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                // Преобразуем ошибки в объект errors
                for (const [field, messages] of Object.entries(validationErrors)) {
                    errors[field] = messages.join(', ');
                }
            }
            console.log('Validation Errors:', errors);
            return { status: false, errors: errors };
        }
    },
    async auth({ commit }, { token }) {
        /*
            * Функция для получения данных пользователя
            *
            * @param {Object} { commit } - Функция для изменения состояния Vuex.
            * @param {Object} { token } - JWT_TOKEN для авторизации.
            * @returns {Promise<Object>} - Возвращает результат авторизации.
            *   - status: boolean - Статус регистрации (true - успешно, false - ошибка).
            *   - errors: Object - Объект с ошибками, если статус false.
        */ 
        try {
            const response = await axios.post("/api/auth/me", null, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
            })
            commit("SET_USER", response.data)
        } catch (err) {
            console.log("err", err)
        }
    }
  },
  modules: {
  }
})
