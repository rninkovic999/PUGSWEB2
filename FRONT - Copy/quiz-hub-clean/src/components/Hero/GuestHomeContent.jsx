import React from "react";

const GuestHomeContent = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Dobrodošli u <span className="text-yellow-400">QuizHub</span>!
        </h1>
        <p className="text-xl text-gray-300 tracking-wide max-w-2xl mx-auto">
          Napravite nalog ili se prijavite da počnete sa kvizovima!!
        </p>
      </div>
    </div>
  );
};

export default GuestHomeContent;