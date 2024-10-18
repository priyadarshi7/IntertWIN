document.getElementById("searchBtn").addEventListener("click", () => {
    const searchInput = document.getElementById("search").value;
  
    if (!searchInput) {
      alert("Please enter a LinkedIn username.");
      return;
    }
  
    // Send message to background.js to retrieve the LinkedIn profile
    chrome.runtime.sendMessage(
      { type: "getLinkedInProfile", data: searchInput },
      (response) => {
        if (response.status === "success") {
          alert(`LinkedIn profile found: ${response.profile}`);
        } else {
          alert("Profile not found");
        }
      }
    );
  });
  