import React from "react";

const UserHero = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Veliki žuti upitnici kao logo (!!!) */}
        <h1 className="text-7xl md:text-9xl font-extrabold mb-4 leading-none">
          <span className="text-yellow-400">???</span>
        </h1>
        
        {/* Žuti tekst "QuizHub" ispod loga */}
        <p className="text-4xl md:text-5xl font-extrabold tracking-widest text-yellow-400">
          QuizHub
        </p>
      </div>
    </div>
  );
};

export default UserHero;