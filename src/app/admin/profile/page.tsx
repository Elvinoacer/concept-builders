"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const AdminProfilePage = () => {
  const { data: session, status } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      const fetchUserProfile = async () => {
        try {
          // In a real application, you would fetch user details from your API
          // For now, we'll use the session data
          setUserProfile(session.user);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    } else if (status === 'unauthenticated') {
      setLoading(false);
      setError('You must be logged in to view this page.');
    } else if (status === 'loading') {
      setLoading(true);
    }
  }, [session, status]);

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <p className="text-red-500 text-xl font-semibold mb-4">Error: {error}</p>
          <p className="text-gray-600 dark:text-gray-400">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-8">No profile data available.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Admin Profile</h1>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Name:</p>
            <p className="text-gray-900 dark:text-white">{userProfile.name}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Email:</p>
            <p className="text-gray-900 dark:text-white">{userProfile.email}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">Role:</p>
            <p className="text-gray-900 dark:text-white">{userProfile.role}</p>
          </div>
          {/* Add more profile fields as needed */}
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
