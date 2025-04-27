'use client';

import { usePaymentHistory } from '@/hooks/use-payment-history';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { RefreshCw, Filter } from 'lucide-react';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

/**
 * Formats a Unix timestamp to a readable date string
 * @param timestamp Unix timestamp in seconds
 * @returns Formatted date string
 */
function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats an amount in cents to a currency string
 * @param amount Amount in cents
 * @param currency Currency code
 * @returns Formatted currency string
 */
function formatAmount(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  });

  return formatter.format(amount / 100);
}

/**
 * Component that displays the user's payment history
 */
export function PaymentHistory() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Create filters object for the API
  const filters = {
    ...(statusFilter && { status: statusFilter }),
    ...(startDate && { start_date: Math.floor(startDate.getTime() / 1000) }),
    ...(endDate && { end_date: Math.floor(endDate.getTime() / 1000) }),
  };

  // Use the hook with filters
  const { paymentHistory, isLoading, error, refreshPaymentHistory } = usePaymentHistory(
    Object.keys(filters).length > 0 ? filters : undefined
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  /**
   * Handles refreshing the payment history
   */
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshPaymentHistory();
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handles applying filters
   */
  const applyFilters = async () => {
    setIsRefreshing(true);
    setIsFilterOpen(false);
    try {
      await refreshPaymentHistory(filters);
    } finally {
      setIsRefreshing(false);
    }
  };

  /**
   * Handles clearing filters
   */
  const clearFilters = async () => {
    setStatusFilter(undefined);
    setStartDate(undefined);
    setEndDate(undefined);
    setIsFilterOpen(false);
    setIsRefreshing(true);
    try {
      await refreshPaymentHistory(undefined);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Payment History</h2>
        <div className="flex gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={Object.keys(filters).length > 0 ? "bg-primary/10" : ""}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {Object.keys(filters).length > 0 && (
                  <span className="ml-1 rounded-full bg-primary w-5 h-5 text-xs flex items-center justify-center text-primary-foreground">
                    {Object.keys(filters).length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h3 className="font-medium">Filter Payments</h3>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="succeeded">Succeeded</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {startDate ? format(startDate, 'PPP') : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {endDate ? format(endDate, 'PPP') : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? (
              <Spinner className="mr-2 h-4 w-4" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner className="h-8 w-8" />
        </div>
      ) : error ? (
        <div className="text-center py-8 text-destructive">
          <p>Failed to load payment history</p>
          <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      ) : paymentHistory.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No payment history found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Date</th>
                <th className="text-left py-2 font-medium">Transaction ID</th>
                <th className="text-left py-2 font-medium">Amount</th>
                <th className="text-left py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="border-b last:border-0">
                  <td className="py-3">{formatDate(payment.created)}</td>
                  <td className="py-3">
                    <code className="bg-secondary px-2 py-1 rounded text-xs">
                      {payment.id}
                    </code>
                  </td>
                  <td className="py-3">{formatAmount(payment.amount, payment.currency)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${payment.status === 'succeeded'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : payment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
