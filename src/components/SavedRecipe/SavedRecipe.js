import React, { useState } from "react";
import "./savedRecipe.scss";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../Firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AiOutlineDelete } from "react-icons/ai";
import { updateSavedRecipes } from "../../redux/userSlice";
import { deleteSavedRecipeHandle } from "../../reuseFunctions";
function SavedRecipe({
  recipeName,
  recipeDocId,
  recipePhoto,
  recipeIngredientsCount,
  recipeOwner,
}) {
  const { userDocumentId } = useSelector((state) => state.user);
  const [openWarningBox, setOpenWarningBox] = useState(false);
  const dispatch = useDispatch();

  function closeDeleteWarningBox(e) {
    e.preventDefault();
    e.stopPropagation();
    setOpenWarningBox(false);
  }

  return (
    <Link to={`/recipe/${recipeDocId}`}>
      <div className="saved_recipe_wrapper">
        <AiOutlineDelete
          className="three_dot_icon"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenWarningBox(true);
          }}
        />
        <div
          className={
            openWarningBox ? "warning_wrapper active" : "warning_wrapper"
          }
        >
          <p>Are you sure you want to remove that recipe from your list?</p>
          <div className="warning_button_wrapper">
            <button onClick={closeDeleteWarningBox}>Close</button>
            <button
              onClick={(e) =>
                deleteSavedRecipeHandle(
                  e,
                  userDocumentId,
                  recipeDocId,
                  dispatch
                )
              }
            >
              Remove
            </button>
          </div>
        </div>
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
    </Link>
  );
}

export default SavedRecipe;
