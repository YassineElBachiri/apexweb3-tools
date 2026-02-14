# ApexWeb3 Tools - Development Environment

## Environment Variables

Copy this file to `.env.local` and fill in your API keys.

```bash
cp .env.example .env.local
```

## For Development (Using Mock Data)

Set this to use mock data without API keys:

```
NEXT_PUBLIC_USE_MOCK_DATA=true
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## For Production (Real API Integration)

Get API keys from:
- CoinGecko: https://www.coingecko.com/en/api
- Moralis: https://moralis.io/
- GoPlus Security: https://gopluslabs.io/
- Alchemy: https://www.alchemy.com/
- Web3 Career: https://web3.career/api

Then set:

```
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_COINGECKO_API_KEY=your_key_here
NEXT_PUBLIC_MORALIS_API_KEY=your_key_here
NEXT_PUBLIC_GOPLUS_API_KEY=your_key_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_key_here
WEB3_CAREER_TOKEN=your_token_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```
