import React from "react";
import "./savedRecipe.scss";
import { BiDotsVerticalRounded } from "react-icons/bi";

function SavedRecipe() {
  return (
    <div className="saved_recipe_wrapper">
      <BiDotsVerticalRounded className="three_dot_icon" />
      <div className="saved_recipe_left_wrapper">
        <img src="https://assets.bonappetit.com/photos/6282c0a2379490891479b046/2:1/w_3990,h_1995,c_limit/0622-Dads-Hamburger-Sandwich.jpg" />
      </div>
      <div className="saved_recipe_right_wrapper">
        <h3>Sandwich</h3>
        <p>
          Ingredients : <span>10</span>
        </p>
        <p>
          Cooking Time : <span>30 Minutes</span>
        </p>
        <p>
          Reciped By : <span>Hlyan Htet Aung</span>
        </p>
      </div>
    </div>
  );
}

export default SavedRecipe;
