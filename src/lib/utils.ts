import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function convertTempWithString(
    temp: number,
    unit: string,
    symbol: string
): string {
    const newTemp = convertTemp(temp, unit);
    return newTemp + " " + symbol;
}

export function convertTemp(temp: number, unit: string): string {
    if (unit === "Celsius") {
        return (temp - 273.15).toFixed(2);
    } else if (unit === "Fahrenheit") {
        return (((temp - 273.15) * 9) / 5 + 32).toFixed(2);
    }

    // Kelvin
    return temp.toFixed(2);
}

export function shortenUnit(unit: string): string {
    if (unit === "Celsius") {
        return "°C";
    } else if (unit === "Fahrenheit") {
        return "°F";
    }

    // Kelvin
    return "K";
}

export function FormatTime(timezone: number): string {
    const locationDate = new Date(new Date().getTime() + timezone * 1000);

    // Format the time
    return locationDate.toLocaleString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
}
