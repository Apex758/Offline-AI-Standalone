import { useEffect } from 'react';
import { useLicense } from '../contexts/LicenseContext';

/**
 * LicenseGate no longer blocks app access.
 * It reports license status to the main process and triggers
 * an update check when a valid OAK license is detected.
 */
export function LicenseGate({ children }: { children: React.ReactNode }) {
  const { isLicensed } = useLicense();

  // Keep main process in sync with license status
  useEffect(() => {
    window.electronAPI?.setLicenseStatus?.(isLicensed);
  }, [isLicensed]);

  // Trigger update check only when licensed
  useEffect(() => {
    if (isLicensed) {
      window.electronAPI?.checkForUpdates?.();
    }
  }, [isLicensed]);

  return <>{children}</>;
}
