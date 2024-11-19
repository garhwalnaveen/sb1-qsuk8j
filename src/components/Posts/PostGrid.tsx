import { format } from 'date-fns';
import { Calendar, BarChart3 } from 'lucide-react';
import { platformConfigs } from '../../lib/platforms/config';
import type { Database } from '../../lib/database.types';

type Post = Database['public']['Tables']['posts']['Row'];

interface PostGridProps {
  posts: Post[];
  onPostSelect: (postId: string) => void;
  selectedPostId: string | null;
}

export default function PostGrid({ posts, onPostSelect, selectedPostId }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No posts found
      </div>
    );
  }

  return (
    <div className="divide-y">
      {posts.map((post) => (
        <div
          key={post.id}
          className={`p-4 hover:bg-gray-50 cursor-pointer ${
            selectedPostId === post.id ? 'bg-blue-50' : ''
          }`}
          onClick={() => onPostSelect(post.id)}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-medium line-clamp-2" dangerouslySetInnerHTML={{ __html: post.content }} />
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(post.scheduled_for), 'MMM d, yyyy h:mm a')}
                </div>
                <div className="flex items-center space-x-1">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: platformConfigs[platform].color }}
                      title={platformConfigs[platform].displayName}
                    />
                  ))}
                </div>
              </div>
            </div>
            {post.status === 'published' && (
              <div className="flex items-center text-sm text-gray-500">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analytics
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}