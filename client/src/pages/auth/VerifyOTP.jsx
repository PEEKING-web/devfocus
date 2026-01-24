import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { Mail, RefreshCw, ShieldCheck } from 'lucide-react';

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.verifyOTP({ email, otp });
      
      // Auto-login after verification
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResendSuccess(false);
    setError('');

    try {
      await authService.resendOTP({ email });
      setResendSuccess(true);
      setOtp('');
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (err) {
      setError(err || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative">
       {/* Background Decoration */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00ff88]/5 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[128px]" />
      </div>

      <div className="max-w-md w-full relative z-10">
        
        <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]">
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00ff88]/10 rounded-2xl flex items-center justify-center border border-[#00ff88]/20 rotate-3">
              <Mail className="w-8 h-8 text-[#00ff88]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
            <p className="text-[#888] text-sm">We've sent a verification code to</p>
            <div className="mt-2 inline-block bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#333]">
              <p className="text-[#00ff88] text-sm font-mono">{email}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6 text-center animate-shake">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {resendSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-6 text-center animate-fade-in">
              <p className="text-[#00ff88] text-sm">New code sent!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="w-full bg-[#0a0a0a] border border-[#333] text-white text-center text-3xl font-bold tracking-[0.5em] rounded-xl py-5 outline-none focus:border-[#00ff88] focus:ring-4 focus:ring-[#00ff88]/10 transition-all placeholder-[#222]"
                placeholder="000000"
                maxLength="6"
                disabled={loading}
                autoFocus
                autoComplete="off"
              />
              <p className="text-xs text-[#555] mt-3 text-center uppercase tracking-wider">
                Code expires in 10 minutes
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(0,255,136,0.4)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between border-t border-[#222] pt-6">
            <button
              onClick={() => navigate('/register')}
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              Change email
            </button>
            
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-xs text-[#00ff88] hover:text-[#00cc6a] font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;