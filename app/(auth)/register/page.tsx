'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Github, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { AuthContext } from '@/context/AuthContent';
import { toast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { OAuthProvider } from '@/utils/oAuthService';
import { Spinner } from '@/components/ui/spinner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

  const validatePassword = (password: string) => {
    const minLength = 10;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[*&?!@#$%^&()_+\-=\[\]{};':"\\|,.<>\/]/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 10 characters long";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character (*&?!@#$%^&, etc.)";
    }

    return null; // Password is valid
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Please ensure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(email, username, password);
      toast({
        title: "Account created",
        description: "Your account has been created successfully",
      });
      // user must login once registered with their new credentials
      router.push('/login');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthRegister = async (provider: OAuthProvider) => {
    try {
      window.location.href = `${API_BASE_URL}/auth/oauth/${provider}`;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Create Your Account</h1>
          <p className="text-muted-foreground mt-2">Join TokenCheck.ai to protect your investments</p>
        </div>

        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister(OAuthProvider.GITHUB)}>
            <Github className="mr-2 h-4 w-4" />
            Sign up with GitHub
          </Button>
          <Button variant="outline" className="w-full" onClick={() => handleOAuthRegister(OAuthProvider.GOOGLE)}>
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
            Sign up with Google
          </Button>
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" type="text" placeholder="Enter your full name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}