import { Link } from 'react-router-dom'; import { fmtDate, fmtPrice } from '../api.js';
const tone = { PUBLISHED: 'bg-emerald-100 text-emerald-800', FULL: 'bg-rose-100 text-rose-800', COMPLETED: 'bg-slate-200 text-slate-700', CANCELLED: 'bg-slate-200 text-slate-700' };
const label = { PUBLISHED: 'Open', FULL: 'Full', COMPLETED: 'Completed', CANCELLED: 'Cancelled' };
export const Badge = ({ s }) => <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${tone[s] || 'bg-amber/20 text-ink'}`}>{label[s] || s}</span>;
export default function EventCard({ e }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white transition hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist">
        <img src={e.image_url} alt={e.title} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute left-3 top-3 flex gap-2"><span className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold backdrop-blur">{e.category}</span><Badge s={e.display_status} /></div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl font-bold leading-snug">{e.title}</h3>
        <p className="text-sm text-ink/70">{fmtDate(e.date)} · {e.venue}, {e.city}</p>
        <div className="mt-auto flex items-center justify-between pt-3 text-sm">
          <span className="font-bold">{fmtPrice(e.price)}</span>
          <span className={e.available_seats < 10 ? 'font-bold text-rose-700' : 'text-ink/70'}>{e.available_seats} seats left</span>
        </div>
        <Link to={`/events/${e.event_id}`} className="btn btn-primary mt-2">View details</Link>
      </div>
    </article>
  );
}
