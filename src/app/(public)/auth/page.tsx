import React from 'react';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-gray-950">
      <AuthForm />
    </div>
  );
};

export default AuthPage;
