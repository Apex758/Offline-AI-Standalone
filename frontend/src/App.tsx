import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { QueueProvider } from './contexts/QueueContext';
import { LicenseProvider } from './contexts/LicenseContext';
import { LicenseGate } from './components/LicenseGate';
import ToastContainer from './components/ToastContainer';
import { useTheme } from './hooks/useTheme';
import { HeartbeatLoader } from './components/ui/HeartbeatLoader';
import { initSpellCheck } from './utils/spellCheck';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Apply theme
  useTheme();

  // Apply global font-size scaling on <html> so all rem-based sizes scale proportionally
  const { settings } = useSettings();
  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [settings.fontSize]);

  // Pre-warm spell check dictionary in background
  useEffect(() => {
    requestIdleCallback?.(() => initSpellCheck()) ?? setTimeout(() => initSpellCheck(), 2000);
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HeartbeatLoader className="w-12 h-12 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </HashRouter>
  );
}

function App() {
  return (
    <LicenseProvider>
      <LicenseGate>
        <SettingsProvider>
          <NotificationProvider>
            <WebSocketProvider>
              <QueueProvider>
                <AppContent />
                <ToastContainer />
              </QueueProvider>
            </WebSocketProvider>
          </NotificationProvider>
        </SettingsProvider>
      </LicenseGate>
    </LicenseProvider>
  );
}

export default App;