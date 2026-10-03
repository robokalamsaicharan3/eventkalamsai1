import { createContext, useContext, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { api, token } from './api.js';
import Home from './pages/Home.jsx'; import Events from './pages/Events.jsx'; import EventDetail from './pages/EventDetail.jsx';
import { Login, Register } from './pages/Auth.jsx'; import MyRegistrations from './pages/MyRegistrations.jsx'; import Ticket from './pages/Ticket.jsx';
const Auth = createContext(null); export const useAuth = () => useContext(Auth);

function Header() {
  const { user, logout } = useAuth(); const [open, setOpen] = useState(false);
  const link = ({ isActive }) => `px-3 py-2 font-medium ${isActive ? 'text-violet' : 'hover:text-violet'}`;
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2" aria-label="Main">
        <Link to="/" aria-label="EventKalam home"><img src="/images/logo.jpeg" alt="EventKalam" className="h-12 w-auto" /></Link>
        <button className="rounded-lg border border-ink/20 px-3 py-2 md:hidden" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <div className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 border-b bg-white p-4 md:static md:flex md:flex-row md:items-center md:border-0 md:p-0`} onClick={() => setOpen(false)}>
          <NavLink to="/" end className={link}>Home</NavLink><NavLink to="/events" className={link}>Events</NavLink>
          <NavLink to="/about" className={link}>About</NavLink><NavLink to="/contact" className={link}>Contact</NavLink>
          {user ? (<><NavLink to="/user/dashboard" className={link}>My registrations</NavLink><button className="btn btn-ghost" onClick={logout}>Log out</button></>)
            : (<><Link to="/login" className="btn btn-ghost">Log in</Link><Link to="/register" className="btn btn-primary">Register</Link></>)}
        </div>
      </nav>
    </header>
  );
}
const Footer = () => (
  <footer className="mt-24 bg-ink text-white/80">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
      <div><img src="/images/robokalam-logo.png" alt="Robokalam Technologies" className="mb-3 h-16 w-16 rounded-lg bg-white p-1" /><p className="font-display text-2xl font-bold text-white">EventKalam</p><p className="mt-2 text-sm">A Robokalam Technologies platform for robotics, AI and innovation events.</p></div>
      <div className="flex flex-col gap-1 text-sm"><Link to="/events">Events</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><a href="#privacy">Privacy</a><a href="#terms">Terms</a></div>
      <div className="text-sm"><p>Warangal, Telangana</p><p>hello@robokalam.example</p><p className="mt-2">LinkedIn · Instagram · YouTube</p></div>
    </div>
    <p className="border-t border-white/10 py-4 text-center text-xs">© {new Date().getFullYear()} Robokalam Technologies. All rights reserved.</p>
  </footer>
);
export const Guard = ({ children }) => { const { user, ready } = useAuth(); if (!ready) return <p className="p-10 text-center">Loading…</p>; return user ? children : <Navigate to="/login" replace />; };
const Simple = ({ t, children }) => <main className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-4xl font-extrabold">{t}</h1><div className="mt-4 space-y-3 text-lg text-ink/80">{children}</div></main>;

export default function App() {
  const [user, setUser] = useState(null), [ready, setReady] = useState(false), nav = useNavigate();
  useEffect(() => { if (!token.get()) return setReady(true); api('/auth/me').then(d => setUser(d.user)).catch(() => token.clear()).finally(() => setReady(true)); }, []);
  const login = (t, u) => { token.set(t); setUser(u); }, logout = () => { token.clear(); setUser(null); nav('/'); };
  return (
    <Auth.Provider value={{ user, ready, login, logout }}>
      <a href="#main" className="sr-only focus:not-sr-only">Skip to content</a>
      <Header />
      <div id="main"><Routes>
        <Route path="/" element={<Home />} /><Route path="/events" element={<Events />} /><Route path="/events/:id" element={<EventDetail />} />
        <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
        <Route path="/user/dashboard" element={<Guard><MyRegistrations /></Guard>} /><Route path="/user/registrations/:id" element={<Guard><Ticket /></Guard>} />
        <Route path="/about" element={<Simple t="About EventKalam"><p>EventKalam is the events home of Robokalam Technologies: a single place to discover workshops, camps, bootcamps and hackathons, and to reserve your seat.</p><p>Robokalam works with schools, polytechnics and colleges, alongside partners such as NASSCOM Foundation, IBM SkillsBuild and Skills Root.</p></Simple>} />
        <Route path="/contact" element={<Simple t="Contact"><p>hello@robokalam.example</p><p>Warangal, Telangana</p></Simple>} />
        <Route path="*" element={<Simple t="Page not found"><Link className="btn btn-primary" to="/">Back to home</Link></Simple>} />
      </Routes></div>
      <Footer />
    </Auth.Provider>
  );
}
