import React, { useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
import "./Platforms.css";
import { useUserContext } from "../../../context/UserContext";

export default function Platforms() {
  const { userData, setUserData,user } = useUserContext();

  // Fetch user data if it already exists when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        console.log("Attempting to fetch data for user ID:", user.sub); // Debugging userId
        try {
          const response = await axios.get(`http://localhost:8000/profile/${user.userId}`);
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
        <h2 style={{ fontFamily: "afacad" }}>Platforms Info</h2>
        <Button
          sx={{ color: "white", fontFamily: "afacad", fontSize: "20px", background: "black" }}
          onClick={(e) => postUserInfo(e)} // Wrap function to prevent immediate execution
        >
          Save
        </Button>
      </div>
      <div className="profile-forms">
        <form>
          {/* Codeforces */}
          <div className="field">
            <div className="sub-field">
              <label>Codeforces</label>
              <input
                type="text"
                placeholder="Codeforces"
                name="codeforces" // Add name attribute
                onChange={handleInputs}
                value={userData.codeforces || ""}
              />
            </div>
          </div>
          {/* Leetcode */}
          <div className="field">
            <div className="sub-field">
              <label>Leetcode</label>
              <input
                type="text"
                placeholder="Leetcode"
                name="leetcode" // Add name attribute
                onChange={handleInputs}
                value={userData.leetcode || ""}
              />
            </div>
          </div>
          {/* Codechef */}
          <div className="field">
            <div className="sub-field">
              <label>Codechef</label>
              <input
                type="text"
                placeholder="Codechef"
                name="codechef" // Add name attribute
                onChange={handleInputs}
                value={userData.codechef || ""}
              />
            </div>
          </div>
          {/*GitHub*/}
          <div className="field">
            <div className="sub-field">
              <label>GitHub</label>
              <input
                type="text"
                placeholder="GitHub"
                name="github" // Add name attribute
                onChange={handleInputs}
                value={userData.github || ""}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
