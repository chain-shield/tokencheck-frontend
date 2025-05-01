'use client'
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';
import { useUserData } from '@/hooks/use-user-data';
export default function ApiPlanPage() {

  const { user, isLoading, error, isError } = useUserData()

  if (isLoading) return <div>Loading...</div>;
  console.log(user)
  if (isError) return <div>Error: {error.message}</div>;



  return (
    <Card className="p-6 mb-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Current API Plan</h2>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        <Button>Upgrade Plan</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>API Calls Used Today</span>
              <span>0 / 100,000</span>
            </div>
            <Progress value={0} className="h-2" />
          </div>
          <p className="text-sm text-muted-foreground">
            Free API Plan - Up to 100,000 calls per day
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Rate Limit:</span>
            <span className="text-sm">5 calls/second</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Daily Limit:</span>
            <span className="text-sm">100,000 calls</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
