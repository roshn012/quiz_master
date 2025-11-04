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
    <section className="start-screen container">
      <h2>Choose your quiz settings</h2>

      <input
        type="text"
        placeholder="Enter your topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-2 rounded"
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full p-2 rounded"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input
        type="number"
        min="1"
        max="20"
        value={questionCount}
        onChange={(e) => setQuestionCount(e.target.value)}
        className="w-full p-2 rounded"
      />

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
