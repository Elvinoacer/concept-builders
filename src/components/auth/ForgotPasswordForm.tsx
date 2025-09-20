
'use client';
import React from 'react';

const ForgotPasswordForm = ({ setAuthMode }) => {

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Forgot your password?</h2>
      <p className="text-gray-600 mt-2 mb-4 md:mb-8 dark:text-gray-400">No problem! Enter your email address below and we'll send you a link to reset it.</p>
      <form className="flex flex-col gap-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
          <input className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-600 focus:ring-blue-600 sm:text-sm h-12 px-4 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" id="email" placeholder="Enter your email" type="email"/>
        </div>
        <button className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors" type="submit">
          Send reset link
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        Remember your password?
        <button onClick={() => setAuthMode('login')} className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1">
          Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;
