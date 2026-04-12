import { useSettings } from '../contexts/SettingsContext';

export function useAssistantName(): string {
  const { settings } = useSettings();
  return (settings.profile?.assistantName || '').trim() || 'Assistant';
}
