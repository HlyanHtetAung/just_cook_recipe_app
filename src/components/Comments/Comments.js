import React from "react";
import Comment from "../Comment/Comment";
import "./comments.scss";

function Comments({
  comment,
  orignialCommentId,
  recipeDetail,
  docId,
  commentOwnerId,
}) {
  return (
    <div className="comments_wrapper">
      <Comment
        comment={comment.originalComment}
        date={comment.commentedDate}
        userPhotoUrl={comment.originalUserPhoto}
        USERNAME={comment.originalCommentUsername}
        orignialCommentId={orignialCommentId}
        recipeDetail={recipeDetail}
        docId={docId}
        commentOwnerId={commentOwnerId}
      />
      <div className="replied_comment_wrapper">
        {comment.repliedComments.map((com) => (
          <Comment
            key={com.repliedCommentId}
            comment={com.comment}
            date={com.date}
            userPhotoUrl={com.userPhoto}
            USERNAME={com.username}
            orignialCommentId={orignialCommentId}
            recipeDetail={recipeDetail}
            repliedCommentId={com.repliedCommentId}
            docId={docId}
            commentOwnerId={com.userId}
          />
        ))}
      </div>
    </div>
  );
}

export default Comments;
