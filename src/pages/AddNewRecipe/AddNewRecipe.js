import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React from 'react';
import { useSelector } from 'react-redux';
import { v4 } from 'uuid';
import RecipeForm from '../../components/RecipeForm/RecipeForm';
import { db, storage } from '../../Firebase';
import { useNavigate } from 'react-router-dom';
function AddNewRecipe() {
  const navigate = useNavigate();
  const { username } = useSelector((state) => state.user);

  const triGram = (txt) => {
    const map = {};
    const s1 = (txt || '').toLowerCase();
    const n = 3;
    for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true;
    return map;
  };

  function handleAddFinalRecipe(recipeDetail, imageFile) {
    if (
      !recipeDetail.recipeName ||
      !recipeDetail.recipeType ||
      !recipeDetail.recipePhoto
    ) {
      alert('Please make sure double check every data is fill out correctly.');
      return;
    }

    const recipesCollectoinRef = collection(db, 'recipes');

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
      return;
    }

    const file = imageFile;
    const imageName = imageFile.name + v4();
    const sotragePath = 'recipesImages/' + imageName;
    const storageRef = ref(storage, sotragePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
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
            toSearchRecipe: [...Object.keys(triGram(recipeName))],
          };
          addDoc(recipesCollectoinRef, newRecipe);
          alert('Successfully created recipe.');
          navigate('/');
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
