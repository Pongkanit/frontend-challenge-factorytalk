"use client";
import CommandSearch from "@/components/CommandSearch";
import { LocationCard } from "@/components/LocationCard";
import { LocationDetails } from "@/components/LocationDetails";
import { AppSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAppContext } from "@/context/AppContext";
import { City } from "@/models/City";
import { useEffect } from "react";

export default function MainLayout() {
    const { cityList, setCityList, city } = useAppContext();

    useEffect(() => {
        // init set amsterdam as default
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=52.37&lon=4.89&APPID=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_KEY}`
                );
                const data = await response.json();

                const weatherData = [
                    new City({
                        lon: data.city.coord.lon,
                        lat: data.city.coord.lat,
                        city_name: data.city.name,
                        timezone: data.city.timezone,
                        temp: data.list[0].main.temp,
                        weather: data.list[0].weather[0].main,
                        weather_icon: data.list[0].weather[0].icon,
                    }),
                ];

                setCityList(weatherData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        };

        if (!cityList.length) {
            fetchWeatherData();
        }
    }, []);
    return (
        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <main className="w-full p-10">
                <CommandSearch />
                {city && <LocationDetails CurrentCity={city} />}
                {!city && cityList.length > 0 && (
                    <div className="card-grid">
                        {cityList.map((weather) => (
                            <LocationCard
                                city={weather}
                                key={weather.city_name}
                            />
                        ))}
                    </div>
                )}
            </main>
        </SidebarProvider>
    );
}
