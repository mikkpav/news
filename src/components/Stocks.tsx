import StocksService from "../services/StocksService";
import type { StockPriceResponse } from '../types/stocks';
import { useEffect, useState, useRef } from 'react';

export default function Stocks() {
    const [prices, setPrices] = useState<StockPriceResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const didLoad = useRef(false);
    const symbols = ['NVDA', 'JPM', 'MSFT', 'TSLA', 'WMT', 'TT', 'AAPL', 'META', 'GOOG', 'AMZN', 'BRK.B'];
    const STOCK_URL_YAHOO = 'https://finance.yahoo.com/quote/'

    useEffect(() => {
        if (didLoad.current) return;
        didLoad.current = true;
        loadPrices();
    }, []);

    async function loadPrices() {
        try {
            const newPrices = await StocksService.fetchBatchStockPrices(symbols);
            setPrices(newPrices);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    if (error) return <div className='error'>Error loading:<br/>{ error }</div>;

    return (
        <>
            <h1 className='section-title-font gradient'>Stocks</h1>
            <ul className='flex flex-col justify-between px-30 gap-3 text-lg font-medium overflow-y-auto scroll-hide'
                aria-live='polite'>
                { loading
                    ?  Array(symbols.length)
                        .fill(0)
                        .map((_, i) => (
                            <li
                                key={i}
                                className={`${i % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} flex flex-row justify-between gap-4 animate-pulse`}
                            >
                                <span className="bg-gray-300 h-6 w-20 rounded"></span>
                                <span className="bg-gray-300 h-6 w-16 rounded"></span>
                            </li>
                        ))
                    :
                     prices.map((stock, index) => (
                                <li 
                                    key={ stock.symbol } 
                                    onClick={() => window.open(`${STOCK_URL_YAHOO}${stock.symbol}`, '_blank')}
                                    className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'} flex flex-row justify-between gap-4 rounded px-2 cursor-pointer hover:bg-gray-50`}
                                    >
                                        <span>{stock.symbol}</span>
                                        <span>{stock.price}</span>
                                </li>
                            ))
                            }
            </ul>
        </>
    );
}