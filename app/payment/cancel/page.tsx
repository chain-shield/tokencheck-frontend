import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary">
      <Card className="w-full max-w-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
        <p className="text-muted-foreground mb-8">
          Your payment was cancelled. If you experienced any issues or have questions, please don't hesitate to contact our support team.
        </p>
        <div className="space-y-4">
          <Link href="/api-plans">
            <Button className="w-full">Try Again</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" className="w-full">Contact Support</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
