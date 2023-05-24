import { useState } from 'react';
import './app.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AboutUs from './pages/AboutUs/AboutUs';
import Home from './pages/Home/Home';
import SavedRecipes from './pages/SavedRecipes/SavedRecipes';
import { AiOutlineInstagram } from 'react-icons/ai';
import { SlSocialTwitter } from 'react-icons/sl';
import { MdFacebook } from 'react-icons/md';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import EditRecipe from './pages/EditRecipeForm/EditRecipe';
import AddNewRecipe from './pages/AddNewRecipe/AddNewRecipe';
import SearchResultRecipes from './pages/SearchResultRecipes/SearchResultRecipes';
import AddNewRecipeType from './pages/AddNewRecipeType/AddNewRecipeType';
import ViewAllRecipes from './pages/ViewAllRecipes/ViewAllRecipes';
import SearchResultByType from './pages/searchResultByType/SearchResultByType';

function App() {
  // To contorl Navbar on small screen
  const [acitveHamburgerMenu, setActiveHamburgerMenu] = useState(false);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar
          setActiveHamburgerMenu={setActiveHamburgerMenu}
          acitveHamburgerMenu={acitveHamburgerMenu}
        />
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="savedRecipes" element={<SavedRecipes />} />
            <Route path="addNewRecipe" element={<AddNewRecipe />} />
            <Route path="addNewRecipeType" element={<AddNewRecipeType />} />
            <Route path="allRecipesTable" element={<ViewAllRecipes />} />
            <Route path="editRecipe/:recipeDocId" element={<EditRecipe />} />
            <Route path="recipe/:recipeId" element={<RecipeDetail />} />
            <Route
              path="recipes/searchResult=:searchInput"
              element={<SearchResultRecipes />}
            />
            <Route
              path="recipes/searchRecipeType=:recipeType"
              element={<SearchResultByType />}
            />
          </Route>
        </Routes>

        <div className="app_footer_wrapper">
          <div className="app_footer">
            <div className="app_footer_left_side_wrapper">
              <h1>JustCook</h1>
              <div className="app_footer_logo_container">
                <AiOutlineInstagram className="footer_social_icon" />
                <SlSocialTwitter className="footer_social_icon" />
                <MdFacebook className="footer_social_icon" />
                {/* <MdFacebook className="footer_social_icon" /> */}
              </div>
              <p>@{new Date().getFullYear()} JustCook. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
