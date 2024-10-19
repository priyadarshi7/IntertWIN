import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

// Create UserContext
const UserContext = createContext();

// UserProvider component to provide user data to the rest of the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Retrieve user from localStorage if available
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [userData, setUserData] = useState(() => {
        // Retrieve userData from localStorage if available
        const storedUserData = localStorage.getItem("userData");
        return storedUserData ? JSON.parse(storedUserData) : {
            userId: user?.userId,
            email: user?.email,
            firstName: "",
            lastName: "",
            country: "",
            college: "",
            degree: "",
            branch: "",
            linkedIn: "",
            twitter: "",
            website: "",
            codeforces: "",
            leetcode: "",
            codechef: "",
            github: "",
        };
    });
    const [leetcodeData, setLeetCodeData] = useState({});
    const [loading, setLoading] = useState(true);
    const [leetcodeLoading, setLeetcodeLoading] = useState(true);
    const [codeforcesRating, setCodeforcesRating] = useState([]);
    const [error, setError] = useState(null);

    // Store user in localStorage whenever it changes
    useEffect(() => {
        if (user?.userId) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    // Store userData in localStorage whenever it changes
    useEffect(() => {
        if (userData?.userId) {
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    }, [userData]);

    // Function to fetch user profile data from the backend API
    const getUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/profile/${user?.userId}`);
            const profileData = response.data.data;
            setUserData(prevData => ({ ...prevData, ...profileData }));
            localStorage.setItem("userData", JSON.stringify(profileData)); // Store in localStorage
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch LeetCode problems
    const getLeetcodeProblems = async () => {
        if (!userData.leetcode) return;
        setLeetcodeLoading(true);
        try {
            const response = await axios.get(`http://localhost:3001/${userData?.leetcode}/solved`);
            setLeetCodeData(response.data);
        } catch (err) {
            console.error("Error fetching LeetCode problems:", err);
            setError("Failed to fetch LeetCode problems");
        } finally {
            setLeetcodeLoading(false);
        }
    };

    // Function to fetch Codeforces Ratings
    const getCodeforcesRating = async () => {
        if (!userData.codeforces) return;
        try {
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${userData?.codeforces}`);
            setCodeforcesRating(response.data.result);
        } catch (err) {
            console.error("Error fetching Codeforces ratings:", err);
            setError("Failed to fetch Codeforces ratings");
        }
    };

    return (
        <UserContext.Provider value={{ 
            userData, 
            setUserData, 
            getUserProfile, 
            loading, 
            error, 
            getLeetcodeProblems, 
            leetcodeData, 
            leetcodeLoading,
            getCodeforcesRating,
            codeforcesRating,
            user,
            setUser,
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUserContext = () => useContext(UserContext);
