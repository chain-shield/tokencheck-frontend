'use client';

import { useEffect } from 'react';

interface PageViewTrackerProps {
  pageTitle: string;
  pagePath: string;
  contentCategory?: string;
}

/**
 * Pushes a `page_view` event to the GTM dataLayer on mount.
 * Drop this into any server or client page to track page views.
 */
export function PageViewTracker({ pageTitle, pagePath, contentCategory }: PageViewTrackerProps) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'page_view',
      page_title: pageTitle,
      page_path: pagePath,
      ...(contentCategory ? { content_category: contentCategory } : {}),
    });
  }, [pageTitle, pagePath, contentCategory]);

  return null;
}

