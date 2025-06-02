
import {createBrowserRouter , RouterProvider } from "react-router-dom"   //different routes pe route krne ke liye
import Login from './Login.jsx'
import Main from "./Main.jsx"
import Profile from "./profile.jsx"
const Body = ()=>{
    const appRouter = createBrowserRouter([
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/",
            element:<Main/>
        },
        {
            path:"profile", 
            element:<Profile/>
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter}/>
        </div>
    )
}
export default Body