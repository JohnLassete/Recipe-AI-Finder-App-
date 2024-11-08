const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const natural = require("natural");
const morgan = require("morgan");
const fs = require("fs");
const cors = require("cors"); // Importing the cors module

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());  // Enable CORS for all routes

// Natural Language Processing setup
const tokenizer = new natural.WordTokenizer();

// Favorites file setup
const favoritesFile = "./favorites.json";
if (!fs.existsSync(favoritesFile)) {
  fs.writeFileSync(favoritesFile, JSON.stringify([]));
}

function getFavorites() {
  const data = fs.readFileSync(favoritesFile, "utf8");
  return JSON.parse(data);
}

function saveFavorites(favorites) {
  fs.writeFileSync(favoritesFile, JSON.stringify(favorites, null, 2));
}

function processIngredients(input) {
  const tokens = tokenizer.tokenize(input);
  return tokens.join(",");
}

// Routes

// Fetch recipes by ingredients (optionally filtered by diet)
app.get("/recipes", async (req, res) => {
  let { ingredients, diet } = req.query;

  if (!ingredients) {
    return res.status(400).json({ message: "Please provide ingredients." });
  }

  ingredients = processIngredients(ingredients);

  try {
    const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${
      process.env.API_KEY
    }&ingredients=${ingredients}&diet=${diet || ""}`;
    const response = await axios.get(apiUrl);
    res.json({ recipes: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching recipes." });
  }
});

// Add recipe to favorites
app.post("/favorites", (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) {
    return res.status(400).json({ message: "Please provide a recipeId." });
  }

  const favorites = getFavorites();
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId);
    saveFavorites(favorites);
    res.json({ message: "Recipe added to favorites." });
  } else {
    res.json({ message: "Recipe is already in favorites." });
  }
});

// Get all favorite recipes
app.get("/favorites", (req, res) => {
  const favorites = getFavorites();
  res.json({ favorites });
});

// Remove recipe from favorites
app.delete("/favorites", (req, res) => {
  const { recipeId } = req.body;
  if (!recipeId) {
    return res.status(400).json({ message: "Please provide a recipeId." });
  }

  let favorites = getFavorites();
  favorites = favorites.filter((id) => id !== recipeId);
  saveFavorites(favorites);
  res.json({ message: "Recipe removed from favorites." });
});

// Generate grocery list from favorite recipes
app.get("/grocery-list", async (req, res) => {
  const favorites = getFavorites();
  if (favorites.length === 0) {
    return res
      .status(400)
      .json({ message: "No favorites to generate a grocery list." });
  }

  try {
    const groceryList = {};

    for (const recipeId of favorites) {
      const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.API_KEY}`;
      const response = await axios.get(apiUrl);
      const ingredients = response.data.extendedIngredients;

      ingredients.forEach((ingredient) => {
        groceryList[ingredient.name] =
          (groceryList[ingredient.name] || 0) + ingredient.amount;
      });
    }

    res.json({ groceryList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating grocery list." });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = app;
