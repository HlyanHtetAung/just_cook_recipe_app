import React, { useEffect, useState } from 'react';
import './home.scss';
import { FiSearch } from 'react-icons/fi';
import { BsArrowLeftCircle, BsArrowRightCircle } from 'react-icons/bs';

import RecipeWithSavedIcon from '../../components/RecipeWithSavedIcon/RecipeWithSavedIcon';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  where,
} from 'firebase/firestore';
import { db } from '../../Firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { finishLoading, startLoading } from '../../redux/loadingSlice';
import Loading from '../../components/Loading/Loading';

function Home() {
  const { loading } = useSelector((state) => state.loading);
  const [allRecipes, setAllRecipes] = useState([]);
  const [newestRecipes, setNewestRecipes] = useState([]);
  const [allRecipeTypes, setAllRecipeTypes] = useState([]);
  const dispatch = useDispatch();
  const [toMovePercentage, setToMovePercentage] = useState(0);
  const [currentStartPosition, setCurrentStartPosition] = useState(0);
  const [currentShownCarouselItems, setCurrentShownCarouselItems] = useState(0);
  const navigate = useNavigate();
  const [userSearchInput, setUserSearchInput] = useState('');

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
    window.addEventListener('resize', hanldeCarouselItemOnWindowWidth);
    return () =>
      window.removeEventListener('resize', hanldeCarouselItemOnWindowWidth);
  }, []);

  function handleCarouselRightBtn(val) {
    if (val == 4) {
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          4 >=
        4
      ) {
        setToMovePercentage((prev) => prev + 400);
        setCurrentStartPosition((prev) => prev + 4);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          4 ==
        3
      ) {
        setToMovePercentage((prev) => prev + 300);
        setCurrentStartPosition((prev) => prev + 3);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          4 ==
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          4 ==
        1
      ) {
        setToMovePercentage((prev) => prev + 100);
        setCurrentStartPosition((prev) => prev + 1);
      }
    }
    if (val == 3) {
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          3 >=
        3
      ) {
        setToMovePercentage((prev) => prev + 300);
        setCurrentStartPosition((prev) => prev + 3);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          3 ==
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          3 ==
        1
      ) {
        setToMovePercentage((prev) => prev + 100);
        setCurrentStartPosition((prev) => prev + 1);
      }
    }
    if (val == 2) {
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
          2 >=
        2
      ) {
        setToMovePercentage((prev) => prev + 200);
        setCurrentStartPosition((prev) => prev + 2);
      }
      if (
        allRecipeTypes.slice(currentStartPosition, allRecipeTypes.length)
          .length -
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
      if (allRecipeTypes.slice(0, currentStartPosition).length >= 4) {
        setToMovePercentage((prev) => prev - 400);
        setCurrentStartPosition((prev) => prev - 4);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 3) {
        setToMovePercentage((prev) => prev - 300);
        setCurrentStartPosition((prev) => prev - 3);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
    if (val == 3) {
      if (allRecipeTypes.slice(0, currentStartPosition).length >= 3) {
        setToMovePercentage((prev) => prev - 300);
        setCurrentStartPosition((prev) => prev - 3);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
    if (val == 2) {
      if (allRecipeTypes.slice(0, currentStartPosition).length >= 2) {
        setToMovePercentage((prev) => prev - 200);
        setCurrentStartPosition((prev) => prev - 2);
      }
      if (allRecipeTypes.slice(0, currentStartPosition).length == 1) {
        setToMovePercentage((prev) => prev - 100);
        setCurrentStartPosition((prev) => prev - 1);
      }
    }
  }

  useEffect(() => {
    async function fetchNewestRecieps() {
      dispatch(startLoading());
      const recipesCollectionRef = collection(db, 'recipes');
      const q = query(
        recipesCollectionRef,
        orderBy('timestamp', 'desc'),
        limit(5)
      );
      onSnapshot(q, (snapshot) => {
        setNewestRecipes(
          snapshot.docs.map((doc) => ({ ...doc.data(), recipeDocId: doc.id }))
        );
        dispatch(finishLoading());
      });
    }
    async function fetchAllRecipes() {
      const recipesCollectionRef = collection(db, 'recipes');
      onSnapshot(recipesCollectionRef, (snapshot) => {
        setAllRecipes(
          snapshot.docs.map((doc) => ({ ...doc.data(), recipeDocId: doc.id }))
        );
      });
    }
    fetchNewestRecieps();
    fetchAllRecipes();
  }, []);

  useEffect(() => {
    async function fetchAllRecipeTypes() {
      const recipeTypesCollectionRef = collection(db, 'recipeTypes');
      onSnapshot(recipeTypesCollectionRef, (snapshot) => {
        const result = snapshot.docs.map((doc) => ({
          ...doc.data(),
          recipeTypeDocId: doc.id,
        }));
        setAllRecipeTypes(result);
        let arrayLength = result.length;

        let caraouselCurrentShowLengthOnEndOfArray =
          currentStartPosition + currentShownCarouselItems;
        let toMoveResult = caraouselCurrentShowLengthOnEndOfArray - arrayLength;
        if (toMoveResult > 0) {
          setToMovePercentage((prev) => prev - 100);
          setCurrentStartPosition((prev) => prev - 1);
        }
      });
    }
    fetchAllRecipeTypes();
  }, [currentShownCarouselItems]);

  function handleSearchRecipe(e) {
    const userInputValue = e.target.value;
    setUserSearchInput(userInputValue);
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      navigate(`/recipes/searchResult=${userSearchInput}`);
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="home_outside_wrapper">
          <div className="home_wrapper">
            <div className="image_overlayEffect"></div>
            <div className="home_search_wrapper">
              <h1 className="home_seach_header">Ready To Cook?</h1>
              <div className="home_input_wrapper">
                <FiSearch className="home_input_searchIcon" />
                <input
                  type="text"
                  placeholder="Search for a recipe"
                  onChange={(e) => handleSearchRecipe(e)}
                  onKeyPress={(e) => handleKeyPress(e)}
                  value={userSearchInput}
                />
              </div>
              <div className="home_recipeType_wrapper">
                <BsArrowLeftCircle
                  className="home_recipeArrowIcon"
                  onClick={() =>
                    handleCarouselLeftBtn(currentShownCarouselItems)
                  }
                />
                <BsArrowRightCircle
                  className="home_recipeArrowIcon"
                  onClick={() =>
                    handleCarouselRightBtn(currentShownCarouselItems)
                  }
                />
                <div className="recipeTypes_wrapper">
                  {allRecipeTypes.map((recipeType) => (
                    <Link
                      className="recipesType"
                      to={`/recipes/searchRecipeType=${recipeType.recipeTypeName}`}
                      key={recipeType.recipeTypeDocId}
                      style={{
                        transform: `translate(-${toMovePercentage}%)`,
                      }}
                    >
                      <p>{recipeType.recipeTypeName}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="newest_outside_recipesTypes_wrapper">
            <div className="newest_recipeTypes_wrapper">
              <h2 className="newest_recipes_header">Newest Recipes</h2>
              <div className="newest_recipes_wrapper">
                {newestRecipes.map((recipe) => (
                  <RecipeWithSavedIcon
                    recipeDetail={recipe}
                    key={recipe.recipeDocId}
                    recipeId={recipe.recipeDocId}
                    recipeName={recipe.recipeName}
                    recipePhoto={recipe.recipePhotoLink}
                  />
                ))}
              </div>
              <div className="divider"></div>
            </div>
          </div>
          <div className="popular_recipes_wrapper">
            <h2 className="popular_recipes_header">All Recipes</h2>
            <div className="popular_recipes_conatiner">
              {allRecipes.map((recipe) => (
                <RecipeWithSavedIcon
                  key={recipe.recipeDocId}
                  recipeDetail={recipe}
                  recipeId={recipe.recipeDocId}
                  recipeName={recipe.recipeName}
                  recipePhoto={recipe.recipePhotoLink}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
