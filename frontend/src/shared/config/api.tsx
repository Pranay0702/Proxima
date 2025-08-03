import axios from 'axios';

export const register = (data: {username: string, email: string, password: string}) => {
    return axios.post('http://localhost:3000/api/auth/register', data);
}

export const login = (data: {username:string, password:string }) => {
    return axios.post('http://localhost:3000/api/auth/login', data);
}