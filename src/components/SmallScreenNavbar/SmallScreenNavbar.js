import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import Navlink from "../Navlink/Navlink";
import "./smallScreenNavbar.scss";

function SmallScreenNavbar({
  acitveHamburgerMenu,
  activeLink,
  setActiveLink,
  setActiveHamburgerMenu,
}) {
  const { username } = useSelector((state) => state.user);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function windowResizeHandle() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", windowResizeHandle);
    return () => window.removeEventListener("resize", windowResizeHandle);
  }, []);
  const [openRecipeDropDown, setOpenRecipeDropdown] = useState(false);
  return (
    <div
      className={
        acitveHamburgerMenu && windowWidth < 850
          ? "smallScreenNavbar_wrapper active"
          : "smallScreenNavbar_wrapper "
      }
    >
      <div className="smallScreenNavbar_inside_wrapper">
        <Navlink
          linkName="Home"
          linkPath="/"
          windowLoactinPath={activeLink}
          setActiveLink={setActiveLink}
          setActiveHamburgerMenu={setActiveHamburgerMenu}
        />
        <div className="recipe_small_screen_navlink_wrapper">
          <div
            className="recipe_navlink_wrapper"
            onClick={() => setOpenRecipeDropdown((prev) => !prev)}
          >
            <h3>Recipe</h3>
            {openRecipeDropDown ? (
              <IoMdArrowDropup className="recipe_navlink_icon" />
            ) : (
              <IoMdArrowDropdown className="recipe_navlink_icon" />
            )}
          </div>
          <div
            className={
              openRecipeDropDown
                ? "small_screen_dropdown active"
                : "small_screen_dropdown"
            }
          >
            <Link
              to="/addNewRecipe"
              onClick={() => {
                setActiveHamburgerMenu(false);
                setOpenRecipeDropdown(false);
              }}
            >
              <p>Add New Recipe</p>
            </Link>
            <Link
              to="/addNewRecipeType"
              onClick={() => {
                setActiveHamburgerMenu(false);
                setOpenRecipeDropdown(false);
              }}
            >
              <p>Add New Recipe Type</p>
            </Link>
            <Link
              to="/allRecipesTable"
              onClick={() => {
                setActiveHamburgerMenu(false);
                setOpenRecipeDropdown(false);
              }}
            >
              <p>View All Recipes</p>
            </Link>
          </div>
        </div>
        {/* <Navlink
          linkName="About Us"
          linkPath="/aboutUs"
          windowLoactinPath={activeLink}
          setActiveLink={setActiveLink}
        /> */}
        <Navlink
          linkName="Saved Recipes"
          linkPath="/savedRecipes"
          windowLoactinPath={activeLink}
          setActiveLink={setActiveLink}
          setActiveHamburgerMenu={setActiveHamburgerMenu}
        />
        {username ? null : (
          <button className="small_screen_navbar_signUp_btn">Sign Up</button>
        )}
      </div>
    </div>
  );
}

export default SmallScreenNavbar;
