import React, { useEffect } from "react";
import Navlink from "../Navlink/Navlink";
import { FiSearch } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgCloseR } from "react-icons/cg";
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
import { reduxLogin } from "../../redux/userSlice";

function Navbar({
  setActiveHamburgerMenu,
  activeLink,
  setActiveLink,
  acitveHamburgerMenu,
}) {
  // const { allUsers } = useSelector((state) => state.allUsers);
  const { username, userPhoto } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   windowWidth > 850 && setActiveHamburgerMenu(false);
  // }, []);

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
      await updateDoc(docRef, updatedNameAndPhotoLinkUser);

      const reduxUser = {
        ...updatedNameAndPhotoLinkUser,
        userDocumentId: foundUser.docId,
      };

      console.log(
        reduxUser.userPhoto === updatedNameAndPhotoLinkUser.userPhoto
      );

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
            <div className="currnet_userinfo_wrapper">
              <img src={userPhoto} alt="Something Went Wrong" />
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
