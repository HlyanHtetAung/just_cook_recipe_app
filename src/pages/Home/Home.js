import React, { useEffect, useState } from "react";
import "./home.scss";
import { FiSearch } from "react-icons/fi";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import NewestRecipe from "../../components/NewestRecipe/NewestRecipe";
import RecipeWithSavedIcon from "../../components/RecipeWithSavedIcon/RecipeWithSavedIcon";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Firebase";

function Home() {
  const [allRecipes, setAllRecipes] = useState([]);
  const [recipeTypes, setRecipesTypes] = useState([
    {
      recipeTypeId: 1,
      recipeType: "Chinese",
    },
    {
      recipeTypeId: 2,
      recipeType: "Myanmar",
    },
    {
      recipeTypeId: 3,
      recipeType: "India",
    },
    {
      recipeTypeId: 4,
      recipeType: "Mexico",
    },
    {
      recipeTypeId: 5,
      recipeType: "Spanish",
    },
    {
      recipeTypeId: 6,
      recipeType: "French",
    },
    {
      recipeTypeId: 7,
      recipeType: "Italy",
    },
    {
      recipeTypeId: 8,
      recipeType: "Korea",
    },
    {
      recipeTypeId: 9,
      recipeType: "Somewhere",
    },
    {
      recipeTypeId: 10,
      recipeType: "Somewhere",
    },
    {
      recipeTypeId: 11,
      recipeType: "Somewhere",
    },
  ]);

  const [toMovePercentage, setToMovePercentage] = useState(0);
  const [currentStartPosition, setCurrentStartPosition] = useState(0);
  const [currentShownCarouselItems, setCurrentShownCarouselItems] = useState(0);

  function hanldeCarouselItemOnWindowWidth() {
    if (window.innerWidth > 1000) {
      setCurrentShownCarouselItems(4);
    }
    if (window.innerWidth < 1100 && window.innerWidth > 800) {
      setCurrentShownCarouselItems(3);
    }
    if (window.innerWidth < 800) {
      setCurrentShownCarouselItems(2);
    }
  }

  useEffect(() => {
    if (window.innerWidth > 1000) {
      setCurrentShownCarouselItems(4);
    }
    if (window.innerWidth < 1100 && window.innerWidth > 800) {
      setCurrentShownCarouselItems(3);
    }
    if (window.innerWidth < 800) {
      setCurrentShownCarouselItems(2);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("resize", hanldeCarouselItemOnWindowWidth);
    return () =>
      window.removeEventListener("resize", hanldeCarouselItemOnWindowWidth);
  }, []);

  useEffect(() => {
    let arrayLength = recipeTypes.length;
    let caraouselCurrentShowLengthOnEndOfArray =
      currentStartPosition + currentShownCarouselItems;
    let toMoveResult = caraouselCurrentShowLengthOnEndOfArray - arrayLength;
    if (toMoveResult > 0) {
      setToMovePercentage((prev) => prev - 100);
      setCurrentStartPosition((prev) => prev - 1);
    }
  }, [currentShownCarouselItems]);

  function handleCarouselRightBtn(val) {
    if (val == 4) {
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          4 >=
        4
      ) {
        setToMovePercentage((prev) => prev + 400);
        setCurrentStartPosition((prev) => prev + 4);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          4 ==
        3
      ) {
        setToMovePercentage((prev) => prev + 300);
        setCurrentStartPosition((prev) => prev + 3);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          4 ==
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          4 ==
        1
      ) {
        setToMovePercentage((prev) => prev + 100);
        setCurrentStartPosition((prev) => prev + 1);
      }
    }
    if (val == 3) {
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          3 >=
        3
      ) {
        setToMovePercentage((prev) => prev + 300);
        setCurrentStartPosition((prev) => prev + 3);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          3 ==
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          3 ==
        1
      ) {
        setToMovePercentage((prev) => prev + 100);
        setCurrentStartPosition((prev) => prev + 1);
      }
    }
    if (val == 2) {
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          2 >=
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        recipeTypes.slice(currentStartPosition, recipeTypes.length).length -
          2 ==
        1
      ) {
        setToMovePercentage((prev) => prev + 100);
        setCurrentStartPosition((prev) => prev + 1);
      }
    }
  }

  function handleCarouselLeftBtn(val) {
    if (val == 4) {
      if (recipeTypes.slice(0, currentStartPosition).length >= 4) {
        setToMovePercentage((prev) => prev - 400);
        setCurrentStartPosition((prev) => prev - 4);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 3) {
        setToMovePercentage((prev) => prev - 300);
        setCurrentStartPosition((prev) => prev - 3);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
    if (val == 3) {
      if (recipeTypes.slice(0, currentStartPosition).length >= 3) {
        setToMovePercentage((prev) => prev - 300);
        setCurrentStartPosition((prev) => prev - 3);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
    if (val == 2) {
      if (recipeTypes.slice(0, currentStartPosition).length >= 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (recipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
  }

  useEffect(() => {
    async function fetchAllRecipes() {
      const recipesCollectionRef = collection(db, "recipes");
      onSnapshot(recipesCollectionRef, (snapshot) =>
        setAllRecipes(
          snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }))
        )
      );
    }
    console.log("reenderderd");
    fetchAllRecipes();
  }, []);

  return (
    <div className="home_outside_wrapper">
      <div className="home_wrapper">
        <div className="image_overlayEffect"></div>
        <div className="home_search_wrapper">
          <h1 className="home_seach_header">Ready To Cook?</h1>
          <div className="home_input_wrapper">
            <FiSearch className="home_input_searchIcon" />
            <input type="text" placeholder="Search for a recipe" />
          </div>
          <div className="home_recipeType_wrapper">
            <BsArrowLeftCircle
              className="home_recipeArrowIcon"
              onClick={() => handleCarouselLeftBtn(currentShownCarouselItems)}
            />
            <BsArrowRightCircle
              className="home_recipeArrowIcon"
              onClick={() => handleCarouselRightBtn(currentShownCarouselItems)}
            />
            <div className="recipeTypes_wrapper">
              {recipeTypes.map((recipe) => (
                <p
                  style={{ transform: `translate(-${toMovePercentage}%)` }}
                  className="recipesType"
                  key={recipe.recipeTypeId}
                >
                  {recipe.recipeType}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="newest_outside_recipesTypes_wrapper">
        <div className="newest_recipeTypes_wrapper">
          <h2 className="newest_recipes_header">Newest Recipes</h2>
          <div className="newest_recipes_wrapper">
            <NewestRecipe recipeName="Burger King Burger" />
            <NewestRecipe recipeName="Hello World" />
            <NewestRecipe recipeName="Burger King" />
            <NewestRecipe recipeName="Hello World" />
            <NewestRecipe recipeName="Burger King" />
          </div>
          <div className="divider"></div>
        </div>
      </div>
      <div className="popular_recipes_wrapper">
        <h2 className="popular_recipes_header">Popular Recipes These Days</h2>
        <div className="popular_recipes_conatiner">
          {allRecipes.map((recipe) => (
            <RecipeWithSavedIcon
              key={recipe.docId}
              recipeId={recipe.docId}
              recipeName={recipe.recipeName}
              recipePhoto={recipe.recipePhotoLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
