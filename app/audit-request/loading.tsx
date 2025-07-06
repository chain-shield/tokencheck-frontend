'use client';

import { Spinner } from '@/components/ui/spinner';

/**
 * Loading component for the Contact page
 * 
 * Displays a centered spinner when the Contact page is loading
 */
export default function AuditRequestLoading() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center">
                <Spinner size="lg" className="mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading audit request form...</p>
            </div>
        </div>
    );
}
