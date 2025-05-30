
import React from 'react';
import { AuthForm } from '../components/AuthForm';

export const LoginPage: React.FC = () => {
  return (
    <div>
      <AuthForm mode="login" />
    </div>
  );
};
