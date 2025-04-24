import { Platform } from 'react-native';

// Replace this with your computer's local network IP address when testing on physical devices
const LOCAL_IP = '192.168.1.100'; // Example IP - replace with your actual IP

const getApiUrl = () => {
  if (__DEV__) {
    // Development environment
    if (Platform.OS === 'android') {
      // Android emulator
      return 'http://10.0.2.2:8000/api/v1';
    } else if (Platform.OS === 'ios') {
      // iOS simulator
      return 'http://localhost:8000/api/v1';
    } else {
      // Physical device
      return `http://${LOCAL_IP}:8000/api/v1`;
    }
  }
  
  // Production environment
  return 'https://your-production-api.com/api/v1';
};

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 15000,
};