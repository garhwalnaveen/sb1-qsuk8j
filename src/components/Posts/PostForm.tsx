import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { platformConfigs } from '../../lib/platforms/config';
import RichTextEditor from '../Editor/RichTextEditor';
import { usePlatformStore } from '../../stores/platformStore';
import type { PlatformType } from '../../lib/platforms/types';

interface PostFormData {
  content: string;
  scheduledFor: string;
  platforms: PlatformType[];
}

interface PostFormProps {
  initialData?: Partial<PostFormData>;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel?: string;
  hideSubmit?: boolean;
}

export default function PostForm({ 
  initialData, 
  onSubmit, 
  submitLabel = 'Schedule Post', 
  hideSubmit = false 
}: PostFormProps) {
  const { accounts } = usePlatformStore();
  const [content, setContent] = useState(initialData?.content || '');
  const [error, setError] = useState<string | null>(null);
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<PostFormData>({
    defaultValues: {
      content: initialData?.content || '',
      scheduledFor: initialData?.scheduledFor || format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      platforms: initialData?.platforms || [],
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      setError(null);
      await onSubmit({
        ...data,
        content,
      });
    } catch (err) {
      setError((err as Error).message || 'Failed to create post');
    }
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    // TODO: Implement actual image upload to storage
    return URL.createObjectURL(file);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Content
        </label>
        <RichTextEditor
          content={content}
          onChange={setContent}
          onImageUpload={handleImageUpload}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Schedule
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            {...register('scheduledFor', { required: 'Schedule time is required' })}
            className="block w-full rounded-md border-gray-300 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        {errors.scheduledFor && (
          <p className="mt-1 text-sm text-red-600">{errors.scheduledFor.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platforms
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {accounts.map((account) => {
            const config = platformConfigs[account.platform];
            return (
              <label
                key={account.id}
                className="relative flex cursor-pointer rounded-lg border p-4 focus:outline-none"
                style={{ borderColor: config.color + '40' }}
              >
                <input
                  type="checkbox"
                  {...register('platforms', { 
                    required: 'Select at least one platform' 
                  })}
                  value={account.platform}
                  className="sr-only"
                />
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-sm">
                      <p className="font-medium" style={{ color: config.color }}>
                        {config.displayName}
                      </p>
                      <p className="text-gray-500">@{account.platformUsername}</p>
                    </div>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
        {errors.platforms && (
          <p className="mt-1 text-sm text-red-600">{errors.platforms.message}</p>
        )}
      </div>

      {!hideSubmit && (
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}