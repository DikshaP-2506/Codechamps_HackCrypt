// API configuration for different environments
import { Platform } from "react-native";

// Get the local IP address for development
const getAPIBaseURL = () => {
  if (__DEV__) {
    // In development, use localhost for web, IP for mobile
    if (Platform.OS === "web") {
      return "http://localhost:3000";
    } else {
      // For mobile development, use your computer's WiFi IP address
      return "http://10.183.21.78:3000";
    }
  } else {
    // In production, use your actual API endpoint
    return "https://your-api-domain.com";
  }
};

export const API_BASE_URL = getAPIBaseURL();

// API endpoints
export const API_ENDPOINTS = {
  USERS_PROFILE: `${API_BASE_URL}/api/users/profile`,
  PATIENTS: `${API_BASE_URL}/api/patients`,
  VITALS: `${API_BASE_URL}/api/vitals`,
  MENTAL_HEALTH: `${API_BASE_URL}/api/mental-health`,
  MENTAL_HEALTH_QUICK: `${API_BASE_URL}/api/mental-health/quick-log`,
  MEDICATIONS: `${API_BASE_URL}/api/medications`,
  PRESCRIPTIONS: `${API_BASE_URL}/api/prescriptions`,
  ADHERENCE: `${API_BASE_URL}/api/medical-adherence`,
  TODAYS_MEDICATIONS: `${API_BASE_URL}/api/medications/today`,
} as const;
