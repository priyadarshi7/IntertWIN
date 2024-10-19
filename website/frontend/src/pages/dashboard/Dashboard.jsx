import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GitHubContributions from "../../components/GitHub/GitHubContributions";
import axios from "axios"

ChartJS.register(ArcElement, Tooltip, Legend);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Dashboard() {
  const [pinnedRepos, setPinnedRepos] = useState([]);
const [loadingPinnedRepos, setLoadingPinnedRepos] = useState(true); // Loading state
const [errorPinnedRepos, setErrorPinnedRepos] = useState(null); // Error state
  const { userData, getUserProfile, getLeetcodeProblems, leetcodeData, codeforcesRating, getCodeforcesRating,user } = useUserContext();
  const [platformIndex, setPlatformIndex] = useState(0);
  const [displayRating, setDisplayRating] = useState(null);
  const [maxRating, setMaxRating] = useState(null);

  // Fetch data based on user or other relevant state changes
  useEffect(() => {
    if (user) {
      getLeetcodeProblems();
      getUserProfile();
      getCodeforcesRating();
    }
  }, [user]);

  // Optional: Re-fetch data based on userData or other conditions
 // runs when `userData` changes

  // Prepare Doughnut chart data
  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [
        leetcodeData?.easySolved || 0,
        leetcodeData?.mediumSolved || 0,
        leetcodeData?.hardSolved || 0
      ],
      backgroundColor: ['#50FF6E', '#4285F4', '#FF5640'],
      hoverOffset: 4,
    }],
  };

  const options = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          padding: 20,
          font: { size: 12 },
        }
      }
    }
  };

  const availablePlatforms = [
    userData?.codeforces && { name: "Codeforces", url: userData?.codeforces },
    userData?.leetcode && { name: "Leetcode", url: userData?.leetcode },
    userData?.codechef && { name: "CodeChef", url: userData?.codechef },
  ].filter(Boolean);

  const handleNext = () => {
    if (availablePlatforms.length > 0) {
      setPlatformIndex((prevIndex) => (prevIndex + 1) % availablePlatforms.length);
    }
  };

  const handlePrevious = () => {
    if (availablePlatforms.length > 0) {
      setPlatformIndex((prevIndex) => (prevIndex - 1 + availablePlatforms.length) % availablePlatforms.length);
    }
  };

  const fetchPinnedRepos = async () => {
    try {
      setLoadingPinnedRepos(true); // Start loading
      const response = await axios.get(`https://pinned.berrysauce.me/get/${userData?.github}`);
      console.log("Pinned Repos Response:", response.data); // Log the response
      setPinnedRepos(response.data);
      setErrorPinnedRepos(null); // Clear error if successful
    } catch (error) {
      console.error("Error fetching pinned repos:", error);
      setErrorPinnedRepos("Unable to fetch pinned repositories."); // Set error state
    } finally {
      setLoadingPinnedRepos(false); // End loading
    }
  };
  
  useEffect(() => {
    if (userData?.github) {
      fetchPinnedRepos();
    }
  }, [userData]);

  useEffect(() => {
    if (availablePlatforms[platformIndex]?.name === "Codeforces" && codeforcesRating.length > 0) {
      const latestRating = codeforcesRating[codeforcesRating.length - 1].newRating;
      const highestRating = Math.max(...codeforcesRating.map(r => r.newRating));
      setDisplayRating(latestRating);
      setMaxRating(highestRating);
    }
  }, [platformIndex, codeforcesRating, availablePlatforms]);

  // Check if the chart data is ready to render
  const isChartDataReady = leetcodeData?.easySolved !== undefined &&
                            leetcodeData?.mediumSolved !== undefined &&
                            leetcodeData?.hardSolved !== undefined;

  return (
    <div className="dashboard">
      <div className="container-dash">
        <div id="sidebar" className="grid-parts">
          <div className="user-1">
            {/* <img src={user.picture} alt="User" /> */}
            <div className="user-name">
              <span style={{color:"white"}}>{userData ? `${userData?.firstName} ${userData?.lastName}` : "User"}</span>
            </div>
          </div>
          <div className="user-2">
            <div className="refreshed">
              Last Updated at: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="user-btn">
            <Link to="/profile">
              <button>Edit Profile</button>
            </Link>
          </div>
          <div className="user-details">
            <div className="user-detail" id="user-detail-email">
              {userData?.email || ""}
            </div>
            <div className="user-detail">{userData?.college || ""}</div>
            <div className="user-detail">{userData?.degree || ""}</div>
            <div className="user-detail">{userData?.branch || ""}</div>
            <div className="user-sub-heading">Socials</div>
            <div className="user-detail">{userData?.linkedIn || ""}</div>
            <div className="user-detail">{userData?.twitter || ""}</div>
            <div className="user-detail">{userData?.website || ""}</div>
            <div className="user-sub-heading">Platforms</div>
            <div className="user-detail">{userData?.codeforces || ""}</div>
            <div className="user-detail">{userData?.leetcode || ""}</div>
            <div className="user-detail">{userData?.codechef || ""}</div>
            <div className="user-detail">{userData?.github || ""}</div>
          </div>
        </div>
        <div id="notifications" className="grid-parts">
        <div className="grid-sub-heading">Pinned Repositories</div>
        {loadingPinnedRepos ? (
    <p>Loading pinned repositories...</p>
  ) : errorPinnedRepos ? (
    <p>{errorPinnedRepos}</p>
  ) : pinnedRepos.length > 0 ? (
    pinnedRepos.map((repo) => (
      <div key={repo.name} className="repo-card">
        <a href={`https://github.com/${repo.author}/${repo.name}`} target="_blank" rel="noopener noreferrer">
          <h3 style={{color:"yellow"}}>{repo.name}</h3>
          <p>{repo.description ? repo.description : "No description available."}</p> {/* Default message for empty description */}
          <span style={{color:"white"}}>Language: {repo.language}</span> | 
          <span style={{color:"white"}}>Stars: {repo.stars}</span> | 
          <span style={{color:"white"}}>Forks: {repo.forks}</span>
        </a>
      </div>
    ))
  ) : (
    <p>No pinned repositories found.</p>
  )}
        </div>
        <div id="projects" className="grid-parts">
          <GitHubContributions username={userData?.github} theme="dracula" />
        </div>
        <div id="projects-2" className="grid-parts">
        <div className="grid-sub-heading">CodeChef</div>
        <iframe width="100%" height="89%" style={{padding:"0"}}src={`https://codechef-api.vercel.app/heatmap/${userData.codechef}`}></iframe>
        </div>
        <div id="quickStats" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Quick Stats</div>
            <div className="grid-sub-content">
              <h2>Total Active Days:</h2>
              <h2>Total Contests: </h2>
              <h2>Total Questions Solved: {leetcodeData?.solvedProblem}</h2>
            </div>
          </div>
        </div>
        <div id="problems" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Leetcode Problems</div>
            <div className="grid-chart">
              {isChartDataReady ? (
                <Doughnut data={data} style={{ maxWidth: '300px', margin: '20px auto' }} options={options} />
              ) : (
                <p>Loading chart data...</p>
              )}
            </div>
          </div>
        </div>
        <div id="ratings" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Contest Rating</div>
            <div className="grid-sub-content-2">
              <div className="grid-sub-top">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handlePrevious}>
                  <path d="M1.25 9.29904C0.250001 8.72169 0.25 7.27831 1.25 6.70096L11.75 0.638783C12.75 0.061432 14 0.783119 14 1.93782L14 14.0622C14 15.2169 12.75 15.9386 11.75 15.3612L1.25 9.29904Z" fill="white" />
                </svg>
                <span className="grid-sub-heading">{availablePlatforms[platformIndex]?.name || "N/A"}</span>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleNext}>
                  <path d="M12.75 6.70096C13.75 7.27831 13.75 8.72169 12.75 9.29904L2.25 15.3612C1.25 15.9386 -7.52574e-07 15.2169 -7.021e-07 14.0622L-6.15056e-07 1.93782C-6.65056e-07 0.783119 1.25 0.061432 2.25 0.638783L12.75 6.70096Z" fill="white" />
                </svg>
              </div>
              <div className="grid-sub-content">
                <div className="rating-value">{displayRating || "N/A"}</div>
                <div className="rating-max">(max: {maxRating || "N/A"})</div>
              </div>
            </div>
          </div>
        </div>
        <div id="badges" className="grid-parts">
          <img src={`https://leetcode-badge-showcase.vercel.app/api?username=${userData.leetcode}&theme=dark&filter=comp`} alt="LeetCode Badges" />
        </div>
        <div id="graphs" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Codechef Rating</div>
            <iframe width="100%" height="100%" src={`https://codechef-api.vercel.app/rating/${userData.codechef}`}></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
