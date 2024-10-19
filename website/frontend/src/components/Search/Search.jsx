import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Optional: For styling the suggestions list

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const fetchSuggestions = async () => {
        if (searchTerm.length > 2) {
            try {
                const response = await axios.get(`http://localhost:8000/profile/search`, {
                    params: { name: searchTerm }
                });
                
                console.log('Search Response:', response.data); // Debugging line

                if (response.data.success) {
                    setSuggestions(response.data.data); // Update suggestions
                } else {
                    setSuggestions([]); // Clear suggestions if no users found
                }
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                alert('There was an error fetching suggestions. Please try again later.'); // Alert on error
            }
        } else {
            setSuggestions([]); // Clear suggestions if input is less than 3 characters
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchSuggestions();
        }, 300); // Adjust the delay as needed

        return () => {
            clearTimeout(handler); // Clear the timeout on unmount or change
        };
    }, [searchTerm]); // Trigger effect on searchTerm change

    const handleSearch = (event) => {
        event.preventDefault();
        if (suggestions.length > 0) {
            const userId = suggestions[0]._id; // Use the first suggestion for navigation
            navigate(`/dashboard/search/${userId}`); // Correct redirect path
        } else {
            alert('No users found');
        }
    };

    return (
        <form onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                required
                onFocus={() => setSuggestions([])} // Clear suggestions on focus
            />
            <button type="submit">Search</button>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((user) => (
                        <li
                            key={user._id}
                            onClick={() => navigate(`/dashboard/search/${user._id}`)}
                        >
                            {user.firstName} {user.lastName}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default Search;
