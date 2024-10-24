"use client";
import { useAppContext } from "@/context/AppContext";
import { City } from "@/models/City";
import { Command, CommandInput, CommandList, CommandItem } from "cmdk";
import React from "react";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

export default function CommandSearch() {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<any[]>([]);
    const { city, setCity } = useAppContext();

    // input handle
    const handleValueChange = (value: string) => {
        setInputValue(value);
        setOpen(!!value);
    };
    const handleBlur = () => {
        setOpen(false);
    };
    const handleFocus = () => {
        setOpen(!!inputValue);
    };

    // button handle
    const handleClick = (value: string) => {
        setOpen(false);
        const selectedCity = suggestions.find(
            (command) => command.id === value
        );

        // set dummy city
        if (selectedCity) {
            setInputValue(selectedCity.address.municipality);

            const newCity: City = {
                city_name: selectedCity.address.municipality,
                lat: selectedCity.position.lat,
                lon: selectedCity.position.lon,
                timezone: 0,
                temp: 0,
                weather: "",
                weather_icon: "",
            };
            setCity(newCity);
        }
    };
    const buttonHandle = () => {
        setInputValue("");
        setCity(null);
    };
    const buttonState = () => {
        if (city || inputValue) {
            return true;
        }
        return false;
    };

    // fetch suggestion when input change
    React.useEffect(() => {
        const fetchSuggestions = async (query: string) => {
            try {
                const response = await fetch(
                    `https://api.tomtom.com/search/2/search/${query}.json?key=${process.env.NEXT_PUBLIC_TOMTOM}&typeahead=true&limit=5&idxSet=Geo&entityType=Municipality,PostalCodeArea`
                );
                const data = await response.json();

                setSuggestions(data.results);
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            }
        };
        if (inputValue) {
            fetchSuggestions(inputValue);
        }
    }, [inputValue]);

    return (
        <div className="mx-5 flex items-center space-x-2 p-2 border rounded-lg shadow-md ">
            <SidebarTrigger />
            <Command className="flex-1">
                <CommandInput
                    className="w-full p-2"
                    placeholder="Type a city name or zip code..."
                    onValueChange={handleValueChange}
                    onBlur={() => {
                        setTimeout(() => {
                            handleBlur();
                        }, 100);
                    }}
                    onFocus={handleFocus}
                    value={inputValue}
                />
                {/* Suggestion */}
                <CommandList className="absolute z-10 mt-2 border rounded-lg shadow-lg bg-white">
                    {open &&
                        suggestions.length > 0 &&
                        suggestions.map((suggestion: any) => (
                            <CommandItem
                                key={suggestion.id}
                                value={suggestion.address.municipality}
                                onSelect={() => {
                                    handleClick(suggestion.id);
                                }}
                                forceMount={true}
                            >
                                {suggestion.address.municipality} :{" "}
                                {suggestion.address.country}
                            </CommandItem>
                        ))}
                </CommandList>
            </Command>
            {buttonState() && (
                <Button
                    variant="outline"
                    onClick={buttonHandle}
                    className="ml-2 px-4 py-2 text-sm rounded-md"
                >
                    ←
                </Button>
            )}
        </div>
    );
}
