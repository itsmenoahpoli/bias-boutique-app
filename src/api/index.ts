import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import NetInfo from "@react-native-community/netinfo";
import { API_CONFIG } from "@/config/api.config";

const $baseApi = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

$baseApi.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    try {
      const networkState = await NetInfo.fetch();

      if (!networkState.isConnected) {
        throw new Error("No internet connection");
      }

      config.params = {
        ...config.params,
        _t: Date.now(),
      };

      return config;
    } catch (error) {
      return Promise.reject({
        message:
          error instanceof Error ? error.message : "Network check failed",
        isNetworkError: true,
      });
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject({
      message: "Request failed",
      isNetworkError: true,
      originalError: error,
    });
  }
);

$baseApi.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Log the full error object
    // console.log("API Error:", {
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   headers: error.response?.headers,
    //   config: {
    //     url: error.config?.url,
    //     method: error.config?.method,
    //     headers: error.config?.headers,
    //     data: error.config?.data,
    //   },
    //   message: error.message,
    //   code: error.code,
    // });

    // Check if the error is due to no response from server
    if (!error.response) {
      const isTimeout = error.code === "ECONNABORTED";

      return Promise.reject({
        message: isTimeout
          ? "Request timed out. Please check your connection and try again"
          : "Unable to connect to the server. Please try again later",
        isNetworkError: true,
        code: error.code,
      });
    }

    // Handle API errors
    const { status, data } = error.response;

    const errorResponse = {
      status,
      message: "An unexpected error occurred",
      // @ts-ignore
      errors: data?.errors,
      isNetworkError: false,
    };

    switch (status) {
      case 401:
        errorResponse.message = "Session expired. Please sign in again";
        break;
      case 403:
        errorResponse.message =
          "You do not have permission to perform this action";
        break;
      case 404:
        errorResponse.message = "Resource not found";
        break;
      case 422:
        errorResponse.message = "Validation failed";
        break;
      case 500:
        errorResponse.message = "Server error. Please try again later";
        break;
      default:
        errorResponse.message = "Something went wrong. Please try again";
    }

    // Log the formatted error response
    console.log("Formatted Error Response:", errorResponse);

    return Promise.reject(errorResponse);
  }
);

export { $baseApi };
