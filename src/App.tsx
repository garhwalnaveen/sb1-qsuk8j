import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BulkSchedule from './pages/BulkSchedule';
import Auth from './pages/Auth';
import Calendar from './pages/Calendar';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import NewPost from './pages/Posts/NewPost';
import PlatformCallback from './pages/auth/PlatformCallback';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  const loadProfile = useAuthStore(state => state.loadProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadProfile();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [loadProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">
            {error.includes('environment variables') 
              ? 'Please configure Supabase credentials in the .env file.'
              : error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback/:platform" element={<PlatformCallback />} />
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/posts/new" element={<NewPost />} />
            <Route path="/bulk-schedule" element={<BulkSchedule />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;