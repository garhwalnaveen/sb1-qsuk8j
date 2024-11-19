import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, BarChart3, Loader2 } from 'lucide-react';
import { usePostStore } from '../stores/postStore';
import PostPreview from '../components/Posts/PostPreview';
import PostGrid from '../components/Posts/PostGrid';
import { format } from 'date-fns';

export default function Dashboard() {
  const navigate = useNavigate();
  const { posts, loading, loadPosts } = usePostStore();
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const scheduledPosts = posts.filter(post => post.status === 'scheduled');
  const publishedPosts = posts.filter(post => post.status === 'published');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage and monitor your social media posts</p>
        </div>
        <button
          onClick={() => navigate('/posts/new')}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Scheduled Posts</h2>
            </div>
            <PostGrid
              posts={scheduledPosts}
              onPostSelect={setSelectedPost}
              selectedPostId={selectedPost}
            />
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Published Posts</h2>
            </div>
            <PostGrid
              posts={publishedPosts}
              onPostSelect={setSelectedPost}
              selectedPostId={selectedPost}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedPost ? (
            <PostPreview postId={selectedPost} />
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Select a post to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}