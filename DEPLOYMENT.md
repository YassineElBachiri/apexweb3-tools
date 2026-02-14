# Deployment Guide - ApexWeb3 Tools

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- API keys (optional for production)

### Step 1: Push to GitHub

```bash
cd c:\Users\hp\Desktop\ApexWeb3-tools
git init
git add .
git commit -m "Initial commit - ApexWeb3 Tools"
git branch -M main
git remote add origin https://github.com/yourusername/apexweb3-tools.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `NEXT_PUBLIC_USE_MOCK_DATA=false` (for production)
   - `NEXT_PUBLIC_COINGECKO_API_KEY=your_key`
   - `NEXT_PUBLIC_MORALIS_API_KEY=your_key`
   - `NEXT_PUBLIC_GOPLUS_API_KEY=your_key`
   - `NEXT_PUBLIC_ALCHEMY_API_KEY=your_key`
   - `NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app`
5. Click "Deploy"

### Step 3: Custom Domain (Optional)

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

---

## 🐳 Deploy with Docker

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
docker build -t apexweb3-tools .
docker run -p 3000:3000 apexweb3-tools
```

---

## ☁️ Deploy to Other Platforms

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod`

### Railway

1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add environment variables
4. Deploy automatically

### AWS Amplify

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Configure build settings
4. Deploy

---

## 🔑 API Keys Setup

### CoinGecko API
1. Visit [coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for free tier
3. Get API key from dashboard

### Moralis API
1. Visit [moralis.io](https://moralis.io/)
2. Create account
3. Get API key from dashboard

### GoPlus Security API
1. Visit [gopluslabs.io](https://gopluslabs.io/)
2. Request API access
3. Get API key

### Alchemy API
1. Visit [alchemy.com](https://www.alchemy.com/)
2. Create app
3. Get API key

---

## 📊 Performance Optimization

### Before Deployment

1. **Build and Test**
   ```bash
   npm run build
   npm start
   ```

2. **Check Bundle Size**
   ```bash
   npm run build
   # Check .next/static folder size
   ```

3. **Test Production Build**
   - Test all routes
   - Check API responses
   - Verify mobile responsiveness

### After Deployment

1. **Monitor Performance**
   - Use Vercel Analytics
   - Set up error tracking (Sentry)
   - Monitor API usage

2. **Optimize Images**
   - Use next/image for all images
   - Compress static assets

3. **Enable Caching**
   - Configure CDN
   - Set proper cache headers

---

## 🔒 Security Checklist

- [ ] Environment variables secured
- [ ] API keys not in code
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] Security headers configured

---

## 📈 Post-Deployment

### Analytics Setup

Add to `app/layout.tsx`:

```typescript
import Script from 'next/script'

// Add in <body>:
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### Monitoring

1. Set up Vercel Analytics
2. Configure error tracking
3. Monitor API rate limits
4. Track user engagement

---

## 🎯 Launch Checklist

- [ ] All features tested
- [ ] API keys configured
- [ ] Custom domain set up
- [ ] Analytics installed
- [ ] SEO verified
- [ ] Mobile tested
- [ ] Performance optimized
- [ ] Error tracking enabled
- [ ] Backup strategy in place
- [ ] Documentation updated

---

## 🆘 Troubleshooting

### Build Fails
- Check Node.js version (20+)
- Clear `.next` folder
- Delete `node_modules` and reinstall

### API Errors
- Verify API keys
- Check rate limits
- Ensure CORS configured

### Performance Issues
- Enable caching
- Optimize images
- Use CDN

---

Your ApexWeb3 Tools platform is ready for production! 🚀
