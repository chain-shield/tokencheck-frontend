'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserAndToken, OAuthProvider, setTokenInLocalStorage, setUserInLocalStorage } from '@/utils/oAuthService';
import { Spinner } from '@/components/ui/spinner';
import { getRedirect, Redirect, removeRedirect } from '@/utils/localStorage';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';

/**
 * Props for the OAuth callback page
 * @interface OAuthCallbackPageProps
 * @property {OAuthProvider} provider - The OAuth provider (e.g., 'google', 'github')
 */
interface OAuthCallbackPageProps {
  provider: OAuthProvider;
}

/**
 * OAuth Callback Page Component
 *
 * This component handles the OAuth authentication callback process.
 * It processes the authentication response, stores user data and token,
 * and redirects the user to the appropriate page.
 *
 * @param {OAuthCallbackPageProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export default function OAuthCallbackPage({ provider }: OAuthCallbackPageProps) {
  const router = useRouter();
  const { subscribe } = useSubscriptionPlans();
  // Format provider name for display (capitalize first letter)
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1).toLowerCase();

  useEffect(() => {
    /**
     * Process the OAuth callback
     * - Retrieves user data and authentication token
     * - Stores authentication data in localStorage
     * - Triggers auth guard via custom event
     * - Redirects to home page on success or error page on failure
     */
    async function processCallback() {
      try {
        console.log(`processing ${providerName} callback`);

        // Get user data and token from the OAuth provider
        const response = await getUserAndToken(provider);
        const token = response?.token;
        const user = response?.user;

        // Validate authentication data
        if (!token || !user) {
          throw new Error("Missing authentication data");
        }

        // Store token and user in localStorage
        console.log('storing token and user in local storage');
        setTokenInLocalStorage(provider, token);
        setUserInLocalStorage(provider, user);
        console.log('token', token);
        console.log('user', user);

        // Dispatch custom event to notify the application that auth data is saved
        // This can be used by auth guards to verify authentication state
        window.dispatchEvent(new Event('authDataSaved'));

        //get redirect from local storage
        const redirect = getRedirect();

        if (redirect) {
          if (redirect.type === Redirect.STRIPE && redirect.planId) {
            console.log('redirecting to stripe');

            // remove redirect from local storage
            removeRedirect();

            const { url } = await subscribe(redirect.planId);
            if (url) window.location.assign(url)
            else router.push('/api-plans');
          }
        } else {
          // Redirect to home page after successful authentication
          console.log('redirecting to home page');
          router.push('/');
        }
      } catch (error) {
        // Handle authentication errors
        console.error(`${providerName} authentication error:`, error);
        // Redirect to login page with error parameter
        router.push(`/login?error=${provider.toLowerCase()}_auth_failed`);
      }
    }

    // Execute the callback processing when component mounts
    processCallback();
  }, [router, provider, providerName]); // Dependencies for the useEffect hook

  // Display a loading indicator while authentication is processing
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-background/50 p-8 rounded-lg shadow-sm flex flex-col items-center">
        <Spinner size="lg" />
        <p className="mt-4 text-foreground font-medium">Authenticating with {providerName}...</p>
        <p className="mt-2 text-sm text-muted-foreground">Please wait while we complete the process</p>
      </div>
    </div>
  );
}
