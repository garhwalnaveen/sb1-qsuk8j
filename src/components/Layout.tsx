import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import Navigation from './Navigation';

export default function Layout() {
  const profile = useAuthStore(state => state.profile);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}