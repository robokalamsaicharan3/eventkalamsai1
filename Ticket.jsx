import { useEffect, useState } from 'react'; import { Link, useParams } from 'react-router-dom';
import { api, fmtDate, fmtTime } from '../api.js';
export default function Ticket() {
  const { id } = useParams(), [r, setR] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api('/registrations/' + id).then(d => setR(d.data)).catch(x => setErr(x.message)); }, [id]);
  if (err) return <main className="p-16 text-center"><p role="alert">{err}</p><Link to="/user/dashboard" className="btn btn-primary mt-4">My registrations</Link></main>;
  if (!r) return <main className="mx-auto max-w-xl p-10"><div className="skeleton h-72" /></main>;
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <article className="overflow-hidden rounded-3xl border border-ink/15 shadow-xl">
        <img src={r.image_url} alt="" className="h-40 w-full object-cover" />
        <div className="space-y-3 p-6"><p className="text-sm text-ink/60">EventKalam ticket</p><h1 className="font-display text-2xl font-extrabold">{r.title}</h1>
          <p>{fmtDate(r.date)}, {fmtTime(r.start_time)} to {fmtTime(r.end_time)}</p><p>{r.venue}, {r.city}</p>
          <div className="border-t border-dashed pt-3"><p className="text-sm text-ink/60">Registration ID</p><p className="font-display text-3xl font-extrabold tracking-wide">{r.registration_id}</p>
            <p className="mt-2">{r.user_name} · {r.status} · Payment {r.payment_status}</p></div></div>
      </article>
      <div className="no-print mt-6 flex gap-3"><button className="btn btn-primary" onClick={() => window.print()}>Print ticket</button><Link className="btn btn-ghost" to="/user/dashboard">Back</Link></div>
    </main>
  );
}
