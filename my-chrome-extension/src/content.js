console.log("Content script loaded on LinkedIn");

// Example of how to retrieve some LinkedIn data or manipulate the page if needed
const profileName = document.querySelector(".pv-top-card--list li:first-child").innerText;
console.log("LinkedIn profile name found:", profileName);
