chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getLinkedInProfile") {
      // Logic to retrieve LinkedIn profile or ID based on the message
      console.log("Searching LinkedIn for:", message.data);
  
      // Example response
      sendResponse({ status: "success", profile: `https://www.linkedin.com/in/${message.data}` });
    }
  });
  