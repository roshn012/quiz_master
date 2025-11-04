import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import QuizCard from "../Components/Quizcard";
import { Clock, AlertCircle } from "lucide-react";

const quizData = [
  {
    id: 1,
    title: "React Basics",
    timeLimit: 5, // minutes
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
    ]
  },
  {
    id: 2,
    title: "JavaScript Advanced",
    timeLimit: 7,
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
    ]
  },
  {
    id: 3,
    title: "MongoDB Concepts",
    timeLimit: 6,
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
    ]
  },
  {
    id: 4,
    title: "Node.js Fundamentals",
    timeLimit: 5,
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
    ]
  },
  {
    id: 5,
    title: "JavaScript Basics",
    timeLimit: 4,
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
    ]
  },
  {
    id: 6,
    title: "HTML & CSS Essentials",
    timeLimit: 5,
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
    ]
  },
];

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  // Redirect admins to admin dashboard
  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      navigate("/admin", { replace: true });
      return;
    }
  }, [user, authLoading, navigate]);

  const quiz = quizData.find(q => q.id === Number(id));
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [startTime] = useState(Date.now());
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Initialize timer
  useEffect(() => {
    if (!quiz) return;
    
    const timeLimitMinutes = quiz.timeLimit || 10; // Default 10 minutes
    const timeLimitSeconds = timeLimitMinutes * 60;
    setTimeRemaining(timeLimitSeconds);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          setIsTimeUp(true);
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quiz not found</h2>
        <p>No quiz found for this topic.</p>
      </div>
    );
  }

  const total = quiz.quizQuestions.length;
  const questionObj = quiz.quizQuestions[current];

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSelect = (option) => {
    if (!isTimeUp) {
      setAnswers({ ...answers, [current]: option });
    }
  };

  const handleAutoSubmit = async () => {
    // Auto-submit when time is up
    await handleSubmit(true);
  };

  const handleSubmit = async (autoSubmit = false) => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000); // in seconds
    
    const correct = quiz.quizQuestions.reduce((acc, q, index) => {
      return acc + (answers[index] === q.correctAnswer ? 1 : 0);
    }, 0);
    
    const totalScore = Math.round((correct / total) * 100);
    const results = quiz.quizQuestions.map((q, index) => ({
      question: q.question,
      answer: answers[index] || "Not answered",
      isCorrect: answers[index] === q.correctAnswer,
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/results/submit', {
        quiz: quiz.id,
        score: totalScore,
        totalQuestions: total,
        correctAnswers: correct,
        timeTaken: timeTaken,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error submitting result:', error);
    }

    navigate("/result", {
      state: {
        quizTitle: quiz.title,
        totalScore,
        correct,
        incorrect: total - correct,
        total,
        answers: results,
        timeTaken,
        autoSubmitted: autoSubmit,
      },
    });
  };

  // Get time color based on remaining time
  const getTimeColor = () => {
    if (!timeRemaining) return "text-gray-600";
    const timeLimitMinutes = quiz.timeLimit || 10;
    const timeLimitSeconds = timeLimitMinutes * 60;
    const percentage = (timeRemaining / timeLimitSeconds) * 100;
    
    if (percentage <= 10) return "text-red-600";
    if (percentage <= 25) return "text-orange-600";
    return "text-indigo-600";
  };

  if (isTimeUp) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Time's Up!</h2>
        <p className="text-gray-600 mb-4">Your quiz has been automatically submitted.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header with Timer */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{quiz.title}</h2>
          <div className={`flex items-center gap-2 font-bold text-lg ${getTimeColor()}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeRemaining || 0)}</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              timeRemaining && (timeRemaining / ((quiz.timeLimit || 10) * 60)) * 100 <= 10
                ? "bg-red-500"
                : timeRemaining && (timeRemaining / ((quiz.timeLimit || 10) * 60)) * 100 <= 25
                ? "bg-orange-500"
                : "bg-indigo-500"
            }`}
            style={{
              width: `${timeRemaining ? (timeRemaining / ((quiz.timeLimit || 10) * 60)) * 100 : 0}%`,
            }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Question {current + 1} of {total}
        </p>
      </div>

      <QuizCard
        question={questionObj.question}
        options={questionObj.options}
        selectedOption={answers[current]}
        onSelect={handleSelect}
      />
      
      <div className="flex justify-between items-center mt-6">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setCurrent(current - 1)}
          disabled={current === 0 || isTimeUp}
        >
          Previous
        </button>
        {current === total - 1 ? (
          <button
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:opacity-50"
            onClick={() => handleSubmit(false)}
            disabled={isTimeUp}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCurrent(current + 1)}
            disabled={current === total - 1 || isTimeUp}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;
