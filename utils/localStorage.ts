
export enum Redirect {
    DASHBOARD = 'redirectToDashboard',
    STRIPE = 'redirectToStripe'
}

export interface RedirectOptions {
    type: Redirect,
    planId?: string | null;
}

export function setRedirect(redirect: Redirect, planId?: string): void {
    let redirectOptions = { type: redirect, planId: planId || null };

    localStorage.setItem('REDIRECT', JSON.stringify(redirectOptions));
}

export function getRedirect(): RedirectOptions | null {
    const redirectOptions = localStorage.getItem('REDIRECT');
    if (redirectOptions) {
        return JSON.parse(redirectOptions);
    }
    return null;
}

export function removeRedirect(): void {
    localStorage.removeItem('REDIRECT');
}
