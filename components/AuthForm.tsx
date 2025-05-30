
import React, { useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { HCAPTCHA_SITE_KEY } from '../constants';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService'; // For user lookup/creation
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

// Simplified user storage for demo. In real app, use backend.
const USERS_DB_KEY = 'aamva_users_db';

const getUsersFromStorage = (): User[] => {
  return storageService.getItem<User[]>(USERS_DB_KEY) || [];
};

const saveUsersToStorage = (users: User[]) => {
  storageService.setItem<User[]>(USERS_DB_KEY, users);
};

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hcaptchaToken, setHcaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!hcaptchaToken) {
      setError('Please complete the hCaptcha verification.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    const users = getUsersFromStorage();

    if (mode === 'signup') {
      if (users.find(user => user.email === email)) {
        setError('User with this email already exists.');
        return;
      }
      const newUser: User = { id: Date.now().toString(), email }; // Password not stored in this demo
      saveUsersToStorage([...users, newUser]);
      auth.login(newUser); // Auto-login after signup
      setSuccessMessage('Signup successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } else { // Login mode
      const existingUser = users.find(user => user.email === email);
      // In a real app, you'd verify the password hash here
      if (!existingUser) {
        setError('Invalid email or password.');
        return;
      }
      auth.login(existingUser);
      setSuccessMessage('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-gray-800 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-center text-teal-400 mb-8">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
          />
        </div>
        {mode === 'signup' && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-white"
            />
          </div>
        )}
        <div className="flex justify-center">
           <HCaptcha
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={setHcaptchaToken}
            theme="dark" // Or "light"
          />
        </div>
       
        {error && (
          <div className="flex items-center p-3 text-sm text-red-300 bg-red-800 rounded-md">
            <AlertTriangle size={20} className="mr-2" />
            {error}
          </div>
        )}
        {successMessage && (
          <div className="flex items-center p-3 text-sm text-green-300 bg-green-800 rounded-md">
            <CheckCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-500 disabled:bg-gray-500 transition-colors"
          >
            {isLoading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')}
          </button>
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <a href="#/signup" className="font-medium text-teal-400 hover:text-teal-300">
              Sign up
            </a>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <a href="#/login" className="font-medium text-teal-400 hover:text-teal-300">
              Login
            </a>
          </>
        )}
      </p>
    </div>
  );
};
