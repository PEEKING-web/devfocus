import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (!/\S+@\S+\.\S+/.test(email)) {
        setError('Please enter a valid email');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);

      try {
        const response = await register({ name, email, password });
        
        // Check if OTP verification is required
        if (response.requiresVerification) {
          // Redirect to OTP verification page
          navigate('/verify-otp', { state: { email } });
        } else {
          // Old flow - direct login (shouldn't happen with new backend)
          navigate('/dashboard');
        }
      } catch (err) {
        setError(err || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#00ff88] mb-2">DevFocus</h1>
          <p className="text-[#a0a0a0]">AI-Powered Pomodoro for Developers</p>
        </div>

        {/* Register Card */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                className="input-field"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
              <p className="text-xs text-[#6b6b6b] mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#a0a0a0] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-[#00ff88] hover:text-[#00cc6a] font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Join thousands of developers boosting their productivity 🚀
        </p>
      </div>
    </div>
  );
};

export default Register;