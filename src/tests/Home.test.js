import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import Home from "../pages/Home";
import { BrowserRouter } from "react-router-dom";
import * as api from "../services/countryApi";

jest.mock("../services/countryApi");

const mockCountries = [
  {
    name: { common: "United States", official: "United States of America" },
    flags: { png: "https://flagcdn.com/us.png" },
    region: "Americas",
    capital: ["Washington, D.C."],
    population: 331000000,
    cca3: "USA"
  },
  {
    name: { common: "Canada", official: "Canada" },
    flags: { png: "https://flagcdn.com/ca.png" },
    region: "Americas",
    capital: ["Ottawa"],
    population: 38000000,
    cca3: "CAN"
  }
];

describe("Home Page Integration", () => {
  it("fetches and displays countries", async () => {
    api.getAllCountries.mockResolvedValueOnce(mockCountries);

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/United States/i)).toBeInTheDocument();
      expect(screen.getByText(/Canada/i)).toBeInTheDocument();
    });
  });
});
