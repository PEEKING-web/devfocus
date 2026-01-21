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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00ff88] mb-2">DevFocus</h1>
          <p className="text-[#a0a0a0]">Reset your password with OTP</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Forgot Password</h2>

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

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              Remembered your password?{' '}
              <Link to="/login" className="text-[#00ff88] hover:text-[#00cc6a] font-medium">
                Back to login
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Focus better. Code faster. Ship more. 🚀
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
