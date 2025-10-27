'use client';
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react'; // Import Lucide icons
import { toast } from 'sonner'; // Import toast from sonner

const PasswordSettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const passwordFields = [
    {
      id: 'current-password',
      label: 'Current Password',
      name: 'currentPassword',
      state: showCurrentPassword,
      setter: setShowCurrentPassword,
    },
    {
      id: 'new-password',
      label: 'New Password',
      name: 'newPassword',
      state: showNewPassword,
      setter: setShowNewPassword,
    },
    {
      id: 'confirm-password',
      label: 'Confirm New Password',
      name: 'confirmPassword',
      state: showConfirmPassword,
      setter: setShowConfirmPassword,
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true on submission
    toast.dismiss(); // Clear any existing toasts

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwords.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });

      if (response.ok) {
        toast.success('Password updated successfully');
        setPasswords({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        const data = await response.json();
        toast.error(data.message || data.error || 'Failed to update password');
      }
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false after submission
    }
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Change Password
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Update your password here.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 md:mt-6 grid grid-cols-1 gap-x-6 gap-y-6 max-w-2xl">
        {passwordFields.map(({ id, label, name, state, setter }) => (
          <div key={id} className="relative">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              htmlFor={id}
            >
              {label}
            </label>
            <input
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4 pr-12"
              id={id}
              name={name}
              type={state ? 'text' : 'password'}
              value={passwords[name as keyof typeof passwords]}
              onChange={handleChange}
              disabled={loading} // Disable input when loading
            />
            <button
              type="button"
              onClick={() => setter(!state)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400 top-4 md:top-6"
              disabled={loading} // Disable button when loading
            >
              {state ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        ))}
        <div className="pt-4">
          <button
            className="flex items-center justify-center rounded-md h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-cyan-500 transition-colors"
            type="submit"
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Update Password'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordSettings;

