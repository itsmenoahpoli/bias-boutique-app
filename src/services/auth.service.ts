import { $baseApi } from "@/api";
import { ApiError } from "@/types/api.types";
import { useUserStore } from "@/store/user.store";

type RegisterUserPayload = {
  name: string;
  email: string;
  username: string;
  contact_no: string;
  password: string;
  account_type: string;
};

type LoginUserPayload = {
  email: string;
  password: string;
};

type UpdateUserPayload = {
  name: string;
  email: string;
  contact_no: string;
  address?: string;
  password?: string;
};

export const useAuthService = () => {
  const setUser = useUserStore((state) => state.setUser);

  const loginUser = async (payload: LoginUserPayload) => {
    try {
      console.log("loginUser-payload", payload);
      const response = await $baseApi.post("/auth/signin", payload);

      console.log(response.data.data);

      if (!response.data.data.user) {
        throw new Error("No user data received from server");
      }

      // Store user data in the store (now handles AsyncStorage internally)
      await setUser(response.data.data.user);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.isNetworkError) {
        throw new Error(apiError.message);
      }

      if (apiError.status === 422 && apiError.errors) {
        const firstError = Object.values(apiError.errors)[0]?.[0];
        throw new Error(firstError || apiError.message);
      }

      throw new Error(apiError.message || "An unexpected error occurred");
    }
  };

  const registerUser = async (payload: RegisterUserPayload) => {
    try {
      console.log("registerUser-payload", payload);
      const response = await $baseApi.post("/auth/signup", payload);
      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.isNetworkError) {
        throw new Error(apiError.message);
      }

      if (apiError.status === 422) {
        if (apiError.errors?.email) {
          throw new Error("This email address is already registered");
        }
        if (apiError.errors?.username) {
          throw new Error("This username is already taken");
        }
        throw new Error("Email or username may already be in use");
      }

      throw new Error(apiError.message || "An unexpected error occurred");
    }
  };

  const updateUserAccount = async (
    userId: string,
    payload: UpdateUserPayload
  ) => {
    try {
      const response = await $baseApi.post(`/auth/update-account/${userId}`, {
        ...payload,
        contact_number: payload.contact_no,
      });

      const user = useUserStore.getState().user;
      if (user) {
        // Update user in store with new data
        await setUser({
          ...user,
          ...payload,
        });
      }

      return response.data;
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.isNetworkError) {
        throw new Error(apiError.message);
      }

      if (apiError.status === 422 && apiError.errors) {
        const firstError = Object.values(apiError.errors)[0]?.[0];
        throw new Error(firstError || apiError.message);
      }

      throw new Error(apiError.message || "An unexpected error occurred");
    }
  };

  return {
    loginUser,
    registerUser,
    updateUserAccount,
  };
};
