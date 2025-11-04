import { useState } from "react";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

import Start from "./components/Start";
import Quiz from "./components/Quiz";
import Loader from "./components/Loader";
import Result from "./components/Result";

import "./styles.css";

function AIQuizModule() {
  const [questions, setQuestions] = useState(null);
  const [status, setStatus] = useState("start"); // start | loading | ready | finished
  const [userAnswers, setUserAnswers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const restartQuiz = () => {
    setQuestions(null);
    setStatus("start");
    setUserAnswers([]);
    setErrorMessage("");
  };

  const storeAnswer = (answer) => {
    setUserAnswers((prev) => [...prev, answer]);
  };

  const startQuiz = async ({ topic, difficulty, questionCount }) => {
    setStatus("loading");

    const API_KEY = "AIzaSyA2Gcq-7-_1A-QR8FiIAOG1oY8mHXKkggg"; // move to env in production
    const genAI = new GoogleGenerativeAI(API_KEY);

    const schema = {
      description: "List of quiz questions",
      type: SchemaType.OBJECT,
      properties: {
        response_code: { type: SchemaType.NUMBER, nullable: false },
        results: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              type: { type: SchemaType.STRING, nullable: false },
              difficulty: { type: SchemaType.STRING, nullable: false },
              category: { type: SchemaType.STRING, nullable: false },
              question: { type: SchemaType.STRING, nullable: false },
              correct_answer: { type: SchemaType.STRING, nullable: false },
              incorrect_answers: {
                type: SchemaType.ARRAY,
                items: { type: SchemaType.STRING },
                nullable: false,
              },
            },
            required: [
              "type",
              "difficulty",
              "category",
              "question",
              "correct_answer",
              "incorrect_answers",
            ],
          },
          nullable: false,
        },
      },
      required: ["response_code", "results"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    try {
      const prompt = `
        Create ${questionCount} quiz questions about ${topic}
        Difficulty: ${difficulty}
        Type: Multiple Choice
      `;
      const result = await model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
      });

      setQuestions(JSON.parse(result.response.text()));
      setStatus("ready");
    } catch (error) {
      console.error("Error generating quiz:", error);
      setErrorMessage(
        "There was an error generating the quiz. Please try again."
      );
      setStatus("start");
    }
  };

  return (
    <div>
      <header>
        <div className="container">
          <h1>AI Quiz Module</h1>
        </div>
      </header>

      <main className="container">
        {status === "start" && (
          <Start
            errorMessage={errorMessage}
            onStartQuiz={startQuiz}
          />
        )}
        {status === "loading" && <Loader />}
        {status === "ready" && questions && (
          <Quiz
            questions={questions.results}
            onStoreAnswer={storeAnswer}
            onEndQuiz={() => setStatus("finished")}
          />
        )}
        {status === "finished" && (
          <Result
            userAnswers={userAnswers}
            onRestartQuiz={restartQuiz}
          />
        )}
      </main>
    </div>
  );
}

export default AIQuizModule;
