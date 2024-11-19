import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Upload, Plus, Trash2, AlertCircle } from 'lucide-react';
import { usePostStore } from '../stores/postStore';
import { useAuthStore } from '../stores/authStore';
import PostForm from '../components/Posts/PostForm';
import { addDays, format, parse } from 'date-fns';

interface BulkPost {
  id: string;
  content: string;
  scheduledFor: string;
  platforms: string[];
}

export default function BulkSchedule() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const createPost = usePostStore(state => state.createPost);
  const [posts, setPosts] = useState<BulkPost[]>([]);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.csv'],
    },
    multiple: false,
    onDrop: async (files) => {
      setImporting(true);
      setError(null);
      try {
        const file = files[0];
        const text = await file.text();
        const lines = text.split('\n').filter(line => line.trim());
        
        // Skip header row and parse CSV
        const newPosts = lines.slice(1).map((line, index) => {
          const [content, date, time, platformsList] = line.split(',').map(s => s.trim());
          const dateTime = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
          
          return {
            id: crypto.randomUUID(),
            content,
            scheduledFor: format(dateTime, "yyyy-MM-dd'T'HH:mm"),
            platforms: platformsList.split(';').map(p => p.toLowerCase()),
          };
        });

        setPosts(newPosts);
      } catch (err) {
        setError('Failed to parse CSV file. Please ensure it matches the required format.');
      } finally {
        setImporting(false);
      }
    },
  });

  const addEmptyPost = () => {
    const lastPost = posts[posts.length - 1];
    const scheduledFor = lastPost
      ? format(addDays(new Date(lastPost.scheduledFor), 1), "yyyy-MM-dd'T'HH:mm")
      : format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm");

    setPosts([
      ...posts,
      {
        id: crypto.randomUUID(),
        content: '',
        scheduledFor,
        platforms: [],
      },
    ]);
  };

  const removePost = (id: string) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const updatePost = (id: string, data: Partial<BulkPost>) => {
    setPosts(posts.map(post => 
      post.id === id ? { ...post, ...data } : post
    ));
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      await Promise.all(posts.map(post => 
        createPost({
          user_id: user.id,
          content: post.content,
          scheduled_for: post.scheduledFor,
          platforms: post.platforms,
          status: 'scheduled',
          media_urls: [],
          platform_post_ids: {},
        })
      ));

      navigate('/');
    } catch (err) {
      setError('Failed to schedule posts. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Bulk Schedule Posts</h1>
        <p className="mt-1 text-gray-600">
          Schedule multiple posts at once or import from CSV
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drop your CSV file here, or click to select
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Format: content,date,time,platforms (e.g., "Hello world,2024-03-01,09:00,twitter;linkedin")
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {posts.map((post, index) => (
          <div key={post.id} className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium">Post {index + 1}</h3>
              <button
                onClick={() => removePost(post.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <PostForm
                initialData={post}
                onSubmit={async (data) => updatePost(post.id, data)}
                submitLabel="Save"
                hideSubmit
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEmptyPost}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
        >
          <Plus className="h-5 w-5 mx-auto" />
        </button>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={posts.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Schedule {posts.length} Posts
          </button>
        </div>
      </div>
    </div>
  );
}