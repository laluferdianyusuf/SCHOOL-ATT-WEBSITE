import React from "react";

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="loader">
        <div className="spinner border-8 border-t-8 border-gray-300 border-t-custom-green-1 rounded-full w-16 h-16 animate-spin"></div>
        <p className="text-sm text-gray-600 mt-2">Loading...</p>
      </div>
    </div>
  );
};
