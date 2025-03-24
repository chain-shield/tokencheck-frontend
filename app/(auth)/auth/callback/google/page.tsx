'use client';

import { OAuthProvider } from '@/utils/oAuthService';
import OAuthCallbackPage from '../OAuthCallbackPage';

export default function OAuthGoogleCallbackPage() {
  return <OAuthCallbackPage provider={OAuthProvider.GOOGLE} />;
}