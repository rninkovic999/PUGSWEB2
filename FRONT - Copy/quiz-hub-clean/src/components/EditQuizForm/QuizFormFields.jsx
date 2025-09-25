import React from "react";

const QuizFormFields = ({ formData, handleChange, fieldErrors }) => (
  <>
    {["title", "description", "category"].map((field) => (
      <div key={field}>
        <label className="block font-semibold capitalize">{field}</label>
        <input
          type="text"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded"
          required
        />
        {fieldErrors[field] && (
          <p className="text-red-500 text-sm">{fieldErrors[field]}</p>
        )}
      </div>
    ))}

    <div>
      <label className="block font-semibold">Time Limit (seconds)</label>
      <input
        type="number"
        name="timeLimitSeconds"
        value={formData.timeLimitSeconds}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
        required
      />
    </div>

    <div>
      <label className="block font-semibold">Difficulty (1-3)</label>
      <input
        type="number"
        name="difficulty"
        min={1}
        max={3}
        value={formData.difficulty}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded"
        required
      />
    </div>
  </>
);

export default QuizFormFields;
