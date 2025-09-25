import React from "react";

const UserHero = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          <span className="text-yellow-400">Dobrodošli</span> nazad!
        </h1>
        <p className="text-xl text-gray-300 tracking-wide max-w-2xl mx-auto">
          Nastavite tamo gde si stali ili istražite nove kvizove!!
        </p>
      </div>
    </div>
  );
};

export default UserHero;