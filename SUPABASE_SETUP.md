# Supabase Setup Guide

This guide will help you set up Supabase for the AI Social Content Generator application.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: AI Social Content Generator (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Free tier is sufficient to start
5. Click "Create new project" and wait for it to initialize (2-3 minutes)

## Step 2: Run the Database Schema

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `database-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
6. You should see a success message confirming all tables were created

## Step 3: Get Your API Credentials

1. In your Supabase project dashboard, click on **Settings** (gear icon) in the left sidebar
2. Click on **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

## Step 4: Configure Environment Variables

1. In your project root, create a `.env.local` file (if it doesn't exist)
2. Copy the contents from `.env.local.example`
3. Fill in your Supabase credentials:

```env
# Anthropic API Key (you already have this)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your_anon_key_here
```

4. Save the file

## Step 5: Enable Authentication Providers (Optional)

### Email Authentication (Already Enabled by Default)
Email/password authentication works out of the box.

### Google OAuth (Optional)
To enable Google sign-in:

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Find **Google** and click **Enable**
3. Follow Supabase's guide to set up Google OAuth:
   - Create a Google Cloud project
   - Configure OAuth consent screen
   - Create OAuth 2.0 credentials
   - Add the authorized redirect URI from Supabase
4. Paste your Google Client ID and Client Secret into Supabase
5. Save

## Step 6: Update Vercel Environment Variables

If you're deploying to Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings** → **Environment Variables**
3. Add the same environment variables from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy your application

## Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/signup`
3. Create a test account
4. Try generating some content
5. Check your Supabase dashboard → **Table Editor** → **content_items** to see the saved content

## Troubleshooting

### "Invalid API key" or "Project not found"
- Double-check that you copied the correct Project URL and anon key
- Make sure there are no extra spaces in your `.env.local` file
- Restart your development server after updating environment variables

### "Row Level Security policy violation"
- Make sure you ran the complete `database-schema.sql` script
- Check that RLS policies were created successfully in **Authentication** → **Policies**

### Google OAuth not working
- Verify the redirect URI matches exactly: `https://your-project.supabase.co/auth/v1/callback`
- Make sure your Google OAuth app is in production mode (not testing)
- Check that authorized domains include your deployment domain

### Database connection issues
- Verify your database is active in the Supabase dashboard
- Check that you have an internet connection
- Try refreshing your Supabase project API credentials

## Database Schema Overview

Your database includes these main tables:

- **profiles**: User accounts with subscription tiers
- **brand_profiles**: Brand intelligence (voice, colors, keywords)
- **content_items**: All generated content with performance tracking
- **ai_insights**: AI learning and pattern recognition
- **performance_patterns**: What works best per platform
- **social_accounts**: Connected social media accounts
- **scheduled_posts**: Content calendar
- **analytics_snapshots**: Daily performance metrics
- **team_members**: Collaboration features

## Next Steps

Once Supabase is set up, you can:

1. ✅ User authentication works
2. ✅ Content is automatically saved to database
3. ✅ View content history at `/history`
4. 🚧 Implement Brand Intelligence features
5. 🚧 Add social media account connections
6. 🚧 Build analytics dashboard
7. 🚧 Implement content scheduling

## Security Notes

- Never commit your `.env.local` file to version control
- The `anon` key is safe to expose in client-side code (it's protected by Row Level Security)
- Your database password should be kept secret
- Consider enabling 2FA on your Supabase account

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Next.js + Supabase Guide: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
