import { useEffect, useState } from 'react'; import { useSearchParams } from 'react-router-dom';
import { api } from '../api.js'; import EventCard from '../components/EventCard.jsx';
export default function Events() {
  const [sp, setSp] = useSearchParams(), [res, setRes] = useState(null), [err, setErr] = useState(''), [meta, setMeta] = useState({ categories: [], cities: [] });
  const [text, setText] = useState(sp.get('q') || '');
  const qs = sp.toString();
  useEffect(() => { api('/events/meta/filters').then(setMeta).catch(() => {}); }, []);
  useEffect(() => { setRes(null); setErr(''); api('/events?limit=9&' + qs).then(setRes).catch(e => setErr(e.message)); }, [qs]);
  const set = (k, v) => { const n = new URLSearchParams(sp); v ? n.set(k, v) : n.delete(k); if (k !== 'page') n.delete('page'); setSp(n); };
  const Sel = ({ k, label, opts }) => (<label className="text-sm font-bold">{label}<select className="input mt-1 font-normal" value={sp.get(k) || ''} onChange={e => set(k, e.target.value)}><option value="">All</option>{opts.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o}>{o}</option>)}</select></label>);
  const p = res?.pagination;
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-4xl font-extrabold">Events</h1>
      <form role="search" className="mt-6 flex gap-2" onSubmit={e => { e.preventDefault(); set('q', text.trim()); }}>
        <label className="sr-only" htmlFor="s">Search events</label>
        <input id="s" className="input" placeholder="Search by title, category, city or venue" value={text} onChange={e => setText(e.target.value)} /><button className="btn btn-primary">Search</button></form>
      <div className="mt-4 grid gap-3 rounded-2xl bg-mist p-4 sm:grid-cols-3 lg:grid-cols-6">
        <Sel k="category" label="Category" opts={meta.categories} /><Sel k="city" label="City" opts={meta.cities} />
        <Sel k="status" label="Status" opts={[['PUBLISHED', 'Open'], ['FULL', 'Full'], ['COMPLETED', 'Completed']]} />
        <Sel k="maxPrice" label="Price" opts={[['0', 'Free only'], ['500', 'Up to ₹500'], ['1000', 'Up to ₹1000']]} />
        <label className="text-sm font-bold">Date<input type="date" className="input mt-1 font-normal" value={sp.get('date') || ''} onChange={e => set('date', e.target.value)} /></label>
        <Sel k="sort" label="Sort by" opts={[['date', 'Soonest'], ['newest', 'Newest'], ['price_asc', 'Price: low to high'], ['price_desc', 'Price: high to low']]} />
      </div>
      {err && <div role="alert" className="mt-8 rounded-xl bg-rose-50 p-6 text-rose-800">{err} <button className="font-bold underline" onClick={() => setSp(new URLSearchParams(sp))}>Try again</button></div>}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {!res && !err && Array.from({ length: 6 }, (_, i) => <div key={i} className="skeleton h-96" />)}
        {res?.data.map(e => <EventCard key={e.event_id} e={e} />)}
      </div>
      {res?.data.length === 0 && <div className="mt-8 rounded-xl bg-mist p-10 text-center"><p className="font-bold">No events match these filters.</p><button className="btn btn-ghost mt-3" onClick={() => { setText(''); setSp({}); }}>Clear filters</button></div>}
      {p?.pages > 1 && <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
        <button className="btn btn-ghost" disabled={p.page <= 1} onClick={() => set('page', p.page - 1)}>Previous</button><span>Page {p.page} of {p.pages}</span>
        <button className="btn btn-ghost" disabled={p.page >= p.pages} onClick={() => set('page', p.page + 1)}>Next</button></nav>}
    </main>
  );
}
