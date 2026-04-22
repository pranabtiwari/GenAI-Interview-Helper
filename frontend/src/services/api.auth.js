import axios from "axios"


const API_BASE_URL_VALUE = import.meta.env.VITE_API_BASE_URL || "/api";
const API_BASE_URL = axios.create({
    baseURL: API_BASE_URL_VALUE,
    withCredentials: true
})


export async function authRegister(name, email, password){
    try {
        const response = await API_BASE_URL.post('/auth/register', {
            name, email, password
        })
        localStorage.setItem('token', response.data.token)
        return response.data
    }catch (error) {
        console.error('Registration failed:', error)
        throw error
    }
}

export async function authLogin(email, password){
    try {
        const response = await API_BASE_URL.post('/auth/login', {
            email, password
        })
        
        localStorage.setItem('token', response.data.token)
        
        return response.data
    }catch(error){
        console.error('Login failed:', error)
        throw error
    }
}


export async function authLogout(){
    try {
        const response = await API_BASE_URL.delete('/auth/logout')
        return response.data
    } catch (error) {
        console.log('Logout error', error);
        throw error
    } finally {
        localStorage.removeItem('token')
    }
}


// export async function getMePage(){
//     try {
//         const token = localStorage.getItem('token')
//         const response = await API_BASE_URL.get('/getme',{
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         })
//         console.log(response);
//         return response.data.user
        
//     } catch (error) {   
//         console.log('Page Error: ', error);
//         throw error
        
        
//     }
// } 