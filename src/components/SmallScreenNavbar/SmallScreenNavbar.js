import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import Navlink from '../Navlink/Navlink';
import './smallScreenNavbar.scss';
import { signInHandle } from '../../reuseFunctions';
function SmallScreenNavbar({
  acitveHamburgerMenu,
  activeLink,
  setActiveLink,
  setActiveHamburgerMenu,
}) {
  const { username, userRole } = useSelector((state) => state.user);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const dispatch = useDispatch();
  useEffect(() => {
    function windowResizeHandle() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', windowResizeHandle);
    return () => window.removeEventListener('resize', windowResizeHandle);
  }, []);
  const [openRecipeDropDown, setOpenRecipeDropdown] = useState(false);
  return (
    <div
      className={
        acitveHamburgerMenu && windowWidth < 850
          ? 'smallScreenNavbar_wrapper active'
          : 'smallScreenNavbar_wrapper '
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
        {userRole === 'Admin' && (
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
                  ? 'small_screen_dropdown active'
                  : 'small_screen_dropdown'
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
            </div>
          </div>
        )}

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
          <button
            className="small_screen_navbar_signUp_btn"
            onClick={(e) => signInHandle(e, dispatch)}
          >
            Login in with google
          </button>
        )}
      </div>
    </div>
  );
}

export default SmallScreenNavbar;
