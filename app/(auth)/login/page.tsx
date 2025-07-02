'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthContext } from '@/context/AuthContent';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Github } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { OAuthProvider } from '@/utils/oAuthService';
import { ButtonLoadingOverlay } from '@/components/ui/loading-overlay';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';
import { Redirect, setRedirect } from '@/utils/localStorage';

export interface LoginSearchParams {
  type: string,
  planId: string,
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const { subscribe } = useSubscriptionPlans();
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<OAuthProvider | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "You have been logged in successfully",
        variant: "default",
      });

      // Keep loading state active during navigation
      const params = getSearchParams();

      if (params) {
        const { url } = await subscribe(params.planId);
        if (url) window.location.assign(url);
        else router.push('/api-plans')
      } else router.push('/');

    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };


  const handleOAuthLogin = async (provider: OAuthProvider) => {

    const params = getSearchParams();

    // set redirect once for user once login process is complete
    if (params && params.type === 'stripe' && params.planId) {
      setRedirect(Redirect.STRIPE, params.planId);
    }

    try {

      // Set loading state for this specific provider
      setIsOAuthLoading(provider);

      let redirectUrl = `${API_BASE_URL}/auth/oauth/${provider}`;

      // Add a small delay to ensure the loading state is visible
      // This is especially important on slow connections
      setTimeout(() => {
        window.location.href = redirectUrl
      }, 100);
    } catch (error) {
      setIsOAuthLoading(null);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
    }
  }

  const getSearchParams = (): LoginSearchParams | null => {
    if (!searchParams) {
      return null;
    }

    const type = searchParams.get('type');
    const plan = searchParams.get('plan');

    if (type && plan) {
      return { type, planId: plan };
    }

    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your ChainShield.ai account</p>
        </div>

        <div className="space-y-4">
          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button
              variant="outline"
              className="w-full relative"
              onClick={() => handleOAuthLogin(OAuthProvider.GITHUB)}
              disabled={isOAuthLoading !== null}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            {isOAuthLoading === OAuthProvider.GITHUB && (
              <ButtonLoadingOverlay isLoading={true} text="Connecting..." />
            )}
          </div>

          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button
              variant="outline"
              className="w-full relative"
              onClick={() => handleOAuthLogin(OAuthProvider.GOOGLE)}
              disabled={isOAuthLoading !== null}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
            {isOAuthLoading === OAuthProvider.GOOGLE && (
              <ButtonLoadingOverlay isLoading={true} text="Connecting..." />
            )}
          </div>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} role="form">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="relative w-full" style={{ minHeight: '40px' }}>
            <Button type="submit" className="w-full relative" disabled={isLoading}>
              Sign In
            </Button>
            {isLoading && (
              <ButtonLoadingOverlay isLoading={true} text="Signing In..." />
            )}
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}
