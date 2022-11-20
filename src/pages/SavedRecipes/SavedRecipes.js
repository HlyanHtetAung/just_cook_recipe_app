import React from "react";
import SavedRecipe from "../../components/SavedRecipe/SavedRecipe";
import "./savedRecipes.scss";

function SavedRecipes() {
  return (
    <div className="saved_recipes_outside_wrapper">
      <div className="saved_recipes_inside_wrapper">
        <h3>Saved Recipes(2)</h3>
        <div className="saved_recipes_layout_wrapper">
          <SavedRecipe />
          <SavedRecipe />
          <SavedRecipe />
          <SavedRecipe />
          <SavedRecipe />
          <SavedRecipe />
        </div>
      </div>
    </div>
  );
}

export default SavedRecipes;
