import { useEffect, useState } from "react";
import "./app.scss";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AboutUs from "./pages/AboutUs/AboutUs";
import Home from "./pages/Home/Home";
import SavedRecipes from "./pages/SavedRecipes/SavedRecipes";
import { AiOutlineInstagram } from "react-icons/ai";
import { SlSocialTwitter } from "react-icons/sl";
import { MdFacebook } from "react-icons/md";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";

import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./Firebase";
import { getAllUsers } from "./redux/allUsersSlice";
import AddNewRecipe from "./pages/AddNewRecipe/AddNewRecipe";
function App() {
  const { userRole } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  // To contorl Navbar on small screen
  const [acitveHamburgerMenu, setActiveHamburgerMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeLink, setActiveLink] = useState(
    "/" + window.location.pathname.split("/")[1]
  );

  useEffect(() => {
    setActiveLink("/" + window.location.pathname.split("/")[1]);
  }, []);

  useEffect(() => {
    function windowResizeHandle() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", windowResizeHandle);
    return () => window.removeEventListener("resize", windowResizeHandle);
  }, []);

  // useEffect(() => {
  //   // get All users after app is mounted
  //   const fetchAllUsers = () => {
  //     const userCollectionRef = collection(db, "users");
  //     onSnapshot(userCollectionRef, (snapshot) =>
  //       dispatch(
  //         getAllUsers(
  //           snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id }))
  //         )
  //       )
  //     );
  //   };
  //   fetchAllUsers();
  // }, []);

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar
          setActiveHamburgerMenu={setActiveHamburgerMenu}
          activeLink={activeLink}
          setActiveLink={setActiveLink}
          acitveHamburgerMenu={acitveHamburgerMenu}
          windowWidth={windowWidth}
        />

        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="savedRecipes" element={<SavedRecipes />} />
            <Route path="addNewRecipe" element={<AddNewRecipe />} />
            <Route path="recipe/:recipeId" element={<RecipeDetail />} />
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
                <MdFacebook className="footer_social_icon" />
              </div>
              <p>@{new Date().getFullYear()} JustCook. All Rights Reserved.</p>
            </div>
            <div className="app_footer_link_wrapper">
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Advertisting</p>
              <p>Contact Us</p>
              <p>Advertisting</p>
            </div>
            <div className="app_footer_link_wrapper">
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Advertisting</p>
            </div>
            <div className="app_footer_link_wrapper">
              <p>About Us</p>
              <p>Contact Us</p>
              <p>Advertisting</p>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
