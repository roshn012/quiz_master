import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Quizzes = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]);

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      navigate("/admin", { replace: true });
    }
  }, [user, authLoading, navigate]);

  // ✅ Add dummy quiz data for display
  useEffect(() => {
    const dummyData = [
      {
        id: 5,
        title: "JavaScript Basics",
        questions: 10,
        difficulty: "Easy",
        quizQuestions: [
          {
            question: "Which of the following is a JavaScript data type?",
            options: ["Number", "String", "Boolean", "All of the above"],
            correctAnswer: "All of the above"
          },
          {
            question: "Which symbol is used for single-line comments?",
            options: ["//", "/*", "<!--", "#"],
            correctAnswer: "//"
          },
          {
            question: "How do you declare a variable in JavaScript?",
            options: ["var", "let", "const", "All of the above"],
            correctAnswer: "All of the above"
          },
          // ...add more questions
        ]
      },
      {
        id: 1,
        title: "React Basics",
        questions: 12,
        difficulty: "Easy",
        quizQuestions: [
          {
            question: "What is a React component?",
            options: ["A function", "A variable", "A class", "All of the above"],
            correctAnswer: "All of the above"
          },
          {
            question: "What hook is used for state management?",
            options: ["useEffect", "useState", "useContext", "useReducer"],
            correctAnswer: "useState"
          },
          {
            question: "What is JSX?",
            options: ["A CSS preprocessor", "A JavaScript extension", "A database", "A server"],
            correctAnswer: "A JavaScript extension"
          },
          // ...add more questions
        ]
      },
      {
        id: 2,
        title: "JavaScript Advanced",
        questions: 18,
        difficulty: "Medium",
        quizQuestions: [
          {
            question: "Which method creates a new array from a filtered subset?",
            options: ["map", "filter", "reduce", "forEach"],
            correctAnswer: "filter"
          },
          {
            question: "What is a closure?",
            options: ["A function inside a function", "A variable", "A loop", "A class"],
            correctAnswer: "A function inside a function"
          },
          {
            question: "Which keyword declares a block-scoped variable?",
            options: ["var", "let", "const", "static"],
            correctAnswer: "let"
          },
          // ...add more questions
        ]
      },
      {
        id: 3,
        title: "MongoDB Concepts",
        questions: 15,
        difficulty: "Hard",
        quizQuestions: [
          {
            question: "What is MongoDB?",
            options: ["Relational DB", "NoSQL DB", "Frontend framework", "Server"],
            correctAnswer: "NoSQL DB"
          },
          {
            question: "Which command inserts a document?",
            options: ["insertOne", "addDoc", "putDoc", "create"],
            correctAnswer: "insertOne"
          },
          {
            question: "What is a collection?",
            options: ["A table", "A group of documents", "A schema", "A query"],
            correctAnswer: "A group of documents"
          },
          // ...add more questions
        ]
      },
      {
        id: 4,
        title: "Node.js Fundamentals",
        questions: 10,
        difficulty: "Easy",
        quizQuestions: [
          {
            question: "Node.js is based on which language?",
            options: ["Python", "Java", "JavaScript", "C++"],
            correctAnswer: "JavaScript"
          },
          {
            question: "Which module is used for file operations?",
            options: ["http", "fs", "path", "os"],
            correctAnswer: "fs"
          },
          {
            question: "What is npm?",
            options: ["Node Package Manager", "Node Project Module", "New Programming Method", "None"],
            correctAnswer: "Node Package Manager"
          },
          // ...add more questions
        ]
      },
      {
        id: 6,
        title: "HTML & CSS Essentials",
        questions: 12,
        difficulty: "Easy",
        quizQuestions: [
          {
            question: "What does HTML stand for?",
            options: ["Hyper Trainer Marking Language", "Hyper Text Markup Language", "Hyper Text Marketing Language", "Hyper Tool Markup Language"],
            correctAnswer: "Hyper Text Markup Language"
          },
          {
            question: "Which tag is used for the largest heading?",
            options: ["<h1>", "<h6>", "<head>", "<header>"],
            correctAnswer: "<h1>"
          },
          {
            question: "Which property is used to change text color in CSS?",
            options: ["font-color", "text-color", "color", "background-color"],
            correctAnswer: "color"
          },
          // ...add more questions
        ]
      }
    ];
    setQuizzes(dummyData);
  }, []);

  // If navigated with a hash, filter to only that quiz
  const quizIdFromHash = location.hash ? location.hash.replace('#', '') : null;
  const filteredQuizzes = quizIdFromHash
    ? quizzes.filter(q => String(q.id) === quizIdFromHash)
    : quizzes;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold text-center text-indigo-700 mb-8">
        Available Quizzes
      </h1>
      {Array.isArray(filteredQuizzes) && filteredQuizzes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                {quiz.title}
              </h2>
              <p className="text-gray-600 mb-1">
                Questions: {quiz.questions}
              </p>
              <p className="text-gray-600 mb-4">
                Difficulty: {quiz.difficulty}
              </p>
              <button
                className="bg-indigo-700 text-white py-2 px-4 rounded hover:bg-indigo-800 transition"
                onClick={() => navigate(`/quiz/${quiz.id}`)}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No quizzes available.</p>
      )}
    </div>
  );
};

export default Quizzes;
