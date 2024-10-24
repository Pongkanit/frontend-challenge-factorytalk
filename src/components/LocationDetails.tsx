"use client";

import { City } from "@/models/City";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useAppContext } from "@/context/AppContext";
import { convertTemp, convertTempWithString, FormatTime } from "@/lib/utils";

type LocationCardProps = {
    CurrentCity: City | undefined;
};

export function LocationDetails({ CurrentCity }: Readonly<LocationCardProps>) {
    const [loading, setLoading] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<any>(null);
    const { unit, unitSymbol, cityList, setCityList } = useAppContext();

    // button
    const buttonHandle = () => {
        if (CurrentCity) {
            setCityList([...cityList, CurrentCity]);
        }
    };
    const checkExist = () => {
        const exist = cityList.filter(
            (city) =>
                city.lat === CurrentCity?.lat && city.lon === CurrentCity?.lon
        );
        if (exist.length) {
            return true;
        }
        return false;
    };

    // fetch when current city change
    useEffect(() => {
        const FetchData = async () => {
            if (CurrentCity) {
                try {
                    setLoading(true);
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${CurrentCity.lat}&lon=${CurrentCity.lon}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY}`
                    );
                    const data = await response.json();
                    const weatherData = new City({
                        lon: data.city.coord.lon,
                        lat: data.city.coord.lat,
                        city_name: data.city.name,
                        timezone: data.city.timezone,
                        temp: data.list[0].main.temp,
                        weather: data.list[0].weather[0].main,
                        weather_icon: data.list[0].weather[0].icon,
                    });
                    CurrentCity = weatherData;
                    setWeatherData(data);
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        FetchData();
    }, [CurrentCity]);

    if (loading) {
        return <p>Loading weather data...</p>;
    }

    return (
        <div className="weather-card border rounded-lg shadow-lg bg-white mx-auto my-5 hover:bg-blue-50">
            {weatherData && (
                <div>
                    {!checkExist() && (
                        <Button
                            className="absolute z-10 m-5 text-green-600 border-green-600 hover:bg-green-100"
                            variant="outline"
                            onClick={buttonHandle}
                        >
                            +
                        </Button>
                    )}

                    {/* Header Section */}
                    <div className="header">
                        <p className="text-6xl mb-5">{weatherData.city.name}</p>
                        <h2>{FormatTime(weatherData.city.timezone)}</h2>
                        <h3>
                            Min:{" "}
                            {convertTempWithString(
                                weatherData.list[0].main.temp_min,
                                unit,
                                unitSymbol
                            )}
                            , Max:{" "}
                            {convertTempWithString(
                                weatherData.list[0].main.temp_max,
                                unit,
                                unitSymbol
                            )}
                        </h3>
                        <div className="current-weather">
                            <h1 className="current-temp">
                                {convertTempWithString(
                                    weatherData.list[0].main.temp,
                                    unit,
                                    unitSymbol
                                )}
                            </h1>
                            <img
                                src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                                alt={weatherData.list[0].weather[0].description}
                            />
                            <p className="weather-desc">
                                {weatherData.list[0].weather[0].description}
                            </p>
                        </div>
                    </div>

                    {/* 24-Hour Forecast */}
                    <div className="forecast">
                        <h2>24 Hours Forecast</h2>
                        <div className="forecast-list">
                            {weatherData.list.slice(1, 9).map((data: any) => (
                                <div key={data.dt} className="forecast-item">
                                    <p className="text-xs font-medium mt-4">
                                        {new Date(
                                            (data.dt +
                                                weatherData.city.timezone) *
                                                1000
                                        ).getUTCHours()}
                                        :00
                                    </p>

                                    <img
                                        src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                                        alt={data.weather[0].description}
                                    />
                                    <p className="text-xs font-medium">
                                        {convertTemp(data.main.temp, unit)}
                                    </p>
                                    <p className="text-xs font-medium">
                                        {unitSymbol}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Current Details Section */}
                    <div className="current-details flex justify-center flex-col items-center">
                        <p className="text-xl">Current Details</p>
                        <p>Humidity: {weatherData.list[0].main.humidity}%</p>
                        <p>Wind: {weatherData.list[0].wind.speed} km/h</p>
                        <p>
                            Pressure: {weatherData.list[0].main.pressure} mBar
                        </p>
                        <p>Chance of rain: {weatherData.list[0].pop * 100}%</p>
                    </div>
                </div>
            )}
        </div>
    );
}
