import React, { useState, useEffect } from "react";

const CustomToast = ({ message, type = "info", isVisible, onClose }) => {
  const toastColors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-black",
    info: "bg-blue-500 text-white",
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 px-4 py-3 rounded-md shadow-lg transition-opacity duration-300 ${toastColors[type]}`}
    >
      <div className="flex items-center">
        <span className="mr-2">
          {/* Icon based on the type */}
          {type === "success" && "✔️"}
          {type === "error" && "❌"}
          {type === "warning" && "⚠️"}
          {type === "info" && "ℹ️"}
        </span>
        <p>{message}</p>
        <button
          className="ml-4 text-lg font-bold hover:opacity-75"
          onClick={onClose}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default CustomToast;
