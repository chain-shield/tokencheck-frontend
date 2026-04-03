'use client';

import { MarketingLoadingState } from '@/components/marketing/loading-state';

/**
 * Loading component for the Privacy Policy page
 * 
 * Displays a centered spinner when the Privacy Policy page is loading
 */
export default function PrivacyLoading() {
  return <MarketingLoadingState label="Loading privacy policy" />;
}
