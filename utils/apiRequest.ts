import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthTokenFromLocalStorage, OAuthProvider } from './oAuthService';
import { isTokenSetFromLocalStorage } from './oAuthService';
import { getTokenFromLocalStorage } from './oAuthService';

/**
 * Utility function for making API requests using Axios
 * @param {string} endpoint - API endpoint to call
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object} data - Data to send in the request body (for POST/PUT)
 * @returns {Promise<T>} - Response data
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  method = 'GET',
  data: Record<string, unknown> | null = null,
  addAuthToken = true
): Promise<T> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const url = `${API_BASE_URL}${endpoint}`;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Equivalent to credentials: 'include'
  };

  if (addAuthToken) {
    const oauthToken = getAuthTokenFromLocalStorage();
    console.log('adding token to request', oauthToken);
    if (oauthToken) {
      const token = oauthToken.token;
      const provider = oauthToken.provider;
      console.log('adding token to request headers for provider =>', provider);
      console.log('token =>', token);
    config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }

  if (data && (method === 'POST' || method === 'PUT')) {
    config.data = data;
  }

  try {
    const response: AxiosResponse<T> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const customError = new Error(error.response?.data?.error || 'API request failed') as Error & {
        status?: number;
        data?: Record<string, unknown> | null;
      };

      customError.status = error.response?.status;
      customError.data = error.response?.data || null;
      throw customError;
    }
    // Handle non-Axios errors
    throw error instanceof Error ? error : new Error(String(error));
  }
}
