import React from "react";

const OptionInputs = ({ options, setOptions, fieldErrors }) => {
  return (
    <>
      {options.map((opt, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Option ${idx + 1}`}
          value={opt}
          onChange={(e) => {
            const newOptions = [...options];
            newOptions[idx] = e.target.value;
            setOptions(newOptions);
          }}
          className={`w-full px-2 py-1 mb-2 border rounded ${
            fieldErrors.Options ? "border-red-500" : "border-gray-300"
          }`}
        />
      ))}
      {fieldErrors.Options && (
        <p className="text-red-500 text-sm mb-2">{fieldErrors.Options}</p>
      )}
    </>
  );
};

export default OptionInputs;
