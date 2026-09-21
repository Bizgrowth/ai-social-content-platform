# AI Social Content Generator - SaaS Platform

A robust AI-powered social media content generator that creates platform-optimized content for Facebook, Instagram, LinkedIn, and Twitter. Built with Next.js 16, Supabase, and Claude AI.

![AI Social Content Generator](https://img.shields.io/badge/AI-Powered-purple) ![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan) ![Supabase](https://img.shields.io/badge/Supabase-Database-green)

## Features

### 🚀 Content Generation
- **Multi-Platform Support**: Generate optimized content for Facebook, Instagram, LinkedIn, and Twitter
- **Smart Prompts**: Guided form fields for tone, target audience, content type, and keywords
- **Image Suggestions**: AI-generated image prompts for visual content
- **Hashtag Generation**: Platform-specific hashtag recommendations
- **Character Limits**: Automatic optimization for each platform's limits

### 🧠 AI Intelligence
- **Brand Voice Learning**: AI analyzes your website and content to learn your brand voice (database ready)
- **Performance Tracking**: Track engagement metrics and content performance (database ready)
- **Pattern Recognition**: Discover what works best for your audience (database ready)
- **Continuous Improvement**: AI learns from your ratings and performance data

### 💾 Data Management
- **Content History**: Save and organize all generated content
- **User Authentication**: Secure login with email/password or Google OAuth
- **Multi-Tenant Architecture**: Support for teams and organizations
- **Row Level Security**: Database-level security with Supabase RLS
- **Content Rating**: Rate your content to help AI learn

### 📊 Advanced Features (Database Ready)
- Brand Intelligence profiles
- Social media account connections
- Content calendar and scheduling
- Analytics and performance snapshots
- Team collaboration
- AI insights and recommendations

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude API (claude-3-haiku-20240307)
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Anthropic API key ([Get one here](https://console.anthropic.com/))
- Supabase account ([Sign up here](https://supabase.com))

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd testapp
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase**

Follow the detailed guide in `SUPABASE_SETUP.md`:
- Create a Supabase project
- Run the database schema from `database-schema.sql`
- Configure authentication providers
- Get your API credentials

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up / Login**
   - Create an account with email or Google OAuth
   - Access the dashboard after authentication

2. **Generate Content**
   - Select one or more platforms (Facebook, Instagram, LinkedIn, Twitter)
   - Fill in the smart form with topic, tone, audience, and keywords
   - Click "Generate Content"

3. **Review & Rate**
   - View generated content for each platform
   - Copy to clipboard with one click
   - Rate content to help AI learn your preferences

4. **View History**
   - Access `/history` to see all generated content
   - Filter and search through your content library
   - Re-rate content as needed

## Platform-Specific Features

### Twitter
- Maximum 280 characters
- Concise and punchy content
- 2-3 hashtags maximum
- Clear call-to-action

### Instagram
- Up to 2,200 characters
- Visual storytelling focus
- 5-10 relevant hashtags
- Engaging first sentence
- Image prompt included

### Facebook
- Up to 63,206 characters (practical limit: 500-1000)
- First 2-3 sentences visible before "See More"
- Engagement-focused content
- 2-5 hashtags
- Questions to boost interaction

### LinkedIn
- Up to 3,000 characters
- Professional yet personable
- Insights and value-driven
- 3-5 hashtags
- Minimal emoji use

## Project Structure

```
testapp/
├── app/
│   ├── api/
│   │   └── generate/          # Content generation API endpoint
│   ├── auth/
│   │   └── callback/          # OAuth callback handler
│   ├── dashboard/             # Main content generation dashboard
│   ├── history/               # Content history viewer
│   ├── login/                 # Login page
│   ├── signup/                # Sign up page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── components/
│   └── PlatformPreview.tsx    # Platform content preview component
├── lib/
│   └── supabase/
│       ├── client.ts          # Client-side Supabase client
│       └── server.ts          # Server-side Supabase client
├── database-schema.sql        # Complete database schema
├── middleware.ts              # Auth middleware
├── SUPABASE_SETUP.md         # Supabase setup guide
└── README.md                  # This file
```

## Database Schema

The application uses a comprehensive database schema designed for a full-featured SaaS platform:

### Core Tables
- **profiles**: User accounts with subscription tiers and credits
- **brand_profiles**: Brand intelligence (voice, colors, keywords, target audience)
- **content_items**: Generated content with performance tracking
- **ai_insights**: AI learning and pattern recognition
- **performance_patterns**: What works best per platform

### Advanced Features (Ready to Implement)
- **social_accounts**: Connected social media accounts
- **scheduled_posts**: Content calendar
- **analytics_snapshots**: Daily performance metrics
- **team_members**: Collaboration features

See `database-schema.sql` for the complete schema with indexes and RLS policies.

## Features Roadmap

### ✅ Implemented
- [x] Multi-platform content generation
- [x] User authentication (email + Google OAuth)
- [x] Content saving to database
- [x] Content history viewer
- [x] Dark mode UI
- [x] Platform-specific optimization
- [x] Image prompt generation
- [x] Content rating system

### 🚧 Next Steps
- [ ] Brand Intelligence (analyze website/content)
- [ ] Social media account connections
- [ ] Content scheduling
- [ ] Analytics dashboard
- [ ] Performance prediction
- [ ] Team collaboration
- [ ] Subscription tiers
- [ ] Credits system
- [ ] AI learning from performance data
- [ ] Best posting time recommendations

## API Endpoints

### POST `/api/generate`

Generates social media content for selected platforms.

**Request Body:**
```json
{
  "platforms": ["facebook", "instagram", "linkedin", "twitter"],
  "topic": "Launching our new product",
  "tone": "professional",
  "targetAudience": "Small business owners",
  "callToAction": "Visit our website",
  "keywords": "innovation, quality",
  "contentType": "promotional",
  "includeHashtags": true,
  "includeEmojis": false
}
```

**Response:**
```json
{
  "content": [
    {
      "platform": "facebook",
      "content": "Generated post content...",
      "hashtags": ["#innovation", "#quality"],
      "imagePrompt": "A professional image showing..."
    }
  ],
  "contentItemId": "uuid-of-saved-content"
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Your Anthropic API key for Claude AI | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | Yes |

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings:
   - `ANTHROPIC_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

The app will automatically deploy on every push to your main branch.

### Deploy to Other Platforms

This is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- DigitalOcean
- AWS
- Google Cloud

## Best Practices

1. **API Key Security**: Never commit your `.env.local` file. Always use environment variables for sensitive data.

2. **Content Review**: Always review generated content before posting to ensure it aligns with your brand voice.

3. **Image Selection**: Use the generated image prompts with tools like:
   - DALL-E
   - Midjourney
   - Stable Diffusion
   - Canva AI

4. **Rate Limiting**: The Anthropic API has rate limits. Consider implementing caching or rate limiting for production use.

5. **Cost Management**: Monitor your Anthropic API usage to manage costs effectively.

## Customization

### Adding New Platforms

1. Add the platform type to `app/page.tsx`:
   ```typescript
   type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'newplatform';
   ```

2. Add platform specifications in `app/api/generate/route.ts`:
   ```typescript
   const platformSpecs: Record<Platform, PlatformSpecs> = {
     // ... existing platforms
     newplatform: {
       maxLength: 1000,
       bestPractices: ['...'],
       imageRequired: false,
     },
   };
   ```

3. Add platform configuration in `components/PlatformPreview.tsx`

### Customizing Tone Options

Edit the tone select options in `app/page.tsx` to add or modify tone styles.

### Styling

The application uses Tailwind CSS. Customize colors and styles in:
- `tailwind.config.ts` - Global theme configuration
- Component files - Individual component styles

## Troubleshooting

### API Key Error

If you see "ANTHROPIC_API_KEY is not configured":
1. Ensure `.env.local` file exists in the root directory
2. Verify the API key is correct
3. Restart the development server after adding the key

### Supabase Connection Issues

1. Double-check your Supabase URL and anon key
2. Ensure you ran the database schema from `database-schema.sql`
3. Check that Row Level Security policies are enabled
4. See `SUPABASE_SETUP.md` for detailed troubleshooting

### Content Generation Fails

1. Check your Anthropic API key is valid
2. Verify you have API credits remaining
3. Check the browser console and server logs for detailed errors

### Build Errors

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Check TypeScript errors: `npm run lint`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Security

- Environment variables are never committed to version control
- Supabase Row Level Security (RLS) protects all data
- Authentication is handled by Supabase Auth
- API keys are stored securely

## Support

For issues or questions:
- Check `SUPABASE_SETUP.md` for setup issues
- Review the database schema in `database-schema.sql`
- Check Supabase logs for database errors
- Review Next.js logs for API errors

## License

Private - All rights reserved

## Credits

- Built with [Next.js](https://nextjs.org/)
- Powered by [Claude AI](https://www.anthropic.com/claude)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
