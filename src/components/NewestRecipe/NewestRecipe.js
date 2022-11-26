import React from "react";
import { Link } from "react-router-dom";
import { handleWordLimit } from "../../reuseFunctions";
import "./newestRecipe.scss";

function NewestRecipe({ recipeName, recipePhoto }) {
  return (
    <Link>
      <div className="newestRecipe_wrapper">
        <img src={recipePhoto} alt="Something Went Wrong" />
        <p>{handleWordLimit(recipeName, 25)}</p>
      </div>
    </Link>
  );
}

export default NewestRecipe;
