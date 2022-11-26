import React, { useEffect, useState } from "react";
import SavedRecipe from "../../components/SavedRecipe/SavedRecipe";
import "./savedRecipes.scss";

import { db } from "../../Firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useSelector } from "react-redux";

function SavedRecipes() {
  const { userId } = useSelector((state) => state.user);
  const [userDetail, setUserDetail] = useState([]);

  useEffect(() => {
    async function fetchUserDetail() {
      const usersCollectionRef = collection(db, "users");
      const q = query(usersCollectionRef, where("userId", "==", userId));
      onSnapshot(q, (snapshot) =>
        setUserDetail(
          snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }))
        )
      );
    }
    fetchUserDetail();
  }, [userId]);

  return (
    <div className="saved_recipes_outside_wrapper">
      <div className="saved_recipes_inside_wrapper">
        <h3>Saved Recipes({userDetail[0]?.savedRecipes?.length})</h3>
        <div className="saved_recipes_layout_wrapper">
          {userDetail[0]?.savedRecipes?.map((recipe) => (
            <SavedRecipe
              key={recipe.recipeDocId}
              recipeName={recipe.recipeName}
              recipePhoto={recipe.recipePhotoLink}
              recipeIngredientsCount={recipe.recipeIngredients.length}
              recipeOwner={recipe.createdBy}
              recipeDocumentId={recipe.recipeDocId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedRecipes;
