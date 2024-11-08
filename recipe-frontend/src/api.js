// src/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:3000";  // Backend URL

// Fetch recipes by ingredients and optional diet
export const fetchRecipes = async (ingredients, diet) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/recipes`, {
      params: { ingredients, diet },
    });
    return response.data.recipes;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Get the user's favorite recipes
export const getFavorites = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/favorites`);
    return response.data.favorites;
  } catch (error) {
    console.error("Error fetching favorites:", error);
    throw error;
  }
};

// Add a recipe to favorites
export const addFavorite = async (recipeId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/favorites`, { recipeId });
    return response.data.message;
  } catch (error) {
    console.error("Error adding to favorites:", error);
    throw error;
  }
};

// Remove a recipe from favorites
export const removeFavorite = async (recipeId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/favorites`, {
      data: { recipeId },
    });
    return response.data.message;
  } catch (error) {
    console.error("Error removing from favorites:", error);
    throw error;
  }
};

// Get a grocery list from favorites
export const getGroceryList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/grocery-list`);
    return response.data.groceryList;
  } catch (error) {
    console.error("Error generating grocery list:", error);
    throw error;
  }
};
