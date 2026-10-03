import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom';
import { api, fmtDate } from '../api.js'; import { useAuth } from '../App.jsx';
export default function MyRegistrations() {
  const { user } = useAuth(), [rows, setRows] = useState(null), [err, setErr] = useState('');
  const load = () => api('/registrations/mine').then(d => setRows(d.data)).catch(x => setErr(x.message));
  useEffect(() => { load(); }, []);
  const cancel = async r => { if (!confirm(`Cancel your registration for ${r.title}?`)) return; try { await api(`/registrations/${r.registration_id}/cancel`, { method: 'PATCH' }); load(); } catch (x) { setErr(x.message); } };
  const today = new Date(new Date().toDateString());
  const up = rows?.filter(r => new Date(r.date) >= today && r.status === 'CONFIRMED') || [], past = rows?.filter(r => !up.includes(r)) || [];
  const Row = ({ r, canCancel }) => (
    <li className="flex flex-col gap-3 rounded-xl border border-ink/10 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="font-display text-lg font-bold">{r.title}</p><p className="text-sm text-ink/70">{fmtDate(r.date)} · {r.venue}, {r.city}</p>
        <p className="text-sm">ID <b>{r.registration_id}</b> · {r.status} · Payment {r.payment_status}</p></div>
      <div className="flex gap-2"><Link className="btn btn-ghost" to={`/user/registrations/${r.registration_id}`}>Ticket</Link>{canCancel && <button className="btn btn-ghost text-rose-700" onClick={() => cancel(r)}>Cancel</button>}</div>
    </li>);
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Hi, {user.name.split(' ')[0]}</h1>
      <p className="text-ink/70">{user.email} · {user.phone}</p>
      {err && <p role="alert" className="mt-4 rounded-lg bg-rose-50 p-3 text-rose-800">{err}</p>}
      {!rows && !err && <div className="skeleton mt-8 h-40" />}
      {rows && <>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">{[['Upcoming', up.length], ['Past', past.filter(r => r.status === 'CONFIRMED').length], ['Cancelled', rows.filter(r => r.status === 'CANCELLED').length]].map(([k, n]) => <div key={k} className="rounded-xl bg-mist p-4"><p className="font-display text-3xl font-extrabold">{n}</p><p className="text-sm">{k}</p></div>)}</div>
        <h2 className="mt-10 font-display text-2xl font-bold">Upcoming registrations</h2>
        {up.length ? <ul className="mt-3 space-y-3">{up.map(r => <Row key={r.registration_id} r={r} canCancel />)}</ul> : <p className="mt-3 rounded-xl bg-mist p-6">You have no upcoming events. <Link className="font-bold text-violet" to="/events">Browse events</Link></p>}
        <h2 className="mt-10 font-display text-2xl font-bold">Previous registrations</h2>
        {past.length ? <ul className="mt-3 space-y-3">{past.map(r => <Row key={r.registration_id} r={r} />)}</ul> : <p className="mt-3 text-ink/70">Nothing here yet.</p>}
      </>}
    </main>
  );
}
