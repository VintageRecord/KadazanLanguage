import { NavLink, useNavigate } from 'react-router-dom';
import { BookOpen, LayoutDashboard, Tag, FileText, HelpCircle, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin',            label: 'Dashboard',  icon: <LayoutDashboard size={16} />, end: true },
  { to: '/admin/categories', label: 'Kategori',   icon: <Tag size={16} /> },
  { to: '/admin/phrases',    label: 'Frasa',       icon: <FileText size={16} /> },
  { to: '/admin/quizzes',    label: 'Kuiz',        icon: <HelpCircle size={16} /> },
];

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-forest-900 flex flex-col fixed top-0 left-0 h-screen z-40">
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-earth-600 flex items-center justify-center">
              <BookOpen size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold leading-tight">Kadazan</p>
              <p className="text-white/40 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors
                 ${isActive
                   ? 'bg-earth-600 text-white font-medium'
                   : 'text-white/70 hover:text-white hover:bg-forest-700'}`
              }>
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-white/70
                       hover:text-white hover:bg-forest-700 transition-colors w-full">
            <LogOut size={16} />
            Log Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 flex-1 bg-cream min-h-screen">
        {children}
      </main>
    </div>
  );
}
