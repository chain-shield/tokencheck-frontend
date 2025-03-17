import TokenAnalysis from './token-analysis';

// Mock data for development - will be replaced with actual API call
const mockTokenData = {
  token_score: "3 - Likely Legit",
  reason: "This token demonstrates several positive indicators including locked liquidity, reasonable token distribution, and verifiable social presence. The contract code shows standard ERC20 implementation with some anti-bot measures that are within acceptable bounds. While there are some concentration risks in token holdings, the overall profile suggests legitimate intentions and proper security measures.",
  token_name: "Example Token",
  token_address: "0x1234567890abcdef1234567890abcdef12345678",
  token_symbol: "EX",
  token_dex: "Uniswap V2",
  possible_scam: false,
  reason_possible_scam: "The token contract implements standard security practices and shows no signs of malicious code. The liquidity is properly locked, and the team's identity is verifiable through social channels.",
  could_legitimately_justify_suspicious_code: true,
  reason_could_or_couldnt_justify_suspicious_code: "The contract includes anti-bot measures that, while potentially restrictive, are commonly used in legitimate projects to prevent manipulation during launch. These mechanisms are temporary and controlled by a time-lock contract.",
  top_holder_percentage_tokens_held: 15.5,
  percentage_of_tokens_locked_or_burned: 60.0,
  percentage_liquidity_locked_or_burned: 95.0,
  liquidity_in_usd: 250000,
  has_website: true,
  has_twitter_or_discord: true,
  is_token_sellable: true
};

// Add example token addresses for static generation
export function generateStaticParams() {
  return [
    { tokenAddress: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' }, // WBTC
    { tokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }, // WETH
    { tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' }, // USDC
    { tokenAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }, // DAI
    { tokenAddress: '0x1234567890abcdef1234567890abcdef12345678' }, // Example token
  ];
}

export default function TokenPage({ params }: { params: { tokenAddress: string } }) {
  // In a real application, we would fetch this data server-side
  // For now, we're using mock data
  return <TokenAnalysis tokenAddress={params.tokenAddress} tokenData={mockTokenData} />;
}