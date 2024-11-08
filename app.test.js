const fs = require("fs");
const request = require("supertest");
const app = require("./app"); // Ensure `app.js` exports the express instance
const { getFavorites, saveFavorites, processIngredients } = require("./app"); // Adjust imports based on your exports

describe("Helper Functions", () => {
  const testFavoritesFile = "./test_favorites.json";

  // Temporarily mock file operations
  beforeEach(() => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => JSON.stringify([]));
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restore original fs functions after each test
  });

  test("getFavorites should return an empty array when file is empty", () => {
    const favorites = getFavorites(testFavoritesFile);
    expect(favorites).toEqual([]);
  });

  test("saveFavorites should store data and retrieve it with getFavorites", () => {
    const testFavorites = [123, 456];
    saveFavorites(testFavorites, testFavoritesFile);
    const favorites = getFavorites(testFavoritesFile);
    expect(favorites).toEqual(testFavorites);
  });

  test("processIngredients should tokenize ingredients string", () => {
    const input = "tomato cheese garlic";
    const output = processIngredients(input);
    expect(output).toBe("tomato,cheese,garlic");
  });
});

describe("Recipe API Endpoints", () => {
  beforeEach(() => {
    jest.spyOn(fs, "readFileSync").mockImplementation(() => JSON.stringify([]));
    jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Reset mocks after each test
  });

  test("GET /recipes should return 400 if ingredients are not provided", async () => {
    const response = await request(app).get("/recipes");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Please provide ingredients.");
  });

  test("GET /recipes should return recipes if ingredients are provided", async () => {
    const response = await request(app).get(
      "/recipes?ingredients=tomato,cheese"
    );
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("recipes");
  });

  test("POST /favorites should add a recipe to favorites", async () => {
    const response = await request(app)
      .post("/favorites")
      .send({ recipeId: 123 });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Recipe added to favorites.");
  });

  test("GET /favorites should retrieve all favorites", async () => {
    await request(app).post("/favorites").send({ recipeId: 123 });
    const response = await request(app).get("/favorites");
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.favorites)).toBe(true);
  });

  test("DELETE /favorites should remove a recipe from favorites", async () => {
    await request(app).post("/favorites").send({ recipeId: 123 });
    const response = await request(app)
      .delete("/favorites")
      .send({ recipeId: 123 });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Recipe removed from favorites.");
  });

  test("GET /grocery-list should return 400 if no favorites available", async () => {
    const response = await request(app).get("/grocery-list");
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      "No favorites to generate a grocery list."
    );
  });

  test("GET /grocery-list should return a grocery list", async () => {
    // Simulate adding a favorite recipe
    await request(app).post("/favorites").send({ recipeId: 123 });

    const response = await request(app).get("/grocery-list");
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("groceryList");
  });

  test("Error handling middleware should catch errors", async () => {
    // Simulate a route error by passing invalid data
    const response = await request(app).get("/recipes?ingredients=");
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Something went wrong!");
  });
});
