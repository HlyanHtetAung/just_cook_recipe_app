import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "../../components/Comments/Comments";
import ReplyCommentInputBox from "../../components/ReplyCommentInputBox/ReplyCommentInputBox";
import ScrollToTopOnMount from "../../ScrollToTopOnMount";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../Firebase";
import "./recipeDetail.scss";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

function RecipeDetail() {
  const params = useParams();
  const { username, userPhoto, userId, userDocumentId } = useSelector(
    (state) => state.user
  );
  const [recipeDetail, setRecipeDetail] = useState({});

  useEffect(() => {
    async function fetchRecipeDetail() {
      const docRef = doc(db, "recipes", params.recipeId);
      onSnapshot(docRef, (snapshot) =>
        setRecipeDetail({ ...snapshot.data(), recipeDocId: snapshot.id })
      );
    }
    fetchRecipeDetail();
  }, []);

  async function handleGiveOriginalComment(userinput) {
    const date = Timestamp.now().toDate().getDate();
    const month = Timestamp.now().toDate().getMonth() + 1;
    const year = Timestamp.now().toDate().getFullYear();

    const docRef = doc(db, "recipes", params.recipeId);
    const previousComments = recipeDetail.comments;
    const updatedComments = [
      ...previousComments,
      {
        orignialCommentId: v4(),
        originalComment: userinput,
        originalUserPhoto: userPhoto,
        userId: userId,
        originalCommentUsername: username,
        commentedDate: `${date}/${month}/${year}`,
        repliedComments: [],
      },
    ];
    await updateDoc(docRef, { comments: updatedComments });
  }

  async function savedRecipeHandle() {
    const userDocRef = doc(db, "users", userDocumentId);
    const currentUserResult = (await getDoc(userDocRef)).data();

    const toAddSavedRecipeAry = [
      ...currentUserResult.savedRecipes,
      { ...recipeDetail },
    ];
    await updateDoc(userDocRef, { savedRecipes: toAddSavedRecipeAry });
  }

  return (
    <div className="recipe_detail_wrapper">
      <ScrollToTopOnMount />
      <div className="recipe_info_wrapper">
        <div className="recipe_header_wrapper">
          <div className="recipe_photo_wrapper">
            <img src={recipeDetail?.recipePhotoLink} />
          </div>
          <div className="recipe_headerInfo_wrapper">
            <h2>{recipeDetail?.recipeName}</h2>
            <p>By {recipeDetail?.createdBy}</p>
            <button onClick={savedRecipeHandle}>Save Recipe</button>
          </div>
        </div>
        <div className="recipe_ingredients_wrapper">
          <h3>Ingredients</h3>
          <ul>
            {recipeDetail?.recipeIngredients?.map((ingredient, index) => (
              <li key={index}>
                <p>{ingredient}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="divider"></div>
        <div className="recipe_method_wrapper">
          <h3>Method</h3>
          <ol>
            {recipeDetail?.recipeMethods?.map((method, index) => (
              <li key={index}>
                <h4>{method.methodHeader}</h4>
                <p>{method.methodLetter}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="divider"></div>
        <div className="comments_wrapper">
          <h3>Comments</h3>
          <ReplyCommentInputBox
            placeholderValue="Enter your opinion about that recipe"
            btnName="Upload"
            btnFunction={handleGiveOriginalComment}
            commentStarterInputBox
          />
          {recipeDetail?.comments?.map((comment, index) => (
            <Comments
              comment={comment}
              key={index}
              orignialCommentId={comment.orignialCommentId}
              recipeDetail={recipeDetail}
              docId={params.recipeId}
              commentOwnerId={comment.userId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
