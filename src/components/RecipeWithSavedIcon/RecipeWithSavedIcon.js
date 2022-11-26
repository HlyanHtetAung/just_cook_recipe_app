import React, { useEffect, useState } from "react";
import "./recipeWithSavedIcon.scss";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { handleWordLimit } from "../../reuseFunctions";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function RecipeWithSavedIcon({ recipePhoto, recipeName, recipeId }) {
  const { savedRecipes, username } = useSelector((state) => state.user);
  const [onSaveList, setOnSaveList] = useState(false);

  useEffect(() => {
    const onListAry = savedRecipes.filter(
      (savRecipe) => savRecipe.recipeDocId == recipeId
    );
    if (onListAry.length > 0) {
      setOnSaveList(true);
    }
  }, [username, savedRecipes]);

  return (
    <Link to={`/recipe/${recipeId}`}>
      <div className="recipeWithSavedIcon_wrapper">
        <div className="recipe_image_wrapper">
          <img src={recipePhoto} alt="" />
          <div
            className={
              onSaveList ? "like_icon_wrapper saved" : "like_icon_wrapper"
            }
          >
            {onSaveList ? (
              <AiFillHeart className="like_icon saved" />
            ) : (
              <AiOutlineHeart className="like_icon" />
            )}
          </div>
          <p
            className={
              onSaveList
                ? "click_to_save_warning_letter saved"
                : "click_to_save_warning_letter"
            }
          >
            {username && onSaveList ? "Already Saved" : "Click To Save Recipe"}
          </p>
        </div>
        <p>{handleWordLimit(recipeName, 50)}</p>
      </div>
    </Link>
  );
}

export default RecipeWithSavedIcon;
