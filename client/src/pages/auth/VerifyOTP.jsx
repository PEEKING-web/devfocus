import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as authService from '../../services/authService';
import { Mail, RefreshCw } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#00ff88]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00ff88]/20">
            <Mail className="w-10 h-10 text-[#00ff88]" />
          </div>
          <h1 className="text-4xl font-bold text-[#00ff88] mb-2">Check Your Email</h1>
          <p className="text-[#a0a0a0]">We sent a verification code to</p>
          <p className="text-white font-medium">{email}</p>
        </div>

        {/* Verification Card */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Enter Verification Code</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {resendSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/50 rounded-lg p-3 mb-4">
              <p className="text-[#00ff88] text-sm">New code sent! Check your email.</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                6-Digit Code
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="input-field text-center text-2xl tracking-widest font-bold border-[#333333] focus:border-[#00ff88]"
                placeholder="000000"
                maxLength="6"
                disabled={loading}
                autoFocus
              />
              <p className="text-xs text-[#6b6b6b] mt-2 text-center">
                Valid for 10 minutes
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Verifying...
                </span>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#00ff88] hover:text-[#00cc6a] font-medium text-sm flex items-center gap-2 mx-auto disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Wrong email? <button onClick={() => navigate('/register')} className="text-[#00ff88] hover:text-[#00cc6a]">Go back</button>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTP;