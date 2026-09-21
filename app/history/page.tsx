'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Calendar, Tag, TrendingUp } from 'lucide-react';
import PlatformPreview from '@/components/PlatformPreview';
import type { User } from '@supabase/supabase-js';

interface ContentItem {
  id: string;
  topic: string;
  platforms: string[];
  tone: string;
  content_type: string;
  generated_content: Record<string, {
    content: string;
    hashtags: string[];
    imagePrompt: string;
  }>;
  status: string;
  created_at: string;
  user_rating?: number;
  performance_metrics?: any;
}

export default function HistoryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        loadHistory(user.id);
      }
    };

    getUser();
  }, [supabase, router]);

  const loadHistory = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setContentItems(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const rateContent = async (itemId: string, rating: number) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .update({ user_rating: rating })
        .eq('id', itemId);

      if (!error) {
        setContentItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, user_rating: rating } : item
          )
        );
        if (selectedItem?.id === itemId) {
          setSelectedItem({ ...selectedItem, user_rating: rating });
        }
      }
    } catch (error) {
      console.error('Error rating content:', error);
    }
  };

  if (!user || loading) {
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
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Content History
          </h1>
          <p className="text-gray-300 mt-2">
            {contentItems.length} content {contentItems.length === 1 ? 'item' : 'items'} generated
          </p>
        </div>

        {contentItems.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl shadow-xl p-12 text-center border border-gray-700">
            <Calendar className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No Content History
            </h3>
            <p className="text-gray-400 mb-6">
              You haven't generated any content yet. Start creating!
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Generate Content
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Content List */}
            <div className="lg:col-span-1 space-y-4">
              {contentItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'border-purple-500 bg-gray-750'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {item.topic}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {item.tone}
                    </span>
                  </div>
                  {item.user_rating && (
                    <div className="mt-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={star <= item.user_rating! ? 'text-yellow-400' : 'text-gray-600'}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Content Details */}
            <div className="lg:col-span-2">
              {selectedItem ? (
                <div className="space-y-6">
                  {/* Metadata */}
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">{selectedItem.topic}</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Tone:</span>
                        <span className="text-white ml-2 capitalize">{selectedItem.tone}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white ml-2 capitalize">{selectedItem.content_type}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white ml-2">
                          {new Date(selectedItem.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white ml-2 capitalize">{selectedItem.status}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <span className="text-gray-400 text-sm block mb-2">Rate this content:</span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => rateContent(selectedItem.id, star)}
                            className={`text-2xl transition-colors ${
                              star <= (selectedItem.user_rating || 0)
                                ? 'text-yellow-400 hover:text-yellow-300'
                                : 'text-gray-600 hover:text-gray-500'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Platform Previews */}
                  {Object.entries(selectedItem.generated_content).map(([platform, data]) => (
                    <PlatformPreview
                      key={platform}
                      platform={platform as any}
                      content={data.content}
                      hashtags={data.hashtags}
                      imagePrompt={data.imagePrompt}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                  <TrendingUp className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    Select a Content Item
                  </h3>
                  <p className="text-gray-400">
                    Click on any content item from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
