import React, { useRef, useState } from "react";
import InputTextBox from "../../components/inputTextBox/InputTextBox";
import { RiImageAddFill } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import "./addNewRecipe.scss";
import { useSelector } from "react-redux";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../Firebase";
import { v4 } from "uuid";
function AddNewRecipe() {
  const [recipeDetail, setRecipeDetail] = useState({
    recipeName: "",
    reciepType: "Burmese",
    recipePhoto: "",
    recipeIngredientText: "",
    recipeIngredients: [],
    recipeMethodHeader: "",
    recipeMethodLetter: "",
    recipeMethods: [],
  });

  const { username } = useSelector((state) => state.user);
  const [toEditIngredintIndex, setToEditIngredintIndex] = useState(null);
  const [editIngredientBtnClicked, setEditIngredientBtnClicked] =
    useState(false);
  const [editMethodBtnClicked, setEditMethodBtnClicked] = useState(false);
  const [toEditMethodIndex, setToEditMethodIndex] = useState(null);
  const [imageFile, setImageFileName] = useState("");
  const inputFileRef = useRef(null);

  function inputTextChangeHandle(e, propertyName) {
    const inputValue = e.target.value;
    setRecipeDetail((prev) => ({ ...prev, [propertyName]: inputValue }));
  }

  // Recipe Ingredients functions
  function addToIngerdientsList() {
    const toAddValue = recipeDetail.recipeIngredientText;
    if (!toAddValue) {
      return;
    }
    const prevArrayValue = recipeDetail.recipeIngredients;
    const updatedArrayValue = [...prevArrayValue, toAddValue];
    setRecipeDetail((prev) => ({
      ...prev,
      recipeIngredientText: "",
      recipeIngredients: updatedArrayValue,
    }));
  }
  function deleteIngerdientList(index) {
    const prevArrayValue = recipeDetail.recipeIngredients;
    prevArrayValue.splice(index, 1);
    setRecipeDetail((prev) => ({ ...prev, recipeIngredients: prevArrayValue }));
  }

  function editIngredientBtnClickedHandle(prevIngredientValue, index) {
    setToEditIngredintIndex(index);
    setEditIngredientBtnClicked(true);
    setRecipeDetail((prev) => ({
      ...prev,
      recipeIngredientText: prevIngredientValue,
    }));
  }

  function editIngredientList() {
    const prevArrayValue = recipeDetail.recipeIngredients;
    const editedText = recipeDetail.recipeIngredientText;
    if (!editedText) {
      return;
    }
    const editedArrayvalue = prevArrayValue.map((val, index) =>
      index !== toEditIngredintIndex ? val : editedText
    );
    setRecipeDetail((prev) => ({
      ...prev,
      recipeIngredientText: "",
      recipeIngredients: editedArrayvalue,
    }));
    setEditIngredientBtnClicked(false);
  }

  // Recipe Method functions
  function addToMethodList() {
    const methodHeader = recipeDetail.recipeMethodHeader;
    const methodLetter = recipeDetail.recipeMethodLetter;
    if (!methodHeader && !methodLetter) {
      return;
    }
    // if (!methodHeader  && methodLetter || methodHeader  && !methodLetter) {
    //   return;
    // }
    const prevMethodArray = recipeDetail.recipeMethods;
    const updateMethodArray = [
      ...prevMethodArray,
      { methodHeader, methodLetter },
    ];
    setRecipeDetail((prev) => ({
      ...prev,
      recipeMethodHeader: "",
      recipeMethodLetter: "",
      recipeMethods: updateMethodArray,
    }));
  }

  function deleteRecipeMethodHandle(index) {
    const prevRecipeMethods = recipeDetail.recipeMethods;
    prevRecipeMethods.splice(index, 1);
    setRecipeDetail((prev) => ({ ...prev, recipeMethods: prevRecipeMethods }));
  }

  function editMethodBtnClickedHandle(header, letter, index) {
    setToEditMethodIndex(index);
    setEditMethodBtnClicked(true);
    const methodHeader = header;
    const methodLetter = letter;
    setRecipeDetail((prev) => ({
      ...prev,
      recipeMethodHeader: methodHeader,
      recipeMethodLetter: methodLetter,
    }));
  }

  function editMethodHandle() {
    setEditMethodBtnClicked(false);
    const prevMethods = recipeDetail.recipeMethods;

    const editedAryValue = prevMethods.map((val, index) =>
      index == toEditMethodIndex
        ? {
            methodHeader: recipeDetail.recipeMethodHeader,
            methodLetter: recipeDetail.recipeMethodLetter,
          }
        : val
    );

    setRecipeDetail((prev) => ({
      ...prev,
      recipeMethodHeader: "",
      recipeMethodLetter: "",
      recipeMethods: editedAryValue,
    }));
  }

  function fileChangeHandle(e) {
    const selectedFileImage = e.target.files[0];
    setImageFileName(selectedFileImage);
    setRecipeDetail((prev) => ({
      ...prev,
      recipePhoto: selectedFileImage
        ? URL.createObjectURL(selectedFileImage)
        : "",
    }));
  }

  function handleAddFinalRecipe() {
    const recipesCollectoinRef = collection(db, "recipes");

    const {
      recipeName,
      reciepType,
      recipePhoto,
      recipeIngredients,
      recipeMethods,
    } = recipeDetail;

    if (
      !recipeName ||
      !reciepType ||
      !recipePhoto ||
      recipeIngredients.length <= 0 ||
      recipeMethods <= 0
    ) {
      return;
    }
    const file = imageFile;
    const sotragePath = "recipesImages/" + imageFile.name + v4();
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
            recipeName,
            reciepType,
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
    <div className="addRecipe_wrapper">
      <h3 className="addRecipe_header">Add New Recipe Form</h3>
      <div className="form_wrapper">
        <InputTextBox
          textBoxHeader="Recipe Name"
          textOnChangeHandler={inputTextChangeHandle}
          propertyName="recipeName"
          stateValue={recipeDetail.recipeName}
        />
        <InputTextBox
          textBoxHeader="Recipe Type"
          textOnChangeHandler={inputTextChangeHandle}
          propertyName="reciepType"
          stateValue={recipeDetail.reciepType}
        />
        <div className="recipe_ingredients_wrapper">
          <div className="recipe_ingredients_left_wrapper">
            <InputTextBox
              textBoxHeader="Recipe Ingredients"
              textOnChangeHandler={inputTextChangeHandle}
              propertyName="recipeIngredientText"
              stateValue={recipeDetail.recipeIngredientText}
              placeholderValue="Enter a recipe ingredients"
            />
            {editIngredientBtnClicked ? (
              <button onClick={editIngredientList}>Edit</button>
            ) : (
              <button onClick={addToIngerdientsList}>Add To list</button>
            )}
          </div>
          <div className="added_ingredients_wrapper">
            <p>Added ingredients ({recipeDetail.recipeIngredients.length})</p>
            <div className="added_ingredients">
              {recipeDetail.recipeIngredients.map((ingredient, index) => (
                <div className="ingredient_wrapper" key={index}>
                  <p>{ingredient}</p>
                  <div className="ingredients_wrapper_right">
                    <FaRegEdit
                      className="icon_ingredients"
                      onClick={() =>
                        editIngredientBtnClickedHandle(ingredient, index)
                      }
                    />
                    <AiOutlineDelete
                      className="icon_ingredients"
                      onClick={() => deleteIngerdientList(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="recipe_ingredients_wrapper">
          <div className="recipe_ingredients_left_wrapper">
            <InputTextBox
              textBoxHeader="Recipe Method Header"
              textOnChangeHandler={inputTextChangeHandle}
              propertyName="recipeMethodHeader"
              stateValue={recipeDetail.recipeMethodHeader}
              placeholderValue="Enter recipe method header"
              textareaMode
            />
            <InputTextBox
              textBoxHeader="Recipe Method Detail"
              textOnChangeHandler={inputTextChangeHandle}
              propertyName="recipeMethodLetter"
              stateValue={recipeDetail.recipeMethodLetter}
              placeholderValue="Enter a detail of method"
              textareaMode
            />
            {editMethodBtnClicked ? (
              <button onClick={editMethodHandle}>Edit Method</button>
            ) : (
              <button onClick={addToMethodList}>Add To list</button>
            )}
          </div>
          <div className="added_ingredients_wrapper">
            <p>Added Methods ({recipeDetail.recipeMethods.length})</p>
            <div className="added_ingredients">
              {recipeDetail.recipeMethods?.map((method, index) => (
                <div className="ingredient_wrapper" key={index}>
                  <div className="ingredient_method_wrapper">
                    <h3>{method.methodHeader}</h3>
                    <p>{method.methodLetter}</p>
                  </div>
                  <div className="ingredients_wrapper_right">
                    <FaRegEdit
                      className="icon_ingredients"
                      onClick={() =>
                        editMethodBtnClickedHandle(
                          method.methodHeader,
                          method.methodLetter,
                          index
                        )
                      }
                    />
                    <AiOutlineDelete
                      className="icon_ingredients"
                      onClick={() => deleteRecipeMethodHandle(index)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="input_recipe_iamge_wrapper">
          <button onClick={() => inputFileRef.current.click()}>
            <p>Click to add recipe Image</p>
            <RiImageAddFill className="add_image_icon" />
          </button>
          <input
            type="file"
            onChange={fileChangeHandle}
            ref={inputFileRef}
            style={{ display: "none" }}
          />
          <img
            src={
              recipeDetail.recipePhoto
                ? recipeDetail.recipePhoto
                : "https://thumbs.dreamstime.com/b/gallery-line-icon-isolated-white-background-outline-symbol-website-design-mobile-application-ui-pictogram-vector-190294765.jpg"
            }
          />
        </div>
        <button
          className="add_final_recipe_button"
          onClick={handleAddFinalRecipe}
        >
          Add New Recipe
        </button>
      </div>
    </div>
  );
}

export default AddNewRecipe;
