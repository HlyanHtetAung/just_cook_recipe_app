import React, { useEffect, useRef, useState } from "react";
import Navlink from "../Navlink/Navlink";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgCloseR } from "react-icons/cg";
import { IoIosLogOut, IoMdArrowDropdown } from "react-icons/io";
import { CiDark } from "react-icons/ci";
import { AiOutlineCloseCircle } from "react-icons/ai";

import "./navbar.scss";
import SmallScreenNavbar from "../SmallScreenNavbar/SmallScreenNavbar";

import { useSelector, useDispatch } from "react-redux";

import { reduxLogout } from "../../redux/userSlice";
import { signInHandle } from "../../reuseFunctions";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setActiveHamburgerMenu, acitveHamburgerMenu }) {
  const { username, userPhoto, userRole } = useSelector((state) => state.user);
  const [openLogoutWrapper, setOpenLogoutWrapper] = useState(false);
  const [openNavSearchBar, setOpenNavSearchBar] = useState(false);
  const [userSearchInput, setUserSearchInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logoutWrapperRef = useRef();
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink("/" + window.location.pathname.split("/")[1]);
  }, []);

  function logoutHandle() {
    setOpenLogoutWrapper(false);
    dispatch(reduxLogout());
  }

  // detect outside of div
  useEffect(() => {
    function handleClickOutsideLogoutWrapper(e) {
      if (!logoutWrapperRef?.current?.contains(e.target)) {
        setOpenLogoutWrapper(false);
      }
    }
    window.addEventListener("click", handleClickOutsideLogoutWrapper);

    return () =>
      window.removeEventListener("click", handleClickOutsideLogoutWrapper);
  }, []);

  function handleSearchRecipe(e) {
    const userInputValue = e.target.value;
    setUserSearchInput(userInputValue);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      navigate(`/recipes/searchResult=${userSearchInput}`);
    }
  }

  return (
    <div className="navbar_outside_wrapper">
      <SmallScreenNavbar
        acitveHamburgerMenu={acitveHamburgerMenu}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <div
        className={openNavSearchBar ? "navbar_wrapper hide" : "navbar_wrapper"}
      >
        <div
          className={
            openNavSearchBar ? "searchBar_wrapper active" : "searchBar_wrapper"
          }
        >
          <div className="seachBar_input_wrapper">
            <FiSearch className="searchBar_searchIcon" />
            <input
              type="text"
              placeholder="Search recipe..."
              onChange={(e) => handleSearchRecipe(e)}
              onKeyPress={(e) => handleKeyPress(e)}
              value={userSearchInput}
            />
          </div>
          <AiOutlineCloseCircle
            className="searchBar_closeIcon"
            onClick={() => {
              setOpenNavSearchBar(false);
              setUserSearchInput("");
            }}
          />
        </div>
        <h1 className="navbar_header">JustCook</h1>
        <div className="navbar_right_wrapper">
          <Navlink
            linkName="Home"
            linkPath="/"
            windowLoactinPath={activeLink}
            setActiveLink={setActiveLink}
          />

          {userRole === "Admin" ? (
            <div className="recipe_dropdown_wrapper">
              <div className="recipe_navLink_wrapper">
                <h3>Recipes</h3>
                <IoMdArrowDropdown className="arrowDown_icon" />
                <ul className="dropdown_links_wrapper">
                  <Link to="/addNewRecipe">
                    <li>Add New Recipe</li>
                  </Link>
                  <Link to="/addNewRecipeType">
                    <li>Add New Recipe Type</li>
                  </Link>
                  <Link to="/allRecipesTable">
                    <li>View All Recipes</li>
                  </Link>
                </ul>
              </div>
            </div>
          ) : null}

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
          />
          {username ? (
            <div className="currnet_userinfo_wrapper" ref={logoutWrapperRef}>
              <img
                src={userPhoto}
                alt="Something Went Wrong"
                onClick={() => setOpenLogoutWrapper((prev) => !prev)}
              />
              <div
                className={
                  openLogoutWrapper ? "logout_Wrapper active" : "logout_Wrapper"
                }
              >
                <div className="logout_userInfo_wrapper">
                  <img src={userPhoto} alt="Something Went wrong" />
                  <div className="logout_userInfo_right">
                    <p>{username}</p>
                    <p>{userRole}</p>
                  </div>
                </div>
                <p className="link_wrapper">
                  <CiDark className="link_wrapper_icon" />
                  Change Dark Theme
                </p>
                <p className="link_wrapper" onClick={logoutHandle}>
                  <IoIosLogOut className="link_wrapper_icon" />
                  Sign Out
                </p>
              </div>
            </div>
          ) : (
            <button
              className="navbar_signUpBtn"
              onClick={(e) => signInHandle(e, dispatch)}
            >
              Login with Google
            </button>
          )}
          <FiSearch
            className="navbar_searchIcon"
            onClick={() => setOpenNavSearchBar(true)}
          />
          {acitveHamburgerMenu ? (
            <CgCloseR
              className="navbar_hamburgerIcon"
              onClick={() => setActiveHamburgerMenu((prev) => !prev)}
            />
          ) : (
            <GiHamburgerMenu
              className="navbar_hamburgerIcon"
              onClick={() => setActiveHamburgerMenu((prev) => !prev)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
