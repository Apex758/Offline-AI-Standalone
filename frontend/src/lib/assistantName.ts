// For non-React contexts (data files, nudges, analytics). Reads directly from the settings localStorage key.
export function getAssistantName(): string {
  try {
    const raw = localStorage.getItem('app-settings-main');
    if (!raw) return 'Assistant';
    const parsed = JSON.parse(raw);
    return (parsed?.profile?.assistantName || '').trim() || 'Assistant';
  } catch { return 'Assistant'; }
}
