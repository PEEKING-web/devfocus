import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      setSuccess(res?.message || 'OTP sent to your email');

      // go to reset page with email in query
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 800);
    } catch (err) {
      setError(err || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] relative overflow-hidden px-4">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff88]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Recovery</h1>
           <p className="text-[#666]">Don't worry, happens to the best of us.</p>
        </div>

        <div className="bg-[#121212]/80 backdrop-blur-xl border border-[#333] rounded-2xl p-8 shadow-2xl ring-1 ring-white/5">
          
          {error && (
             <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-center">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6 text-center">
              <p className="text-[#00ff88] text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-[#666] mb-2 ml-1">
                Registered Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-xl px-4 py-3.5 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/50 transition-all placeholder-[#333]"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black hover:bg-[#00ff88] font-bold py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                'Send Recovery Code'
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-[#222] pt-6">
            <Link to="/login" className="text-sm text-[#888] hover:text-white transition-colors flex items-center justify-center gap-2 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;