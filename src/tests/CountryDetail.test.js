import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CountryDetail from "../pages/CountryDetail";
import * as api from "../services/countryApi";

jest.mock("../services/countryApi");

const mockCountry = {
  name: { common: "United States", official: "United States of America" },
  flags: { png: "https://flagcdn.com/us.png" },
  region: "Americas",
  capital: ["Washington, D.C."],
  population: 331000000,
  cca3: "USA",
};

describe("CountryDetail Component", () => {
  it("renders detailed country data correctly", async () => {
    api.getCountryByCode.mockResolvedValueOnce([mockCountry]);

    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      // Avoid ambiguous matches
      expect(screen.getAllByText(/United States/i).length).toBeGreaterThan(0);
      expect(screen.getByText("Official:")).toBeInTheDocument();
      expect(screen.getByText("Official:").parentElement).toHaveTextContent(
        "United States of America"
      );
      expect(screen.getByText("Capital:").parentElement).toHaveTextContent(
        "Washington, D.C."
      );
      expect(screen.getByText("Population:").parentElement).toHaveTextContent(
        "331,000,000"
      );
    });
  });

  it("renders fallback UI when API call fails", async () => {
    api.getCountryByCode.mockRejectedValueOnce(new Error("API failed"));

    render(
      <MemoryRouter initialEntries={["/country/USA"]}>
        <Routes>
          <Route path="/country/:code" element={<CountryDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/Official:/)).not.toBeInTheDocument();
    });
  });
});
