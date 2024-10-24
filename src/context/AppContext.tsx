import { shortenUnit } from "@/lib/utils";
import { City } from "@/models/City";
import React, { createContext, useState, ReactNode, useMemo } from "react";

interface AppContextType {
    unit: string;
    unitSymbol: string;
    setUnit: (unit: string) => void;
    cityList: City[];
    setCityList: (cities: City[]) => void;
    city: City | null;
    setCity: (city: City | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [unit, setUnitState] = useState<string>("Celsius");
    const [cityList, setCityListState] = useState<City[]>([]);
    const [city, setCityState] = useState<City | null>(null);
    const [unitSymbol, setUnitSymbol] = useState<string>("°C");
    const setUnit = (unit: string) => {
        if (["Kelvin", "Fahrenheit", "Celsius"].includes(unit)) {
            setUnitState(unit);
        }
        setUnitSymbol(shortenUnit(unit));
    };

    const setCityList = (cities: City[]) => {
        setCityListState(cities);
    };
    const setCity = (city: City | null) => {
        setCityState(city);
    };

    const contextValue = useMemo(
        () => ({
            unit,
            unitSymbol,
            setUnit,
            cityList,
            setCityList,
            city,
            setCity,
        }),
        [unit, cityList, city]
    );

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
