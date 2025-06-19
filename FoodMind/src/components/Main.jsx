import { useState, useEffect } from "react";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Main() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [userData, setUserData] = useState(null);
  const [mealPlan, setMealPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState("monday");
  const [checkedMeals, setCheckedMeals] = useState({}); 
  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const mealTimes = ["breakfast", "lunch", "snack", "dinner"];

  // Auth middleware and fetch real user data
  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const response = await axios.get("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };
    checkAuthAndFetchUser();
  }, [navigate]);

  // Fetch meal plan from backend
  const fetchMealPlan = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/savedmealplan");
      const planObj = {};
      response.data.forEach(dayPlan => {
        planObj[dayPlan.day.toLowerCase()] = {};
        dayPlan.meals.forEach(meal => {
          planObj[dayPlan.day.toLowerCase()][meal.time.toLowerCase()] = meal;
        });
      });
      setMealPlan(planObj);
    } catch (error) {
      console.error("Error fetching meal plan:", error);
    }
  };

  useEffect(() => {
    fetchMealPlan();
  }, []);

  // Mock shopping list data
  const shoppingList = [
    { id: 1, name: "Avocados", quantity: 3, category: "Produce" },
    { id: 2, name: "Eggs", quantity: 12, category: "Dairy" },
    { id: 3, name: "Chicken Breast", quantity: 1, category: "Meat" },
    { id: 4, name: "Quinoa", quantity: 1, category: "Grains" },
    { id: 5, name: "Greek Yogurt", quantity: 2, category: "Dairy" },
    { id: 6, name: "Spinach", quantity: 1, category: "Produce" },
    { id: 7, name: "Salmon Fillets", quantity: 2, category: "Seafood" },
    { id: 8, name: "Almonds", quantity: 1, category: "Nuts" },
  ];

  // Calculate daily calories
  const calculateDailyCalories = () => {
    
  };

  // Calculate checked macros for the selected day
  const checkedMacros = mealPlan && mealPlan[selectedDay]
    ? Object.entries(mealPlan[selectedDay]).reduce(
        (acc, [mealTime, meal]) => {
          if (checkedMeals[selectedDay]?.[mealTime]) {
            acc.calories += meal.calories || 0;
            acc.protein += meal.protein || 0;
            acc.carbs += meal.carbs || 0;
            acc.fats += meal.fat || 0;
          }
          return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      )
    : { calories: 0, protein: 0, carbs: 0, fats: 0 };

  // Handler for checkbox toggle
  const handleMealCheck = (day, mealTime) => {
    setCheckedMeals(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [mealTime]: !prev[day]?.[mealTime],
      },
    }));
  };

  // Restore checkedMeals from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("checkedMeals");
    if (stored) {
      setCheckedMeals(JSON.parse(stored));
    }
  }, []);

  // Save checkedMeals to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("checkedMeals", JSON.stringify(checkedMeals));
  }, [checkedMeals]);

  // Render functions for different tabs
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Today's Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Calories</p>
            <p className="text-xl font-bold text-gray-800">
              {checkedMacros.calories} / {userData.dailyCalories}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (checkedMacros.calories / userData.dailyCalories) * 100)}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Protein</p>
            <p className="text-xl font-bold text-gray-800">
              {checkedMacros.protein}g / {userData.proteinGoal}g
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (checkedMacros.protein / userData.proteinGoal) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Carbs</p>
            <p className="text-xl font-bold text-gray-800">
              {checkedMacros.carbs}g / {userData.carbGoal}g
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (checkedMacros.carbs / userData.carbGoal) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Fats</p>
            <p className="text-xl font-bold text-gray-800">
              {checkedMacros.fats}g / {userData.fatGoal}g
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${Math.min(100, (checkedMacros.fats / userData.fatGoal) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          Today's Meals
        </h3>
        <div className="space-y-3">
          {mealPlan && mealPlan[selectedDay]
            ? Object.entries(mealPlan[selectedDay]).map(([mealTime, meal], index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-green-600 rounded focus:ring-green-500 mr-3"
                    checked={!!checkedMeals[selectedDay]?.[mealTime]}
                    onChange={() => handleMealCheck(selectedDay, mealTime)}
                  />
                  <div>
                    <p className="text-sm text-gray-500 text-left">{meal.time}</p>
                    <p className="font-medium">{meal.meal}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">{meal.calories} cal</p>
                </div>
              </div>
            ))
            : <div className="text-gray-500">No meal plan available. Generate one to get started!</div>
          }
        </div>
      </div>
    </div>
  );

  const renderMealPlan = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Your Meal Plan</h3>
        <button className="text-sm px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700" onClick={() => navigate("/mealplan")}>Regenerate Plan</button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          {daysOfWeek.map((day, index) => (
            <button
              key={day}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                selectedDay === day
                  ? "text-green-600 border-b-2 border-green-500"
                  : "text-gray-500 hover:text-green-600"
              }`}
              onClick={() => setSelectedDay(day)}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {mealPlan && mealPlan[selectedDay]
            ? mealTimes.map((mealTime) => {
                const meal = mealPlan[selectedDay][mealTime];
                return (
                  <div
                    key={mealTime}
                    className="border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-800">{mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}</h4>
                      <span className="text-sm text-gray-500">
                        {meal ? `${meal.calories} cal` : "0 cal"}
                      </span>
                    </div>
                    {meal ? (
                      <div className="flex items-center">
                        <div className="bg-gray-100 h-16 w-16 rounded-md flex-shrink-0"></div>
                        <div className="ml-4">
                          <p className="font-medium">{meal.meal}</p>
                          <div className="text-xs text-gray-500 mt-1 text-left">
                            Protein: {meal.protein}g | Carbs: {meal.carbs}g | Fat: {meal.fat}g
                          </div>
                          <div className="flex mt-1">
                            <button className="text-xs text-green-600 hover:text-green-800">
                              View Recipe
                            </button>
                            <span className="mx-2 text-gray-300">|</span>
                            <button className="text-xs text-gray-500 hover:text-gray-700">
                              Replace
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button className="text-sm text-green-600 hover:text-green-800">
                        + Add a meal
                      </button>
                    )}
                  </div>
                );
              })
            : <div className="text-gray-500">No meal plan available. Generate one to get started!</div>
          }
        </div>
      </div>
    </div>
  );

  const renderShoppingList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-800">Shopping List</h3>
        <div className="flex space-x-2">
          <button className="text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200">
            Sort
          </button>
          <button className="text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700">
            Print List
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          {["Produce", "Dairy", "Meat", "Seafood", "Grains", "Nuts"].map(
            (category) => {
              const items = shoppingList.filter(
                (item) => item.category === category
              );
              if (items.length === 0) return null;

              return (
                <div key={category}>
                  <h4 className="font-medium text-gray-800 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center p-2 border rounded-lg hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-green-600 rounded focus:ring-green-500"
                        />
                        <span className="ml-3 flex-grow">{item.name}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Add an item"
              className="flex-grow px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700">
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Profile render
  const renderProfile = () => <Profile userData={userData} />;

  // Add a loading state while fetching user data
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
                {userData.name
                  .split(" ")
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
            Welcome back, {userData.name.split(" ")[0]}!
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
                  if (tab.key === "profile") {
                    navigate("/profile");
                  } 
                  else {
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

        {/* Tab Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "meal-plan" && renderMealPlan()}
        {activeTab === "shopping-list" && renderShoppingList()}
        {activeTab === "profile" && renderProfile()}
      </main>
    </div>
  );
}
