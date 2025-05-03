'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSubscriptionPlans } from '@/hooks/use-subscription-plans';
import { useUserData } from '@/hooks/use-user-data';
import { useRouter, useSearchParams } from 'next/navigation';
import { SubscriptionPlan } from '@/lib/models/models';

export default function ApiPlansPage() {
  const { plans, subscribe, isLoading, error } = useSubscriptionPlans();
  const { user } = useUserData();
  const searchParams = useSearchParams();
  const router = useRouter();
  console.log('Plans:', plans, 'Loading:', isLoading, 'Error:', error);

  const handleSubscribe = async (planId: string) => {

    if (user) {
      const { url } = await subscribe(planId);
      if (url) window.location.assign(url);
    } else {

      const params = setQueryParams(planId);
      console.log('params', params.toString());
      router.push(`/login?${params.toString()}`);
    }

  }

  const CallToActionText = () => {
    if (user) return "Subscribe Now"
    else return "Login to Subscribe"

  }

  const setQueryParams = (planId: string): URLSearchParams => {

    const params = new URLSearchParams(searchParams.toString());
    params.set('type', 'stripe');
    params.set('plan', planId);
    return params;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">API Plans & Pricing</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include access to our
            AI-powered token analysis API.
          </p>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading subscription plans...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Error loading subscription plans</p>
            <p className="text-muted-foreground">{error instanceof Error ? error.message : 'An unknown error occurred'}</p>
          </div>
        )}

        {!isLoading && !error && !!plans && plans.length > 0 && (
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto justify-center">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-card rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${plan.name === 'Basic'
                  ? 'border-2 border-primary relative'
                  : 'border border-border'
                  }`}
              >
                {plan.name === 'Basic' && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Popular
                  </div>
                )}

                <div className="p-6 flex flex-col h-full">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold">${(plan.price / 100).toFixed(2)}</span>
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{plan.description}</p>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {plan.features?.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={plan.price === 0 ? 'outline' : 'default'}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {CallToActionText()}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !error && (!plans || plans.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No subscription plans available at this time. Please check back later.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
          <p className="text-muted-foreground mb-6">
            Contact our sales team to learn more about our Enterprise solutions or
            to discuss custom requirements.
          </p>
          <Link href="/contact">
            <Button variant="outline" size="lg">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
