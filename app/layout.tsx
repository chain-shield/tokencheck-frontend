import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AuthProvider } from '@/context/AuthContent';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TokenCheck.ai - AI-Powered Token Analysis',
  description: 'Advanced AI-powered token analysis to protect you from scams and ensure safe crypto investments',
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
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}