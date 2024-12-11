import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Socials.css";
import { useUserContext } from "../../../context/UserContext";

export default function Socials() {
    const { user } = useAuth0();
    const { userData, setUserData } = useUserContext();
    const [techStackInput, setTechStackInput] = useState(""); // Input field for tech stack items

    // Fetch user data if it already exists when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                console.log("Attempting to fetch data for user ID:", user.sub);
                try {
                    const response = await axios.get(`http://localhost:8000/profile/${user.sub}`);
                    console.log("API response:", response.data);

                    if (response.data.success && response.data.data) {
                        setUserData({
                            userId: user.sub,
                            email: user.email,
                            ...response.data.data,
                        });
                    } else {
                        console.warn("No user data found in the database.");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error.message || error);
                }
            }
        };

        if (user) fetchUserData();
    }, [user, setUserData]);

    // Function to handle user info submission
    async function postUserInfo(event) {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8000/profile", userData);
            console.log(response.data);
            alert("Social info saved successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to save user info. Please try again.");
        }
    }

    // Handle form input changes
    function handleInputs(event) {
        setUserData(prev => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }


    return (
        <div className="profile-info">
            <div className="profile-info-top">
                <h2 style={{ fontFamily: "afacad" }}>Social Info</h2>
            </div>
            <div className="profile-forms">
                <form onSubmit={postUserInfo}>
                    {/* Social Links */}
                    <div className="field">
                        <div className="sub-field">
                            <label>LinkedIn</label>
                            <input 
                                type="text" 
                                placeholder="LinkedIn" 
                                name="linkedIn" 
                                onChange={handleInputs} 
                                value={userData.linkedIn || ""} 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="sub-field">
                            <label>Twitter</label>
                            <input 
                                type="text" 
                                placeholder="Twitter" 
                                name="twitter" 
                                onChange={handleInputs} 
                                value={userData.twitter || ""} 
                            />
                        </div>
                    </div>
                    <div className="field">
                        <div className="sub-field">
                            <label>Website</label>
                            <input 
                                type="text" 
                                placeholder="Website" 
                                name="website"  
                                onChange={handleInputs} 
                                value={userData.website || ""} 
                            />
                        </div>
                    </div>
                    {/* Submit Button */}
                    <Button 
                        sx={{ color: "white", fontFamily: "afacad", fontSize: "20px", background: "black" }} 
                        type="submit"
                    >
                        Save
                    </Button>
                </form>
            </div>
        </div>
    );
}
