import { useEffect, useState } from 'react'; import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, fmtDate, fmtTime, fmtPrice } from '../api.js'; import { useAuth } from '../App.jsx'; import { Badge } from '../components/EventCard.jsx';
export default function EventDetail() {
  const { id } = useParams(), { user } = useAuth(), nav = useNavigate();
  const [e, setE] = useState(null), [err, setErr] = useState(''), [busy, setBusy] = useState(false), [msg, setMsg] = useState(''), [done, setDone] = useState(null);
  const load = () => api('/events/' + id).then(d => setE(d.data)).catch(x => setErr(x.status === 404 ? 'This event is not available.' : x.message));
  useEffect(() => { load(); }, [id]);
  if (err) return <main className="mx-auto max-w-3xl p-16 text-center"><p role="alert" className="text-xl">{err}</p><Link to="/events" className="btn btn-primary mt-6">Browse events</Link></main>;
  if (!e) return <main className="mx-auto max-w-6xl p-10"><div className="skeleton h-96" /></main>;
  const reg = async () => {
    if (!user) return nav('/login', { state: { from: `/events/${id}` } });
    setBusy(true); setMsg('');
    try { const d = await api('/registrations', { method: 'POST', body: { event_id: e.event_id } }); setDone(d.data); load(); } catch (x) { setMsg(x.message); load(); } finally { setBusy(false); }
  };
  const s = e.display_status, open = s === 'PUBLISHED';
  if (done) return (
    <main className="mx-auto max-w-xl px-4 py-16 text-center"><div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-10" role="status">
      <h1 className="font-display text-3xl font-extrabold">You're registered!</h1>
      <dl className="mt-6 space-y-2 text-left"><div><dt className="text-sm text-ink/60">Registration ID</dt><dd className="font-display text-2xl font-bold">{done.registration_id}</dd></div>
        <div><dt className="text-sm text-ink/60">Event</dt><dd>{done.title}</dd></div><div><dt className="text-sm text-ink/60">Name</dt><dd>{done.user_name}</dd></div>
        <div><dt className="text-sm text-ink/60">Date and venue</dt><dd>{fmtDate(done.date)}, {done.venue}</dd></div><div><dt className="text-sm text-ink/60">Status</dt><dd>{done.status}{done.payment_status === 'PENDING' ? ' (payment pending)' : ''}</dd></div></dl>
      <div className="mt-8 flex justify-center gap-3"><Link className="btn btn-primary" to={`/user/registrations/${done.registration_id}`}>View ticket</Link><Link className="btn btn-ghost" to="/user/dashboard">My registrations</Link></div></div></main>);
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <img src={e.image_url} alt={e.title} className="aspect-[21/9] w-full rounded-3xl object-cover" />
      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div><div className="flex gap-2"><span className="rounded-full bg-mist px-3 py-0.5 text-sm font-bold">{e.category}</span><Badge s={s} /></div>
          <h1 className="mt-3 font-display text-4xl font-extrabold">{e.title}</h1><p className="mt-4 whitespace-pre-line text-lg text-ink/80">{e.description}</p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">{[['Date', fmtDate(e.date)], ['Time', `${fmtTime(e.start_time)} to ${fmtTime(e.end_time)}`], ['Venue', e.venue], ['City', e.city], ['Capacity', e.capacity], ['Registered', e.registered_count]].map(([k, v]) => <div key={k} className="rounded-xl bg-mist p-4"><dt className="text-sm text-ink/60">{k}</dt><dd className="font-bold">{v}</dd></div>)}</dl></div>
        <aside className="h-fit rounded-2xl border border-ink/10 p-6 shadow-lg lg:sticky lg:top-24" aria-label="Registration">
          <p className="font-display text-3xl font-extrabold">{fmtPrice(e.price)}</p>
          <p className="mt-1 text-ink/70">{e.available_seats} of {e.capacity} seats available</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={e.registered_count} aria-valuemax={e.capacity}><div className="h-full bg-violet" style={{ width: `${Math.min(100, e.registered_count / e.capacity * 100)}%` }} /></div>
          {open && e.available_seats <= 10 && <p className="mt-3 font-bold text-rose-700">Only {e.available_seats} seats remaining</p>}
          {open ? <button className="btn btn-primary mt-5 w-full" disabled={busy} onClick={reg}>{busy ? 'Registering…' : user ? 'Register now' : 'Log in to register'}</button>
            : <button className="btn mt-5 w-full bg-ink/10" disabled>{s === 'FULL' ? 'Event full' : s === 'COMPLETED' ? 'Event completed' : 'Registration closed'}</button>}
          {msg && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-800">{msg}</p>}
        </aside>
      </div>
    </main>
  );
}
