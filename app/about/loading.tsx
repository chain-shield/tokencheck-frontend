'use client';

import { MarketingLoadingState } from '@/components/marketing/loading-state';

/**
 * Loading component for the About page
 * 
 * Displays a centered spinner when the About page is loading
 */
export default function AboutLoading() {
  return <MarketingLoadingState label="Loading about page" />;
}
