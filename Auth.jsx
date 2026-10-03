import { useState } from 'react'; import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api.js'; import { useAuth } from '../App.jsx';
function Shell({ title, fields, path, cta, alt, initial }) {
  const [v, setV] = useState(initial), [err, setErr] = useState(''), [fe, setFe] = useState({}), [busy, setBusy] = useState(false);
  const { login } = useAuth(), nav = useNavigate(), loc = useLocation();
  const submit = async ev => {
    ev.preventDefault(); setErr(''); setFe({}); setBusy(true);
    try { const d = await api(path, { method: 'POST', body: v }); login(d.token, d.user); nav(loc.state?.from || '/events'); }
    catch (x) { setErr(x.message); setFe(x.fields || {}); } finally { setBusy(false); }
  };
  return (
    <main className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 md:grid-cols-2">
      <img src="/images/launch.jpeg" alt="" className="hidden aspect-square rounded-3xl object-cover md:block" />
      <form onSubmit={submit} className="space-y-4" noValidate>
        <h1 className="font-display text-4xl font-extrabold">{title}</h1>
        {err && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-rose-800">{err}</p>}
        {fields.map(([k, label, type]) => <div key={k}><label htmlFor={k} className="font-bold">{label}</label>
          <input id={k} type={type} className="input mt-1" value={v[k]} onChange={e => setV({ ...v, [k]: e.target.value })} required autoComplete={k === 'password' ? (path.includes('login') ? 'current-password' : 'new-password') : k} aria-invalid={!!fe[k]} />
          {fe[k] && <p className="mt-1 text-sm text-rose-700">{fe[k][0]}</p>}</div>)}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'Please wait…' : cta}</button>{alt}
      </form>
    </main>
  );
}
export const Login = () => <Shell title="Welcome back" path="/auth/login" cta="Log in" initial={{ email: '', password: '' }}
  fields={[['email', 'Email', 'email'], ['password', 'Password', 'password']]} alt={<p>New here? <Link className="font-bold text-violet" to="/register">Create an account</Link></p>} />;
export const Register = () => <Shell title="Create your account" path="/auth/register" cta="Create account" initial={{ name: '', email: '', phone: '', password: '', confirmPassword: '' }}
  fields={[['name', 'Full name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'], ['password', 'Password', 'password'], ['confirmPassword', 'Confirm password', 'password']]}
  alt={<p>Already registered? <Link className="font-bold text-violet" to="/login">Log in</Link></p>} />;
