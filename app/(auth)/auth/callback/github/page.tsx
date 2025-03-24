'use client';

import { OAuthProvider } from '@/utils/oAuthService';
import OAuthCallbackPage from '../OAuthCallbackPage';

export default function OAuthGithubCallbackPage() {
  return <OAuthCallbackPage provider={OAuthProvider.GITHUB} />;
}