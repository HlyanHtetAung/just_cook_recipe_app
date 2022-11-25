import React, { useEffect, useRef, useState } from "react";
import Navlink from "../Navlink/Navlink";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgCloseR } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";
import { CiDark } from "react-icons/ci";

import "./navbar.scss";
import SmallScreenNavbar from "../SmallScreenNavbar/SmallScreenNavbar";
import { signInWithGoogle } from "../../Firebase";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { reduxLogin, reduxLogout } from "../../redux/userSlice";

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

  async function signInHandle() {
    const userCollectionRef = collection(db, "users");
    const allUsersDocs = await getDocs(userCollectionRef);
    const signInResponse = await signInWithGoogle();

    const foundUser = allUsersDocs.docs
      .map((user) => ({ ...user.data(), docId: user.id }))
      .find((usr) => usr.userId === signInResponse.user?.uid);
    console.log("foundUser", foundUser);

    if (foundUser !== undefined) {
      console.log("found User render");
      const updatedNameAndPhotoLinkUser = { ...foundUser };
      updatedNameAndPhotoLinkUser.userPhoto = signInResponse.user.photoURL;
      updatedNameAndPhotoLinkUser.username = signInResponse.user.displayName;
      delete updatedNameAndPhotoLinkUser.docId;
      const docRef = doc(db, "users", foundUser.docId);
      await updateDoc(docRef, {
        userPhoto: signInResponse.user.photoURL,
        username: signInResponse.user.displayName,
      });

      const reduxUser = {
        ...updatedNameAndPhotoLinkUser,
        userDocumentId: foundUser.docId,
      };
      console.log("reduxUser", reduxUser);
      dispatch(reduxLogin(reduxUser));
      return;
    }

    const newUserObj = {
      username: signInResponse.user.displayName,
      userPhoto: signInResponse.user.photoURL,
      userId: signInResponse.user.uid,
      savedRecipes: [],
      userRole: "User",
    };
    await addDoc(userCollectionRef, newUserObj);
    dispatch(reduxLogin(newUserObj));
  }
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
          <Navlink
            linkName="Add New Recipe"
            linkPath="/addNewRecipe"
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
            <button className="navbar_signUpBtn" onClick={signInHandle}>
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
