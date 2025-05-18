
import {createBrowserRouter , RouterProvider } from "react-router-dom"   //different routes pe route krne ke liye
import Login from './Login.jsx'
import Main from "./Main.jsx"
const Body = ()=>{
    const appRouter = createBrowserRouter([
        {
            path:"/",
            element:<Login/>
        },
        {
            path:"main/",
            element:<Main/>
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter}/>
        </div>
    )
}
export default Body