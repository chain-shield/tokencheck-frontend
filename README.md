# ChainShield.ai

**AI-Powered Smart Contract Security Auditing Platform**

ChainShield combines advanced AI technology with expert security analysis to deliver comprehensive smart contract audits in minutes, not weeks. For pennies on the dollar. Protect your protocol with enterprise-grade security assessments.

## 🚀 Overview

With over 760 breaches in 2024 resulting in $2.36 billion in losses, robust security shouldn't be a luxury reserved for the largest projects. ChainShield democratizes smart contract security by making comprehensive audits accessible to every protocol.

### Key Features

- **AI-Powered Analysis**: Expertly fine-tuned AI agents scan your Solidity code for known vulnerabilities and emerging threats
- **Expert Human Validation**: Security experts validate AI findings and provide detailed remediation guidance
- **Lightning Fast**: 99.9% accuracy rate while delivering results 80% faster than traditional manual audits
- **Cost Effective**: Save 80% compared to traditional audit firms
- **Comprehensive Reports**: Detailed security reports with actionable remediation guidance
- **Multiple Frameworks**: Support for Foundry, Hardhat, and Brownie
- **Enterprise Ready**: Scalable solutions for projects of all sizes

### Statistics

- 🎯 **99.9%** Accuracy Rate
- 💰 **Save 80%** Over Manual Audits  
- ⚡ **1 Day** Average Audit Time
- 🔍 **1000+** Critical Bugs Found

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **SWR** - Data fetching with caching
- **React Hook Form** - Form management with validation
- **Zod** - Schema validation

### Authentication & Payments
- **OAuth Integration** - Google, GitHub, X (Twitter)
- **Stripe** - Payment processing
- **JWT** - Secure authentication tokens

### Infrastructure
- **Google Cloud Platform** - Cloud hosting and services
- **Docker** - Containerization
- **Kubernetes** - Container orchestration

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (legal)/           # Legal pages (Terms, Privacy)
│   ├── (protected)/       # Protected dashboard pages
│   ├── audit-request/     # Audit request flow
│   ├── api-plans/         # Subscription plans
│   └── about/             # About page
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── audit-request/    # Audit-specific components
├── context/              # React context providers
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and models
├── utils/                # Helper functions
├── types/                # TypeScript type definitions
├── __tests__/            # Test files
└── k8s/                  # Kubernetes deployment configs
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker (for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/chainshield-ai.git
   cd chainshield-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   NEXT_PUBLIC_SUBSCRIPTIONS_API_URL=your_subscriptions_api_url
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   GITHUB_CLIENT_ID=your_github_oauth_client_id
   GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
   TWITTER_CLIENT_ID=your_twitter_oauth_client_id
   TWITTER_CLIENT_SECRET=your_twitter_oauth_client_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure
- **Unit Tests**: Component and utility function tests
- **Integration Tests**: API and authentication flow tests
- **E2E Tests**: Complete user journey tests

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t chainshield-frontend .
```

### Run Container
```bash
docker run -p 3000:3000 chainshield-frontend
```

## ☸️ Kubernetes Deployment

Deploy to Kubernetes using the provided configurations:

```bash
# Apply all Kubernetes configs
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n develop
kubectl get services -n develop
```

### Kubernetes Resources
- **Deployment**: Application pods with rolling updates
- **Service**: Load balancer for pod traffic
- **Ingress**: External traffic routing
- **ConfigMap**: Environment configuration
- **Certificate**: TLS/SSL certificates

## 📊 Features

### Audit Request Flow
1. **Submit Code**: Upload Solidity smart contracts
2. **AI Analysis**: Automated vulnerability detection
3. **Expert Review**: Human validation and recommendations
4. **Detailed Report**: Comprehensive security assessment

### Subscription Plans
- **Free**: Limited audit previews
- **Pro ($997/audit)**: Full audits with 48-hour turnaround
- **Enterprise**: Custom pricing for large organizations

### Dashboard Features
- **Audit History**: Track all submitted audits
- **API Key Management**: Generate and manage API keys
- **Payment History**: View billing and transaction records
- **Account Settings**: Manage profile and preferences

## 🔐 Security

- **HTTPS/TLS**: All communications encrypted
- **OAuth 2.0**: Secure third-party authentication
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Comprehensive data sanitization
- **Rate Limiting**: API abuse prevention
- **CORS**: Cross-origin request security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Use semantic commit messages
- Update documentation as needed

## 📄 License

This project is proprietary software owned by ChainShield. All rights reserved.

## 📞 Support

- **Email**: support@chainshield.ai
- **Website**: [chainshield.ai](https://chainshield.ai)
- **Discord**: [Join our community](https://discord.gg/KtrWV7zw3H)
- **X (Twitter)**: [@ChainShieldAI](https://x.com/ChainShieldAI)

## 🗺️ Roadmap

- [ ] **Continuous Monitoring**: Automated code scanning on every commit
- [ ] **CI/CD Integration**: Seamless pipeline integration
- [ ] **Multi-chain Support**: Expand beyond Ethereum
- [ ] **Advanced Analytics**: Enhanced reporting and insights
- [ ] **Team Collaboration**: Multi-user audit management

---

**Securing the future of DeFi, one smart contract at a time.**
