import StocksService from "../services/StocksService";
import { useEffect, useState } from 'react';

export default function Stocks() {
    const [prices, setPrices] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPrices();
    });

    async function loadPrices() {
        try {
            const newPrices = await StocksService.fetchStockPrice();
            console.log(newPrices);
            setPrices(newPrices);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ul>
            { prices.map((price) => (
                <li>
                    <p>AAPL: </p>
                    <p>{price}</p>
                </li>
            ))}
        </ul>
    );
}