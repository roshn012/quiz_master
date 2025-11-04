function ResultScreen({ userAnswers, onRestartQuiz }) {
  const correctAnswersCount = userAnswers.filter(
    (answer) => answer.userAnswer === answer.question.correct_answer
  ).length;

  return (
    <section className="result-screen container max-w-3xl mx-auto my-12 p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        {correctAnswersCount === userAnswers.length ? (
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-500 mb-2">
            🎉 Congratulations!
          </h1>
        ) : (
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">
            Quiz Completed
          </h1>
        )}
        <p className="text-lg md:text-xl text-gray-700">
          You answered{" "}
          <span className="font-semibold text-indigo-600">{correctAnswersCount}</span> out of{" "}
          <span className="font-semibold text-indigo-600">{userAnswers.length}</span> questions correctly
        </p>
      </div>

      {/* Answers List */}
      <ul className="space-y-4">
        {userAnswers.map((answer, index) => {
          const isCorrect = answer.userAnswer === answer.question.correct_answer;
          return (
            <li
              key={index}
              className={`border-2 rounded-lg p-4 ${
                isCorrect ? "border-green-400 bg-green-50" : "border-red-400 bg-red-50"
              }`}
            >
              <div className="flex items-center mb-2">
                <span className="text-xl mr-2">{isCorrect ? "✅" : "❌"}</span>
                <b className="text-gray-800">{answer.question.question}</b>
              </div>
              <p className="text-gray-700">
                <span className="font-semibold">Your answer:</span> {answer.userAnswer}
              </p>
              {!isCorrect && (
                <p className="text-gray-700">
                  <span className="font-semibold">Correct answer:</span> {answer.question.correct_answer}
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Restart Button */}
      <div className="text-center mt-8">
        <button
          onClick={onRestartQuiz}
          className="bg-indigo-600 text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-indigo-700 transition duration-200"
        >
          Create a New Quiz
        </button>
      </div>
    </section>
  );
}

export default ResultScreen;
