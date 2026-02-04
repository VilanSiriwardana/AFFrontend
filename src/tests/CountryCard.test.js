import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import CountryCard from "../components/CountryCard";
import { Provider } from "react-redux";
import { store } from "../store";

const mockCountry = {
  name: { common: "United States", official: "United States of America" },
  flags: { png: "https://flagcdn.com/us.png" },
  region: "Americas",
  capital: ["Washington, D.C."],
  population: 331000000,
  cca3: "USA",
};

describe("CountryCard Component", () => {
  it("renders country card with flag and info", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <CountryCard country={mockCountry} />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByAltText(/flag of United States/i)).toBeInTheDocument();
    expect(screen.getByText(/United States/i)).toBeInTheDocument();
    expect(screen.getByText(/Capital:/).parentElement).toHaveTextContent(
      "Capital: Washington, D.C."
    );
    expect(screen.getByText(/Population:/).parentElement).toHaveTextContent(
      "Population: 331,000,000"
    );
  });
});
