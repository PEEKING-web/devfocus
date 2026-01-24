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
    <div className="min-h-screen flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* Left Side - Visual Panel (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[#111] relative items-center justify-center overflow-hidden border-r border-[#222]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00ff88]/5 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00ff88]/10 via-[#0a0a0a] to-[#0a0a0a]" />
        
        <div className="relative z-10 p-12 max-w-lg">
          <div className="mb-8 inline-block p-4 rounded-2xl bg-[#1a1a1a] border border-[#333] shadow-[0_0_30px_-10px_rgba(0,255,136,0.2)]">
            <div className="w-12 h-12 rounded-full bg-[#00ff88] flex items-center justify-center">
              <span className="text-black font-bold text-2xl">DF</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Focus better. <br />
            <span className="text-[#00ff88]">Code faster.</span>
          </h1>
          <p className="text-[#888] text-lg leading-relaxed">
            Join the community of developers who have mastered their workflow with AI-powered focus sessions.
          </p>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-[#666]">Enter your credentials to access your workspace.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#888] mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all placeholder-[#444]"
                  placeholder="name@company.com"
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                  <label htmlFor="password" className="block text-sm font-medium text-[#888]">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-[#00ff88] hover:text-[#00cc6a] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all placeholder-[#444]"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_-5px_rgba(0,255,136,0.5)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-[#222]">
            <p className="text-[#666] text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-white hover:text-[#00ff88] font-medium transition-colors ml-1">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;