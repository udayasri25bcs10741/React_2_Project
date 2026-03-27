import { NavLink } from 'react-router-dom';
import {
  MdDashboard, MdMenuBook, MdChecklist, MdCalendarMonth, MdAutoAwesome, MdSchool,
  MdDarkMode, MdLightMode,
} from 'react-icons/md';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard',  icon: MdDashboard },
  { to: '/subjects',  label: 'Subjects',   icon: MdMenuBook },
  { to: '/tasks',     label: 'Tasks',      icon: MdChecklist },
  { to: '/revision',  label: 'Revision',   icon: MdCalendarMonth },
  { to: '/ai-tools',  label: 'AI Tools',   icon: MdAutoAwesome },
];

export default function Navbar() {
  const { theme, toggle, isDark } = useTheme();

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo"><MdSchool /></div>
          <div>
            <div className="sidebar-brand-name">StudyAI</div>
            <div className="sidebar-brand-sub">Companion</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Navigation</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }>
              <div className="sidebar-link-icon"><Icon /></div>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Theme toggle */}
          <button className="theme-toggle" onClick={toggle} title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
            <div className="theme-toggle-track">
              <span className="theme-toggle-icon theme-toggle-dark"><MdDarkMode /></span>
              <span className="theme-toggle-icon theme-toggle-light"><MdLightMode /></span>
              <div className="theme-toggle-thumb" />
            </div>
            <span className="theme-toggle-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div className="sidebar-footer-content" style={{ marginTop: '0.6rem' }}>
            <div className="sidebar-footer-dot" />
            <div className="sidebar-footer-text">
              <strong>PRD 3</strong> · v1.0.0
            </div>
          </div>
        </div>
      </aside>

      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `bottom-nav-item ${isActive ? 'active' : ''}`
          }>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="bottom-nav-item bottom-nav-theme" onClick={toggle}>
          {isDark ? <MdLightMode /> : <MdDarkMode />}
          <span>Theme</span>
        </button>
      </nav>
    </>
  );
}

