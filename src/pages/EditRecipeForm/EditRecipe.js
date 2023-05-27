import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 } from 'uuid';
import RecipeForm from '../../components/RecipeForm/RecipeForm';
import { db, storage } from '../../Firebase';

function EditRecipe() {
  const params = useParams();
  const navigate = useNavigate();
  async function editRecipeHandle(recipeDetail, imageFile, toDelteImageName) {
    const {
      recipeName,
      recipeType,
      recipePhoto,
      recipeIngredients,
      recipeMethods,
    } = recipeDetail;
    const recipceDocRef = doc(db, 'recipes', params.recipeDocId);
    const file = imageFile;
    if (file) {
      const toDelteImageRef = ref(storage, `recipesImages/${toDelteImageName}`);
      await deleteObject(toDelteImageRef);
      const imageName = imageFile.name + v4();
      const sotragePath = 'recipesImages/' + imageName;
      const storageRef = ref(storage, sotragePath);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Edit is ' + progress + '% done');
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateDoc(recipceDocRef, {
              recipeImageName: imageName,
              recipeName,
              recipeType,
              recipePhotoLink: downloadURL,
              recipeIngredients,
              recipeMethods,
            });
          });
          alert('Successfully edit recipe.');
          navigate(`/recipe/${params.recipeDocId}`);
        }
      );
      return;
    }
    await updateDoc(recipceDocRef, {
      recipeName,
      recipeType,
      recipeIngredients,
      recipeMethods,
    });
    alert('Successfully edit recipe.');
    navigate(`/recipe/${params.recipeDocId}`);
  }

  return (
    <RecipeForm
      formButtonName="Edit Recipe"
      formHeader="Edit Recipe Form"
      toEditRecipeDocId={params.recipeDocId}
      formFunction={editRecipeHandle}
    />
  );
}

export default EditRecipe;
