import React from "react";
import loading from "../assets/loading.svg";

const Loading = () => (
  <div className="spinner bg-white dark:bg-gray-900">
    <img src={loading} alt="Loading" />
  </div>
);

export default Loading;
