import React from "react";
import { render, screen } from "@testing-library/react";
import { useParams } from "react-router-dom";
import { CategoriesContext } from "../../../../contexts/categories.context";
import Category from "../category.component";

jest.mock("react-router-dom", () => ({
  useParams: jest.fn(), //to create custom behaviour for the mocked hook 
})); //mocks the useParams hook.

describe("Category Component", () => {
  beforeEach(() => {
    useParams.mockReturnValue({ category: "test-category" });
  }); // this function runs before each testing occur in this case "runs the hook params".

  it("renders the category title", () => {
    const categoriesMap = {
      "test-category": [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ],
    };

    render(
      <CategoriesContext.Provider value={{ categoriesMap }}>
        <Category />
      </CategoriesContext.Provider>
    );

    const categoryTitle = screen.getByText(/test-category/i);
    expect(categoryTitle).toBeInTheDocument();
  });

  it("renders product cards when products are available", () => {
    const categoriesMap = {
      "test-category": [
        { id: 1, name: "Product 1" },
        { id: 2, name: "Product 2" },
      ],
    };

    render(
      <CategoriesContext.Provider value={{ categoriesMap }}>
        <Category />
      </CategoriesContext.Provider>
    );

    const productCards = screen.getAllByTestId("product-card");
    expect(productCards).toHaveLength(2);
  });

  it("does not render product cards when products are not available", () => {
    const categoriesMap = {};

    render(
      <CategoriesContext.Provider value={{ categoriesMap }}>
        <Category />
      </CategoriesContext.Provider>
    );

    const productCards = screen.queryAllByTestId("product-card");
    expect(productCards).toHaveLength(0);
  });
});
