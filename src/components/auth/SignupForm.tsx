
'use client';
import React, { useState } from 'react';

const SignupForm = ({ setAuthMode }: { setAuthMode: React.Dispatch<React.SetStateAction<string>> }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h2>
      <p className="text-gray-600 mt-2 mb-4 md:mb-8 dark:text-gray-400">Get started with a free account.</p>
      <form className="flex flex-col gap-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">Name</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="name" placeholder="Enter your name" type="text"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="email" placeholder="Enter your email" type="email"/>
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'}/>
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 top-6 dark:text-gray-400"
            >
                <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                </span>
            </button>
        </div>
        <button onClick={() => setAuthMode('emailVerification')} className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors" type="submit">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;

