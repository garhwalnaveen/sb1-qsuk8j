import { useState } from 'react';
import { usePostStore } from '../stores/postStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PostPreview from '../components/Posts/PostPreview';

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const { posts } = usePostStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <p className="mt-1 text-gray-600">View and manage your scheduled posts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 flex items-center justify-between border-b">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}
              {days.map((day, dayIdx) => {
                const dayPosts = posts.filter(
                  (post) => isSameDay(new Date(post.scheduled_for), day)
                );

                return (
                  <div
                    key={day.toString()}
                    className={`bg-white p-2 ${
                      isToday(day) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <p
                        className={`text-sm ${
                          isToday(day)
                            ? 'text-blue-600 font-semibold'
                            : 'text-gray-500'
                        }`}
                      >
                        {format(day, 'd')}
                      </p>
                      <div className="mt-1 space-y-1">
                        {dayPosts.map((post) => (
                          <button
                            key={post.id}
                            onClick={() => setSelectedPost(post.id)}
                            className={`w-full text-left p-1 text-xs rounded ${
                              selectedPost === post.id
                                ? 'bg-blue-100 text-blue-800'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <p className="truncate">
                              {post.content.replace(/<[^>]*>/g, '')}
                            </p>
                            <p className="text-gray-500">
                              {format(new Date(post.scheduled_for), 'h:mm a')}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div>
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