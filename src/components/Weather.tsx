import type { WeatherForecastResponse, WeatherCurrentResponse } from '../types/weather';
import { useEffect, useRef, useState } from 'react';
import WeatherService from "../services/WeatherService";
import Loading from '../assets/loading.gif';
import { toDateTimeString } from '../utils/dateUtils';

export default function Weather() {
    const [currentWeather, setCurrentWeather] = useState<WeatherCurrentResponse>();
    const [weatherForecast, setWeatherForecast] = useState<WeatherForecastResponse | undefined>(undefined);
    const [loading, setLoading] = useState<{ current: boolean, forecast: boolean }>({ current: true, forecast: true });
    const [error, setError] = useState<string | null>(null);
    const didLoad = useRef(false);
    const URL_ICON_BASE = 'https://openweathermap.org/img/wn/'; 
    const URL_ICON_SUFFIX = '@2x.png';

    useEffect(() => {
        if (didLoad.current) return;
        didLoad.current = true;
        loadCurrentWeather();
        loadWeatherForecast();
    }, []);

    async function loadCurrentWeather() {
        try {
            const current = await WeatherService.fetchCurrent();
            console.log(current);
            setCurrentWeather(current);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(prev => ({...prev, current: false }));
        }
    }

    async function loadWeatherForecast() {
        try {
            const forecast = await WeatherService.fetchForecast();
            console.log(forecast);
            setWeatherForecast(forecast);
        } catch (error) {
            setError((error as Error).message);
        } finally {
            setLoading(prev => ({...prev, forecast: false }));
        }
    }

    function urlForIcon(icon: string): string {
        return `${URL_ICON_BASE}${icon}${URL_ICON_SUFFIX}`;
    }

    if (loading.current && loading.forecast) {
        return (
            <div className='center'><img className='w-30' src={Loading}></img></div>
        );
    }
    if (error) return <div className='error'>Error loading:<br/>{ error }</div>;

    return( 
        <>
            <h1 className='section-title-font'>Weather</h1>
        { currentWeather 
                ? <div className='flex flex-col min-h-0  overflow-y-auto'> 
                    <div className='flex flex-row text-2xl text-center justify-center items-center gap-6'>
                        <img src={urlForIcon(currentWeather?.weather[0].icon)}></img>
                        <p>{currentWeather?.main.temp.toFixed(1)} C</p>
                    </div>
                    <ul className='flex- gap-0.5 px-4 md:px-10'>{ weatherForecast?.list.map(info => (
                            <li 
                                key={ info.dt } 
                                className='flex flex-row gap-4 justify-evenly items-center h-20 text-xl'>
                                    <img 
                                        src={urlForIcon(info.weather[0].icon)}
                                        className='w-auto h-full object-contain'></img>
                                    <span>{toDateTimeString(info.dt)}</span>
                                    <span>{info.main.temp.toFixed(1)}°C</span>
                            </li>
                        ))}
                    </ul>
                </div>
                : <></>
        }
        </>   
    )
}