import { Platform } from "react-native";

const LOCAL_IP = "192.168.68.124";

const getApiUrl = () => {
  console.log(__DEV__);

  // if (__DEV__) {
  //   // Development environment
  //   if (Platform.OS === "android") {
  //     return "http://10.0.2.2:8000/api/v1";
  //   } else if (Platform.OS === "ios") {
  //     return "http://localhost:8000/api/v1";
  //   } else {
  //     return `http://${LOCAL_IP}:8000/api/v1`;
  //   }
  // }

  return "https://bias-boutique-backend-production.up.railway.app/api/v1";
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 5000,
};
