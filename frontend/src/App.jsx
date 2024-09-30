import React from "react"
import Home from "./pages/home/home.jsx"
import DrawerAppBar from "./components/Navbar/Navbar.jsx"
import { Route, Routes } from "react-router-dom"
import MyCalendar from "./pages/calendar/Calendar.jsx"
import { useAuth0 } from "@auth0/auth0-react";
export default function App(){
    const { user, loginWithRedirect, isAuthenticated, logout  } = useAuth0();

    return(<>
    < DrawerAppBar/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        {isAuthenticated?<Route path="/calendar" element={<MyCalendar/>}/>:""}
    </Routes>
    </>)
}