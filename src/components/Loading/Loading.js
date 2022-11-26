import React from "react";
import "./loading.scss";

function Loading() {
  return (
    <div className="loading_wrapper">
      <div className="loading">
        Loading
        <div className="spinner"></div>
      </div>
    </div>
  );
}

export default Loading;
