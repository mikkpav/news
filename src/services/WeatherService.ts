import type { WeatherForecastResponse, WeatherCurrentResponse } from '../types/weather';
import { fetchOrLoadDebug } from './serviceBase';

const API_KEY_OWM = import.meta.env.VITE_API_KEY_OWM;
const BASE_URL_OWM = 'https://api.openweathermap.org';
const ENDPOINT_OWM_CURRENT = 'data/2.5/weather';
const ENDPOINT_OWM_FORECAST = 'data/2.5/forecast';
const TALLINN_LAT = '59.4372155';
const TALLINN_LON = '24.7453688';
const UNITS_METRIC = 'metric';

const DEBUG = false;

function buildUrl(endpoint: string): string {
    const url = new URL(`${BASE_URL_OWM}/${endpoint}`);
        const parameters = {
            appid: API_KEY_OWM,
            lat: TALLINN_LAT,
            lon: TALLINN_LON,
            units: UNITS_METRIC
        }

        Object.entries(parameters).forEach(([key, value]) => {
            url.searchParams.set(key, value);
        });
    
    return url.toString();
}

const WeatherService = {
    async fetchCurrent(): Promise<WeatherCurrentResponse> {
        const url = buildUrl(ENDPOINT_OWM_CURRENT);
        const data: WeatherCurrentResponse = await fetchOrLoadDebug<WeatherCurrentResponse>(url, DEBUG);
        
        return data;
    },

    async fetchForecast(): Promise<WeatherForecastResponse> {
        const url = buildUrl(ENDPOINT_OWM_FORECAST);
        const data: WeatherForecastResponse = await fetchOrLoadDebug<WeatherForecastResponse>(url, DEBUG);
        
        return data;
    }
}

export default WeatherService;