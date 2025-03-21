'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateApiKeyModalProps {
  onCreateKey: (appName: string) => void;
}

export function CreateApiKeyModal({ onCreateKey }: CreateApiKeyModalProps) {
  const [appName, setAppName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (appName.trim()) {
      onCreateKey(appName);
      setAppName('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create API Key</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
          <DialogDescription>
            Enter a name for your application to generate a new API key.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appName" className="col-span-4">
                Application Name
              </Label>
              <Input
                id="appName"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="col-span-4"
                placeholder="My Application"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Generate Key</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 