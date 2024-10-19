import React from "react";
import Home from "./pages/home/Home.jsx";
import DrawerAppBar from "./components/Navbar/Navbar.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import MyCalendar from "./pages/calendar/Calendar.jsx";
import ProfileSetup from "./pages/profile-setup/Profile.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import SignUp from "./pages/Auth/SignUp/SignUp.jsx";
import Login from "./pages/Auth/Login/Login.jsx";
import { useUserContext } from "./context/UserContext.jsx";
import GeminiChatBot from "./components/ChatBot/ChatBot.jsx";
import SearchedDashboard from "./pages/Searched-Dashboard/SearchedDashboard.jsx";

export default function App() {

    const {user} = useUserContext();

    return (
        <>
            <DrawerAppBar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path={`/user/signup`} element={<SignUp/>} />
                <Route path={"/user/login"} element={<Login/>} />
                <Route path="/calendar" element={<MyCalendar />} />
                {user && <Route path={`/profile`} element={<ProfileSetup />} />}
                <Route path={`/dashboard/${user?.userId}`} element={<Dashboard />} />
                <Route path={`/dashboard/search/:searchedUserId`} element={<SearchedDashboard />} /> {/* Route for searched dashboard */}
                {/* Catch-all route for undefined paths */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
            <GeminiChatBot/>
        </>
    );
}
