import React, { useState } from "react";
import "./Dropdown.css";

interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder = "Select..",
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-display">{selected || placeholder}</div>
      <ul className="dropdown-list">
        {options.map((option) => (
          <li
            key={option}
            className="dropdown-item"
            onClick={() => handleSelect(option)}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
