import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './i18n';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { User } from './types';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { QueueProvider } from './contexts/QueueContext';
import { TabBusyProvider } from './contexts/TabBusyContext';
import { StickyNoteProvider } from './contexts/StickyNoteContext';
import { CapabilitiesProvider } from './contexts/CapabilitiesContext';
import { LicenseProvider } from './contexts/LicenseContext';
import { ReminderProvider } from './contexts/ReminderContext';
import { LicenseGate } from './components/LicenseGate';
import ToastContainer from './components/ToastContainer';
import { useTheme } from './hooks/useTheme';
import { useDisplayFilters } from './hooks/useDisplayFilters';
import { usePreload } from './hooks/usePreload';
import { HeartbeatLoader } from './components/ui/HeartbeatLoader';
import { EngineStatusProvider } from './contexts/EngineStatusContext';
import { TimetableProvider } from './contexts/TimetableContext';

const SetupWizard = lazy(() => import('./components/SetupWizard/SetupWizard'));
function AppContent() {
  // Login bypassed — auto-login as default user
  const defaultUser: User = { id: 1, username: 'admin', name: 'Admin', role: 'admin' } as User;
  const [user, setUser] = useState<User | null>(defaultUser);
  const [loading, setLoading] = useState(false);

  // Seed localStorage['user'] so components that read it (e.g. EducatorInsights)
  // can resolve the correct teacher/user IDs for achievement lookups.
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      localStorage.setItem('user', JSON.stringify(defaultUser));
    }
  }, []);

  // Apply theme & display filters (brightness / warm tone)
  useTheme();
  useDisplayFilters();
  // Preload LLM and TTS models once at app startup
  usePreload();
  // Engine status polling is now handled by EngineStatusProvider

  // Apply global font-size scaling on <html> so all rem-based sizes scale proportionally
  const { settings, hasCompletedSetup } = useSettings();
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    return () => { document.documentElement.style.fontSize = ''; };
  }, [settings.fontSize]);
  // Sync i18n language with user setting
  useEffect(() => {
    if (i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language, i18n]);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Login disabled — just reload instead of logging out
    setUser(defaultUser);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <HeartbeatLoader className="w-12 h-12 mx-auto" />
          <p className="mt-4 text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      {!hasCompletedSetup && (
        <Suspense fallback={null}>
          <SetupWizard />
        </Suspense>
      )}
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
          <CapabilitiesProvider>
            <NotificationProvider>
              <ReminderProvider>
              <EngineStatusProvider>
              <WebSocketProvider>
                <QueueProvider>
                  <TabBusyProvider>
                    <StickyNoteProvider>
                      <TimetableProvider>
                        <AppContent />
                        <ToastContainer />
                      </TimetableProvider>
                    </StickyNoteProvider>
                  </TabBusyProvider>
                </QueueProvider>
              </WebSocketProvider>
              </EngineStatusProvider>
              </ReminderProvider>
            </NotificationProvider>
          </CapabilitiesProvider>
        </SettingsProvider>
      </LicenseGate>
    </LicenseProvider>
  );
}

export default App;