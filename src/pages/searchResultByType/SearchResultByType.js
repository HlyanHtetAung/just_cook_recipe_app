import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import SearchResult from "../../components/SearchResult/SearchResult";
import { db } from "../../Firebase";
import { finishLoading, startLoading } from "../../redux/loadingSlice";

function SearchResultByType() {
  const params = useParams();
  const { loading } = useSelector((state) => state.loading);
  const [searchedRecipes, setSearchRecipes] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    function fetchRecipesOnTypes() {
      dispatch(startLoading());
      const recipesCollectionRef = collection(db, "recipes");
      const q = query(
        recipesCollectionRef,
        where("recipeType", "==", params.recipeType)
      );
      onSnapshot(q, (snapshot) => {
        setSearchRecipes(
          snapshot.docs.map((doc) => ({ ...doc.data(), recipeDocId: doc.id }))
        );
        dispatch(finishLoading());
      });
    }
    fetchRecipesOnTypes();
  }, [params.recipeType]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <SearchResult
          foundRecipes={searchedRecipes}
          selectedRecipeType={params.recipeType}
        />
      )}
    </>
  );
}

export default SearchResultByType;
