import { useSettings } from '../contexts/SettingsContext';

export function useCoworkerName(): string {
  const { settings } = useSettings();
  return (settings.profile?.coworkerName || '').trim() || 'Coworker';
}
