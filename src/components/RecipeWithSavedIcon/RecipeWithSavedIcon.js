import React, { useEffect, useState } from "react";
import "./recipeWithSavedIcon.scss";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { handleWordLimit } from "../../reuseFunctions";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function RecipeWithSavedIcon({ recipePhoto, recipeName, recipeId }) {
  const { savedRecipes, username, userDocumentId } = useSelector(
    (state) => state.user
  );

  const [onSaveList, setOnSaveList] = useState(false);

  useEffect(() => {
    const onListAry = savedRecipes.filter(
      (savRecipe) => savRecipe.recipeDocId == recipeId
    );
    if (onListAry.length > 0) {
      console.log("true triggered");
      setOnSaveList(true);
    } else {
      console.log("false triggered");
      setOnSaveList(false);
    }
  }, [username, savedRecipes, userDocumentId]);

  return (
    <Link to={`/recipe/${recipeId}`}>
      <div className="recipeWithSavedIcon_wrapper">
        <div className="recipe_image_wrapper">
          <img src={recipePhoto} alt="" />
          <div
            className={
              userDocumentId && onSaveList
                ? "like_icon_wrapper saved"
                : "like_icon_wrapper"
            }
          >
            {userDocumentId && onSaveList ? (
              <AiFillHeart className="like_icon saved" />
            ) : (
              <AiOutlineHeart className="like_icon" />
            )}
          </div>
          <p
            className={
              userDocumentId && onSaveList
                ? "click_to_save_warning_letter saved"
                : "click_to_save_warning_letter"
            }
          >
            {userDocumentId && onSaveList
              ? "Already Saved"
              : "Click To Save Recipe"}
          </p>
        </div>
        <p>{handleWordLimit(recipeName, 50)}</p>
      </div>
    </Link>
  );
}

export default RecipeWithSavedIcon;
