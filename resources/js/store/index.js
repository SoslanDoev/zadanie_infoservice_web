import { createStore } from 'vuex'
// Запросы
import axios from "axios"
// Валидация 
import { isValidEmail } from "@/helper/validation"

export default createStore({
  state: {
    loader: false, // Экран загрузки false - ВЫКЛ true - ВКЛ
    // Состояние пользователя
    user: { 
        isAuthenticated: false, // Флаг состояния авторизации (true - авторизован, false - не авторизован)
        data: null, // Данные пользователя 
    },
  },
  getters: {
  },
  mutations: {
    // Функция для запуска загрузки
    SET_LOADER(state, enabled) {
        state.loader = enabled
    },
    SET_USER(state, { user, isAuth }) {
        /**
         * Мутация для обновления состояния пользователя в Vuex.
         *
         * @param {Object} state - Состояние Vuex-хранилища.
         * @param {Object} user - Данные пользователя.
         * @param {Boolean} isAuth - Состояние авторизации (true - авторизован, false - не авторизован).
         */
        console.log(state.user)
        state.user.data = user
        state.user.isAuthenticated = isAuth
    }
  },
  actions: {
    async register({ commit }, { name, email, password, password_confirmation }) {
        /*
            * Действие для регистрации нового пользователя.
            *
            * @param {Object} { commit } - Функция для вызова мутаций Vuex.
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
            // Успешный ответ от сервера
            if (response.status >= 400 || response.data.status >= 400 ) {
                return { status: false, errors: response.data?.message };
            }
            console.log('Success:', response.data);
            return { status: true, data: response.data };
        } catch (error) {
            // Обработка ошибок валидации
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
            * Действие для авторизации пользователя и получения JWT токена.
            *
            * @param {Object} { commit } - Функция для вызова мутаций Vuex.
            * @param {Object} { email, password } - Данные пользователя для авторизации.
            * @returns {Promise<Object>} - Возвращает JWT токен и статус авторизации.
            *   - status: boolean - Статус авторизации (true - успешно, false - ошибка).
            *   - errors: Object - Объект с ошибками, если статус false.
        */
        let errors = {} // Объект для хранения ошибок
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
            if (response.status >= 400 || response.data.status >= 400 ) {
                return { status: false, errors: { "message": "Неправильный логин или пароль" }, };
            }
            return { status: true, data: response.data };
        } catch (error) {
            // Обработка ошибок авторизации
            console.log(error)
            if (error.response && error.response.data && error.response.data.errors) {
                const validationErrors = error.response.data.errors;
                // Преобразуем ошибки в объект errors
                for (const [field, messages] of Object.entries(validationErrors)) {
                    errors[field] = messages.join(', ');
                }
            }
            console.log('Validation Errors:', errors);
            return { status: false, errors: { "message": "Неправильный логин или пароль" }, };
        }
    },
    async auth({ commit }, { token }) {
        /*
            * Действие для получения данных пользователя по JWT токену.
            *
            * @param {Object} { commit } - Функция для вызова мутаций Vuex.
            * @param {Object} { token } - JWT токен для авторизации.
            * @returns {Promise<void>} - Если авторизация успешна, обновляет состояние пользователя.
        */ 
       let errors = {}
        try {
            const response = await axios.post("/api/auth/me", null, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                commit("SET_USER", { user: response.data, isAuth: true })
            }
        } catch (err) {
            console.log("err", err)
        }
    },
    async logout({ commit }, { token }) {
        /*
            * Действие для выхода пользователя из системы.
            *
            * @param {Object} { commit } - Функция для вызова мутаций Vuex.
            * @param {Object} { token } - JWT токен для авторизации.
            * @returns {Promise<Object>} - Возвращает статус выхода (true - успешно, false - ошибка).
        */ 
        try {
            const response = await axios.post("/api/auth/logout", null, {
                headers: {
                  "Authorization": `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                commit("SET_USER", { user: null, isAuth: false })
                localStorage.removeItem("token")
                return { status: true, errors: {} };
            }
            return { status: false, errors: {} };
        } catch (err) {
            console.log("err", err)
        }   
    }
  },
  modules: {
  }
})