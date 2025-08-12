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

interface StockPriceResponse {
  price: number;
}