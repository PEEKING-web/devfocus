import { useState } from 'react';
import { changePassword } from '../../services/authService';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const res = await changePassword({ currentPassword, newPassword });
      setSuccess(res?.message || 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-[#a0a0a0]">Manage your account settings</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333333] rounded-lg p-6 shadow-2xl max-w-xl">
        <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>

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
            <label
              htmlFor="currentPassword"
              className="block text-sm font-medium text-[#a0a0a0] mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              className="input-field"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (error) setError('');
              }}
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-[#a0a0a0] mb-2">
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
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2"></div>
                Updating...
              </span>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
