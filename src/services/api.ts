import axios from 'axios';

export function fetchDataFromCSV() { 
    return axios.get(import.meta.env.GOOGLE_SHEET_URL);
}