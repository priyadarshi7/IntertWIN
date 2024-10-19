import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// Create SearchedUserContext
const SearchedUserContext = createContext();

// SearchedUserProvider component to provide searched user data
export const SearchedUserProvider = ({ children }) => {
    const [searchedUser, setSearchedUser] = useState({});
    const [searchedLeetcodeData, setSearchedLeetcodeData] = useState({});
    const [searchedCodeforcesRating, setSearchedCodeforcesRating] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { searchedUserId } = useParams();

    // Function to fetch searched user profile data from the backend API
    const getSearchedUserProfile = async () => {
        console.log("Searched User ID:", searchedUserId); // Log the ID for debugging
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8000/profile/${searchedUserId}`);
            const profileData = response.data.data;
            setSearchedUser(profileData);
        } catch (err) {
            console.error("Error fetching searched user data:", err);
            setError("Failed to fetch searched user data");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch LeetCode problems for the searched user
    const getSearchedLeetcodeProblems = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3001/${searchedUser?.leetcode}/solved`);
            setSearchedLeetcodeData(response.data);
        } catch (err) {
            console.error("Error fetching searched user's LeetCode problems:", err);
            setError("Failed to fetch searched user's LeetCode problems");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch Codeforces Ratings for the searched user
    const getSearchedCodeforcesRating = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${searchedUser?.codeforces}`);
            setSearchedCodeforcesRating(response.data.result);
        } catch (err) {
            console.error("Error fetching searched user's Codeforces ratings:", err);
            setError("Failed to fetch searched user's Codeforces ratings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SearchedUserContext.Provider value={{ 
            searchedUser, 
            setSearchedUser, 
            getSearchedUserProfile, 
            searchedLeetcodeData,
            getSearchedLeetcodeProblems,
            searchedCodeforcesRating,
            getSearchedCodeforcesRating,
            loading, 
            error 
        }}>
            {children}
        </SearchedUserContext.Provider>
    );
};

// Custom hook to use SearchedUserContext
export const useSearchedUserContext = () => useContext(SearchedUserContext);
