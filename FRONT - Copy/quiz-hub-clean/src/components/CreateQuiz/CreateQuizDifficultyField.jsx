import React from "react";

const CreateQuizDifficultyField = ({ value, error, onChange }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">
      Difficulty (1–3)
    </label>
    <input
      type="number"
      min={1}
      max={3}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border rounded-md"
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default CreateQuizDifficultyField;
