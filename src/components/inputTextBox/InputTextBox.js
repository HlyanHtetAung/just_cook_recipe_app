import React from "react";
import "./inputTextBox.scss";

function InputTextBox({
  textBoxHeader,
  textOnChangeHandler,
  propertyName,
  stateValue,
  placeholderValue,
  textareaMode,
}) {
  return (
    <div className="inputTextBox_wrapper">
      <p>{textBoxHeader}</p>
      {textareaMode ? (
        <textarea
          onChange={(e) => textOnChangeHandler(e, propertyName)}
          value={stateValue}
          placeholder={placeholderValue ? placeholderValue : ""}
        />
      ) : (
        <input
          type="text"
          onChange={(e) => textOnChangeHandler(e, propertyName)}
          value={stateValue}
          placeholder={placeholderValue ? placeholderValue : ""}
        />
      )}
    </div>
  );
}

export default InputTextBox;
