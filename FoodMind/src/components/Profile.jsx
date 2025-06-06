import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Profile({ userData: propUserData }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingDiet, setIsAddingDiet] = useState(false);
  const [newDietRestriction, setNewDietRestriction] = useState("");
  const [userData, setUserData] = useState(
    propUserData || {
      name: "",
      dailyCalories: 0,
      proteinGoal: 0,
      carbGoal: 0,
      fatGoal: 0,
      waterGoal: 0,
      dietRestrictions: [],
    }
  );
  const [editedGoals, setEditedGoals] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    };

    if (!propUserData) {
      fetchUserData();
    }
  }, [propUserData, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedGoals({
      dailyCalories: userData.dailyCalories,
      proteinGoal: userData.proteinGoal,
      carbGoal: userData.carbGoal,
      fatGoal: userData.fatGoal,
    });
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.put("http://localhost:5000/api/user/goals", editedGoals, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData((prev) => ({
        ...prev,
        ...editedGoals,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating goals:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedGoals({});
  };

  const handleGoalChange = (field, value) => {
    setEditedGoals((prev) => ({
      ...prev,
      [field]: parseInt(value) || 0,
    }));
  };

  const handleAddDietClick = () => {
    setIsAddingDiet(true);
  };

  const handleDietInputKeyPress = async (e) => {
    if (e.key === "Enter" && newDietRestriction.trim()) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const updatedRestrictions = [
          ...userData.dietRestrictions,
          newDietRestriction.trim(),
        ];

        await axios.put(
          "http://localhost:5000/api/user/diet-restrictions",
          { dietRestrictions: updatedRestrictions },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUserData((prev) => ({
          ...prev,
          dietRestrictions: updatedRestrictions,
        }));
        setNewDietRestriction("");
        setIsAddingDiet(false);
      } catch (error) {
        console.error("Error updating diet restrictions:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }
  };

  const handleRemoveDiet = async (indexToRemove) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const updatedRestrictions = userData.dietRestrictions.filter(
        (_, index) => index !== indexToRemove
      );

      await axios.put(
        "http://localhost:5000/api/user/diet-restrictions",
        { dietRestrictions: updatedRestrictions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUserData((prev) => ({
        ...prev,
        dietRestrictions: updatedRestrictions,
      }));
    } catch (error) {
      console.error("Error removing diet restriction:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xl font-bold">
              {userData?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="ml-4">
              <h3 className="text-2xl text-left  font-medium text-gray-800">
                {userData?.name}
              </h3>
              <p className="text-gray-500">Free Plan</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Dietary Preferences
              </h4>
              <div className="flex flex-wrap gap-2">
                {userData?.dietRestrictions?.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center"
                  >
                    {restriction}
                    <button
                      onClick={() => handleRemoveDiet(index)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {isAddingDiet ? (
                  <input
                    type="text"
                    value={newDietRestriction}
                    onChange={(e) => setNewDietRestriction(e.target.value)}
                    onKeyPress={handleDietInputKeyPress}
                    onBlur={() => {
                      if (!newDietRestriction.trim()) {
                        setIsAddingDiet(false);
                      }
                    }}
                    placeholder="Press Enter to add"
                    className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                    autoFocus
                  />
                ) : (
                  <button
                    onClick={handleAddDietClick}
                    className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400"
                  >
                    + Add more
                  </button>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Daily Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Calories</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedGoals.dailyCalories}
                      onChange={(e) =>
                        handleGoalChange("dailyCalories", e.target.value)
                      }
                      className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    <p className="font-medium">{userData?.dailyCalories} cal</p>
                  )}
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Protein</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedGoals.proteinGoal}
                      onChange={(e) =>
                        handleGoalChange("proteinGoal", e.target.value)
                      }
                      className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    <p className="font-medium">{userData?.proteinGoal}g</p>
                  )}
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Carbs</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedGoals.carbGoal}
                      onChange={(e) =>
                        handleGoalChange("carbGoal", e.target.value)
                      }
                      className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    <p className="font-medium">{userData?.carbGoal}g</p>
                  )}
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Fats</p>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedGoals.fatGoal}
                      onChange={(e) =>
                        handleGoalChange("fatGoal", e.target.value)
                      }
                      className="w-full mt-1 px-2 py-1 border rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                    />
                  ) : (
                    <p className="font-medium">{userData?.fatGoal}g</p>
                  )}
                </div>
              </div>
            </div>

            {isEditing ? (
              <div className="flex space-x-4">
                <button
                  onClick={handleSaveClick}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancelClick}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditClick}
                className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                ></path>
              </svg>
              <h1 className="ml-2 text-xl font-bold text-gray-800">FoodMind</h1>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  ></path>
                </svg>
              </button>

              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium">
                {userData?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {userData?.name?.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Here's your nutrition overview for today
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview" },
              { key: "meal-plan", label: "Meal Plan" },
              { key: "shopping-list", label: "Shopping List" },
              { key: "profile", label: "Profile" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.key !== "profile") {
                    navigate("/");
                    setActiveTab(tab.key);
                  }
                }}
                className={`py-4 px-1 font-medium text-sm border-b-2 ${
                  activeTab === tab.key
                    ? "border-green-500 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Content */}
        {renderProfile()}
      </main>
    </div>
  );
}
