// Only the JWT is kept in localStorage; all data is fetched from the API/database.
export const token = { get: () => localStorage.getItem('ek_token'), set: t => localStorage.setItem('ek_token', t), clear: () => localStorage.removeItem('ek_token') };
export async function api(path, { method = 'GET', body, raw } = {}) {
  let res;
  try {
    res = await fetch('/api' + path, { method, headers: { ...(body && { 'Content-Type': 'application/json' }), ...(token.get() && { Authorization: 'Bearer ' + token.get() }) }, body: body && JSON.stringify(body) });
  } catch { throw new Error('Cannot reach the server. Check your connection and try again.'); }
  if (raw) return res;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const e = new Error(data.message || 'Request failed'); e.fields = data.errors; e.status = res.status; throw e; }
  return data;
}
export const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
export const fmtTime = t => new Date('1970-01-01T' + t).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
export const fmtPrice = p => (p > 0 ? '₹' + p : 'Free');
