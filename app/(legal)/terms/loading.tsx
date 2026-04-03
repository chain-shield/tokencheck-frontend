'use client';

import { MarketingLoadingState } from '@/components/marketing/loading-state';

/**
 * Loading component for the Terms of Use page
 * 
 * Displays a centered spinner when the Terms of Use page is loading
 */
export default function TermsLoading() {
  return <MarketingLoadingState label="Loading terms of use" />;
}
