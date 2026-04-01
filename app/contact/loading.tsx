'use client';

import { MarketingLoadingState } from '@/components/marketing/loading-state';

/**
 * Loading component for the Contact page
 * 
 * Displays a centered spinner when the Contact page is loading
 */
export default function ContactLoading() {
  return <MarketingLoadingState label="Loading contact page" />;
}
