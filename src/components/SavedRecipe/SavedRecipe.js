import React from "react";
import "./savedRecipe.scss";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function SavedRecipe({
  recipeName,
  recipeDocumentId,
  recipePhoto,
  recipeIngredientsCount,
  recipeOwner,
}) {
  const { userDocumentId } = useSelector((state) => state.user);

  async function deleteSavedRecipeHandle(e) {
    e.stopPropagation();
    e.preventDefault();
    const docRef = doc(db, "users", userDocumentId);
    const userResult = (await getDoc(docRef)).data();
    const currentSavedRecipes = [...userResult.savedRecipes];
    const toDeleteSavedRecipeIndex = currentSavedRecipes.findIndex(
      (recipe) => recipe.recipeDocId === recipeDocumentId
    );
    currentSavedRecipes.splice(toDeleteSavedRecipeIndex, 1);
    await updateDoc(docRef, { savedRecipes: currentSavedRecipes });
  }

  return (
    <Link to={`/recipe/${recipeDocumentId}`}>
      <div className="saved_recipe_wrapper">
        <BiDotsVerticalRounded
          className="three_dot_icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <div className="saved_recipe_left_wrapper">
          <img src={recipePhoto} />
        </div>
        <div className="saved_recipe_right_wrapper">
          <h3>{recipeName}</h3>
          <p>
            Ingredients : <span>{recipeIngredientsCount}</span>
          </p>
          <p>
            Cooking Time : <span>30 Minutes</span>
          </p>
          <p>
            Reciped By : <span>{recipeOwner}</span>
          </p>
        </div>
      </div>
      <button onClick={deleteSavedRecipeHandle}>Delete</button>
    </Link>
  );
}

export default SavedRecipe;
