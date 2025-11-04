import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../Components/Footer";

const featuredQuizzes = [
	{
		id: 5,
		title: "JavaScript Basics",
		questions: 10,
		color: "bg-yellow-100",
		icon: "🟨",
		desc: "Start your coding journey with JS fundamentals.",
	},
	{
		id: 1,
		title: "React Basics",
		questions: 12,
		color: "bg-blue-100",
		icon: "⚛️",
		desc: "Master the essentials of React for web apps.",
	},
	{
		id: 6,
		title: "HTML & CSS Essentials",
		questions: 12,
		color: "bg-pink-100",
		icon: "🎨",
		desc: "Build beautiful websites with HTML & CSS.",
	},
];

const Home = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 flex flex-col">
			{/* Hero Section */}
			<section className="relative bg-gradient-to-r from-indigo-700 to-indigo-600 text-white py-20 px-6 text-center shadow-md rounded-b-3xl mb-8">
				<div className="absolute top-4 right-8 hidden md:block animate-bounce">
					<span className="text-6xl">✨</span>
				</div>
				<h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
					Welcome to{" "}
					<span className="text-blue-100">QuizMaster</span>
				</h1>
				<p className="text-xl md:text-2xl mb-8 opacity-90 font-light">
					Test your knowledge, improve your skills, and compete with others!
				</p>
				<Link
					to="/quizzes"
					className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-50 transition duration-200"
				>
					Explore Quizzes
				</Link>
				<div className="absolute bottom-4 left-8 hidden md:block animate-pulse">
					<span className="text-6xl">🚀</span>
				</div>
			</section>

			{/* Featured Quizzes */}
			<section className="py-16 px-6 max-w-6xl mx-auto w-full">
				<h2 className="text-3xl font-extrabold text-indigo-700 mb-10 text-center tracking-tight">
					Featured Quizzes
				</h2>
				<div className="grid md:grid-cols-3 gap-10">
					{featuredQuizzes.map((quiz) => (
						<div
							key={quiz.id}
							className={`relative ${quiz.color} p-8 rounded-2xl shadow-xl border border-gray-100 hover:scale-105 hover:shadow-2xl transition duration-200`}
						>
							<div className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg">
								{quiz.icon}
							</div>
							<h3 className="text-2xl font-bold mb-2 text-indigo-700 mt-8 text-center">
								{quiz.title}
							</h3>
							<p className="text-gray-700 mb-2 text-center">
								{quiz.questions} Questions
							</p>
							<p className="text-gray-500 mb-4 text-center">
								{quiz.desc}
							</p>
							<div className="flex justify-center">
								<button
									className="bg-indigo-700 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-indigo-800 transition"
									onClick={() => {
										if (user) {
											navigate(`/quiz/${quiz.id}`);
										} else {
											navigate("/login");
										}
									}}
								>
									Start Quiz
								</button>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* How it Works Section */}
			<section className="bg-white py-16 px-6 border-t border-gray-200 rounded-3xl shadow-md mx-4 mb-12">
				<h2 className="text-3xl font-extrabold text-indigo-700 mb-10 text-center tracking-tight">
					How It Works
				</h2>
				<div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-center">
					<div className="bg-indigo-50 rounded-xl p-8 shadow">
						<div className="text-5xl mb-4 text-indigo-700">📝</div>
						<h3 className="font-bold mb-2 text-gray-800 text-lg">
							Choose a Quiz
						</h3>
						<p className="text-gray-600">
							Pick a quiz from our collection of topics.
						</p>
					</div>
					<div className="bg-blue-50 rounded-xl p-8 shadow">
						<div className="text-5xl mb-4 text-indigo-700">⏱️</div>
						<h3 className="font-bold mb-2 text-gray-800 text-lg">
							Take the Quiz
						</h3>
						<p className="text-gray-600">
							Answer questions within the timer and test your skills.
						</p>
					</div>
					<div className="bg-pink-50 rounded-xl p-8 shadow">
						<div className="text-5xl mb-4 text-indigo-700">🏆</div>
						<h3 className="font-bold mb-2 text-gray-800 text-lg">
							See Results
						</h3>
						<p className="text-gray-600">
							Get instant results and check your ranking on the leaderboard.
						</p>
					</div>
				</div>
			</section>

			{/* Call-to-Action */}
			<section className="py-16 px-6 text-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-3xl mx-4 mb-12 shadow-lg">
				<h2 className="text-3xl font-extrabold mb-6">
					Ready to Challenge Yourself?
				</h2>
				<Link
					to="/quizzes"
					className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-50 transition duration-200"
				>
					Start Now
				</Link>
			</section>
			<Footer />
		</div>
	);
};

export default Home;
