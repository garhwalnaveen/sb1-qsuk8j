import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/Posts/PostForm';
import { usePostStore } from '../../stores/postStore';
import { useAuthStore } from '../../stores/authStore';
import type { PlatformType } from '../../lib/platforms/types';

interface PostFormData {
  content: string;
  scheduledFor: string;
  platforms: PlatformType[];
}

export default function NewPost() {
  const navigate = useNavigate();
  const createPost = usePostStore(state => state.createPost);
  const user = useAuthStore(state => state.user);

  const handleSubmit = async (data: PostFormData) => {
    if (!user) {
      console.error('User not authenticated');
      return;
    }
    
    try {
      await createPost({
        user_id: user.id,
        content: data.content,
        scheduled_for: data.scheduledFor,
        platforms: data.platforms,
        status: 'scheduled',
        media_urls: [],
        platform_post_ids: {},
      });

      navigate('/');
    } catch (error) {
      console.error('Failed to create post:', error);
      throw error; // Let the form handle the error
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Post</h1>
        <p className="mt-1 text-gray-600">
          Compose and schedule your post across multiple platforms
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}