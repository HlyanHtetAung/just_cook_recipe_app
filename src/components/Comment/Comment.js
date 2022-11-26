import React, { useState } from "react";
import "./comment.scss";
import { BiCommentMinus } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { AiOutlineDelete } from "react-icons/ai";
import ReplyCommentInputBox from "../ReplyCommentInputBox/ReplyCommentInputBox";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { v4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { signInHandle } from "../../reuseFunctions";

function Comment({
  userPhotoUrl,
  USERNAME,
  date,
  comment,
  orignialCommentId,
  recipeDetail,
  docId,
  repliedCommentId,
  commentOwnerId,
}) {
  const { username, userId, userPhoto } = useSelector((state) => state.user);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const dispatch = useDispatch();
  const [commentBtn, setCommentBtn] = useState({
    buttonName: "",
    buttonFunction: "",
    textareaValue: "",
    placeholder: "",
  });

  function editCommentHandle() {
    setShowCommentBox(true);
    setCommentBtn((prev) => ({
      ...prev,
      buttonName: "Edit",
      buttonFunction: async (userInput) => {
        const allComments = recipeDetail.comments;
        const docRef = doc(db, "recipes", docId);
        const toUpdateIndex = allComments.findIndex(
          (comment) => comment.orignialCommentId === orignialCommentId
        );

        // For Reply Comments
        if (repliedCommentId) {
          const toUpdateRepliedIndex = allComments[
            toUpdateIndex
          ].repliedComments.findIndex(
            (repComment) => repComment.repliedCommentId === repliedCommentId
          );

          const toUpdateId =
            allComments[toUpdateIndex].repliedComments[toUpdateRepliedIndex]
              .repliedCommentId;

          const finalRepliedResult = allComments[
            toUpdateIndex
          ].repliedComments.map((res) =>
            res.repliedCommentId === toUpdateId
              ? {
                  ...res,
                  comment: userInput,
                }
              : res
          );

          allComments[toUpdateIndex].repliedComments = finalRepliedResult;
          await updateDoc(docRef, { comments: allComments });
          setShowCommentBox(false);
          return;
        }
        // For Original Comment
        allComments[toUpdateIndex].originalComment = userInput;
        await updateDoc(docRef, { comments: allComments });
        setShowCommentBox(false);
      },
      prevValueToEdit: comment,
    }));
  }

  function replyCommentHandle() {
    const date = Timestamp.now().toDate().getDate();
    const month = Timestamp.now().toDate().getMonth() + 1;
    const year = Timestamp.now().toDate().getFullYear();
    setShowCommentBox(true);
    setCommentBtn((prev) => ({
      ...prev,
      buttonName: "Reply",
      buttonFunction: async (userInput) => {
        const docRef = doc(db, "recipes", docId);
        const allComments = recipeDetail.comments;
        const toAddIndex = allComments.findIndex(
          (comment) => comment.orignialCommentId === orignialCommentId
        );
        allComments[toAddIndex].repliedComments.push({
          date: `${date}/${month}/${year}`,
          repliedCommentId: v4(),
          comment: userInput,
          userId: userId,
          userPhoto: userPhoto,
          username: username,
        });
        await updateDoc(docRef, { comments: allComments });
        setShowCommentBox(false);
      },
      prevValueToEdit: "",
      commentPlaceholder: "Enter a reply comment",
    }));
  }

  async function deleteCommentHandle() {
    const allComments = recipeDetail.comments;
    const docRef = doc(db, "recipes", docId);
    const toUpdateIndex = allComments.findIndex(
      (comment) => comment.orignialCommentId === orignialCommentId
    );

    // For Reply Comments
    if (repliedCommentId) {
      const toUpdateRepliedIndex = allComments[
        toUpdateIndex
      ].repliedComments.findIndex(
        (repComment) => repComment.repliedCommentId === repliedCommentId
      );
      allComments[toUpdateIndex].repliedComments.splice(
        toUpdateRepliedIndex,
        1
      );
      await updateDoc(docRef, { comments: allComments });
      setShowCommentBox(false);
      return;
    }
    // For Original Comment
    allComments.splice(toUpdateIndex, 1);
    await updateDoc(docRef, { comments: allComments });
    setShowCommentBox(false);
  }

  return (
    <div className="comment_wrapper">
      <div className="comment_inside_wrapper">
        <img src={userPhotoUrl} alt="Something Went Wrong" />
        <div className="comment_right_wrapper">
          <div>
            <div className="comment_header_wrapper">
              <h4 className="comment_username">{USERNAME}</h4>
              <p className="comment_date">{date}</p>
            </div>
            <p className="comment_letter">{comment}</p>
          </div>
          <div className="comment_button_wrapper">
            {commentOwnerId === userId ? (
              <button onClick={editCommentHandle} name="edit">
                <FaRegEdit />
                <p>Edit</p>
              </button>
            ) : null}
            <button
              onClick={(e) =>
                username ? replyCommentHandle() : signInHandle(e, dispatch)
              }
              name="reply"
            >
              <BiCommentMinus />
              <p>Reply</p>
            </button>
            {commentOwnerId === userId ? (
              <button onClick={deleteCommentHandle} name="delete">
                <AiOutlineDelete />
                <p>Delete</p>
              </button>
            ) : null}
          </div>
          {showCommentBox ? (
            <ReplyCommentInputBox
              btnFunction={commentBtn.buttonFunction}
              prevValueToEdit={commentBtn.prevValueToEdit}
              btnName={commentBtn.buttonName}
              placeholderValue={commentBtn.commentPlaceholder}
              setShowCommentBox={setShowCommentBox}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Comment;
