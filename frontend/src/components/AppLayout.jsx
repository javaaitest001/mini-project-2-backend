import { CalendarDays, LogOut, Medal, Newspaper, Shield, Sparkles, Star, UsersRound } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../main.jsx';

const navItems = [
  { to: '/', label: '홈', icon: Newspaper },
  { to: '/standings', label: '조별 순위', icon: Medal },
  { to: '/schedule', label: '경기 일정', icon: CalendarDays },
  { to: '/squads', label: '스쿼드', icon: UsersRound },
  { to: '/preview', label: '미리보기', icon: Sparkles },
  { to: '/reservations', label: '예약 목록', icon: Star }
];

export default function AppLayout() {
  const { session, logout } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <Shield size={30} />
          <span>World Cup Watch</span>
        </NavLink>
        <nav className="nav-list">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {session ? (
            <>
              <div className="profile">
                <strong>{session.name}</strong>
                <span>{session.role}</span>
              </div>
              <button className="icon-text-button" onClick={logout}>
                <LogOut size={18} />
                로그아웃
              </button>
            </>
          ) : (
            <NavLink to="/login" className="primary-link">로그인</NavLink>
          )}
        </div>
      </aside>
      <main className="main-panel">
        <Outlet />
      </main>
    </div>
  );
}
