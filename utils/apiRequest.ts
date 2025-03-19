import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

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
  data: Record<string, unknown> | null = null
): Promise<T> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const url = `${API_BASE_URL}${endpoint}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  const config: AxiosRequestConfig = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // Equivalent to credentials: 'include'
  };

  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
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


