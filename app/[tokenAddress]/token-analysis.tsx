'use client';

import { AlertTriangle, CheckCircle, ExternalLink, Shield, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

type TokenData = {
  token_score: string;
  reason: string;
  token_name: string;
  token_address: string;
  token_symbol: string;
  token_dex: string;
  possible_scam: boolean;
  reason_possible_scam: string;
  could_legitimately_justify_suspicious_code: boolean;
  reason_could_or_couldnt_justify_suspicious_code: string;
  top_holder_percentage_tokens_held: number;
  percentage_of_tokens_locked_or_burned: number;
  percentage_liquidity_locked_or_burned: number;
  liquidity_in_usd: number;
  has_website: boolean;
  has_twitter_or_discord: boolean;
  is_token_sellable: boolean;
};

function ScoreIndicator({ score }: { score: string }) {
  const scoreNum = parseInt(score.split(' ')[0]);
  const colors = {
    0: 'bg-red-500',
    1: 'bg-orange-500',
    2: 'bg-yellow-500',
    3: 'bg-green-500',
    4: 'bg-emerald-500'
  };

  return (
    <div className="flex items-center gap-4 p-6 rounded-lg bg-card">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colors[scoreNum as keyof typeof colors]}`}>
        <span className="text-2xl font-bold text-white">{scoreNum}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold">{score}</h2>
        <p className="text-muted-foreground">Token Safety Score</p>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: any; description?: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
        </div>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
}

export default function TokenAnalysis({ tokenAddress, tokenData }: { tokenAddress: string; tokenData: TokenData }) {
  const data = tokenData;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Token Basic Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{data.token_name} ({data.token_symbol})</h1>
          <p className="text-muted-foreground font-mono">{data.token_address}</p>
        </div>

        {/* Score and Analysis */}
        <div className="mb-12">
          <ScoreIndicator score={data.token_score} />
          <Card className="mt-4 p-6">
            <h3 className="font-semibold mb-2">Analysis Summary</h3>
            <p className="text-muted-foreground">{data.reason}</p>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-4 mb-12">
          <MetricCard
            title="Liquidity (USD)"
            value={`$${data.liquidity_in_usd.toLocaleString()}`}
            icon={Wallet}
          />
          <MetricCard
            title="DEX"
            value={data.token_dex || 'Not Listed'}
            icon={ExternalLink}
          />
        </div>

        {/* Security Metrics */}
        <div className="space-y-8 mb-12">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Security Analysis</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tokens Locked/Burned</span>
                <span className="font-semibold">{data.percentage_of_tokens_locked_or_burned}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Liquidity Locked/Burned</span>
                <span className="font-semibold">{data.percentage_liquidity_locked_or_burned}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Top Holder Percentage</span>
                <span className="font-semibold">{data.top_holder_percentage_tokens_held}%</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Liquidity (USD)</span>
                <span className="font-semibold">${data.liquidity_in_usd.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Trading Status</span>
                <span className="font-semibold">{data.is_token_sellable ? 'Tradable' : 'Not Tradable'}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Risk Assessment</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                {data.possible_scam ? (
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                ) : (
                  <Shield className="h-6 w-6 text-green-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold mb-2">Scam Analysis</h4>
                  <p className="text-muted-foreground">{data.reason_possible_scam}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-4">
                {data.could_legitimately_justify_suspicious_code ? (
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <h4 className="font-semibold mb-2">Code Analysis</h4>
                  <p className="text-muted-foreground">{data.reason_could_or_couldnt_justify_suspicious_code}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Additional Checks</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${data.has_website ? 'text-green-500' : 'text-red-500'}`} />
                <span>Website</span>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckCircle className={`h-5 w-5 ${data.has_twitter_or_discord ? 'text-green-500' : 'text-red-500'}`} />
                <span>Social Media</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}