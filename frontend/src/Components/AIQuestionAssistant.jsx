import { useState, useEffect } from "react";
import { Sparkles, X } from "lucide-react";

// Question database - using local JSON data
const questionDatabase = {
  javascript: [
    {
      question: "What is hoisting in JavaScript?",
      options: [
        "A way to lift variables",
        "The behavior of moving declarations to the top",
        "A DOM manipulation technique",
        "A type of function"
      ],
      correctAnswer: "The behavior of moving declarations to the top"
    },
    {
      question: "What is closure in JavaScript?",
      options: [
        "A variable scope",
        "A function that has access to outer function's variables",
        "A JavaScript library",
        "A data type"
      ],
      correctAnswer: "A function that has access to outer function's variables"
    },
    {
      question: "What is the difference between let and var?",
      options: [
        "let is block-scoped, var is function-scoped",
        "They are identical",
        "var is newer",
        "let is only for functions"
      ],
      correctAnswer: "let is block-scoped, var is function-scoped"
    },
    {
      question: "What is a promise in JavaScript?",
      options: [
        "A guarantee",
        "An object representing eventual completion of an async operation",
        "A variable type",
        "A function"
      ],
      correctAnswer: "An object representing eventual completion of an async operation"
    }
  ],
  react: [
    {
      question: "What is a React component?",
      options: [
        "A JavaScript function or class",
        "A CSS file",
        "A database table",
        "A server endpoint"
      ],
      correctAnswer: "A JavaScript function or class"
    },
    {
      question: "What is JSX?",
      options: [
        "A JavaScript extension",
        "A CSS framework",
        "A database",
        "A server technology"
      ],
      correctAnswer: "A JavaScript extension"
    },
    {
      question: "What does useState return?",
      options: [
        "A single value",
        "An array with state value and setter function",
        "An object",
        "A promise"
      ],
      correctAnswer: "An array with state value and setter function"
    },
    {
      question: "What is the purpose of useEffect?",
      options: [
        "To style components",
        "To perform side effects in functional components",
        "To create routes",
        "To manage state"
      ],
      correctAnswer: "To perform side effects in functional components"
    }
  ],
  html: [
    {
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Hyper Transfer Markup Language",
        "Home Tool Markup Language"
      ],
      correctAnswer: "HyperText Markup Language"
    },
    {
      question: "Which tag is used for the largest heading?",
      options: ["<h1>", "<h6>", "<head>", "<header>"],
      correctAnswer: "<h1>"
    }
  ],
  css: [
    {
      question: "What does CSS stand for?",
      options: [
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Creative Style System",
        "Colorful Style Sheets"
      ],
      correctAnswer: "Cascading Style Sheets"
    },
    {
      question: "Which property is used to change text color?",
      options: ["font-color", "text-color", "color", "background-color"],
      correctAnswer: "color"
    }
  ],
  mongodb: [
    {
      question: "What is MongoDB?",
      options: [
        "A relational database",
        "A NoSQL document database",
        "A frontend framework",
        "A server language"
      ],
      correctAnswer: "A NoSQL document database"
    },
    {
      question: "What is a collection in MongoDB?",
      options: [
        "A table",
        "A group of documents",
        "A schema",
        "A query"
      ],
      correctAnswer: "A group of documents"
    }
  ],
  nodejs: [
    {
      question: "What is Node.js?",
      options: [
        "A JavaScript runtime",
        "A database",
        "A CSS framework",
        "A markup language"
      ],
      correctAnswer: "A JavaScript runtime"
    },
    {
      question: "Which module is used for file operations in Node.js?",
      options: ["http", "fs", "path", "os"],
      correctAnswer: "fs"
    }
  ]
};

const AIQuestionAssistant = ({ onSelectQuestion }) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (keyword.trim().length > 2) {
      searchSuggestions(keyword.toLowerCase());
    } else {
      setSuggestions([]);
    }
  }, [keyword]);

  const searchSuggestions = (searchTerm) => {
    const results = [];
    
    // Search in database by keyword matching
    Object.keys(questionDatabase).forEach((topic) => {
      if (topic.includes(searchTerm) || searchTerm.includes(topic)) {
        questionDatabase[topic].forEach((q) => {
          if (
            q.question.toLowerCase().includes(searchTerm) ||
            q.options.some((opt) => opt.toLowerCase().includes(searchTerm))
          ) {
            results.push({ ...q, topic });
          }
        });
      }
    });

    // Also search in question text directly
    Object.keys(questionDatabase).forEach((topic) => {
      questionDatabase[topic].forEach((q) => {
        if (q.question.toLowerCase().includes(searchTerm)) {
          if (!results.find((r) => r.question === q.question)) {
            results.push({ ...q, topic });
          }
        }
      });
    });

    setSuggestions(results.slice(0, 5)); // Limit to 5 suggestions
  };

  const handleSelect = (question) => {
    onSelectQuestion(question);
    setKeyword("");
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition"
      >
        <Sparkles className="w-5 h-5" />
        AI Question Assistant
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Search Questions</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <input
            type="text"
            placeholder="Type keywords (e.g., JavaScript, React, hoisting...)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          />

          {suggestions.length > 0 ? (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-indigo-50 cursor-pointer transition"
                  onClick={() => handleSelect(suggestion)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {suggestion.topic}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800 mb-2">
                    {suggestion.question}
                  </p>
                  <p className="text-xs text-gray-500">
                    {suggestion.options.length} options
                  </p>
                </div>
              ))}
            </div>
          ) : keyword.trim().length > 2 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No suggestions found for "{keyword}"
            </p>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Type at least 3 characters to search...
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              💡 Try: "JavaScript", "React", "hoisting", "closure", "useState"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIQuestionAssistant;

