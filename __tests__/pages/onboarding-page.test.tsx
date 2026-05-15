import React from 'react';

import { render, screen } from '../utils';
import OnboardingPage from '@/app/onboarding/page';

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
  Check: () => <div data-testid="check-icon" />,
  Circle: () => <div data-testid="circle-icon" />,
  ClipboardList: () => <div data-testid="clipboard-list-icon" />,
  Clock3: () => <div data-testid="clock3-icon" />,
  FileText: () => <div data-testid="file-text-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
  Plus: () => <div data-testid="plus-icon" />,
  ShieldCheck: () => <div data-testid="shield-check-icon" />,
  Trash2: () => <div data-testid="trash2-icon" />,
}));

describe('Onboarding page', () => {
  it('renders the client onboarding shell and intake form', () => {
    render(<OnboardingPage />);

    expect(screen.getByText(/Complete your private audit intake/i)).toBeInTheDocument();
    expect(screen.getByText(/Best completed by/i)).toBeInTheDocument();
    expect(screen.getByText(/What to prepare/i)).toBeInTheDocument();
    expect(screen.getByText(/Intake coverage/i)).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /^Audit Target$/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Protocol \/ project name \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repo URL/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Scope$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Protocol Intent$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Assets And Integrations$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Roles And Trust$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Known Risks$/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /^Reporting Preferences$/i })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Add in-scope item/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit onboarding intake/i })).toBeInTheDocument();
  });
});
