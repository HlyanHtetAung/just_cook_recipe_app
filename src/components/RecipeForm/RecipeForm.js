import React, { useEffect, useRef, useState } from 'react';
import InputTextBox from '../../components/inputTextBox/InputTextBox';
import { RiImageAddFill } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import './recipeForm.scss';

function RecipeForm({
  formHeader,
  formButtonName,
  formFunction,
  toEditRecipeDocId,
}) {
  const [recipeDetail, setRecipeDetail] = useState({
    recipeName: '',
    recipeType: '',
    recipePhoto: '',
    recipeIngredientText: '',
    recipeIngredients: [],
    recipeMethodHeader: '',
    recipeMethodLetter: '',
    recipeMethods: [],
  });

  const [toDelteImageName, setToDeleteImageName] = useState('');

  const [toEditIngredintIndex, setToEditIngredintIndex] = useState(null);
  const [editIngredientBtnClicked, setEditIngredientBtnClicked] =
    useState(false);
  const [editMethodBtnClicked, setEditMethodBtnClicked] = useState(false);
  const [toEditMethodIndex, setToEditMethodIndex] = useState(null);
  const [imageFile, setImageFileName] = useState('');
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
      recipeIngredientText: '',
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
      recipeIngredientText: '',
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
      recipeMethodHeader: '',
      recipeMethodLetter: '',
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
      recipeMethodHeader: '',
      recipeMethodLetter: '',
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
        : '',
    }));
  }

  useEffect(() => {
    async function fetchRecipeDetailToEdit() {
      if (toEditRecipeDocId) {
        const docRef = doc(db, 'recipes', toEditRecipeDocId);
        const result = (await getDoc(docRef)).data();
        const {
          recipeName,
          recipeType,
          recipePhotoLink,
          recipeIngredients,
          recipeMethods,
          recipeImageName,
        } = result;
        setRecipeDetail({
          recipeName: recipeName,
          recipeType: recipeType,
          recipePhoto: recipePhotoLink,
          recipeIngredientText: '',
          recipeIngredients: recipeIngredients,
          recipeMethodHeader: '',
          recipeMethodLetter: '',
          recipeMethods: recipeMethods,
        });
        setToDeleteImageName(recipeImageName);
      }
    }
    fetchRecipeDetailToEdit();
  }, []);

  return (
    <div className="addRecipe_wrapper">
      <h3 className="addRecipe_header">{formHeader}</h3>
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
          propertyName="recipeType"
          stateValue={recipeDetail.recipeType}
        />
        <div className="recipe_ingredients_wrapper">
          <div className="added_ingredients_wrapper">
            <p>Added ingredients ({recipeDetail?.recipeIngredients?.length})</p>
            <div className="added_ingredients">
              {recipeDetail?.recipeIngredients?.map((ingredient, index) => (
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
          <div className="recipe_ingredients_left_wrapper">
            <InputTextBox
              textBoxHeader="Recipe Ingredients"
              textOnChangeHandler={inputTextChangeHandle}
              propertyName="recipeIngredientText"
              stateValue={recipeDetail.recipeIngredientText}
              placeholderValue="Enter a recipe ingredients"
            />
            {editIngredientBtnClicked ? (
              <button onClick={editIngredientList}>Edit Ingredients</button>
            ) : (
              <button onClick={addToIngerdientsList}>
                Add Ingredients To list
              </button>
            )}
          </div>
        </div>
        <div className="recipe_ingredients_wrapper">
          <div className="added_ingredients_wrapper">
            <p>Added Methods ({recipeDetail?.recipeMethods?.length})</p>
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
              <button onClick={addToMethodList}>Add Method To list</button>
            )}
          </div>
        </div>
        <div className="input_recipe_iamge_wrapper">
          <img
            alt=""
            src={
              recipeDetail.recipePhoto
                ? recipeDetail.recipePhoto
                : 'https://thumbs.dreamstime.com/b/gallery-line-icon-isolated-white-background-outline-symbol-website-design-mobile-application-ui-pictogram-vector-190294765.jpg'
            }
          />
          <button onClick={() => inputFileRef.current.click()}>
            <p>Click to add recipe Image</p>
            <RiImageAddFill className="add_image_icon" />
          </button>
          <input
            type="file"
            onChange={fileChangeHandle}
            ref={inputFileRef}
            style={{ display: 'none' }}
          />
        </div>
        <button
          className="add_final_recipe_button"
          onClick={() =>
            formFunction(recipeDetail, imageFile, toDelteImageName)
          }
        >
          {formButtonName}
        </button>
      </div>
    </div>
  );
}

export default RecipeForm;
