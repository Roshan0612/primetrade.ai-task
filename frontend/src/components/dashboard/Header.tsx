'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
          Task Manager
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/tasks"
              className="text-gray-700 hover:text-blue-600 font-medium transition"
            >
              Tasks
            </Link>
          </nav>

          <div className="flex items-center gap-4 pl-6 border-l border-gray-200">
            {user && (
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.username}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
