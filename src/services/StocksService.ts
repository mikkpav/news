import type { StocksResponse } from '../types/stocks';

const API_KEY_TWELVE_DATA = '1305ad2667684d83b734f6ee8b3d3f4a';
const BASE_URL_TWELVE_DATA = 'https://api.twelvedata.com';
const ENDPOINT_TWELVE_PRICE = 'price';

function buildUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(`${BASE_URL_TWELVE_DATA}/${endpoint}`);
    url.searchParams.set('apikey', API_KEY_TWELVE_DATA);
    for (const key in params) {
        url.searchParams.set(key, params[key]);
    }
    return url.toString();
}

const StocksService = {
    async fetchStockPrice(): Promise<number[]> {
        // '/price?symbol=AAPL&apikey=your_api_key'

        const url = buildUrl(ENDPOINT_TWELVE_PRICE, { symbol: 'aapl' });
        console.log(`URL: ${url.toString()}`)
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Error ${res.status}: Unable to fetch price ${ 'aapl' }`);
        } 

        const data: StocksResponse = await res.json();
        return [data.price];
    }
};

export default StocksService;