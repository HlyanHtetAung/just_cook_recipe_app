import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React from "react";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import RecipeForm from "../../components/RecipeForm/RecipeForm";
import { db, storage } from "../../Firebase";

function AddNewRecipe() {
  const { username } = useSelector((state) => state.user);

  function handleAddFinalRecipe(recipeDetail, imageFile) {
    console.log("clicked");
    const recipesCollectoinRef = collection(db, "recipes");

    const {
      recipeName,
      recipeType,
      recipePhoto,
      recipeIngredients,
      recipeMethods,
    } = recipeDetail;

    if (
      !recipeName ||
      !recipeType ||
      !recipePhoto ||
      recipeIngredients.length <= 0 ||
      recipeMethods <= 0
    ) {
      console.log("hello world");
      return;
    }
    const file = imageFile;
    const imageName = imageFile.name + v4();
    const sotragePath = "recipesImages/" + imageName;
    const storageRef = ref(storage, sotragePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newRecipe = {
            recipeImageName: imageName,
            recipeName,
            recipeType,
            recipePhotoLink: downloadURL,
            recipeIngredients,
            recipeMethods,
            comments: [],
            createdBy: username,
            timestamp: serverTimestamp(),
          };
          addDoc(recipesCollectoinRef, newRecipe);
        });
      }
    );
  }

  return (
    <RecipeForm
      formFunction={handleAddFinalRecipe}
      formButtonName="Add New Recipe"
      formHeader="New Recipe Form"
    />
  );
}

export default AddNewRecipe;
