/**
 * Shared helper for resolving the current teacher's id.
 * Hoisted from SchoolYearHub.tsx (Phase 4) so all calendar consumers
 * agree on identity. Phantom "no events" bugs happen when two panels
 * disagree on which teacher_id to fetch for.
 */
export function getTeacherId(): string {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username || 'admin';
  } catch {
    return 'admin';
  }
}
