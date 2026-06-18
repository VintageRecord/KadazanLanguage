import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Lock } from 'lucide-react';
import { adminApi } from '../../api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminApi.get('/admin/counts', {
        headers: { Authorization: `Bearer ${password}` },
      });
      localStorage.setItem('admin_token', password);
      navigate('/admin');
    } catch {
      setError('Password salah. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-forest-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen size={24} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-forest-900">Admin Panel</h1>
          <p className="text-forest-500 text-sm mt-1">Kadazan Language Platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card border border-parchment p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-forest-500 uppercase tracking-wide mb-1.5 block">
                Password Admin
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full pl-9 pr-4 py-2.5 border border-forest-200 rounded-xl text-sm
                             focus:outline-none focus:ring-2 focus:ring-forest-400 bg-cream"
                  required
                />
              </div>
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Mengesahkan...' : 'Log Masuk'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
