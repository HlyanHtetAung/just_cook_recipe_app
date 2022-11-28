import { db } from "./Firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { signInWithGoogle } from "./Firebase";
import { reduxLogin, updateSavedRecipes } from "./redux/userSlice";

export function handleWordLimit(toLimitWord, limitAmount) {
  if (toLimitWord.split("").length > limitAmount) {
    return toLimitWord.split("").splice(0, limitAmount).join("") + "...";
  }
  return toLimitWord;
}

export async function signInHandle(e, dispatch) {
  e.preventDefault();
  e.stopPropagation();
  const userCollectionRef = collection(db, "users");
  const allUsersDocs = await getDocs(userCollectionRef);
  const signInResponse = await signInWithGoogle();

  const foundUser = allUsersDocs.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .find((usr) => usr.userId === signInResponse.user?.uid);

  if (foundUser !== undefined) {
    console.log("userphotoUrl", signInResponse.user.photoURL);
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

export async function savedRecipeHandle(
  recipeDetail,
  dispatch,
  userDocumentId
) {
  const userDocRef = doc(db, "users", userDocumentId);
  const currentUserResult = (await getDoc(userDocRef)).data();
  const refoundSavedRecipes = currentUserResult.savedRecipes.filter(
    (curRecipeDetail) =>
      curRecipeDetail.recipeDocId === recipeDetail.recipeDocId
  );
  if (refoundSavedRecipes.length <= 0) {
    const toAddSavedRecipeAry = [
      ...currentUserResult.savedRecipes,
      { ...recipeDetail },
    ];
    dispatch(updateSavedRecipes({ data: toAddSavedRecipeAry }));
    await updateDoc(userDocRef, { savedRecipes: toAddSavedRecipeAry });
  }
}

export async function deleteSavedRecipeHandle(
  e,
  userDocumentId,
  recipeDocId,
  dispatch
) {
  e.stopPropagation();
  e.preventDefault();
  const docRef = doc(db, "users", userDocumentId);
  const userResult = (await getDoc(docRef)).data();
  const currentSavedRecipes = [...userResult.savedRecipes];
  const toDeleteSavedRecipeIndex = currentSavedRecipes.findIndex(
    (recipe) => recipe.recipeDocId === recipeDocId
  );
  currentSavedRecipes.splice(toDeleteSavedRecipeIndex, 1);
  dispatch(updateSavedRecipes({ data: currentSavedRecipes }));
  await updateDoc(docRef, { savedRecipes: currentSavedRecipes });
}
