"use client";
import { AppProvider } from "@/context/AppContext";
import MainLayout from "./mainLayout";

export default function Home() {
    return (
        <AppProvider>
            <MainLayout></MainLayout>
        </AppProvider>
    );
}
