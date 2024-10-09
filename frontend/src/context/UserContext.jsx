import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";
import { useAuth0 } from '@auth0/auth0-react';

// Create UserContext
const UserContext = createContext();

// UserProvider component to provide user data to the rest of the app
export const UserProvider = ({ children }) => {
    const { user } = useAuth0(); // Destructure user from Auth0 context
    const [userData, setUserData] = useState({
        userId: user?.sub,
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
        codechef: ""
    });
    const [leetcodeData, setLeetCodeData] = useState({});
    const [loading, setLoading] = useState(true);
    const [leetcodeLoading, setLeetcodeLoading] = useState(true);
    const [codeforcesRating, setCodeforcesRating] = useState([]);
    const [error, setError] = useState(null);

    // Function to fetch user profile data from the backend API
    const getUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/user/profile/${user?.sub}`);
            setUserData(prevData => ({ ...prevData, ...response.data.data }));
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
            const response = await axios.get(`http://localhost:3000/${userData.leetcode}/solved`);
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
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${userData.codeforces}`);
            setCodeforcesRating(response.data.result);
        } catch (err) {
            console.error("Error fetching Codeforces ratings:", err);
            setError("Failed to fetch Codeforces ratings");
        }
    };

    // Fetch user profile and LeetCode problems on component mount or when user changes
    useEffect(() => {
        if (user) {
            getUserProfile();
        }
    }, [user]);

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
        }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use UserContext
export const useUserContext = () => useContext(UserContext);
