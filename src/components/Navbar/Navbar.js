import React, { useEffect, useRef, useState } from "react";
import Navlink from "../Navlink/Navlink";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgCloseR } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { CiDark } from "react-icons/ci";

import "./navbar.scss";
import SmallScreenNavbar from "../SmallScreenNavbar/SmallScreenNavbar";

import { useSelector, useDispatch } from "react-redux";

import { reduxLogout, updateSavedRecipes } from "../../redux/userSlice";
import { signInHandle } from "../../reuseFunctions";

function Navbar({
  setActiveHamburgerMenu,
  activeLink,
  setActiveLink,
  acitveHamburgerMenu,
}) {
  const { username, userPhoto, userRole } = useSelector((state) => state.user);
  const [openLogoutWrapper, setOpenLogoutWrapper] = useState(false);
  const dispatch = useDispatch();
  const logoutWrapperRef = useRef();

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

  return (
    <div className="navbar_outside_wrapper">
      <SmallScreenNavbar
        acitveHamburgerMenu={acitveHamburgerMenu}
        activeLink={activeLink}
        setActiveLink={setActiveLink}
      />
      <div className="navbar_wrapper">
        <h1 className="navbar_header">JustCook</h1>
        <div className="navbar_right_wrapper">
          <Navlink
            linkName="Home"
            linkPath="/"
            windowLoactinPath={activeLink}
            setActiveLink={setActiveLink}
          />
          {userRole === "Admin" ? (
            <Navlink
              linkName="Add New Recipe"
              linkPath="/addNewRecipe"
              windowLoactinPath={activeLink}
              setActiveLink={setActiveLink}
            />
          ) : null}

          <Navlink
            linkName="About Us"
            linkPath="/aboutUs"
            windowLoactinPath={activeLink}
            setActiveLink={setActiveLink}
          />
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
              onClick={() => signInHandle(dispatch)}
            >
              Login with Google
            </button>
          )}
          <FiSearch className="navbar_searchIcon" />
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
