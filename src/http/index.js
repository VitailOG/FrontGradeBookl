import axios from 'axios'
import baseUrl from "./urls";
import router from '../router/index'
import Qs from "qs";

const http = axios.create({
    baseURL:baseUrl,
    withCredentials: true,
    paramsSerializer: params => Qs.stringify(params, {arrayFormat: 'repeat'})
})

http.interceptors.request.use((config) => {
    if (localStorage.getItem('access')) {
        config.headers.Authorization = `Bearer ${localStorage.getItem('access')}`
    }
    return config;
})

http.interceptors.response.use((config) => {
        return config;
    }, async (error) => {
        if (error.response.status === 401){
            try{
                await axios.post('/auth/api/token/refresh/',
                    {refresh:localStorage.getItem('refresh')},
                    {withCredentials:true}
                )
                    .then(response => {
                        localStorage.setItem('access', response.data.access)
                    })
                return http.request(error.config)
            } catch (e) {
                localStorage.removeItem('access')
                localStorage.removeItem('refresh')
                localStorage.removeItem('permission')
                router.push('/log-in')
            }
        }
    }
)

export default http