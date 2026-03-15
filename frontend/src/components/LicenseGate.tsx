import React, { useState, useEffect } from 'react';
import { useLicense } from '../contexts/LicenseContext';
import { HeartbeatLoader } from './ui/HeartbeatLoader';

export function LicenseGate({ children }: { children: React.ReactNode }) {
  const { isLicensed, loading, error, activate } = useLicense();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Trigger gated update check once licensed
  useEffect(() => {
    if (isLicensed) {
      window.electronAPI?.checkForUpdates?.();
    }
  }, [isLicensed]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HeartbeatLoader className="w-12 h-12 mx-auto" />
          <p className="mt-4 text-gray-600">Checking license...</p>
        </div>
      </div>
    );
  }

  if (isLicensed) return <>{children}</>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await activate(email.trim(), code.trim().toUpperCase());
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">OECS Learning Hub</h1>
          <p className="text-gray-500 mt-2">Enter your license code to activate the app.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="license-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="license-email"
              type="email"
              placeholder="you@school.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="license-code" className="block text-sm font-medium text-gray-700 mb-1">
              License code
            </label>
            <input
              id="license-code"
              type="text"
              placeholder="OECS-XXXX-XXXX-XXXX"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors font-mono tracking-wider"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
          >
            {submitting ? 'Validating...' : 'Activate'}
          </button>
        </form>
      </div>
    </div>
  );
}
