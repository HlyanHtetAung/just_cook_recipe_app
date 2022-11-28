import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import RecipeWithSavedIcon from "../../components/RecipeWithSavedIcon/RecipeWithSavedIcon";
import { db } from "../../Firebase";
import { finishLoading, startLoading } from "../../redux/loadingSlice";
import "./searchResultRecipes.scss";

function SearchResultRecipes() {
  const { loading } = useSelector((state) => state.loading);
  const params = useParams();
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const triGram = (txt) => {
      const map = {};
      const s1 = (txt.split(" ").join("") || "").toLowerCase();
      console.log("s1", s1);
      const n = 3;
      for (let k = 0; k <= s1.length - n; k++)
        map[s1.substring(k, k + n)] = true;
      return map;
    };

    async function getSearchResult() {
      dispatch(startLoading());
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("toSearchRecipe", "array-contains-any", [
          ...Object.keys(triGram(params.searchInput)),
        ])
      );

      const result = (await getDocs(q)).docs.map((doc) => ({
        ...doc.data(),
        recipeDocId: doc.id,
      }));
      setSearchedRecipes(result);
      dispatch(finishLoading());
    }
    getSearchResult();
  }, [params.searchInput]);

  console.log("searchedRecipes", searchedRecipes);
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="searchResultRecipes_wrapper">
          <div className="searchResult_wrapper">
            <div className="searchResult_left">
              <h3>Found Recipes ({searchedRecipes.length})</h3>
              <div className="searched_recipes_wrapper">
                {searchedRecipes?.map((recipe) => (
                  <RecipeWithSavedIcon
                    recipeDetail={recipe}
                    key={recipe.recipeDocId}
                    recipeId={recipe.recipeDocId}
                    recipeName={recipe.recipeName}
                    recipePhoto={recipe.recipePhotoLink}
                  />
                ))}
              </div>
            </div>
            <div className="searchResult_right">
              <h3>Food Types</h3>
              <div className="food_types_wrapper">
                <p>Myanmar</p>
                <p>English</p>
                <p>Mexican</p>
                <p>Chinese</p>
                <p>Spanish</p>
                <p>Thai</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResultRecipes;
