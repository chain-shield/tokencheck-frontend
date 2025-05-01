'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserSubscription } from '@/hooks/user-user-subscription';
import { formatDate } from 'date-fns';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BillingTab() {

  const { userPlan, plans, cancelUserSubscription, error, isLoading } = useUserSubscription();
  const router = useRouter();
  console.log('Plan:', userPlan, 'Loading:', isLoading, 'Error:', error);
  const plan = userPlan?.plan;
  const paymentHistory = userPlan?.paymentHistory;


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const getPlanName = (price: number): string => {
    const plan = plans.find(plan => plan.price === price);
    return `${plan?.name} Plan` || 'Cannot Find Plan';
  }

  const nextPaymentDate = () => {
    const willSubscriptionCancel = userPlan?.userSubscription.cancel_at_period_end;
    const nextBillingPeriod = userPlan?.userSubscription.current_period_end;
    if (willSubscriptionCancel || !nextBillingPeriod) return 'Subscription will not renew';
    return formatDate(userPlan?.userSubscription?.current_period_end * 1000, 'MMM d, yyyy');

  }

  const handleCancelUser = async () => {
    await cancelUserSubscription();

    // send user to home page
    router.push('/');

  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Current Plan</h3>
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">{plan?.name} Plan</p>
                <p className="text-sm text-muted-foreground">${((plan?.price || 0) / 100).toFixed(2)}/{plan?.interval}</p>
              </div>
              <Button variant="outline"><Link href="/api-plans">Change Plan</Link></Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your next billing date is: {nextPaymentDate()}
            </p>
          </div>
        </div>
        {/** UNCOMMENT WHEN STRIPE API IS IMPLIMENTED
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5" />
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </div>
        **/}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Billing History</h3>
          <div className="space-y-4">
            {paymentHistory?.map((payment) => {
              const payDate = formatDate(payment.created * 1000, 'MMM d, yyyy');
              return <div key={payment.id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-medium">{payDate}</p>
                  <p className="text-sm text-muted-foreground">{getPlanName(payment.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(payment.amount / 100).toFixed(2)}</p>
                  {/* <Button variant="link" className="text-sm">Download</Button> */}
                </div>
              </div>
            }
            )}
          </div>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold text-destructive mb-4">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Once you cancel your account, you will lose access to all services and your data will be deleted.
          </p>
          <Button variant="destructive" size="sm" onClick={cancelUserSubscription}>
            Cancel Account
          </Button>
        </div>
      </div>
    </Card>
  );
}
