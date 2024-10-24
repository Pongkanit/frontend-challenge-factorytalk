"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import { City } from "@/models/City";
import { Button } from "./ui/button";
import { useAppContext } from "@/context/AppContext";
import { convertTemp, FormatTime } from "@/lib/utils";

type LocationCardProps = {
    city: City | undefined;
};

export function LocationCard({ city }: Readonly<LocationCardProps>) {
    const [currentCity, setCurrentCity] = useState<City | null>(null);
    const { unit, unitSymbol, setCity, cityList, setCityList } =
        useAppContext();

    // button
    const buttonHandle = () => {
        if (city) {
            setCityList(
                cityList.filter((item) => city.city_name !== item.city_name)
            );
        }
    };

    // card
    const cardHandle = () => {
        if (city) {
            setCity(city);
        }
    };

    // init using current city
    useEffect(() => {
        const fetchWeatherData = async () => {
            if (city) {
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${city?.lat}&lon=${city?.lon}&APPID=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY}`
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

                    setCurrentCity(weatherData);
                } catch (error) {
                    console.error("Error fetching weather data:", error);
                }
            }
        };

        fetchWeatherData();
    }, []);

    return (
        <Card
            onClick={cardHandle}
            className="hover:bg-blue-50 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">
                    {currentCity ? (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    buttonHandle();
                                }}
                                className="text-red-600 border-red-600 hover:bg-red-100"
                                id="removeBtn"
                            >
                                -
                            </Button>
                            <p> {currentCity.city_name}</p>
                        </div>
                    ) : (
                        "Loading..."
                    )}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500">
                    {currentCity ? `${FormatTime(currentCity.timezone)}` : ""}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-4 text-center">
                {currentCity && (
                    <div>
                        <p className="text-2xl font-bold">
                            {convertTemp(currentCity.temp, unit)} {unitSymbol}
                        </p>
                        <p className="text-lg text-gray-600">
                            {currentCity.weather}
                        </p>
                        <img
                            className="mx-auto"
                            src={`http://openweathermap.org/img/wn/${currentCity.weather_icon}.png`}
                            alt={currentCity.weather_icon}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
