/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Use custom tsconfig file if specified
  typescript: {
    tsconfigPath: process.env.NEXT_TSCONFIG || 'tsconfig.json',
  },
  // Exclude test files from the build
  webpack: (config, { isServer }) => {
    // Exclude test files and Jest setup files
    config.module.rules.push({
      test: /\.(test|spec)\.(js|jsx|ts|tsx)$|jest-setup\.js$|jest\.d\.ts$|global\.d\.ts$/,
      loader: 'ignore-loader',
    });

    // Exclude the __mocks__ directory
    if (config.resolve && config.resolve.alias) {
      config.resolve.alias['__mocks__'] = false;
    }

    return config;
  },
};

module.exports = nextConfig;
