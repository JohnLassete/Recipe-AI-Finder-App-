// src/components/GroceryList.js
import React, { useState, useEffect } from "react";
import { getGroceryList } from "../api";
import "../styles/GroceryList.css"; // Import the CSS

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState({});

  const fetchGroceryList = async () => {
    try {
      const list = await getGroceryList();
      setGroceryList(list);
    } catch (error) {
      console.error("Error generating grocery list:", error);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  return (
    <div>
      <h2>Grocery List</h2>
      <ul className="grocery-list">
        {Object.entries(groceryList).map(([ingredient, quantity]) => (
          <li key={ingredient}>
            <span>{ingredient}:</span> {quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroceryList;
