import React from "react";

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-red-500 border-gray-200"></div>
    </div>
  );
};

export default Spinner;
