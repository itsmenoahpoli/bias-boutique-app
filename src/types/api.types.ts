export type ApiError = {
  message: string;
  isNetworkError?: boolean;
  status?: number;
  errors?: {
    email?: string[];
    username?: string[];
    [key: string]: string[] | undefined;
  };
  code?: string;
};