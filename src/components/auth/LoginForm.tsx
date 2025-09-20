'use client';
import React, { useState } from 'react';

const LoginForm = ({ setAuthMode }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
      <p className="text-gray-600 mt-2 mb-4 md:mb-8 dark:text-gray-400">Login to continue to your account.</p>
      <form className="flex flex-col gap-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="email" placeholder="Enter your email" type="email"/>
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Password</label>
            <button onClick={() => setAuthMode('forgotPassword')} className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500" type="button">Forgot password?</button>
          </div>
          <div className="relative">
            <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="password" placeholder="Enter your password" type={showPassword ? 'text' : 'password'}/>
              <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
              >
                  <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
              </button>
          </div>
        </div>
        <button className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
