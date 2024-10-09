import React, { useState, useEffect } from 'react';
import './GitHubContributions.css'; // Import the CSS file for styling

const GitHubContributions = ({ username }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    // Set the URL for the GitHub contributions image
    const url = `https://ghchart.rshah.org/${username}`;
    setImageUrl(url);
  }, [username]);

  return (
    <div className="github-contributions dark-theme">
      <h2>GitHub Contributions</h2>
      <img src={imageUrl} alt={`${username}'s GitHub Contributions`} />
    </div>
  );
};

export default GitHubContributions;
