import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for subscribing to TokenCheck.ai. Your payment has been processed successfully, and your account has been upgraded.
        </p>
        <div className="space-y-4">
          <Link href="/dashboard">
            <Button className="w-full">Go to Dashboard</Button>
          </Link>
          <Link href="/api-plans">
            <Button variant="outline" className="w-full">View API Plans</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
