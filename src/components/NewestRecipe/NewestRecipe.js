import React from "react";
import { handleWordLimit } from "../../reuseFunctions";
import "./newestRecipe.scss";

function NewestRecipe({ recipeName }) {
  return (
    <div className="newestRecipe_wrapper">
      <img
        src="https://burgerburger.co.nz/wp-content/uploads/2020/01/BC.jpg"
        alt="Something Went Wrong"
      />
      <p>{handleWordLimit(recipeName, 40)}</p>
    </div>
  );
}

export default NewestRecipe;
