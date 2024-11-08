// src/components/RecipeSearch.js
import React, { useState } from "react";
import { fetchRecipes } from "../api";
import "../styles/RecipeSearch.css"; // Import the CSS

const RecipeSearch = ({ onAddFavorite }) => {
  const [ingredients, setIngredients] = useState("");
  const [diet, setDiet] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setError(""); // Clear previous errors
      const results = await fetchRecipes(ingredients, diet);
      setRecipes(results);
    } catch (err) {
      setError("Error fetching recipes.");
    }
  };

  return (
    <div className="recipe-search">
      <h2>Search Recipes</h2>
      <div>
        <input
          type="text"
          placeholder="Enter ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter diet (optional)"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <button onClick={() => onAddFavorite(recipe.id)}>
              Add to Favorites
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecipeSearch;
