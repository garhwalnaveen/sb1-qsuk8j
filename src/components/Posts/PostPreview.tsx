import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Share2, MessageSquare, Eye } from 'lucide-react';
import { usePostStore } from '../../stores/postStore';
import { platformConfigs } from '../../lib/platforms/config';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/database.types';

type Analytics = Database['public']['Tables']['analytics']['Row'];

interface PostPreviewProps {
  postId: string;
}

export default function PostPreview({ postId }: PostPreviewProps) {
  const post = usePostStore(state => state.posts.find(p => p.id === postId));
  const [analytics, setAnalytics] = useState<Analytics[]>([]);

  useEffect(() => {
    if (post?.status === 'published') {
      const fetchAnalytics = async () => {
        const { data } = await supabase
          .from('analytics')
          .select('*')
          .eq('post_id', postId);
        
        if (data) {
          setAnalytics(data);
        }
      };

      fetchAnalytics();
    }
  }, [postId, post?.status]);

  if (!post) {
    return null;
  }

  const totalEngagement = analytics.reduce(
    (acc, curr) => ({
      likes: acc.likes + curr.likes,
      shares: acc.shares + curr.shares,
      comments: acc.comments + curr.comments,
      impressions: acc.impressions + curr.impressions,
    }),
    { likes: 0, shares: 0, comments: 0, impressions: 0 }
  );

  return (
    <div className="bg-white rounded-lg shadow divide-y">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
          <div className="flex items-center space-x-1">
            {post.platforms.map((platform) => (
              <span
                key={platform}
                className="px-2 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: platformConfigs[platform].color + '20',
                  color: platformConfigs[platform].color 
                }}
              >
                {platformConfigs[platform].displayName}
              </span>
            ))}
          </div>
        </div>

        <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(post.scheduled_for), 'PPP p')}
        </div>
      </div>

      {post.status === 'published' && (
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Eye className="w-4 h-4 mr-1" />
                Impressions
              </div>
              <p className="text-2xl font-semibold">{totalEngagement.impressions}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <MessageSquare className="w-4 h-4 mr-1" />
                Comments
              </div>
              <p className="text-2xl font-semibold">{totalEngagement.comments}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <Share2 className="w-4 h-4 mr-1" />
                Shares
              </div>
              <p className="text-2xl font-semibold">{totalEngagement.shares}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                Likes
              </div>
              <p className="text-2xl font-semibold">{totalEngagement.likes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}