'use client';

/**
 * Token Analysis Component
 *
 * This component displays detailed security analysis for a cryptocurrency token,
 * including risk assessment, security metrics, and other key information.
 *
 * It visualizes the token's safety score, liquidity information, security analysis,
 * risk assessment, and additional verification checks.
 */

import { AlertTriangle, CheckCircle, ExternalLink, Shield, Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

// Import the TokenData interface from our hook
import { TokenData } from '@/hooks/use-token-data';

/**
 * ScoreIndicator component displays the token's safety score with appropriate color coding
 *
 * @param score - The token safety score string (e.g., "3 - Likely Legit")
 * @returns A visual indicator of the token's safety score
 */
function ScoreIndicator({ score }: { score: string }) {
  // Extract the numeric part of the score (e.g., "3" from "3 - Likely Legit")
  const scoreNum = parseInt(score.split(' ')[0]);

  // Color mapping for different score levels
  const colors = {
    0: 'bg-red-500',      // High risk/scam
    1: 'bg-orange-500',   // Suspicious
    2: 'bg-yellow-500',   // Caution
    3: 'bg-green-500',    // Likely legitimate
    4: 'bg-emerald-500'   // Very safe
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

/**
 * MetricCard component displays a key metric with an icon
 * Used for showing token statistics like liquidity, DEX, etc.
 *
 * @param title - The title of the metric
 * @param value - The value to display (can be string or number)
 * @param icon - The icon component to display
 * @param description - Optional description text
 * @returns A card displaying the metric information
 */
function MetricCard({ title, value, icon: Icon, description }: {
  title: string;
  value: string | number;
  icon: React.ElementType; // More specific type than 'any'
  description?: string
}) {
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

/**
 * Main TokenAnalysis component that displays comprehensive token security analysis
 *
 * @param tokenAddress - The address of the token being analyzed
 * @param tokenData - The analysis data for the token
 * @returns A detailed token analysis UI with security metrics and risk assessment
 */
export default function TokenAnalysis({ tokenAddress, tokenData }: { tokenAddress: string; tokenData: TokenData }) {
  const data = tokenData; // Alias for easier reference

  return (
    <div className="container mx-auto px-4 py-12" data-testid="token-analysis">
      <div className="max-w-4xl mx-auto">
        {/* Token Basic Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="token-name">{data.token_name} ({data.token_symbol})</h1>
          <p className="text-muted-foreground font-mono" data-testid="token-address">{data.token_address}</p>
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