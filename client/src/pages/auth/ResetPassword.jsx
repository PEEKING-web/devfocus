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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00ff88] mb-2">DevFocus</h1>
          <p className="text-[#a0a0a0]">Enter OTP + new password</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Reset Password</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-[#00ff88]/10 border border-[#00ff88]/50 rounded-lg p-3 mb-4">
              <p className="text-[#00ff88] text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="input-field"
                placeholder="Enter 6-digit OTP"
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
                className="block text-sm font-medium text-[#a0a0a0] mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                className="input-field"
                placeholder="••••••••"
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
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="text-sm text-[#a0a0a0] hover:text-[#00ff88] disabled:opacity-50"
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>

            <Link to="/login" className="text-sm text-[#a0a0a0] hover:text-[#00ff88]">
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Focus better. Code faster. Ship more. 🚀
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
