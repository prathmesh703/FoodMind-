
import {createBrowserRouter , RouterProvider } from "react-router-dom"   //different routes pe route krne ke liye
import Login from './Login.jsx'
const Body = ()=>{
    const appRouter = createBrowserRouter([
        {
            path:"/",
            element:<Login/>
        }
    ])
    return (
        <div>
            <RouterProvider router={appRouter}/>
        </div>
    )
}
export default Body