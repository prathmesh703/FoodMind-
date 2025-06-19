import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MealPlan() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({
    additionalRequirements: "",
  });
  const [mealPlan, setMealPlan] = useState(null);

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

    fetchUserData();
  }, [navigate]);

  const generateMealPlan = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        " http://localhost:5000/api/mealplan/generate-mealplan",
        {
          
          dailyCalories: userData.dailyCalories,
          dietaryRestrictions: userData.dietRestrictions,
          proteinGoal: userData.proteinGoal,
          carbGoal: userData.carbGoal,
          fatGoal: userData.fatGoal,
          additionalRequirements: preferences.additionalRequirements,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMealPlan(response.data);
      console.log(response.data);
      navigate("/");

    } catch (error) {
      console.error("Error generating meal plan:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Meal Plan Generator
          </h2>
          <p className="text-gray-600">
            Generate your personalized meal plan based on your profile
            preferences
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <div className="space-y-6">
              {/* Current Profile Settings Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Your Profile Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Daily Calories</p>
                    <p className="font-medium">{userData.dailyCalories} kcal</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Dietary Restrictions
                    </p>
                    <p className="font-medium">
                      {userData.dietRestrictions?.length > 0
                        ? userData.dietRestrictions.join(", ")
                        : "None"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Protein Goal</p>
                    <p className="font-medium">{userData.proteinGoal}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Carb Goal</p>
                    <p className="font-medium">{userData.carbGoal}g</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fat Goal</p>
                    <p className="font-medium">{userData.fatGoal}g</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  value={preferences.additionalRequirements}
                  onChange={(e) =>
                    setPreferences((prev) => ({
                      ...prev,
                      additionalRequirements: e.target.value,
                    }))
                  }
                  rows={3}
                  placeholder="Any specific preferences or requirements for this meal plan..."
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>

              <div>
                <button
                  onClick={generateMealPlan}
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {loading ? "Generating..." : "Generate Meal Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {mealPlan && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Weekly Meal Plan
            </h3>
            {/* Add meal plan display here once we have the AI integration */}
          </div>
        )}
      </main>
    </div>
  );
}
