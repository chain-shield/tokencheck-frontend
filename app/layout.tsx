/**
 * Root layout component for the TokenCheck.ai application.
 * This component wraps all pages and provides global context providers,
 * theme settings, and common UI elements like the navbar and footer.
 */

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/context/AuthContent';
import { Toaster } from '@/components/ui/toaster';
import { SWRProvider } from '@/components/swr-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ChainShield.ai - AI-Powered Smart Contract Audits',
  description: 'Advanced AI-powered professional-grade smart contract security audits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <SWRProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Footer />
              <Toaster />
            </ThemeProvider>
          </SWRProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
