// src/App.js
import React, { useState } from "react";
import RecipeSearch from "./components/RecipeSearch";
import Favorites from "./components/Favorites";
import GroceryList from "./components/GroceryList";
import { addFavorite } from "./api";
import "./styles/App.css"; // Import the CSS

const App = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGroceryList, setShowGroceryList] = useState(false);

  const handleAddFavorite = async (recipeId) => {
    try {
      const response = await addFavorite(recipeId);
      alert(response.message);
    } catch (error) {
      console.error("Error adding favorite:", error);
    }
  };

  return (
    <div className="container">
      <h1>Recipe App</h1>

      <button onClick={() => setShowFavorites(!showFavorites)}>
        {showFavorites ? "Hide Favorites" : "Show Favorites"}
      </button>
      <button onClick={() => setShowGroceryList(!showGroceryList)}>
        {showGroceryList ? "Hide Grocery List" : "Show Grocery List"}
      </button>

      <RecipeSearch onAddFavorite={handleAddFavorite} />

      {showFavorites && <Favorites />}
      {showGroceryList && <GroceryList />}
    </div>
  );
};

export default App;
