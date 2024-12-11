import React, { useEffect } from "react";
import { Button, Modal, Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import "./Platforms.css";
import { useUserContext } from "../../../context/UserContext";

const VerificationModal = ({ open, handleClose, platform, verificationCode, onVerify }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="modal-box" style={{ color: "white" }}>
        <Typography variant="h6" className="modal-title">
          Verify {platform} Profile
        </Typography>
        <div className="verification-steps">
          <Typography variant="body1">
            Step 1: Go to https://{platform.toLowerCase()}.com/profile
          </Typography>
          <Typography variant="body1">
            Step 2: Edit the "First Name" section and paste the following code:
          </Typography>
          <Box className="verification-code">
            <code>{verificationCode}</code>
          </Box>
          <Typography variant="body1">Step 3: Save your profile.</Typography>
          <Typography variant="body1">Step 4: Click on the verify button below.</Typography>
          <Typography variant="body2" className="note">
            Note: After verification, you may change your first name back to normal.
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={onVerify}
            className="verify-button"
            sx={{ mt: 2 }}
          >
            Verify
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default function Platforms() {
  const { userData, setUserData, user } = useUserContext();
  const [verificationModal, setVerificationModal] = React.useState({
    open: false,
    platform: "",
    code: ""
  });
  const [verificationStatus, setVerificationStatus] = React.useState({});
  const [isVerifying, setIsVerifying] = React.useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const response = await axios.get(`http://localhost:8000/profile/${user.userId}`);
          if (response.data.success && response.data.data) {
            setUserData({
              userId: user.sub,
              email: user.email,
              ...response.data.data,
            });
            setVerificationStatus(response.data.data.verifiedPlatforms || {});
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message || error);
        }
      }
    };

    if (user) fetchUserData();
  }, [user, setUserData]);

  const generateVerificationCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VERIFY_${code}`;
  };

  const handleVerificationClick = (platform) => {
    const code = generateVerificationCode();
    setVerificationModal({
      open: true,
      platform,
      code
    });
  };

  const handleVerify = async () => {
    const { platform, code } = verificationModal;
    const platformLower = platform.toLowerCase();

    setIsVerifying((prev) => ({ ...prev, [platformLower]: true }));

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await axios.post(`http://localhost:8000/verify`, {
        userId: user.userId,
        platform: platformLower,
        username: userData[platformLower],
        verificationCode: code
      });

      if (response.data.success) {
        const updatedStatus = {
          ...verificationStatus,
          [platformLower]: true
        };
        setVerificationStatus(updatedStatus);

        await axios.post("http://localhost:8000/profile", {
          ...userData,
          userId: user.userId,
          verifiedPlatforms: updatedStatus
        });

        alert(`${platform} profile verified successfully!`);
      } else {
        alert(response.data.message || "Verification failed. Please ensure you've updated your profile correctly.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsVerifying((prev) => ({ ...prev, [platformLower]: false }));
      setVerificationModal({ open: false, platform: "", code: "" });
    }
  };

  const handleInputs = async (event) => {
    const { name, value } = event.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));

    const updatedStatus = {
      ...verificationStatus,
      [name]: false,
    };
    setVerificationStatus(updatedStatus);

    try {
      await axios.post("http://localhost:8000/profile", {
        ...userData,
        [name]: value,
        userId: user.userId,
        verifiedPlatforms: updatedStatus
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const renderPlatformInput = (platform) => (
    <div className="field" key={platform}>
      <div className="sub-field">
        <label>{platform}</label>
        <div className="input-verify-container">
          <input
            type="text"
            placeholder={platform}
            name={platform.toLowerCase()}
            onChange={handleInputs}
            value={userData[platform.toLowerCase()] || ""}
          />
          {userData[platform.toLowerCase()] && (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleVerificationClick(platform)}
              disabled={verificationStatus[platform.toLowerCase()]}
              sx={{ ml: 1, minWidth: 100 }}
            >
              {isVerifying[platform.toLowerCase()] ? (
                <CircularProgress size={20} color="inherit" />
              ) : verificationStatus[platform.toLowerCase()] ? (
                "Verified ✓"
              ) : (
                "Verify"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-info">
      <div className="profile-info-top">
        <h2 style={{ fontFamily: "afacad" }}>Platforms Info</h2>
        <Button
          sx={{ color: "white", fontFamily: "afacad", fontSize: "20px", background: "black" }}
          onClick={async () => {
            try {
              await axios.post("http://localhost:8000/profile", {
                ...userData,
                userId: user.userId,
                verifiedPlatforms: verificationStatus
              });
              alert("Social info saved successfully!");
            } catch (error) {
              console.error(error);
              alert("Failed to save user info. Please try again.");
            }
          }}
        >
          Save
        </Button>
      </div>
      <div className="profile-forms">
        <form>
          {["Codeforces", "Leetcode", "Codechef", "GitHub"].map((platform) =>
            renderPlatformInput(platform)
          )}
        </form>
      </div>

      <VerificationModal
        open={verificationModal.open}
        handleClose={() => setVerificationModal({ open: false, platform: "", code: "" })}
        platform={verificationModal.platform}
        verificationCode={verificationModal.code}
        onVerify={handleVerify}
      />
    </div>
  );
}
