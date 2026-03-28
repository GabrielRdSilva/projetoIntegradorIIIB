import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000
})

export default api  // ← Certifique-se que esta linha existe