import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { KeyRound, Mail, AlertTriangle, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get('expired');

  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-black px-4 relative overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      {/* Back to website button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 font-outfit text-xs font-semibold uppercase tracking-wider text-stone-400 hover:text-gold transition-colors"
      >
        <ArrowLeft size={14} /> Back to Website
      </button>

      {/* Main glass panel box */}
      <div className="w-full max-w-md glass-panel-dark p-8 rounded-lg shadow-2xl relative z-10 flex flex-col items-center gap-8">
        
        {/* Branding header */}
        <div className="flex flex-col items-center text-center gap-2">
          <Logo variant="dark" />
          <h2 className="font-outfit text-xs font-bold uppercase tracking-[0.3em] text-gold mt-4">MANAGEMENT HUB</h2>
          <div className="w-8 h-[1px] bg-gold/50 mt-1" />
        </div>

        {/* Info alerts */}
        {expired && (
          <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] p-3 rounded font-sans flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>Session expired. Please log in again to access the portal.</span>
          </div>
        )}

        {error && (
          <div className="w-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] p-3 rounded font-sans flex items-start gap-2">
            <AlertTriangle size={14} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@rustik.com"
                className="w-full bg-luxury-black border border-luxury-gray text-white p-3 pl-11 text-xs rounded focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="font-outfit text-[10px] font-bold text-stone-400 uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-luxury-black border border-luxury-gray text-white p-3 pl-11 text-xs rounded focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-4 font-outfit text-xs font-bold uppercase tracking-widest gold-gradient-bg text-forest rounded shadow-lg transition-luxury hover:scale-105 flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-forest" />
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        {/* Mock accounts list hint for developers/testers */}
        <div className="w-full border-t border-luxury-gray pt-5 text-center flex flex-col gap-2 select-none">
          <span className="font-outfit text-[9px] font-bold tracking-widest text-stone-500 uppercase">PROTOTYPE ACCESS CREDENTIALS</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] font-sans text-stone-400">
            <p><span className="text-stone-300 font-semibold">Owner:</span> owner@rustik.com</p>
            <p><span className="text-stone-300 font-semibold">Manager:</span> manager@rustik.com</p>
            <p><span className="text-stone-300 font-semibold">Staff:</span> staff@rustik.com</p>
            <p><span className="text-stone-300 font-semibold">Barber:</span> marcus@rustik.com</p>
          </div>
          <span className="text-[9px] text-stone-500 font-medium italic mt-1">Default Password: password123</span>
        </div>

      </div>
    </div>
  );
};
export default Login;
