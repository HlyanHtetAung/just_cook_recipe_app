import React from "react";
import { Link, NavLink } from "react-router-dom";
import Navlink from "../Navlink/Navlink";
import "./smallScreenNavbar.scss";

function SmallScreenNavbar({
  acitveHamburgerMenu,
  activeLink,
  setActiveLink,
  windowWidth,
}) {
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
        />
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
        <Link to="/signUp">
          <button className="small_screen_navbar_signUp_btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
}

export default SmallScreenNavbar;
