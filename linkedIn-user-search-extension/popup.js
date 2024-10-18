document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("search-button").addEventListener("click", async () => {
        const linkedInUrl = document.getElementById("linkedInUrl").value;

        if (linkedInUrl) {
            try {
                const response = await fetch('http://localhost:8000/profile/searchLinkedIn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ linkedIn: linkedInUrl }),
                    credentials: 'include' // Include credentials for CORS
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data.success && data.data.length > 0) {
                    const userId = data.data[1].userId; // Adjust based on your data structure
                    window.open(`http://localhost:5173/dashboard/search/${userId}`, '_blank');
                } else {
                    alert("User not found");
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                alert("Error fetching user data");
            }
        } else {
            alert("Please enter a LinkedIn profile URL.");
        }
    });
});
