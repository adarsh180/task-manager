# Deployment Guide

## Netlify Deployment

### 1. Environment Variables
Add these in Netlify dashboard (Site settings > Environment variables):

```
DATABASE_URL=postgresql://neondb_owner:npg_qg4QaxPuF8Eh@ep-misty-bush-abior1j2-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
OPENROUTER_API_KEY=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
JWT_SECRET=super-secret-jwt-key-for-production-2024
NEXTAUTH_URL=https://your-app-name.netlify.app
NEXTAUTH_SECRET=your-nextauth-secret-here
NODE_ENV=production
```

### 2. Deploy Steps
1. Push code to GitHub
2. Connect repository to Netlify
3. Build settings are auto-detected from `netlify.toml`
4. Add environment variables
5. Deploy

### 3. Post-Deployment
- Visit: `https://your-app-name.netlify.app/api/init` to initialize database
- Test registration and login
- Verify AI chat functionality

## Vercel Deployment (Alternative)

1. Connect GitHub repository
2. Add same environment variables
3. Deploy automatically

## Domain Setup
Update `NEXTAUTH_URL` with your actual domain after deployment.