import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../Firebase";
import RecipeWithSavedIcon from "../RecipeWithSavedIcon/RecipeWithSavedIcon";
import "./searchResult.scss";

function SearchResult({ foundRecipes, selectedRecipeType }) {
  const [allRecipeTypes, setAllRecipeTypes] = useState([]);

  useEffect(() => {
    async function fetchAllRecipeTypes() {
      const recipeTypesCollectionRef = collection(db, "recipeTypes");
      onSnapshot(recipeTypesCollectionRef, (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          ...doc.data(),
          recipeTypeDocId: doc.id,
        }));
        setAllRecipeTypes(result);
      });
    }
    fetchAllRecipeTypes();
  }, []);

  return (
    <div className="searchResultRecipes_wrapper">
      <div className="searchResult_wrapper">
        <div className="searchResult_left">
          <h3>
            Found Recipes ({foundRecipes?.length ? foundRecipes?.length : "0"})
          </h3>
          <div className="searched_recipes_wrapper">
            {foundRecipes?.map((recipe) => (
              <RecipeWithSavedIcon
                recipeDetail={recipe}
                key={recipe.recipeDocId}
                recipeId={recipe.recipeDocId}
                recipeName={recipe.recipeName}
                recipePhoto={recipe.recipePhotoLink}
              />
            ))}
          </div>
        </div>
        <div className="searchResult_right">
          <h3>Food Types</h3>
          <div className="food_types_wrapper">
            {allRecipeTypes.map((recipeType) => (
              <Link
                key={recipeType.recipeTypeName}
                to={`/recipes/searchRecipeType=${recipeType.recipeTypeName}`}
              >
                <p
                  className={
                    recipeType.recipeTypeName == selectedRecipeType
                      ? "active"
                      : ""
                  }
                >
                  {recipeType.recipeTypeName}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResult;
