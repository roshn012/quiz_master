import React, { useState } from "react";

const QuizCard = ({ question, options, selectedOption, onSelect }) => {
  const handleSelect = (option) => {
    onSelect(option);
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{question}</h2>
      <div className="flex flex-col space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            className={`py-2 px-4 rounded-lg border text-left transition-all duration-200 ${
              selectedOption === option
                ? "bg-indigo-100 border-indigo-400 text-indigo-700"
                : "bg-gray-50 hover:bg-gray-100 border-gray-300 text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
