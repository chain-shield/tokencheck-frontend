import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthTokenFromLocalStorage } from './oAuthService';

/**
 * Utility function for making subscription API requests using Axios
 * @param {string} endpoint - API endpoint to call (e.g., '/plans' or '/subscribe')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|null} data - Data to send in the request body (for POST/PUT)
 * @param {boolean} addAuthToken - Whether to add authentication token to request headers
 * @returns {Promise<T>} - Response data of type T
 * @throws {Error} - Custom error with status and response data properties
 */
export async function subscriptionApiRequest<T = unknown>(
  endpoint: string,
  method = 'GET',
  data: Record<string, unknown> | null = null,
  addAuthToken = true
): Promise<T> {
  // Determine the base URL from environment variables or fallback to localhost
  const API_BASE_URL = process.env.NEXT_PUBLIC_SUBSCRIPTIONS_API_URL || 'http://localhost:8081/api';
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('SUBSCRIPTIONS_API_BASE_URL', process.env.NEXT_PUBLIC_SUBSCRIPTIONS_API_URL);

  // Configure the request
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Enables sending cookies with cross-origin requests
  };

  // Add authentication token to headers if required
  if (addAuthToken) {
    const oauthToken = getAuthTokenFromLocalStorage();
    if (oauthToken) {
      const token = oauthToken.token;
      const provider = oauthToken.provider;
      console.log('adding token to subscription request headers for provider =>', provider);

      // Append the token to request headers
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }

  // Add request body data for POST or PUT requests
  if (method === 'POST' || method === 'PUT') {
    config.data = data || {};
  }

  try {
    // Execute the request
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(error)) {
      // Create a custom error with additional properties
      const customError = new Error(error.response?.data?.error || 'Subscription API request failed') as Error & {
        status?: number;
        data?: Record<string, unknown> | null;
      };

      // Add HTTP status code and response data to the error
      customError.status = error.response?.status;
      customError.data = error.response?.data || null;
      throw customError;
    }
    // Handle non-Axios errors
    throw error instanceof Error ? error : new Error(String(error));
  }
}
