'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield } from 'lucide-react';

export default function SecurityTab() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <form className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </div>

        <div className="pt-6 border-t">
          <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p>Add an extra layer of security to your account</p>
              <p className="text-sm text-muted-foreground">
                We'll ask for a code in addition to your password when you sign in
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Enable 2FA
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
