import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart2, Settings, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Analytics', href: '/analytics', icon: BarChart2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const location = useLocation();
  const { signOut, profile } = useAuthStore();

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-blue-600">SocialHub</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                      location.pathname === item.href
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            {profile && (
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-700">{profile.full_name || profile.username}</p>
                  <p className="text-gray-500">@{profile.username}</p>
                </div>
                <button
                  onClick={() => signOut()}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}