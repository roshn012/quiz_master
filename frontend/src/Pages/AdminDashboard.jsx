import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, ListChecks, BarChart3, TrendingUp, Plus, UserCircle, Trash2 } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalUsers: 0,
    avgScore: 0,
    totalResults: 0,
  });
  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    // Check if user is admin
    if (!authLoading && user && user.role !== "admin") {
      navigate("/quizzes");
      return;
    }
    
    if (user && user.role === "admin") {
      fetchDashboardData();
    }
  }, [activeTab, user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (activeTab === "dashboard") {
        const [statsRes, analyticsRes, quizzesRes] = await Promise.all([
          axios.get("http://localhost:5000/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/admin/analytics", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/admin/recent-quizzes", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setStats(statsRes.data);
        setAnalytics(analyticsRes.data);
        setRecentQuizzes(quizzesRes.data);
      } else if (activeTab === "users") {
        const usersRes = await axios.get("http://localhost:5000/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsersList(usersRes.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Chart data for quiz performance
  const quizPerformanceData = analytics?.quizAnalytics
    ? {
        labels: analytics.quizAnalytics.map((q) => q.quizTitle),
        datasets: [
          {
            label: "Average Score",
            data: analytics.quizAnalytics.map((q) => q.avgScore),
            backgroundColor: "rgba(79, 70, 229, 0.6)",
            borderColor: "rgba(79, 70, 229, 1)",
            borderWidth: 2,
          },
        ],
      }
    : null;

  // Chart data for daily activity
  const dailyActivityData = analytics?.dailyActivity
    ? {
        labels: analytics.dailyActivity.map((d) => d._id),
        datasets: [
          {
            label: "Quiz Attempts",
            data: analytics.dailyActivity.map((d) => d.count),
            backgroundColor: "rgba(34, 197, 94, 0.6)",
            borderColor: "rgba(34, 197, 94, 1)",
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      }
    : null;

  // Stats distribution chart
  const statsData = stats
    ? {
        labels: ["Quizzes", "Users", "Results"],
        datasets: [
          {
            data: [stats.totalQuizzes, stats.totalUsers, stats.totalResults],
            backgroundColor: [
              "rgba(79, 70, 229, 0.6)",
              "rgba(34, 197, 94, 0.6)",
              "rgba(249, 115, 22, 0.6)",
            ],
            borderColor: [
              "rgba(79, 70, 229, 1)",
              "rgba(34, 197, 94, 1)",
              "rgba(249, 115, 22, 1)",
            ],
            borderWidth: 2,
          },
        ],
      }
    : null;

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  // Additional check - redirect if not admin
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Access Denied</p>
          <button
            onClick={() => navigate("/quizzes")}
            className="text-indigo-600 hover:underline"
          >
            Go to Quizzes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
        <div>
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 p-2 rounded-lg ${
                activeTab === "dashboard"
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <BarChart3 size={18} /> Dashboard
            </button>
            <Link
              to="/admin/create-quiz"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Plus size={18} /> Create Quiz
            </Link>
            <Link
              to="/admin/quizzes"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <ListChecks size={18} /> Manage Quizzes
            </Link>
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 p-2 rounded-lg ${
                activeTab === "users"
                  ? "bg-indigo-100 text-indigo-600 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <Users size={18} /> Users
            </button>
            <button
              onClick={() => setShowCreateAdmin(true)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700 border-t border-gray-200 mt-2"
            >
              <Plus size={18} /> Create Admin
            </button>
            <Link
              to="/leaderboard"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <TrendingUp size={18} /> Leaderboard
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="mb-3 pb-3 border-b">
            <p className="text-sm font-semibold text-gray-800">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
            <p className="text-xs text-indigo-600 font-medium mt-1">👑 Admin</p>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-3 text-gray-600 hover:text-indigo-600"
          >
            <UserCircle size={18} /> Profile
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "dashboard" && (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Total Quizzes</p>
                <h2 className="text-3xl font-bold text-gray-800">{stats.totalQuizzes}</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Total Users</p>
                <h2 className="text-3xl font-bold text-gray-800">{stats.totalUsers}</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Average Score</p>
                <h2 className="text-3xl font-bold text-gray-800">{stats.avgScore}%</h2>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-gray-500 text-sm mb-1">Total Attempts</p>
                <h2 className="text-3xl font-bold text-gray-800">{stats.totalResults}</h2>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {dailyActivityData && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Daily Activity (Last 7 Days)</h3>
                  <Line
                    data={dailyActivityData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { display: false },
                      },
                    }}
                  />
                </div>
              )}

              {statsData && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Statistics Overview</h3>
                  <Doughnut
                    data={statsData}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: { position: "bottom" },
                      },
                    }}
                  />
                </div>
              )}
            </div>

            {quizPerformanceData && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
                <h3 className="text-lg font-semibold mb-4">Top Quiz Performance</h3>
                <Bar
                  data={quizPerformanceData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            )}

            {/* Recent Quizzes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Recent Quizzes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-gray-600">
                      <th className="p-3">Quiz Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Participants</th>
                      <th className="p-3">Average Score</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentQuizzes.map((quiz, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 text-gray-700">
                        <td className="p-3 font-medium">{quiz.title}</td>
                        <td className="p-3">{quiz.category || "N/A"}</td>
                        <td className="p-3">{quiz.participants}</td>
                        <td className="p-3">{quiz.avgScore}</td>
                        <td className="p-3">
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                            {quiz.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

            {activeTab === "users" && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-800">Users</h1>
                  <button
                    onClick={() => setShowCreateAdmin(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus size={18} /> Create Admin
                  </button>
                </div>

                {/* Create Admin Modal */}
                {showCreateAdmin && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                      <h2 className="text-2xl font-bold mb-4">Create Admin User</h2>
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          try {
                            const token = localStorage.getItem("token");
                            await axios.post(
                              "http://localhost:5000/admin/create-admin",
                              newAdmin,
                              {
                                headers: { Authorization: `Bearer ${token}` },
                              }
                            );
                            alert("Admin user created successfully!");
                            setShowCreateAdmin(false);
                            setNewAdmin({ name: "", email: "", password: "" });
                            if (activeTab === "users") fetchDashboardData();
                          } catch (error) {
                            alert(
                              error.response?.data?.message ||
                                "Failed to create admin user"
                            );
                          }
                        }}
                      >
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={newAdmin.name}
                              onChange={(e) =>
                                setNewAdmin({ ...newAdmin, name: e.target.value })
                              }
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={newAdmin.email}
                              onChange={(e) =>
                                setNewAdmin({ ...newAdmin, email: e.target.value })
                              }
                              className="w-full p-2 border rounded-lg"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Password
                            </label>
                            <input
                              type="password"
                              value={newAdmin.password}
                              onChange={(e) =>
                                setNewAdmin({ ...newAdmin, password: e.target.value })
                              }
                              className="w-full p-2 border rounded-lg"
                              required
                              minLength={6}
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                          >
                            Create Admin
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowCreateAdmin(false);
                              setNewAdmin({ name: "", email: "", password: "" });
                            }}
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Name</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Email</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">Role</th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Quizzes Taken
                      </th>
                      <th className="px-6 py-4 text-left font-semibold text-gray-700">
                        Avg Score
                      </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">
                          Total Score
                        </th>
                        <th className="px-6 py-4 text-left font-semibold text-gray-700">
                          Actions
                        </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersList.map((listUser) => (
                      <tr key={listUser._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-800">{listUser.name}</td>
                        <td className="px-6 py-4 text-gray-600">{listUser.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              listUser.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {listUser.role === "admin" ? "👑 Admin" : "👤 User"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{listUser.totalQuizzes}</td>
                        <td className="px-6 py-4 text-gray-700">{listUser.avgScore}%</td>
                        <td className="px-6 py-4 text-gray-700">{listUser.totalScore}</td>
                        <td className="px-6 py-4">
                          <button
                            onClick={async () => {
                              if (
                                !window.confirm(
                                  `Are you sure you want to delete ${listUser.name}? This action cannot be undone and will delete all their quiz results.`
                                )
                              )
                                return;
                              try {
                                const token = localStorage.getItem("token");
                                await axios.delete(
                                  `http://localhost:5000/admin/users/${listUser._id}`,
                                  {
                                    headers: { Authorization: `Bearer ${token}` },
                                  }
                                );
                                alert("User deleted successfully!");
                                fetchDashboardData();
                              } catch (error) {
                                alert(
                                  error.response?.data?.message || "Failed to delete user"
                                );
                              }
                            }}
                            disabled={listUser._id === user?.id}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-sm transition-colors ${
                              listUser._id === user?.id
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            <Trash2 size={14} /> Remove User
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
