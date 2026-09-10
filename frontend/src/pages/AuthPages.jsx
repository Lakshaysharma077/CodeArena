import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Swords, Mail, Lock, User } from 'lucide-react';
import { loginUser, registerUser } from '../store/authSlice';

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-arena-bg text-arena-text">
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-arena-border bg-arena-card space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-arena-primary flex items-center justify-center shadow-glow-primary">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-arena-text">Welcome Back to CodeArena</h2>
          <p className="text-xs text-arena-muted">Sign in to climb rank tiers and enter 1v1 battles</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-arena-danger/15 border border-arena-danger/40 text-arena-danger text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-arena-bg border border-arena-border text-arena-text focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-arena-bg border border-arena-border text-arena-text focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-arena-primary to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold shadow-glow-primary transition-all hover:scale-105 active:scale-95"
          >
            {loading ? 'Authenticating...' : 'Sign In to Arena'}
          </button>
        </form>

        <div className="text-center text-xs text-arena-muted pt-2 border-t border-arena-border/60">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-arena-primary hover:underline font-bold">Register Now</Link>
        </div>

      </div>
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('United States');
  const [college, setCollege] = useState('Stanford University');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await dispatch(registerUser({ username, email, password, country, college })).unwrap();
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-6 bg-arena-bg text-arena-text">
      <div className="w-full max-w-md p-8 rounded-3xl glass-panel border border-arena-border bg-arena-card space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-arena-primary flex items-center justify-center shadow-glow-primary">
            <Swords className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-arena-text">Create Competitor Profile</h2>
          <p className="text-xs text-arena-muted">Join 120,000+ competitive programmers</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-arena-danger/15 border border-arena-danger/40 text-arena-danger text-xs font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="e.g. ApexCoder"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-arena-bg border border-arena-border text-arena-text focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-arena-bg border border-arena-border text-arena-text focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-arena-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-arena-bg border border-arena-border text-arena-text focus:outline-none focus:border-arena-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-arena-bg border border-arena-border text-arena-text text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-arena-muted uppercase block mb-1.5">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-arena-bg border border-arena-border text-arena-text text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-arena-primary to-red-500 hover:from-red-500 hover:to-red-600 text-white font-extrabold shadow-glow-primary transition-all hover:scale-105 active:scale-95"
          >
            {loading ? 'Creating Profile...' : 'Start Competing'}
          </button>
        </form>

        <div className="text-center text-xs text-arena-muted pt-2 border-t border-arena-border/60">
          <span>Already have an account? </span>
          <Link to="/login" className="text-arena-primary hover:underline font-bold">Log In</Link>
        </div>

      </div>
    </div>
  );
}
