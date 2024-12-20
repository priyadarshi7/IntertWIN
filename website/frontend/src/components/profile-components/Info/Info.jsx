import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./Info.css";
import { useUserContext } from "../../../context/UserContext";

export default function Info() {
    const { userData, setUserData } = useUserContext();
    const {user} = useUserContext();
    const [techStackInput, setTechStackInput] = React.useState(""); // Input field for tech stack items

    // Fetch user data from MongoDB when component mounts or user logs in
    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                console.log("Attempting to fetch data for user ID:", user.userId); // Debugging userId
                try {
                    const response = await axios.get(`http://localhost:8000/profile/${user?.userId}`);
                    console.log("API response:", response.data);

                    if (response.data.success && response.data.data) {
                        setUserData({
                            userId: user.userId,
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

    // Handle form submission to update MongoDB with current user data
    async function postUserInfo(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8000/profile", userData);
            alert("Profile info saved successfully!");
        } catch (err) {
            console.error("Error posting user info:", err.response ? err.response.data : err.message);
            alert("Failed to save user info. Please try again.");
        }
    }

    // Handle input changes and update userData
    function handleInputs(event) {
        setUserData((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
        }));
    }

        // Add tech stack item to userData
        function addTechStackItem() {
            if (techStackInput.trim()) {
                setUserData(prev => ({
                    ...prev,
                    techStack: [...(prev.techStack || []), techStackInput.trim()],
                }));
                setTechStackInput(""); // Clear input field after adding
            }
        }
    
        // Remove a tech stack item
        function removeTechStackItem(index) {
            setUserData(prev => ({
                ...prev,
                techStack: prev.techStack.filter((_, i) => i !== index),
            }));
        }


    return (
        <div className="profile-info">
            <div className="profile-info-top">
                <h2 style={{ fontFamily: "afacad" }}>Profile Info</h2>
            </div>
            <div className="profile-forms">
                <form onSubmit={postUserInfo}>
                    <div className="name">
                        <div className="sub-name">
                            <label>First Name</label>
                            <input
                                type="text"
                                placeholder="First Name"
                                name="firstName"
                                onChange={handleInputs}
                                value={userData.firstName || ""}
                            />
                        </div>
                        <div className="sub-name">
                            <label>Last Name</label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="lastName"
                                onChange={handleInputs}
                                value={userData.lastName || ""}
                            />
                        </div>
                    </div>
                    
                    {/* Email - Read-Only */}
                    <div className="field">
                        <div className="sub-field">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={user?.email || ""}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Country */}
                    <div className="field">
                        <div className="sub-field">
                            <label>Country</label>
                            <input
                                type="text"
                                placeholder="Country"
                                name="country"
                                onChange={handleInputs}
                                value={userData.country || ""}
                            />
                        </div>
                    </div>

                    <h2>Educational Details</h2>
                    {/* College */}
                    <div className="field">
                        <div className="sub-field">
                            <label>College</label>
                            <input
                                type="text"
                                placeholder="College"
                                name="college"
                                onChange={handleInputs}
                                value={userData.college || ""}
                            />
                        </div>
                    </div>
                    {/* Degree */}
                    <div className="field">
                        <div className="sub-field">
                            <label>Degree</label>
                            <input
                                type="text"
                                placeholder="Degree"
                                name="degree"
                                onChange={handleInputs}
                                value={userData.degree || ""}
                            />
                        </div>
                    </div>
                    {/* Branch */}
                    <div className="field">
                        <div className="sub-field">
                            <label>Branch</label>
                            <input
                                type="text"
                                placeholder="Branch"
                                name="branch"
                                onChange={handleInputs}
                                value={userData.branch || ""}
                            />
                        </div>
                    </div>

                     {/* Tech Stack Input */}
                     <div className="field">
                        <div className="sub-field">
                            <label>Tech Stack</label>
                            <div className="tech-input" style={{display:"flex",alignItems:"center",marginBottom:"15px"}}>
                            <input 
                                type="text" 
                                placeholder="Add a technology..." 
                                value={techStackInput}
                                onChange={(e) => setTechStackInput(e.target.value)}
                            />
                            <Button onClick={addTechStackItem} variant="contained" sx={{ marginLeft: "10px" }}>
                                Add
                            </Button>
                            </div>
                        </div>
                        <div className="tech-stack-list">
                            {userData.techStack?.map((tech, index) => (
                                <div key={index} className="tech-stack-item" style={{display:"flex", alignItems:"center",background:"black", padding:"10px", borderRadius:"15px", marginBottom:"10px"}}>
                                    {tech}
                                    <Button
                                        onClick={() => removeTechStackItem(index)}
                                        variant="outlined"
                                        color="error"
                                        sx={{ marginLeft: "auto" }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
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
