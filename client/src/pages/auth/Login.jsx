import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

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
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setError(err || 'Login failed. Please try again.');
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
          <p className="text-[#a0a0a0]">AI-Powered Pomodoro for Developers</p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
            </div>

            {/*  Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#a0a0a0] hover:text-[#00ff88]"
              >
                Forgot password?
              </Link>
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
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-[#a0a0a0] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#00ff88] hover:text-[#00cc6a] font-medium">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Focus better. Code faster. Ship more. 🚀
        </p>
      </div>
    </div>
  );
};

export default Login;