import type { StocksResponse, StockPriceResponse } from '../types/stocks';
import { fetchBatchOrLoadDebug } from './serviceBase';
import stocks_debug from './test data/stocks_debug_response.json';

const API_KEY_TWELVE_DATA = import.meta.env.VITE_API_KEY_TWELVE_DATA;
const BASE_URL_TWELVE_DATA = 'https://api.twelvedata.com';

const DEBUG = true;

const StocksService = {
    async fetchBatchStockPrices(symbols: string[]): Promise<StockPriceResponse[]> {
        const batchPayload: Record<string, { url: string }> = {};

        symbols.forEach((symbol, index) => {
            batchPayload[`req_${index + 1}`] = {
                url: `/price?symbol=${symbol.toUpperCase()}&apikey=${API_KEY_TWELVE_DATA}`,
            };
        });
        
        const data = await fetchBatchOrLoadDebug<StocksResponse>(
            `${BASE_URL_TWELVE_DATA}/batch`,
            API_KEY_TWELVE_DATA,
            batchPayload,
            DEBUG,
            stocks_debug
        );

        const prices = Object.keys(batchPayload).map((key, index) => (
            { symbol: symbols[index], price: parseFloat(data.data[key]?.response.price).toFixed(2) ?? 'NaN' }
        ));

        return prices;
    }
};

export default StocksService;