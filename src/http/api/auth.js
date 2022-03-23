import axios from 'axios'

export function authApi(url, data){
    return axios.post(url, data).then(response => response.data)
}