// src/components/Favorites.js
import React, { useState, useEffect } from "react";
import { getFavorites, removeFavorite } from "../api";
import "../styles/Favorites.css"; // Import the CSS

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = async () => {
    try {
      const favoriteRecipes = await getFavorites();
      setFavorites(favoriteRecipes);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const message = await removeFavorite(recipeId);
      alert(message);
      fetchFavorites(); // Refresh favorites list
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div>
      <h2>Favorite Recipes</h2>
      <ul className="favorites-list">
        {favorites.map((id) => (
          <li key={id}>
            Recipe ID: {id}{" "}
            <button onClick={() => handleRemoveFavorite(id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
