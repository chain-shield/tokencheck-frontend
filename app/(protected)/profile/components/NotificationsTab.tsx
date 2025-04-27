'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    email: true,
    security: true,
    marketing: false
  });

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Email Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive alerts about suspicious activity and security updates
                </p>
              </div>
              <Switch
                checked={notifications.security}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, security: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Account Activity</Label>
                <p className="text-sm text-muted-foreground">
                  Get important notifications about your account
                </p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, email: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Marketing Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and promotions
                </p>
              </div>
              <Switch
                checked={notifications.marketing}
                onCheckedChange={(checked) =>
                  setNotifications(prev => ({ ...prev, marketing: checked }))
                }
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t">
          <Button type="submit">Save Notification Preferences</Button>
        </div>
      </div>
    </Card>
  );
}
