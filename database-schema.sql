-- Supabase Database Schema for AI Social Media Platform
-- Created: 2026-09-21

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =======================
-- USERS & AUTHENTICATION
-- =======================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  website_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- BRAND INTELLIGENCE
-- =======================

-- Brand Profiles (learns your brand voice)
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  website_url TEXT,
  brand_voice TEXT, -- casual, professional, humorous, etc.
  tone_analysis JSONB, -- AI-analyzed tone characteristics
  color_palette JSONB, -- primary, secondary, accent colors
  keywords TEXT[], -- brand keywords
  target_audience TEXT,
  content_pillars TEXT[], -- main topics/themes
  writing_samples TEXT[], -- examples of brand content
  visual_style JSONB, -- image/design preferences
  competitors TEXT[],
  last_analyzed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- CONTENT MANAGEMENT
-- =======================

-- Generated Content History
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES brand_profiles(id) ON DELETE SET NULL,

  -- Content Details
  topic TEXT NOT NULL,
  platforms TEXT[] NOT NULL, -- ['facebook', 'instagram', 'linkedin', 'twitter']
  tone TEXT,
  content_type TEXT, -- promotional, educational, etc.

  -- AI Generated Content (per platform)
  generated_content JSONB NOT NULL, -- {platform: {content, hashtags, imagePrompt}}

  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,

  -- Performance Tracking
  performance_metrics JSONB, -- {platform: {likes, shares, comments, reach, engagement_rate}}

  -- Learning & Improvement
  user_rating INTEGER CHECK (user_rating >= 1 AND user_rating <= 5),
  user_edits TEXT, -- what user changed
  performed_well BOOLEAN, -- AI tracks if content performed well

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- AI KNOWLEDGE BASE
-- =======================

-- AI Learning & Insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,

  insight_type TEXT NOT NULL, -- 'best_performing_topic', 'optimal_posting_time', 'audience_preference'
  platform TEXT, -- specific platform or 'all'
  insight_data JSONB NOT NULL, -- the actual insight
  confidence_score DECIMAL(3,2), -- 0.00 to 1.00

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Performance Patterns
CREATE TABLE performance_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_profile_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,

  pattern_type TEXT NOT NULL, -- 'hashtag_performance', 'posting_time', 'content_length'
  platform TEXT NOT NULL,
  pattern_data JSONB NOT NULL,
  sample_size INTEGER, -- how many posts this is based on
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- SOCIAL MEDIA CONNECTIONS
-- =======================

-- Connected Social Accounts
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES brand_profiles(id) ON DELETE SET NULL,

  platform TEXT NOT NULL, -- 'facebook', 'instagram', 'linkedin', 'twitter'
  account_name TEXT,
  account_id TEXT, -- platform's account ID
  access_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  token_expires_at TIMESTAMPTZ,

  is_active BOOLEAN DEFAULT true,
  last_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- CONTENT CALENDAR
-- =======================

-- Scheduled Posts
CREATE TABLE scheduled_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,

  scheduled_time TIMESTAMPTZ NOT NULL,
  platform TEXT NOT NULL,
  post_content TEXT NOT NULL,
  media_urls TEXT[],
  hashtags TEXT[],

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  published_post_id TEXT, -- ID from social platform
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- ANALYTICS
-- =======================

-- Platform Analytics Snapshots
CREATE TABLE analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  social_account_id UUID REFERENCES social_accounts(id) ON DELETE CASCADE,

  snapshot_date DATE NOT NULL,
  metrics JSONB NOT NULL, -- {followers, engagement_rate, reach, impressions, top_posts}

  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(social_account_id, snapshot_date)
);

-- =======================
-- TEAM & COLLABORATION
-- =======================

-- Team Members (for multi-user accounts)
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- the account owner
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE, -- the team member

  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  permissions JSONB, -- granular permissions

  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =======================
-- INDEXES FOR PERFORMANCE
-- =======================

CREATE INDEX idx_content_items_user_id ON content_items(user_id);
CREATE INDEX idx_content_items_status ON content_items(status);
CREATE INDEX idx_content_items_created_at ON content_items(created_at DESC);
CREATE INDEX idx_brand_profiles_user_id ON brand_profiles(user_id);
CREATE INDEX idx_ai_insights_brand_profile_id ON ai_insights(brand_profile_id);
CREATE INDEX idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);
CREATE INDEX idx_analytics_snapshots_social_account ON analytics_snapshots(social_account_id, snapshot_date DESC);

-- =======================
-- ROW LEVEL SECURITY (RLS)
-- =======================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own brands" ON brand_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own brands" ON brand_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own content" ON content_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own content" ON content_items FOR ALL USING (auth.uid() = user_id);

-- =======================
-- FUNCTIONS
-- =======================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_brand_profiles_updated_at BEFORE UPDATE ON brand_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
