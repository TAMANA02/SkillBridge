import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Briefcase, FolderKanban, User, LogOut, Menu, Home, PlusSquare, ClipboardList, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const STUDENT_LINKS = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/opportunities', label: 'Opportunities', icon: Target },
  { to: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/student/projects', label: 'Projects', icon: FolderKanban },
  { to: '/student/performance', label: 'Performance', icon: TrendingUp },
  { to: '/student/profile', label: 'Profile', icon: User },
];

const CLIENT_LINKS = [
  { to: '/client/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/client/new-project', label: 'New Project', icon: PlusSquare },
  { to: '/client/manage-projects', label: 'Manage Projects', icon: ClipboardList },
  { to: '/client/profile', label: 'Profile', icon: User },
];

export default function DashboardLayout({ role: forcedRole }) {
  console.log("DASHBOARD LAYOUT LOADED", forcedRole);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = forcedRole || user?.role || 'student';
  const links = role === 'client' ? CLIENT_LINKS : STUDENT_LINKS;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-topbar">
        <button className="icon-button" aria-label="Open menu" onClick={() => setOpen(true)}>
          <Menu size={18} />
        </button>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>SkillBridge</span>
        <div />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1400 }}
        />
      )}

      <aside className={`dashboard-sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">SB</span>
          <div className="brand-copy">
            <strong>SkillBridge</strong>
            <span>{role === 'client' ? 'Client workspace' : 'Student workspace'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <NavLink to="/" className="sidebar-link">
            <Home size={17} /> Back to site
          </NavLink>
          <button type="button" className="sidebar-link" style={{ border: 'none', background: 'none', textAlign: 'left', width: '100%' }} onClick={handleLogout}>
            <LogOut size={17} /> Log out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <Outlet context={{ role }} />
      </main>
      <Toast />
    </div>
  );
}
