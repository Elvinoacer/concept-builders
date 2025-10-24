
'use client';
import React, { useState } from 'react';

interface EmailVerificationFormProps {
  setAuthMode: React.Dispatch<React.SetStateAction<string>>;
  email?: string; // Optional email prop
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({ setAuthMode, email }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResendVerification = async () => {
    if (!email) {
      setError('Email not available to resend verification link.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Verification link sent! Please check your inbox.');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to resend verification link.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Verify your email</h2>
      <p className="text-gray-600 mt-2 mb-4 md:mb-8 dark:text-gray-400">We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to activate your account.</p>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <button
        className="flex w-full justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-400 py-3 px-4 text-sm font-semibold text-white shadow-sm hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
        type="button"
        onClick={handleResendVerification}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Resend verification link'}
      </button>
      <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
        Already verified?
        <button onClick={() => setAuthMode('login')} className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 ml-1">
          Login
        </button>
      </p>
    </div>
  );
};

export default EmailVerificationForm;
