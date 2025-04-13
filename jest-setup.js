// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Import the Jest globals mock
import './__mocks__/jest-globals';

// Mock the Spinner component to have a role="status" for easier testing
jest.mock('./components/ui/spinner', () => ({
    Spinner: ({ size, className, centered }) => (
        <div role="status" className={`spinner ${className || ''} ${size || ''} ${centered ? 'centered' : ''}`}>
            Loading spinner
        </div>
    ),
}));

// Mock the next/link component
jest.mock('next/link', () => {
    return ({ children, href }) => {
        return <a href={href}>{children}</a>;
    };
});

// Mock the lucide-react icons
jest.mock('lucide-react', () => ({
    Github: () => <span data-testid="github-icon">GitHub Icon</span>,
    Shield: () => <span data-testid="shield-icon">Shield Icon</span>,
    // Add other icons as needed
}));

// Mock the SWR hooks
jest.mock('swr', () => require('./__tests__/mocks/swr'));

// Mock the useUserData hook
jest.mock('./hooks/use-user-data', () => require('./__tests__/mocks/use-user-data'));

// Set up global mocks for window.location
Object.defineProperty(window, 'location', {
    writable: true,
    value: { href: 'http://localhost:3000' },
});

// Mock window.matchMedia - required for next-themes
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});
