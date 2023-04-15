import axios from "axios";

export const Fetcher = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
})