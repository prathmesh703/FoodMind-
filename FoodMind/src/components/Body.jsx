import { createBrowserRouter, RouterProvider } from "react-router-dom"; //different routes pe route krne ke liye
import Login from "./Login.jsx";
import Main from "./Main.jsx";
import Profile from "./Profile.jsx";
import MealPlan from "./MealPlan.jsx";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: <Main />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "mealplan",
      element: <MealPlan />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};
export default Body;
