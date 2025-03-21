'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface CreateApiKeyModalProps {
  onCreateKey: (appName: string) => void;
}

export function CreateApiKeyModal({ onCreateKey }: CreateApiKeyModalProps) {
  const [newAppName, setNewAppName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAppName.trim()) {
      onCreateKey(newAppName.trim());
      setNewAppName('');
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setNewAppName('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Key</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New API Key</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateKey} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appName">Application Name</Label>
            <Input
              id="appName"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              placeholder="Enter your application name"
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Generate API Key
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}