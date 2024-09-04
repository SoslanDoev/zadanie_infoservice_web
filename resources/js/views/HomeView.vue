<!-- Главная страница -->

<template>
    <div class="home">
        <div class="container">
            <div class="home__inner">

                <!-- Блок подтверждения удаления записи, отображается только при включении destroyEnabled -->
                <div class="home__update" v-if="destroyEnabled">
                    <h2 class="home__update-delete--title">Удалить запись ?</h2>
                    <div class="home__delete-header">
                        <button class="btn" @click="destroy(destroyIndex)">Удалить</button>
                        <button class="btn" @click="destroyEnabled = false">Отмена</button>
                    </div>
                </div>
                
                <!-- Блок обновления записи, отображается при enabled в checkUpdate -->
                <div class="home__update" v-if="checkUpdate.enabled">
                    <div class="home__update-header">
                        <h2>Обновить {{ checkUpdate.data.email }} - {{ checkUpdate.data.id }}</h2>
                        <button class="btn" @click="checkUpdate.enabled = false">Закрыть</button>
                    </div>
                    <!-- Шапка формы -->
                    <div class="form__header">
                        <h3 class="form__header-title">Заявка</h3>
                    </div>
                    <!-- END Шапка формы -->
                    <!-- Кнопки -->

                    <div class="form__box">
                        <label for="status" class="label">Статус</label>
                        <select class="input" v-model="checkUpdate.data.status" name="status" id="status">
                            <option value="Новый">Новый</option>
                            <option value="В работе">В работе</option>
                            <option value="Завершен">Завершен</option>
                        </select>
                    </div>
                     
                    <div class="form__box" v-for="item in forms.inputs" :key="item.id">
                        <label :for="item.id" class="label">{{ item.placeholder }}</label>
                        <textarea v-if="item['id'] === 'text'" :placeholder="item.placeholder" name="text" disabled v-model.trim="checkUpdate.data[item.id]" class="textarea"></textarea>
                        <input v-else :type="item.type" :placeholder="item.placeholder" class="input" disabled v-model.trim="checkUpdate.data[item.id]">
                    </div>

                    <div class="form__box">
                        <button @keyup.enter="login" @click.prevent="leedUpdate(checkUpdate.data.id)" class="btn">Обновить статус</button>
                        <p>{{ errors['message'] }}</p>
                    </div>
                    <!-- END Кнопки -->
                </div>

                <!-- Если пользователь авторизован, отображается список лидов -->
                <div v-if="store.state.user.isAuthenticated">
                    <h2>Список лидов. <span v-if="leedList">Кол-во: {{ leedList.length }}</span></h2>
                    <table>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Телефон</th>
                        <th>Email</th>
                        <th>Текст обращения</th>
                        <th>Статус</th>
                        <th>Дата создания</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(lead, idx) in leedList" :key="lead.id" @click="checkUpdateActive({ id: idx, item: lead })">
                        <td>{{ lead.id }}</td>
                        <td>{{ lead.name }}</td>
                        <td>{{ lead.surname }}</td>
                        <td>{{ lead.phone }}</td>
                        <td>{{ lead.email }}</td>
                        <td>{{ lead.text }}</td>

                        <td>{{ lead.status }}</td>

                        <td>{{ formatDate(lead.created_at) }}</td>
                        <td><button class="btn" @click.stop="destroyPre(lead.id)">Удалить</button></td>
                        </tr>
                    </tbody>
                    </table>
                </div>

                <!-- Если пользователь не авторизован, отображается форма создания заявки -->
                <div class="form home__form" v-else>
                    <!-- Шапка формы -->
                    <div class="form__header">
                        <h3 class="form__header-title">Заявка</h3>
                    </div>
                    <!-- END Шапка формы -->
                    <!-- Кнопки -->
                    <div class="form__box" v-for="item in forms.inputs" :key="item.id">
                        <label :for="item.id" class="label">{{ item.placeholder }}</label>
                        <textarea v-if="item['id'] === 'text'" :placeholder="item.placeholder" name="text" v-model.trim="forms.fields['text']" class="textarea"></textarea>
                        <input v-else :type="item.type" :placeholder="item.placeholder" class="input" v-model.trim="forms.fields[item.id]">
                        <p>{{ errors[item.id] }}</p>
                    </div>

                    <div class="form__box">
                        <button @keyup.enter="login" @click.prevent="leedSubmit" class="btn">Отправить</button>
                        <p>{{ errors['message'] }}</p>
                    </div>
                    <!-- END Кнопки -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // Импорт необходимых функций Vue.js и зависимостей
    import { ref, onMounted } from "vue"
    import { useStore } from "vuex"
    import axios from "axios"

    // Использование Vuex для хранения данных пользователя
    const store = useStore()

    
    // Объект для хранения ошибок валидации
    const errors = ref({})

    // Список лидов
    const leedList = ref(null)

    // Обновление
    const checkUpdate = ref({
        enabled: false,
        id: -1,
        data: {},
    })

    const destroyEnabled = ref(false)
    const destroyIndex = ref(null)

    const createForm = () => {
        /*
            Функция для удобной записи данных в один объект 
            * @returns {Object} - Результат регистрации
            *   - fields: Object - Значения кнопок
            *   - inputs: Array - Массив кнопок
        */
        // Значения кнопок
        const fields = { name: "", surname: "", phone: "", email: "", text: "", status: ""};
        // Для создания кнопок
        const inputs = [
            { placeholder: "Введите имя", value: () => forms.value.fields.name, type: "text", id: "name" },
            { placeholder: "Введите фамилию", value: () => forms.value.fields.surname, type: "text", id: "surname" },
            { placeholder: "Введите телефон", value: () => forms.value.fields.phone, type: "text", id: "phone" },
            { placeholder: "Введите почту", value: () => forms.value.fields.email, type: "text", id: "email" },
            { placeholder: "Введите текст", value: () => forms.value.fields.text, type: "text", id: "text" },
        ];
        return { fields, inputs };
    }
    const forms = ref(createForm());

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
        return new Date(dateString).toLocaleDateString('ru-RU', options)
    }

    const destroy = async (id) => {
        try {
            const data = await axios.delete(`/api/leed/${id}`)
            if (data.data.status >= 400) {
                errors['message'] = data.data.message
                return 
            }
            leedList.value = leedList.value.filter((e) => e.id !== id)
            destroyEnabled.value = false
            destroyIndex.value = null
        } catch (err) {
            console.log(err)
        }
    }

    const getLeed = async () => {
        try {
            const leedData = await axios.get("/api/leed")
            leedList.value = leedData.data
            console.log(leedData)
        } catch (err) {
            console.log(err)
        }
    }

    const checkUpdateActive = ({ id, item }) => {
        destroyEnabled.value =  false
        destroyIndex.value = null

        checkUpdate.value.enabled = true
        checkUpdate.value.id = id
        checkUpdate.value.data = item
    }


   const destroyPre = (id) => {
        checkUpdate.value.enabled = false
        checkUpdate.value.id = null
        checkUpdate.value.data = null

        destroyEnabled.value =  true
        destroyIndex.value = id
   } 
    
    const leedUpdate = async (id) => {
        try {
            await axios.patch(`/api/leed/${id}`, { status: checkUpdate.value.data.status })
        } catch (err) {
            console.log(err)
        }
    }

    const leedSubmit = async () => {
        console.log("yes")
        try {
            const { name, surname, phone, email, text } = forms.value.fields
            const data = await axios.post("/api/leed", { name, surname, phone, email, text })
            errors.value = {}
            console.log(data)
            if (data.data.errors) {
                const errorsData = data.data.errors
                for (const err in errorsData) {
                    errors.value[err] = errorsData[err][0] || errorsData[err] 
                }
                return 
            }
        } catch (err) {
            console.log(err)
        }
    }

    onMounted(() => {
        getLeed()
    })
</script>

<style>
    .home__form {
        max-width: 500px;
        width: 100%;
    }
    .home__update {
        position: fixed;
        background-color: var(--clr-secondary);
        padding: 10px;
        top: 50%;
        left: 50%;
        border: 1px solid var(--clr-text);
        max-width: 500px;
        width: 100%;
        transform: translate(-50%, -50%);
        border-radius: var(--border-radius-default);
    }
    .home__update-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 5px;
    }
    .home__update-header .btn {
        width: 100px;
    }
    .home__update-delete--title {
        text-align: center;
        margin: 0 0 5px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 10px;
        border: 1px solid var(--clr-primary);
        text-align: left;
        background-color: var(--clr-secondary);
    }
    th {
        background-color: var(--clr-secondary);
    }
</style>