import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { Button } from "./ui/button";

export function AppSidebar() {
    const { setUnit } = useAppContext();
    const [currentUnit, setCurrentUnit] = useState<string>("Celsius");

    // Temp button
    const handleToggle = (selectedUnit: string) => {
        setCurrentUnit(selectedUnit);
        setUnit(selectedUnit);
    };
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarTrigger />
                    <SidebarGroupLabel className="flex flex-col items-center text-xl font-semibold text-gray-600 mb-2">
                        Temperature Unit
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* button toggle */}
                            <div className="flex flex-col items-center space-y-2 mt-4">
                                <Button
                                    variant={
                                        currentUnit === "Kelvin"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => handleToggle("Kelvin")}
                                    className="w-full h-10 text-sm"
                                >
                                    Kelvin
                                </Button>
                                <Button
                                    variant={
                                        currentUnit === "Celsius"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => handleToggle("Celsius")}
                                    className="w-full h-10 text-sm"
                                >
                                    Celsius
                                </Button>
                                <Button
                                    variant={
                                        currentUnit === "Fahrenheit"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => handleToggle("Fahrenheit")}
                                    className="w-full h-10 text-sm"
                                >
                                    Fahrenheit
                                </Button>
                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
