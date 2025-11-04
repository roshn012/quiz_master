import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Search, User } from "lucide-react";

const quizSuggestions = [
  { id: 5, title: "JavaScript Basics" },
  { id: 1, title: "React Basics" },
  { id: 6, title: "HTML & CSS Essentials" },
  { id: 4, title: "Node.js Fundamentals" },
  { id: 3, title: "MongoDB Concepts" },
  { id: 2, title: "JavaScript Advanced" }
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredSuggestions = quizSuggestions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 md:px-6 py-3">
      <div className="flex items-center justify-between">
      {/* Left: Logo + Nav Links */}
      <div className="flex items-center gap-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-2 bg-blue-100 rounded-lg">
            <span className="text-blue-600 text-lg font-bold">?</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            <span className="text-blue-600">Quiz</span>Master
          </h1>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <li>
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          {/* Hide quiz-related links for admins */}
          {(!user || user.role !== "admin") && (
            <>
              <li>
                <Link to="/quizzes" className="hover:text-blue-600">
                  Quizzes
                </Link>
              </li>
              <li>
                <Link to="/ai-quiz" className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-1.5 rounded-full hover:from-purple-700 hover:to-indigo-700 transition font-medium">
                  Practice with AI
                </Link>
              </li>
            </>
          )}
          <li>
            <Link to="/leaderboard" className="hover:text-blue-600">
              Leaderboard
            </Link>
          </li>
          {user && user.role !== "admin" && (
            <li>
              <Link to="/profile" className="hover:text-blue-600">
                Profile
              </Link>
            </li>
          )}
          {user && user.role === "admin" && (
            <li>
              <Link to="/admin" className="hover:text-blue-600 font-medium text-indigo-600">
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>
      </div>

      {/* Right: Search + Auth */}
      <div className="hidden md:flex items-center gap-4">
        {/* Search Bar (always visible) */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full relative">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search quizzes..."
            className="bg-transparent outline-none text-sm text-gray-700 w-40"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && search && (
            <div className="absolute top-10 left-0 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={() => {
                      setSearch("");
                      setShowSuggestions(false);
                      navigate(`/quizzes#${suggestion.id}`);
                    }}
                  >
                    {suggestion.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">No matches found</div>
              )}
            </div>
          )}
        </div>

        {/* Auth / Profile */}
        {!user ? (
          <div className="flex gap-3">
            <Link
              to="/login"
              className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              Signup
            </Link>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm text-white border border-gray-200">
                {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-gray-800 rounded-lg shadow-lg z-10">
                <div className="px-4 py-2 border-b text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-500">{user.email}</p>
                </div>
                {user.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm hover:bg-gray-100 font-medium text-indigo-600"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      </div>

      {/* Mobile controls */}
      <div className="flex md:hidden items-center justify-between mt-3">
        {/* Search (compact) */}
        <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full relative flex-1 mr-3">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm text-gray-700 w-full"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          {showSuggestions && search && (
            <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    onMouseDown={() => {
                      setSearch("");
                      setShowSuggestions(false);
                      navigate(`/quizzes#${suggestion.id}`);
                      setMobileOpen(false);
                    }}
                  >
                    {suggestion.title}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-sm text-gray-400">No matches found</div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 border-t border-gray-200 pt-3 space-y-2">
          <Link to="/" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Home</Link>
          {(!user || user.role !== "admin") && (
            <>
              <Link to="/quizzes" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Quizzes</Link>
              <Link to="/ai-quiz" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Practice with AI</Link>
            </>
          )}
          <Link to="/leaderboard" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Leaderboard</Link>
          {user ? (
            user.role === "admin" ? (
              <Link to="/admin" className="block px-2 py-2 text-indigo-700 font-medium hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Admin Dashboard</Link>
            ) : (
              <>
                <Link to="/profile" className="block px-2 py-2 text-gray-700 hover:bg-gray-50 rounded" onClick={() => setMobileOpen(false)}>Profile</Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="w-full text-left px-2 py-2 text-gray-700 hover:bg-gray-50 rounded">Logout</button>
              </>
            )
          ) : (
            <div className="flex gap-2 px-2">
              <Link to="/login" className="flex-1 text-center text-blue-600 border border-blue-600 px-3 py-2 rounded hover:bg-blue-600 hover:text-white transition" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/signup" className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition" onClick={() => setMobileOpen(false)}>Signup</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
