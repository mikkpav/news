export interface WeatherCurrentResponse {
    dt: number;
    weather: Weather[];
    main: Main;
}

export interface WeatherForecastResponse {
    list: WeatherInfo[];
    weather: Weather[];
    main: Main;
}

export interface WeatherInfo {
    dt: number;
    weather: Weather[];
    main: Main;
}

interface Weather {
    id: string;
    main: string; 
    description: string;
    icon: string;
}

interface Main {
    temp: number;
    temp_min: number;
    temp_max: number;
}
