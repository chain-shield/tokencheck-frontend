import React from 'react';

import { render, screen } from '../utils';
import AuditRequestPage from '@/app/audit-request/page';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as typeof globalThis & { ResizeObserver: typeof ResizeObserverMock }).ResizeObserver = ResizeObserverMock;

jest.mock('@/components/analytics/page-view-tracker', () => ({
  PageViewTracker: () => null,
}));

jest.mock('lucide-react', () => ({
  ClipboardCheck: () => <div data-testid="clipboard-check-icon" />,
  Clock3: () => <div data-testid="clock3-icon" />,
  FileCode2: () => <div data-testid="file-code2-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
  Check: () => <div data-testid="check-icon" />,
  Circle: () => <div data-testid="circle-icon" />,
  ChevronDown: () => <div data-testid="chevron-down-icon" />,
  ChevronUp: () => <div data-testid="chevron-up-icon" />,
}));

describe('Audit request page', () => {
  it('renders the redesigned audit request shell and form', () => {
    render(<AuditRequestPage />);

    expect(screen.getByText(/Request a ChainShield Discovery Run/i)).toBeInTheDocument();
    expect(screen.getByText(/Average response/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Within 24 hours/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/What to prepare/i)).toBeInTheDocument();
    expect(screen.getByText(/What happens next/i)).toBeInTheDocument();

    expect(screen.getByText(/Contact Information/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email \*/i)).toBeInTheDocument();
    expect(screen.getByText(/Audit Objectives/i)).toBeInTheDocument();
    expect(screen.getByText(/Build Configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/Documentation & Code Quality/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Audit Request/i })).toBeInTheDocument();
  });
});
