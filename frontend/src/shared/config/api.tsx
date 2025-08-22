import axios from 'axios';

export const register = (data: {username: string, email: string, password: string, location: string, jobTitle: string, description: string;}) => {
    return axios.post('http://localhost:3000/api/auth/register', data);
}

export const login = (data: {username:string, password:string }) => {
    return axios.post('http://localhost:3000/api/auth/login', data);
}

export const getCurrentUser = () => {
    return axios.get('http://localhost:3000/api/users/list'); 
}

export const getUserprofile = () => axios.get('http://localhost:3000/api/users/profile', {
    headers:{
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});