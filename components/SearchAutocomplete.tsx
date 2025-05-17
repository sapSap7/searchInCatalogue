/*
 - text input box
 - when typing, show a filtered list of suggestions
 - clicking a suggestion fills the input
 - props: list of options (string[])
*/

import React, { useEffect, useState } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";
import "./SearchAutocomplete.css";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  title: string;
  category: string;
}

const SearchAutocomplete: React.FC = () => {
  const [input, setInput] = useState(""); // text input
  const [allSuggestions, setAllSuggestions] = useState<Product[]>([]); // holds all titles from the api
  const [titleToIdMap, setTitleToIdMap] = useState<Map<string, number>>(
    new Map()
  );
  const [filtered, setFiltered] = useState<string[]>([]); // titles based on the filter
  const [showDropdown, setShowDropdown] = useState(false); // controls whether the dropdown is visible or not
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get<Product[]>(
          "https://fakestoreapi.com/products"
        );
        setAllSuggestions(res.data);
        const map = new Map(
          res.data.map((product) => [product.title, product.id])
        );
        setTitleToIdMap(map);
      } catch (err) {
        console.error("Error fetching products:" + err);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(allSuggestions.map((p) => p.category))),
  ];

  // called whenever the user types in the input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // if input is empty, it clears filtered suggestions and hides dropdown
    if (!value.trim()) {
      setFiltered([]);
      setShowDropdown(false);
      return;
    }

    // handle case sensitive, to treat all letters the same
    const filteredTitles = allSuggestions
      .filter(
        (p) =>
          p.title.toLowerCase().includes(value.toLowerCase()) &&
          (selectedCategory === "All" || p.category === selectedCategory)
      )
      .map((p) => p.title);

    // store the matching results in filtered and show the dropdown
    setFiltered(filteredTitles);
    setShowDropdown(true);
  };

  // when the user clicks a suggestion, update the input value and hide dropdown
  const handleSelect = (value: string) => {
    setInput(value);
    setFiltered([]);
    setShowDropdown(false);

    const productId = titleToIdMap.get(value);
    if (productId !== undefined) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="autocomplete-container">
      <Dropdown
        options={categories}
        onSelect={(category) => setSelectedCategory(category)}
        placeholder="Select Category"
      ></Dropdown>
      <input
        type="text"
        className="autocomplete-input"
        placeholder="Search products..."
        value={input}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setShowDropdown(false), 100)}
        onFocus={() => {
          if (filtered.length) setShowDropdown(true);
        }}
      />
      {showDropdown && (
        <ul className="autocomplete-list">
          {filtered.map((title) => (
            <li
              key={title}
              className="autocomplete-item"
              onClick={() => handleSelect(title)}
            >
              {title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchAutocomplete;
