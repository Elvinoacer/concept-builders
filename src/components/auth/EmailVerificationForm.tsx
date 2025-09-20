
'use client';
import React from 'react';

const EmailVerificationForm = () => {

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
      <p className="text-gray-600 mt-2 mb-4 md:mb-8 dark:text-gray-400">We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.</p>
        <button className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors" type="submit">
          Resend verification link
        </button>
    </div>
  );
};

export default EmailVerificationForm;
