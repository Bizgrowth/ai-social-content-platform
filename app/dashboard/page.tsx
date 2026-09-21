'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Facebook, Instagram, Linkedin, Twitter, Image as ImageIcon, Loader2, LogOut, History } from 'lucide-react';
import PlatformPreview from '@/components/PlatformPreview';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

interface FormData {
  platforms: Platform[];
  topic: string;
  tone: string;
  targetAudience: string;
  callToAction: string;
  keywords: string;
  contentType: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

interface GeneratedContent {
  platform: Platform;
  content: string;
  hashtags: string[];
  imagePrompt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    platforms: [],
    topic: '',
    tone: 'professional',
    targetAudience: '',
    callToAction: '',
    keywords: '',
    contentType: 'promotional',
    includeHashtags: true,
    includeEmojis: false,
  });

  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const platformIcons = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const togglePlatform = (platform: Platform) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const generateContent = async () => {
    if (formData.platforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }
    if (!formData.topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);

      // Auto-save the generated content
      if (data.contentItemId) {
        console.log('Content saved with ID:', data.contentItemId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="w-10 h-10 text-purple-400" />
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI Social Content Generator
              </h1>
              <p className="text-gray-300 text-sm mt-1">
                Welcome back, {user.user_metadata?.full_name || user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push('/history')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <History className="w-5 h-5" />
              History
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-200 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-white">Smart Content Builder</h2>

            {/* Platform Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-3">
                Select Platforms *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(platformIcons) as Platform[]).map(platform => {
                  const Icon = platformIcons[platform];
                  const isSelected = formData.platforms.includes(platform);
                  return (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`flex items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                          : 'border-gray-600 hover:border-gray-500 text-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium capitalize">{platform}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Topic */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Topic / Message *
              </label>
              <textarea
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="E.g., Launching our new eco-friendly product line"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400 resize-none"
                rows={3}
              />
            </div>

            {/* Tone */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Tone & Style
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual & Friendly</option>
                <option value="enthusiastic">Enthusiastic & Energetic</option>
                <option value="inspirational">Inspirational</option>
                <option value="humorous">Humorous</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="E.g., Young professionals, Small business owners"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Content Type */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Content Type
              </label>
              <select
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white"
              >
                <option value="promotional">Promotional</option>
                <option value="announcement">Announcement</option>
                <option value="educational">Educational</option>
                <option value="engagement">Engagement / Question</option>
                <option value="testimonial">Testimonial / Review</option>
                <option value="behind-the-scenes">Behind the Scenes</option>
              </select>
            </div>

            {/* Call to Action */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Call to Action
              </label>
              <input
                type="text"
                value={formData.callToAction}
                onChange={(e) => setFormData({ ...formData, callToAction: e.target.value })}
                placeholder="E.g., Visit our website, Sign up now, Learn more"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="E.g., sustainability, innovation, quality"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              />
            </div>

            {/* Options */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHashtags}
                  onChange={(e) => setFormData({ ...formData, includeHashtags: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-200">Include Hashtags</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeEmojis}
                  onChange={(e) => setFormData({ ...formData, includeEmojis: e.target.checked })}
                  className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-sm font-medium text-gray-200">Include Emojis</span>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                {error}
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={generateContent}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            {generatedContent.length === 0 && !loading && (
              <div className="bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-700">
                <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  No Content Yet
                </h3>
                <p className="text-gray-400">
                  Fill out the form and generate AI-powered content for your selected platforms
                </p>
              </div>
            )}

            {generatedContent.map((content, index) => (
              <PlatformPreview
                key={`${content.platform}-${index}`}
                platform={content.platform}
                content={content.content}
                hashtags={content.hashtags}
                imagePrompt={content.imagePrompt}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
