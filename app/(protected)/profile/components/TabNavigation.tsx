'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Lock, User, CreditCard } from 'lucide-react';
import { useTabContext } from '@/context/TabContext';
import ProfileTab from './ProfileTab';
import SecurityTab from './SecurityTab';
import NotificationsTab from './NotificationsTab';
import BillingTab from './BillingTab';
import { useUserSubscription } from '@/hooks/user-user-subscription';
import { Spinner } from '@/components/ui/spinner';

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useTabContext();
  const { userPlan, error, isLoading } = useUserSubscription();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (isLoading) return <div className="flex justify-center py-8">
    <Spinner className="h-8 w-8" />
  </div>;

  console.log("error ==>", error)
  if (error) return <div>Error: {error.message}</div>

  return (
    <Tabs
      defaultValue={activeTab}
      className="space-y-6"
      onValueChange={handleTabChange}
    >
      <TabsList>
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Profile
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Security
        </TabsTrigger>
        {/* <TabsTrigger value="notifications" className="flex items-center gap-2"> */}
        {/*   <Bell className="h-4 w-4" /> */}
        {/*   Notifications */}
        {/* </TabsTrigger> */}
        {userPlan && (
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="profile">
        <ProfileTab />
      </TabsContent>

      <TabsContent value="security">
        <SecurityTab />
      </TabsContent>

      {/* <TabsContent value="notifications"> */}
      {/*    <NotificationsTab /> */}
      {/*  </TabsContent> */}

      {userPlan && (
        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>
      )}
    </Tabs>
  );
}
