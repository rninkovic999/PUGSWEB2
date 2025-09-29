import React from "react";

const GuestHomeContent = () => {
  return (
    <div className="bg-gray-900 py-20">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Veliki žuti upitnici kao logo */}
        <h1 className="text-7xl md:text-9xl font-extrabold mb-4 leading-tight">
          <span className="text-yellow-400">???</span>
        </h1>
        
        {/* Novi red: QuizHub, isto žutom bojom */}
        <p className="text-4xl font-extrabold tracking-widest text-yellow-400 mb-2">
          QuizHub
        </p>
        
        {/* Minimalistička siva poruka (ako želite da ostane) */}
        <p className="text-xl text-gray-300 tracking-wide max-w-2xl mx-auto">
          Prijavi se ili napravi nalog!
        </p>
      </div>
    </div>
  );
};

export default GuestHomeContent;