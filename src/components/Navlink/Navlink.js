import React from "react";
import { Link } from "react-router-dom";
import "./navlink.scss";

function Navlink({
  linkName,
  linkPath,
  windowLoactinPath,
  setActiveLink,
  setActiveHamburgerMenu,
}) {
  return (
    <Link
      to={linkPath}
      onClick={() => {
        setActiveLink(linkPath);
        setActiveHamburgerMenu && setActiveHamburgerMenu(false);
      }}
    >
      <h3
        className={
          windowLoactinPath === linkPath ? "nav_link active" : "nav_link"
        }
      >
        {linkName}
      </h3>
    </Link>
  );
}

export default Navlink;
