import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../Firebase";
import "./searchResultRecipes.scss";

function SearchResultRecipes() {
  const params = useParams();
  const [searchedRecipes, setSearchedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log("params", params.searchInput);

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
      const recipesRef = collection(db, "recipes");
      const q = query(
        recipesRef,
        where("toSearchRecipe", "array-contains-any", [
          ...Object.keys(triGram(params.searchInput)),
        ])
      );
      setLoading(true);
      const result = (await getDocs(q)).docs.map((doc) => ({ ...doc.data() }));
      setSearchedRecipes(result);
      setLoading(false);
    }
    getSearchResult();
  }, []);

  console.log("searchedRecipes", searchedRecipes);
  return (
    <div className="searchResultRecipes_wrapper">
      {/* {loading ? "Loading..." : "Result Reipces"} */}
      <div className="searchResult_wrapper">
        <div className="searchResult_left">
          <h3>Search Result</h3>
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
  );
}

export default SearchResultRecipes;
