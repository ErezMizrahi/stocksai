import axios, { AxiosRequestConfig } from "axios";



export const client = axios.create({
  baseURL: "https://stocksai-backend.vercel.app/",
  adapter: ['xhr', 'http']
});


const get = async (url: string, config: any) => {
    return await client.get(url);
}

const post = async (url: string, config: any) => {
    return await client.post(url, config.params);
}

export const sendRequest = (method: string) => {
    switch(method) {
        case 'GET': return get;
        case 'POST': return post;
        default: return get
    }
}

export const setHeaderToken = (token: string) => {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
    console.log('header' , client.defaults.headers.common.Authorization)
};