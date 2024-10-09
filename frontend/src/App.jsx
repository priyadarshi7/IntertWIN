import React from "react";
import Home from "./pages/home/Home.jsx";
import DrawerAppBar from "./components/Navbar/Navbar.jsx";
import { Route, Routes, Navigate } from "react-router-dom";
import MyCalendar from "./pages/calendar/Calendar.jsx";
import { useAuth0 } from "@auth0/auth0-react";
import ProfileSetup from "./pages/profile-setup/Profile.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

export default function App() {
    const { user, loginWithRedirect, isAuthenticated, logout } = useAuth0();

    return (
        <>
            <DrawerAppBar />
            <Routes>
                <Route path="/" element={<Home />} />
                {isAuthenticated && <Route path="/calendar" element={<MyCalendar />} />}
                {isAuthenticated && <Route path="/profile" element={<ProfileSetup />} />}
                {isAuthenticated && <Route path={`/profile/${user?.sub}`} element={<Dashboard />} />}

                {/* Catch-all route for undefined paths */}
                {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
        </>
    );
}
