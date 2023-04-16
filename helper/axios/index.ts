import axios from "axios";

export const Fetcher = axios.create({
    baseURL: 'http://139.59.126.97',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
})