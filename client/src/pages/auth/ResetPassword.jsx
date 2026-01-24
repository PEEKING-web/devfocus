import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { resetPassword, forgotPassword } from '../../services/authService';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailFromQuery = params.get('email');
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [location.search]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !otp || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword({ email, otp, newPassword });
      setSuccess(res?.message || 'Password reset successful');

      setTimeout(() => {
        navigate('/login');
      }, 900);
    } catch (err) {
      setError(err || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setResendLoading(true);

    try {
      const res = await forgotPassword({ email });
      setSuccess(res?.message || 'OTP resent to your email');
    } catch (err) {
      setError(err || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative">
      <div className="max-w-md w-full relative z-10">
        
        <div className="text-center mb-8">
           <h1 className="text-3xl font-bold text-white tracking-tight mb-2">New Password</h1>
           <p className="text-[#666]">Secure your account with a fresh start.</p>
        </div>

        <div className="bg-[#121212] border border-[#333] rounded-2xl p-8 shadow-2xl">

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-lg p-3 mb-6">
              <p className="text-[#00ff88] text-sm text-center">{success}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs uppercase tracking-wider font-semibold text-[#666] mb-2 ml-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/50 transition-all opacity-50"
                value={email}
                readOnly
                disabled
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-xs uppercase tracking-wider font-semibold text-[#666] mb-2 ml-1">
                OTP Code
              </label>
              <input
                type="text"
                id="otp"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/50 transition-all tracking-widest placeholder-[#333]"
                placeholder="••••••"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs uppercase tracking-wider font-semibold text-[#666] mb-2 ml-1"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="w-full bg-[#0a0a0a] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88]/50 transition-all placeholder-[#333]"
                placeholder="New secure password"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_-3px_rgba(0,255,136,0.3)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Resetting...
                </span>
              ) : (
                'Confirm Reset'
              )}
            </button>
          </form>

          <div className="mt-6 flex justify-between items-center border-t border-[#222] pt-4">
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-xs text-[#666] hover:text-[#00ff88] transition-colors disabled:opacity-50"
            >
              {resendLoading ? 'Resending...' : 'Resend Code'}
            </button>

            <Link to="/login" className="text-xs text-[#666] hover:text-white transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;