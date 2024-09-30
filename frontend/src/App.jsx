import React from "react"
import Home from "./pages/home/Home.jsx"
import DrawerAppBar from "./components/Navbar/Navbar.jsx"
import { Route, Routes } from "react-router-dom"
import MyCalendar from "./pages/calendar/Calendar.jsx"
export default function App(){
    return(<>
    < DrawerAppBar/>
    <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/calendar" element={<MyCalendar/>}/>
    </Routes>
    </>)
}