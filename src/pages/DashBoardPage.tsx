import { useCallback, useEffect, useState } from "react";
import { addHabits, getAllHabits, markDone, reset } from "../service/habit";
import Header from "../components/common/Header";
import { profile } from "../service/auth";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-check-circle"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-8.8" />
    <path d="M22 4 12 14.01l-3-3" />
  </svg>
);
const RefreshCwIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucude-refresh-cw"
  >
    <path d="M23 4v6h-6" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-search"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Habit Interface
interface Habit {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  completedDates: string[];
  userId: string;
  createdAt: string;
  streak?: number;
}

// 7-day streak calculation logic
const calculateStreak = (completedDates: string[]): number => {
  if (completedDates.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  let sortedDates = completedDates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  for (let i = 0; i < sortedDates.length; i++) {
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const completionDate = new Date(
      sortedDates[i].getFullYear(),
      sortedDates[i].getMonth(),
      sortedDates[i].getDate()
    );

    if (completionDate.getTime() === checkDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (completionDate.getTime() < checkDate.getTime()) {
      break;
    }
  }
  return streak;
};

export default function DashBoardPage() {
  interface UserData {
    firstName: string;
    lastName: string;
  }
  interface FormData {
    title: string;
    description: string;
    startDate: string;
  }
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
  });
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
  });
  const fetchHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getAllHabits(filter, searchTerm);
      if (response.status !== 200) throw new Error("Failed to fetch");
      const data: Habit[] = response.data.data;
      const habitsWithStreak = data.map((habit) => ({
        ...habit,
        streak: calculateStreak(habit.completedDates),
      }));
      setHabits(habitsWithStreak);
    } catch (err) {
      console.error("Failed to fetch habits:", err);
      setError("Failed to fetch habits. Please check the backend connection.");
    } finally {
      setIsLoading(false);
    }
  }, [filter, searchTerm]);

  useEffect(() => {
    fetchHabits();
    const fetchUserProfile = async () => {
      try {
        const result = await profile();
        setUserData(result.data.data);
      } catch (error) {
        console.log("err", error);
      }
    };
    fetchUserProfile();
  }, [fetchHabits]);

  const handleCreateHabit = async () => {
    if (!formData) return;
    try {
      const formattedData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString().split("T")[0], // YYYY-MM-DD
      };
      const response: any = await addHabits(formattedData);
      if (response.status !== 201) {
        throw new Error("Failed to create habit.");
      }
      setFormData({
        title: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
      });
      fetchHabits();
    } catch (err) {
      console.error("Failed to create habit:", err);
      setError("Failed to create habit.");
    }
  };

  const handleMarkDone = async (habitId: string) => {
    try {
      const response: any = await markDone(habitId);
      if (response.status !== 200) {
        throw new Error("Failed to mark habit as done.");
      }
      fetchHabits();
    } catch (err) {
      console.error("Failed to mark habit as done:", err);
      setError("Failed to mark habit as done.");
    }
  };

  const handleReset = async (habitId: string) => {
    try {
      const response: any = await reset(habitId);

      if (response.status !== 200) {
        throw new Error("Failed to reset habit.");
      }
      fetchHabits();
    } catch (err) {
      console.error("Failed to reset habit:", err);
      setError("Failed to reset habit.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // clear error when user types
  };
  return (
    <>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="container mx-auto p-6 bg-gray-950 text-white min-h-screen">
          <h2 className="text-3xl font-bold mb-6">Habit Dashboard</h2>
          <p className="text-sm text-gray-400 mb-4">
            Hi:{" "}
            <span className="font-mono">
              {userData.firstName} {userData.lastName}{" "}
            </span>
          </p>

          {/* Add New Habit Section */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8">
            <h3 className="text-2xl font-semibold mb-4">Add a New Habit</h3>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="e.g., Drink water, Read a book"
                value={formData.title}
                name="title"
                onChange={handleChange}
                className="flex-grow p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                name="description"
                onChange={handleChange}
                className="flex-grow p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="date"
                value={formData.startDate}
                name="startDate"
                onChange={handleChange}
                className="p-3 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleCreateHabit}
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md transition-colors shadow-lg"
              >
                Add Habit
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter("")}
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  filter === ""
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  filter === "completed"
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("notCompleted")}
                className={`cursor-pointer flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  filter === "notCompleted"
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Not Completed
              </button>
            </div>
            <div className="relative w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </span>
            </div>
          </div>

          {/* Habit List */}
          {isLoading ? (
            <div className="text-center text-gray-400 text-xl mt-12">
              Loading habits...
            </div>
          ) : error ? (
            <div className="text-center text-red-500 text-xl mt-12">
              {error}
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center text-gray-400 text-xl mt-12">
              No habits found.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((habit) => (
                <div
                  key={habit._id}
                  className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">
                      {habit.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Streak:{" "}
                      <span className="font-bold text-white">
                        {habit.streak} day(s)
                      </span>
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>
                        Started:{" "}
                        {new Date(habit.startDate).toLocaleDateString()}
                      </p>
                      <p>
                        Last Completed:{" "}
                        {habit.completedDates.length > 0
                          ? new Date(
                              habit.completedDates[
                                habit.completedDates.length - 1
                              ]
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
                    <button
                      onClick={() => handleMarkDone(habit._id)}
                      className="cursor-pointer flex-grow flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
                    >
                      <CheckIcon /> <span>Mark Done</span>
                    </button>
                    <button
                      onClick={() => handleReset(habit._id)}
                      className="cursor-pointer flex-grow flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm"
                    >
                      <RefreshCwIcon /> <span>Reset</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
