export interface StocksResponse {
    code: number;
    status: string;
    data: {
        [key: string]: BatchRequestResult;
    };
}

interface BatchRequestResult {
    response: StockPriceResponse;
    status: string;
}

export interface StockPriceResponse {
    symbol?: string;
    price: string;
}