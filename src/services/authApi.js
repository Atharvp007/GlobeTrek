import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

// Helper to exchange access token for profile data
export const fetchUserProfile = (accessToken) => {
  return axios.get("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });
};

// Custom hook for the login flow
export const usegoogleAuth = ({ onSuccess }) => {
  return useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetchUserProfile(codeResponse.access_token);
        // Persist user in browser storage
        localStorage.setItem("user", JSON.stringify(res.data));
        // Trigger the callback passed from the component
        onSuccess?.(res.data);
      } catch (error) {
        console.error("Authentication failed:", error);
      }
    },
    
    onError: (error) => console.log("Login Failed:", error)
  });
};