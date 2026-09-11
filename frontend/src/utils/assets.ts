/**
 * Resolves a backend-relative asset path (e.g. "/uploads/avatars/x.png") to a
 * URL the browser can load. During `vite dev` the frontend runs on :5173 while
 * the API serves uploads from :5001; in production both are same-origin.
 */
export const getAssetUrl = (path: string | null | undefined): string | null => {
  if (!path || typeof path !== 'string') return null;
  const trimmed = path.trim();
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') return null;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const base = window.location.origin.includes(':5173')
    ? 'http://localhost:5001'
    : '';
  return `${base}${trimmed}`;
};
