'use client';

import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

export const ProfileCard = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 fade-in-up card-float">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Profile</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Name</p>
          <p className="text-lg font-semibold text-gray-900">
            {user.firstName} {user.lastName}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Username</p>
          <p className="text-lg font-semibold text-gray-900">{user.username}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="text-lg font-semibold text-gray-900">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Member Since</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(new Date(user.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
};
