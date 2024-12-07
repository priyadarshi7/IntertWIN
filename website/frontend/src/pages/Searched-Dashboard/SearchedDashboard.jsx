import React, { createContext, useContext, useEffect, useState } from "react";
import "../../pages/dashboard/Dashboard.css";
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import GitHubContributions from "../../components/GitHub/GitHubContributions";
import { useParams } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

// Create SearchedUserContext
const SearchedUserContext = createContext();


// SearchedUserProvider component to provide searched user data
const SearchedUserProvider = ({ children }) => {
    const { searchedUserId } = useParams();
    const [searchedUser, setSearchedUser] = useState({});
    const [searchedLeetcodeData, setSearchedLeetcodeData] = useState({});
    const [searchedCodeforcesRating, setSearchedCodeforcesRating] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch searched user profile data from the backend API
    const getSearchedUserProfile = async () => {
        console.log("Searched User ID:", searchedUserId);
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
    const getSearchedLeetcodeProblems = async (leetcodeUsername) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3001/${leetcodeUsername}/solved`);
            setSearchedLeetcodeData(response.data);
        } catch (err) {
            console.error("Error fetching searched user's LeetCode problems:", err);
            setError("Failed to fetch searched user's LeetCode problems");
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch Codeforces Ratings for the searched user
    const getSearchedCodeforcesRating = async (codeforcesHandle) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://codeforces.com/api/user.rating?handle=${codeforcesHandle}`);
            setSearchedCodeforcesRating(response.data.result);
        } catch (err) {
            console.error("Error fetching searched user's Codeforces ratings:", err);
            setError("Failed to fetch searched user's Codeforces ratings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSearchedUserProfile();
    }, [searchedUserId]);

    return (
        <SearchedUserContext.Provider value={{ 
            searchedUser, 
            searchedLeetcodeData,
            searchedCodeforcesRating,
            getSearchedLeetcodeProblems,
            getSearchedCodeforcesRating,
            loading, 
            error 
        }}>
            {children}
        </SearchedUserContext.Provider>
    );
};

// Custom hook to use SearchedUserContext
const useSearchedUserContext = () => useContext(SearchedUserContext);

export default function SearchedDashboard() {
  return (
    <SearchedUserProvider>
      <SearchedDashboardContent />
    </SearchedUserProvider>
  );
}

function SearchedDashboardContent() {
  const [pinnedRepos, setPinnedRepos] = useState([]);
  const [loadingPinnedRepos, setLoadingPinnedRepos] = useState(true); // Loading state
  const [errorPinnedRepos, setErrorPinnedRepos] = useState(null); 
  const { 
    searchedUser, 
    searchedLeetcodeData, 
    searchedCodeforcesRating,  
    getSearchedLeetcodeProblems, 
    getSearchedCodeforcesRating 
  } = useSearchedUserContext();

  const [platformIndex, setPlatformIndex] = useState(0);
  const [displayRating, setDisplayRating] = useState(null);
  const [maxRating, setMaxRating] = useState(null);

  useEffect(() => {
    if (searchedUser) {
      getSearchedLeetcodeProblems(searchedUser?.leetcode);
      getSearchedCodeforcesRating(searchedUser?.codeforces);
    }
  }, [searchedUser]);

  const data = {
    labels: ['Easy', 'Medium', 'Hard'],
    datasets: [{
      data: [
        searchedLeetcodeData?.easySolved || 0,
        searchedLeetcodeData?.mediumSolved || 0,
        searchedLeetcodeData?.hardSolved || 0
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
    searchedUser?.codeforces && { name: "Codeforces", url: searchedUser?.codeforces },
    searchedUser?.leetcode && { name: "LeetCode", url: searchedUser?.leetcode },
    searchedUser?.codechef && { name: "CodeChef", url: searchedUser?.codechef },
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
      const response = await axios.get(`https://pinned.berrysauce.dev/get/${userData?.github}`);
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
    if (searchedUser?.github) {
      fetchPinnedRepos();
    }
  }, [searchedUser]);

  useEffect(() => {
    if (availablePlatforms[platformIndex]?.name === "Codeforces" && searchedCodeforcesRating.length > 0) {
      const latestRating = searchedCodeforcesRating[searchedCodeforcesRating.length - 1].newRating;
      const highestRating = Math.max(...searchedCodeforcesRating.map(r => r.newRating));
      setDisplayRating(latestRating);
      setMaxRating(highestRating);
    }
  }, [platformIndex, searchedCodeforcesRating, availablePlatforms]);

  const isChartDataReady = searchedLeetcodeData?.easySolved !== undefined &&
                            searchedLeetcodeData?.mediumSolved !== undefined &&
                            searchedLeetcodeData?.hardSolved !== undefined;

  return (
    <div className="dashboard">
      <div className="container-dash">
        <div id="sidebar" className="grid-parts">
          <div className="user-1">
            <div className="user-name">
              <span style={{color:"white"}}>{searchedUser ? `${searchedUser.firstName} ${searchedUser.lastName}` : "User"}</span>
            </div>
          </div>
          <div className="user-2">
            <div className="refreshed">
              Last Updated at: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>
          <div className="user-details">
            <div className="user-detail" id="user-detail-email">
              {searchedUser?.email || ""}
            </div>
            <div className="user-detail">{searchedUser?.college || ""}</div>
            <div className="user-detail">{searchedUser?.degree || ""}</div>
            <div className="user-detail">{searchedUser?.branch || ""}</div>
            <div className="user-sub-heading">Socials</div>
            <div className="user-detail">{searchedUser?.linkedIn || ""}</div>
            <div className="user-detail">{searchedUser?.twitter || ""}</div>
            <div className="user-detail">{searchedUser?.website || ""}</div>
            <div className="user-sub-heading">Platforms</div>
            <div className="user-detail">{searchedUser?.codeforces || ""}</div>
            <div className="user-detail">{searchedUser?.leetcode || ""}</div>
            <div className="user-detail">{searchedUser?.codechef || ""}</div>
          </div>
        </div>
        <div className="grid-parts" id="techStack">
  <div className="grid-sub-heading">SKILLS</div>
  <div style={{display:"flex", alignItems:"center",justifyContent:"center",gap:"10px"}}>
  {searchedUser?.techStack && searchedUser.techStack.length > 0 ? (
    searchedUser.techStack.map((tech, index) => (
      <div key={index} className="tech-item" style={{fontSize:"20px",color:"violet" }}>
        {tech}
      </div>
    ))
  ) : (
    <p>No tech stack available.</p>
  )}
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
          <GitHubContributions username={searchedUser?.github} theme="dracula" />
        </div>
        <div id="projects-2" className="grid-parts">
        <div className="grid-sub-heading">CodeChef</div>
        <iframe width="100%" height="89%" style={{padding:"0"}}src={`https://codechef-api.vercel.app/heatmap/${searchedUser?.codechef}`}></iframe>
        </div>
        <div id="quickStats" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Quick Stats</div>
            <div className="grid-sub-content">
              <h2>Total Active Days:</h2>
              <h2>Total Contests:</h2>
              <h2>Total Questions Solved: {searchedLeetcodeData?.solvedProblem}</h2>
            </div>
          </div>
        </div>
        <div id="problems" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Problems Solved</div>
            {isChartDataReady && (
              <Doughnut data={data} options={options} style={{ maxWidth: '300px', margin: '20px auto' }}/>
            )}
          </div>
        </div>
        <div id="platformRating" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Platform Rating</div>
            <div className="platform-info">
            <div className="grid-sub-top">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handlePrevious}>
                  <path d="M1.25 9.29904C0.250001 8.72169 0.25 7.27831 1.25 6.70096L11.75 0.638783C12.75 0.061432 14 0.783119 14 1.93782L14 14.0622C14 15.2169 12.75 15.9386 11.75 15.3612L1.25 9.29904Z" fill="white" />
                </svg>
                <span className="grid-sub-heading">{availablePlatforms[platformIndex]?.name || "N/A"}</span>
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleNext}>
                  <path d="M12.75 6.70096C13.75 7.27831 13.75 8.72169 12.75 9.29904L2.25 15.3612C1.25 15.9386 -7.52574e-07 15.2169 -7.021e-07 14.0622L-6.15056e-07 1.93782C-6.65056e-07 0.783119 1.25 0.061432 2.25 0.638783L12.75 6.70096Z" fill="white" />
                </svg>
              </div>
              {availablePlatforms.length > 0 && (
                <>
                  <div className="platform-name">{availablePlatforms[platformIndex].name}</div>
                  <div className="platform-url">{availablePlatforms[platformIndex].url}</div>
                </>
              )}
              {displayRating !== null && maxRating !== null && (
                <div>
                  <p>Current Rating: {displayRating}</p>
                  <p>(Max: {maxRating})</p>
                </div>
              )}
              <div className="platform-navigation">
              </div>
            </div>
          </div>
        </div>
        <div id="badges" className="grid-parts">
          <img src={`https://leetcode-badge-showcase.vercel.app/api?username=${searchedUser?.leetcode}&theme=dark&filter=comp`} alt="LeetCode Badges" />
        </div>
        <div id="graphs" className="grid-parts">
          <div className="grid-content">
            <div className="grid-sub-heading">Codechef Rating</div>
            <iframe width="100%" height="100%" src={`https://codechef-api.vercel.app/rating/${searchedUser?.codechef}`}></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
