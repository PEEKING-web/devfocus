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
    <div className="min-h-screen flex bg-[#0a0a0a] text-white overflow-hidden">
      {/* Right Side - Form Area (First in DOM for mobile, visual order handled by flex-row-reverse if needed, but standard is fine) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-auto">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
            <p className="mt-2 text-[#666]">Start your journey to better productivity.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#888] mb-1.5 ml-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all placeholder-[#444]"
                placeholder="John Doe"
                disabled={loading}
              />
            </div>

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
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#888] mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all placeholder-[#444]"
                  placeholder="••••••"
                  disabled={loading}
                />
                <p className="text-[10px] text-[#555] mt-1 ml-1 uppercase tracking-wide">Min 6 chars</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#888] mb-1.5 ml-1">
                  Confirm
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#111] border border-[#333] text-white rounded-lg px-4 py-3 outline-none focus:border-[#00ff88] focus:ring-1 focus:ring-[#00ff88] transition-all placeholder-[#444]"
                  placeholder="••••••"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#00ff88] hover:bg-[#00cc6a] text-black font-bold py-3.5 rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(0,255,136,0.3)] hover:shadow-[0_0_25px_-5px_rgba(0,255,136,0.5)]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Get Started'
              )}
            </button>
          </form>

          <div className="pt-6 text-center border-t border-[#222]">
            <p className="text-[#666] text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-[#00ff88] font-medium transition-colors ml-1">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>

       {/* Left Side - Visual Panel (Hidden on mobile) */}
       <div className="hidden lg:flex w-1/2 bg-[#0d0d0d] relative items-center justify-center overflow-hidden border-l border-[#222]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <div className="relative z-10 p-12 max-w-lg text-right">
          <h1 className="text-5xl font-bold mb-6 tracking-tight text-white">
            Ship more. <br />
            <span className="text-[#00ff88] drop-shadow-[0_0_15px_rgba(0,255,136,0.4)]">Stress less.</span>
          </h1>
          <p className="text-[#888] text-lg leading-relaxed ml-auto max-w-sm">
            Join thousands of developers using our AI Pomodoro technique to maintain flow state and prevent burnout.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;