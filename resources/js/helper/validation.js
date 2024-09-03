// Валидация

export const isValidEmail = (email) => {
    /*
        * Функция для проверки коректности email 
        * @param {String} { email } - Почта
        * @returns {Boolean} - Результат коректности (True - успешно, False - Ошибка)
    */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}