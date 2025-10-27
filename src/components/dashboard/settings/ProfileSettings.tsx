'use client';
import React, { useState, useEffect } from 'react';

const ProfileSettings = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await fetch('/api/settings/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile({
          fullName: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/settings/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userProfile),
    });

    if (response.ok) {
      // Handle successful update
      console.log('Profile updated successfully');
    } else {
      // Handle error
      console.error('Failed to update profile');
    }
  };

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">
        Personal Information
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
        Update your personal details here.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 max-w-2xl">
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="full-name"
          >
            Full Name
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="full-name"
            name="fullName"
            type="text"
            value={userProfile.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2">
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="email"
            name="email"
            type="email"
            value={userProfile.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            htmlFor="phone-number"
          >
            Phone Number
          </label>
          <input
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-11 px-4"
            id="phone-number"
            name="phoneNumber"
            type="tel"
            value={userProfile.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="md:col-span-2 pt-4">
          <button
            className="flex items-center justify-center rounded-md h-10 px-6 bg-gradient-to-r from-blue-600 to-cyan-400 text-white text-sm font-semibold shadow-sm hover:from-blue-700 hover:to-cyan-500"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;

