import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInHandle } from "../../reuseFunctions";
import "./replyCommentInputBox.scss";

function ReplyCommentInputBox({
  btnFunction,
  placeholderValue,
  btnName,
  prevValueToEdit,
  setShowCommentBox,
  commentStarterInputBox,
}) {
  const [userInput, setUserInput] = useState("");
  const { username } = useSelector((state) => state.user);
  const textareaRef = useRef(null);
  const dispatch = useDispatch();
  function textareaHeightHandle(e) {
    textareaRef.current.style.height = "45px";
    let scrollHeight = e.target.scrollHeight;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }

  // Set userinput value when user click edit button
  useEffect(() => {
    setUserInput(prevValueToEdit ? prevValueToEdit : "");
  }, [prevValueToEdit]);

  function closeBtnHandle() {
    if (setShowCommentBox) {
      setShowCommentBox(false);
      return;
    }
  }

  return (
    <div className="replyCommentInputBox_wrapper">
      <textarea
        onChange={(e) => setUserInput(e.target.value)}
        value={userInput}
        onKeyUp={textareaHeightHandle}
        placeholder={placeholderValue ? placeholderValue : ""}
        required
        ref={textareaRef}
      />
      <div className="replyCommentInputBox_buttons_wrapper">
        {commentStarterInputBox ? null : (
          <button onClick={closeBtnHandle}>Close</button>
        )}

        <button
          className={userInput.length === 0 ? "disable_btn" : null}
          disabled={userInput.length === 0}
          onClick={(e) => {
            if (username) {
              btnFunction(userInput);
              commentStarterInputBox && setUserInput("");
              return;
            }
            signInHandle(e, dispatch);
          }}
        >
          {btnName}
        </button>
      </div>
    </div>
  );
}

export default ReplyCommentInputBox;
