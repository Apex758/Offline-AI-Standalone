import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
}

const Settings: React.FC<SettingsProps> = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="mb-6">
          <SettingsIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Settings</h2>
        <p className="text-xl text-gray-600">Coming Soon</p>
        <p className="text-sm text-gray-500 mt-4">
          We're working on bringing you customizable settings to enhance your experience.
        </p>
      </div>
    </div>
  );
};

export default Settings;