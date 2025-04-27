'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserData } from '@/hooks/use-user-data';

export default function ProfileTab() {
  const { user } = useUserData();
  const fullName = `${user?.first_name} ${user?.last_name}`;

  return (
    <Card className="p-6">
      <form className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={fullName} />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue={user?.email} />
          </div>

          <div>
            <Label htmlFor="company">Company (Optional)</Label>
            <Input id="company" placeholder={user?.company_name || 'Your Company Name'} />
          </div>
        </div>

        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
