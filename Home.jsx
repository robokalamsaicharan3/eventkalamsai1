import { useEffect, useState } from 'react'; import { Link } from 'react-router-dom';
import { api } from '../api.js'; import EventCard from '../components/EventCard.jsx';
const cats = ['Robotics', 'AI & ML', 'IoT', 'Hackathons', 'Workshops', 'Entrepreneurship', 'School Events', 'College Events'];
const why = [['Find technical events', 'Robotics, AI, IoT and startup events in one searchable list.'], ['Register in minutes', 'Create an account once, then reserve a seat in a couple of clicks.'],
  ['Live seat counts', 'Seats left are read straight from the database, so what you see is current.'], ['Manage your bookings', 'See upcoming and past events, view tickets, and cancel before the event date.'],
  ['Run by Robokalam', 'Events from the team already training students across Telangana.']];
export default function Home() {
  const [ev, setEv] = useState(null), [err, setErr] = useState('');
  useEffect(() => { api('/events?featured=1&limit=3').then(d => setEv(d.data)).catch(e => setErr(e.message)); }, []);
  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:py-20">
        <div>
          <h1 className="font-display text-5xl font-extrabold leading-[1.05] md:text-6xl">Discover. Learn. Build. Experience.</h1>
          <p className="mt-5 max-w-lg text-lg text-ink/75">EventKalam helps you find and register for technology, robotics, AI and innovation events run by Robokalam Technologies.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link to="/events" className="btn btn-primary">Explore events</Link><Link to="/register" className="btn btn-ghost">Join EventKalam</Link></div>
        </div>
        <img src="/images/open-mic.jpeg" alt="A speaker on stage at the Warangal Open Mic rooftop event" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
      </section>

      <section className="mx-auto max-w-6xl px-4" aria-labelledby="up">
        <div className="mb-6 flex items-end justify-between"><h2 id="up" className="font-display text-3xl font-extrabold">Upcoming events</h2><Link to="/events" className="font-bold text-violet">See all events</Link></div>
        {err && <p role="alert" className="rounded-lg bg-rose-50 p-4 text-rose-800">{err}</p>}
        <div className="grid gap-6 md:grid-cols-3">
          {!ev && !err && [0, 1, 2].map(i => <div key={i} className="skeleton h-96" />)}
          {ev?.map(e => <EventCard key={e.event_id} e={e} />)}
        </div>
        {ev?.length === 0 && <p className="rounded-xl bg-mist p-8 text-center">No upcoming events yet. Check back soon.</p>}
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4"><h2 className="font-display text-3xl font-extrabold">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{cats.map(c => <Link key={c} to={`/events?category=${encodeURIComponent(c)}`} className="rounded-xl border border-ink/10 bg-mist px-4 py-6 font-display text-lg font-bold transition hover:border-violet hover:bg-white hover:shadow-lg">{c}</Link>)}</div></section>

      <section className="mt-20 bg-mist py-16"><div className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-3xl font-extrabold">AI for All: skilling 10,000+ people</h2>
        <p className="mt-2 max-w-2xl text-ink/75">Robokalam and Government Polytechnic Warangal, with NASSCOM Foundation, IBM SkillsBuild and partners, are bringing AI skills to students across Warangal and beyond.</p>
        <img src="/images/ai-for-all.jpeg" alt="AI for All upskilling initiative: students and trainers at Govt Polytechnic with partner logos" loading="lazy" className="mt-8 w-full rounded-2xl border border-ink/10 bg-white" />
      </div></section>

      <section className="mx-auto mt-20 max-w-6xl px-4"><h2 className="font-display text-3xl font-extrabold">Moments from our events</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{[['guest-speakers', 'Guest speakers sharing with students at the Robokalam lab'], ['launch', 'Team launching the AI for All posters'], ['felicitation', 'Felicitation of young achievers on World Youth Skills Day']].map(([f, a]) =>
          <img key={f} src={`/images/${f}.jpeg`} alt={a} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />)}</div></section>

      <section className="mx-auto mt-20 grid max-w-6xl items-center gap-10 px-4 md:grid-cols-[320px_1fr]" aria-labelledby="fd">
        <img src="/images/ceo.jpg" alt="Mohammed Sajeed, Founder and CEO of Robokalam Technologies, speaking on stage" loading="lazy" className="aspect-[3/4] w-full rounded-3xl object-cover object-top shadow-xl" />
        <div><h2 id="fd" className="font-display text-3xl font-extrabold">Built by Robokalam Technologies</h2>
          <p className="mt-4 max-w-xl text-lg text-ink/80">Robokalam brings robotics, AI and digital skills to students and young founders. EventKalam is where those workshops, camps and hackathons come together, so anyone can find an event and take a seat.</p>
          <p className="mt-4 font-display text-xl font-bold">Mohammed Sajeed</p><p className="text-ink/70">Founder and CEO, Robokalam Technologies</p>
          <img src="/images/robokalam-logo.png" alt="Robokalam" className="mt-6 h-20 w-20" /></div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4"><h2 className="font-display text-3xl font-extrabold">Why EventKalam</h2>
        <dl className="mt-6 grid gap-x-10 gap-y-6 md:grid-cols-2">{why.map(([t, d]) => <div key={t} className="border-l-4 border-violet pl-4"><dt className="font-display text-xl font-bold">{t}</dt><dd className="text-ink/75">{d}</dd></div>)}</dl></section>

      <section className="mx-auto mt-20 max-w-6xl px-4"><div className="rounded-3xl bg-ink p-10 text-center text-white md:p-16">
        <h2 className="font-display text-4xl font-extrabold">Your next build starts here</h2><p className="mx-auto mt-3 max-w-xl text-white/80">Seats fill quickly. Pick an event and reserve yours today.</p>
        <Link to="/events" className="btn mt-8 bg-white text-ink hover:bg-amber">Explore upcoming events</Link></div></section>
    </main>
  );
}
