import { useState, useEffect } from "react";

export default function Profile({ userData: propUserData }) {
  const [userData, setUserData] = useState(
    propUserData || {
      name: "John Doe",
      dailyCalories: 2100,
      proteinGoal: 140,
      carbGoal: 210,
      fatGoal: 70,
      waterGoal: 2000,
      dietRestrictions: ["Gluten-free"],
    }
  );

  useEffect(() => {
    if (propUserData) {
      setUserData(propUserData);
    }
    // Here you would typically fetch user data from your backend if accessed directly
    // For now, we're using the default data
  }, [propUserData]);

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
              <h3 className="text-xl font-medium text-gray-800">
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
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {restriction}
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400">
                  + Add more
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">Daily Goals</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-medium">{userData?.dailyCalories} cal</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Protein</p>
                  <p className="font-medium">{userData?.proteinGoal}g</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Carbs</p>
                  <p className="font-medium">{userData?.carbGoal}g</p>
                </div>
                <div className="p-3 border rounded-md">
                  <p className="text-sm text-gray-500">Fats</p>
                  <p className="font-medium">{userData?.fatGoal}g</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return <div>{renderProfile()}</div>;
}
