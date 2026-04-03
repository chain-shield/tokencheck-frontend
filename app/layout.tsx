/**
 * Root layout component for the TokenCheck.ai application.
 * This component wraps all pages and provides global context providers,
 * theme settings, and common UI elements like the navbar and footer.
 */

import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/context/AuthContent';
import { Toaster } from '@/components/ui/toaster';
import { SWRProvider } from '@/components/swr-provider';
import { GTMScript, GTMNoScript } from '@/components/analytics/gtm';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ChainShield | Hardened Security for the Decentralized Era',
  description: 'Continuous, hardened smart contract security intelligence for high-stakes decentralized protocols.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GTMScript />
      </head>
      <body className={plusJakarta.className}>
        <GTMNoScript />
        <AuthProvider>
          <SWRProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {/*
		               * Navbar is fixed and responsive. Add top padding so page content doesn't render under it.
	               */}
              <div className="pt-16 md:pt-20">{children}</div>
              <Footer />
              <Toaster />
            </ThemeProvider>
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
