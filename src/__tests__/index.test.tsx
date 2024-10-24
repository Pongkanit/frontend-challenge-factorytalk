import { render, screen, waitFor } from "@testing-library/react";
import Index from "../app/index";
import { LocationCard } from "@/components/LocationCard";
import { City } from "@/models/City";
import { AppProvider } from "@/context/AppContext";
import { LocationDetails } from "@/components/LocationDetails";

describe("Home", () => {
    it("renders without errors", () => {
        const { container } = render(<Index />);
        expect(container).toBeDefined();
    });
});
const mockCity = new City({
    lon: 52.37,
    lat: 4.89,
    city_name: "Da Cita",
    timezone: 7200,
    temp: 290,
    weather: "clear",
    weather_icon: "04d",
});

// Location card
test("renders the LocationCard component", () => {
    render(
        <AppProvider>
            <LocationCard city={mockCity} />
        </AppProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
});

test("displays weather data after fetching", async () => {
    render(
        <AppProvider>
            <LocationCard city={mockCity} />
        </AppProvider>
    );
    await waitFor(() => {
        const removeButton = screen.getByText("-");
        expect(removeButton).toBeInTheDocument();
    });
});

// Location details
test("renders the LocationDetails component", () => {
    render(
        <AppProvider>
            <LocationDetails CurrentCity={mockCity} />
        </AppProvider>
    );
    expect(screen.getByText("Loading weather data...")).toBeInTheDocument();
});
test("displays weather data after fetching", async () => {
    render(
        <AppProvider>
            <LocationDetails CurrentCity={mockCity} />
        </AppProvider>
    );
    await waitFor(() => {
        const addButton = screen.getByText("+");
        expect(addButton).toBeInTheDocument();
    });
});
