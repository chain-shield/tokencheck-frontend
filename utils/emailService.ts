
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { getAuthTokenFromLocalStorage, OAuthProvider } from './oAuthService';
import { FormData } from '@/components/audit-request/form';
import { apiRequest } from './apiRequest';

interface SendEmailResponse {
  id: string
}

export async function submitAuditRequestEmail(formData: FormData): Promise<SendEmailResponse> {

  // Configure the request
  const config: AxiosRequestConfig = {
    method: "POST",
    url: '/api/audit-request',
    data: { data: formData },
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    // Execute the request
    const response: AxiosResponse<SendEmailResponse> = await axios(config);
    return response.data;
  } catch (error: unknown) {
    // Handle Axios-specific errors
    if (axios.isAxiosError(error)) {
      // Create a custom error with additional properties
      const customError = new Error(error.response?.data?.error || 'API request failed') as Error & {
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
