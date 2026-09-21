'use client';

import { useEffect } from 'react';
import { Sparkles, Zap, Brain, TrendingUp, Clock, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/dashboard');
      }
    };

    checkUser();
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Social
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/login"
            className="px-4 py-2 text-gray-200 hover:text-white transition-colors"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Create Viral Social Media Content in Seconds
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            AI-powered platform that generates platform-optimized content for Facebook, Instagram, LinkedIn, and Twitter. Save time, boost engagement, and let AI learn your brand voice.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Start Creating Free
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold text-lg border border-gray-700 hover:bg-gray-700 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-gray-300">
              Generate platform-specific content for all your social media channels in seconds, not hours.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI That Learns</h3>
            <p className="text-gray-300">
              Our AI learns your brand voice, analyzes performance, and continuously improves your content strategy.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Track Performance</h3>
            <p className="text-gray-300">
              Monitor engagement, discover patterns, and optimize your content with advanced analytics.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Schedule & Automate</h3>
            <p className="text-gray-300">
              Plan your content calendar and schedule posts across all platforms from one place.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Team Collaboration</h3>
            <p className="text-gray-300">
              Work together with your team, share brand profiles, and maintain consistent messaging.
            </p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Image Suggestions</h3>
            <p className="text-gray-300">
              Get AI-generated image prompts optimized for each platform's visual requirements.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Social Media?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of creators and businesses using AI to create engaging content
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all"
          >
            Start Free Today
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800 mt-20">
        <div className="text-center text-gray-400">
          <p>&copy; 2026 AI Social Content Generator. Powered by Claude AI.</p>
        </div>
      </footer>
    </div>
  );
}
