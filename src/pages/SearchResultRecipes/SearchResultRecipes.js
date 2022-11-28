import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import RecipeWithSavedIcon from "../../components/RecipeWithSavedIcon/RecipeWithSavedIcon";
import SearchResult from "../../components/SearchResult/SearchResult";
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

  return (
    <>
      {loading ? <Loading /> : <SearchResult foundRecipes={searchedRecipes} />}
    </>
  );
}

export default SearchResultRecipes;
