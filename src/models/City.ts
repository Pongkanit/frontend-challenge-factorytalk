interface CityData {
    lon?: number;
    lat?: number;
    city_name?: string;
    timezone?: number;
    temp?: number;
    weather?: string;
    weather_icon?: string;
}

export class City {
    lon: number;
    lat: number;
    city_name: string;
    timezone: number;
    temp: number;
    weather: string;
    weather_icon: string;

    constructor(data: CityData = {}) {
        this.lon = data.lon ?? 0;
        this.lat = data.lat ?? 0;
        this.city_name = data.city_name ?? "";
        this.timezone = data.timezone ?? 0;
        this.temp = data.temp ?? 0;
        this.weather = data.weather ?? "";
        this.weather_icon = data.weather_icon ?? "";
    }
}
