import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Comments from '../../components/Comments/Comments';
import ReplyCommentInputBox from '../../components/ReplyCommentInputBox/ReplyCommentInputBox';
import ScrollToTopOnMount from '../../ScrollToTopOnMount';
import Loading from '../../components/Loading/Loading';
import { startLoading, finishLoading } from '../../redux/loadingSlice';
import { doc, updateDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../../Firebase';
import './recipeDetail.scss';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { savedRecipeHandle, signInHandle } from '../../reuseFunctions';

function RecipeDetail() {
  const params = useParams();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.loading);
  const {
    username,
    userPhoto,
    userId,
    userDocumentId,
    savedRecipes,
    userRole,
  } = useSelector((state) => state.user);

  const [recipeDetail, setRecipeDetail] = useState({});
  const [onSaveList, setOnSaveList] = useState(false);

  useEffect(() => {
    const onListAry = savedRecipes.filter(
      (savRecipe) => savRecipe.recipeDocId === params.recipeId
    );
    if (onListAry.length > 0) {
      setOnSaveList(true);
    } else {
      setOnSaveList(false);
    }
  }, [username, savedRecipes, userDocumentId]);

  useEffect(() => {
    async function fetchRecipeDetail() {
      dispatch(startLoading());
      const docRef = doc(db, 'recipes', params.recipeId);
      onSnapshot(docRef, (snapshot) => {
        setRecipeDetail({ ...snapshot.data(), recipeDocId: snapshot.id });
        dispatch(finishLoading());
      });
    }
    fetchRecipeDetail();
  }, []);

  async function handleGiveOriginalComment(userinput) {
    const date = Timestamp.now().toDate().getDate();
    const month = Timestamp.now().toDate().getMonth() + 1;
    const year = Timestamp.now().toDate().getFullYear();

    const docRef = doc(db, 'recipes', params.recipeId);
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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                <button
                  style={
                    userDocumentId && onSaveList
                      ? { opacity: '0.5' }
                      : { opacity: '1' }
                  }
                  disabled={userDocumentId && onSaveList}
                  onClick={(e) =>
                    username
                      ? savedRecipeHandle(
                          recipeDetail,
                          dispatch,
                          userDocumentId
                        )
                      : signInHandle(e, dispatch)
                  }
                >
                  {userDocumentId && onSaveList
                    ? 'Already Saved'
                    : 'Save Recipe'}
                </button>
                {userRole === 'Admin' && (
                  <Link to={`/editRecipe/${params.recipeId}`}>
                    <button>Edit Recipe</button>
                  </Link>
                )}
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
      )}
    </>
  );
}

export default RecipeDetail;
