type RetryConfig = {
  maxAttempts?: number;
  delayMs?: number;
};

export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> => {
  const { maxAttempts = 3, delayMs = 1000 } = config;
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) break;

      // Only retry on network errors
      if (!(error as any).isNetworkError) throw error;

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  // @ts-ignore
  throw lastError;
};
