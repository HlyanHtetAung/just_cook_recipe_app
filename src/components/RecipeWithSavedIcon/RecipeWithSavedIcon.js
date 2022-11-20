import React from "react";
import "./recipeWithSavedIcon.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { handleWordLimit } from "../../reuseFunctions";
import { Link } from "react-router-dom";

function RecipeWithSavedIcon({ recipePhoto, recipeName, recipeId }) {
  return (
    <Link to={`/recipe/${recipeId}`}>
      <div className="recipeWithSavedIcon_wrapper">
        <div className="recipe_image_wrapper">
          <img src={recipePhoto} alt="" />
          <div className="like_icon_wrapper">
            <AiOutlineHeart className="like_icon" />
          </div>
          <p className="click_to_save_warning_letter">Click To Save Recipe</p>
        </div>
        <p>{handleWordLimit(recipeName, 50)}</p>
      </div>
    </Link>
  );
}

export default RecipeWithSavedIcon;
