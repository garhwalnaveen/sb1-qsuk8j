import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Share2, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { platformConfigs } from '../lib/platforms/config';

export default function Analytics() {
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.rpc('get_user_analytics', {
          user_id: user.id,
          start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date().toISOString(),
        });

        if (error) throw error;
        setAnalytics(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <BarChart3 className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Failed to load analytics: {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="mt-1 text-gray-600">
          Track your social media performance across platforms
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Impressions
              </p>
              <p className="text-2xl font-semibold">
                {analytics?.total_impressions?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Engagement
              </p>
              <p className="text-2xl font-semibold">
                {analytics?.total_engagement?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Share2 className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Shares</p>
              <p className="text-2xl font-semibold">
                {analytics?.total_shares?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-orange-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">
                Total Comments
              </p>
              <p className="text-2xl font-semibold">
                {analytics?.total_comments?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Platform Breakdown</h2>
          <div className="space-y-4">
            {Object.entries(analytics?.platform_stats || {}).map(([platform, stats]: [string, any]) => (
              <div key={platform} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: platformConfigs[platform].color }}
                />
                <span className="flex-1 text-sm font-medium">
                  {platformConfigs[platform].displayName}
                </span>
                <span className="text-sm text-gray-500">
                  {stats.engagement_rate.toFixed(2)}% Engagement Rate
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Posts</h2>
          <div className="space-y-4">
            {(analytics?.top_posts || []).map((post: any) => (
              <div key={post.id} className="border-b pb-4 last:border-0 last:pb-0">
                <p className="text-sm line-clamp-2">{post.content}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                  <span>{post.total_engagement.toLocaleString()} engagements</span>
                  <span>{post.platforms.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}