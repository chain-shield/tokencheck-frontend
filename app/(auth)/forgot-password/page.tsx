'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <KeyRound className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email address"
              autoComplete="email"
            />
          </div>

          <Button type="submit" className="w-full">
            Send Reset Instructions
          </Button>
        </form>

        <div className="mt-6 text-center">
          <div className="text-sm space-y-2">
            <div>
              <span className="text-muted-foreground">Remember your password? </span>
              <Link href="/login" className="text-primary hover:underline">
                Back to Sign In
              </Link>
            </div>
            <div>
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}