import { useEffect } from 'react';
import { useLicense } from '../contexts/LicenseContext';

/**
 * LicenseGate no longer blocks app access.
 * It simply triggers an update check when a valid license is detected.
 * License activation is handled in Settings.
 */
export function LicenseGate({ children }: { children: React.ReactNode }) {
  const { isLicensed } = useLicense();

  useEffect(() => {
    if (isLicensed) {
      window.electronAPI?.checkForUpdates?.();
    }
  }, [isLicensed]);

  return <>{children}</>;
}
