import { useState } from "react";

function StartScreen({ errorMessage, onStartQuiz }) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [questionCount, setQuestionCount] = useState(5);

  const handleSubmit = () => {
    onStartQuiz({
      topic,
      difficulty,
      questionCount: Number(questionCount)
    });
  };

  return (
    <section className="start-screen">
      <h2>Choose your quiz settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Topic
        </label>
        <input
          type="text"
          placeholder="e.g., JavaScript, React, History..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Difficulty Level
        </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
          Number of Questions
        </label>
        <input
          type="number"
          min="1"
          max="20"
          value={questionCount}
          onChange={(e) => setQuestionCount(e.target.value)}
        />
      </div>

      <button
        className="start-btn"
        onClick={handleSubmit}
        disabled={!topic}
      >
        Start Quiz
      </button>

      {errorMessage && (
        <small className="error">
          {errorMessage}
        </small>
      )}
    </section>
  );
}

export default StartScreen;

