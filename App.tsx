import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchAutocomplete from "./components/SearchAutocomplete";
import ProductPage from "./components/ProductPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchAutocomplete />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  );
};

export default App;
