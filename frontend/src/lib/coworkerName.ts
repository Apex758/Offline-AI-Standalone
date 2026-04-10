// For non-React contexts (data files, nudges, analytics). Reads directly from the settings localStorage key.
export function getCoworkerName(): string {
  try {
    const raw = localStorage.getItem('app-settings-main');
    if (!raw) return 'Coworker';
    const parsed = JSON.parse(raw);
    return (parsed?.profile?.coworkerName || '').trim() || 'Coworker';
  } catch { return 'Coworker'; }
}
