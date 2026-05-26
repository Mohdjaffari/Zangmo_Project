import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// SVGs
const GridIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const SettingsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>;
const BranchIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
const ExpensesIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;
const RestaurantMenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z" /></svg>;
const BriefcaseIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
const ManagerIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const LogoutIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;

// Icons for new sidebar items
const OwnerIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>;
const POSIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 10h8M8 14h8M8 6h8" /></svg>;
const CustomersIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>;
const EventsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const JournalIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3.5A2.5 2.5 0 0 1 6.5 1h12.75a2.5 2.5 0 0 1 0 5H6.5" /></svg>;
const ReportsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
const PayrollIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></svg>;

export default function AdminSidebar({ activePage }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('zangmo_logged_user_name') || 'Mehdi Khan';
  });
  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('zangmo_logged_user_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb';
  });

  useEffect(() => {
    const handleStorage = () => {
      setUserName(localStorage.getItem('zangmo_logged_user_name') || 'Mehdi Khan');
      setUserAvatar(localStorage.getItem('zangmo_logged_user_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb');
    };
    window.addEventListener('storage', handleStorage);
    const interval = setInterval(handleStorage, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      sessionStorage.removeItem('zangmo_logged_in');
      window.location.reload();
    }
  };

  const handleComingSoon = (e, moduleName) => {
    e.preventDefault();
    alert(`${moduleName} Module is currently undergoing review. Check back soon!`);
  };

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-top">
          <div className="brand-icon-box">
            <RestaurantMenuIcon />
          </div>
          <h2>Zangmo &amp; Mehdi</h2>
        </div>
        <p>Kitchen Management</p>
      </div>

      <ul className="nav-menu">
        <li className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <Link to="/dashboard" className="nav-link"><GridIcon /> Dashboard</Link>
        </li>
        <li className={`nav-item ${activePage === 'expenses' ? 'active' : ''}`}>
          <Link to="/admin/expenses" className="nav-link"><ExpensesIcon /> Expenses</Link>
        </li>
        <li className={`nav-item ${activePage === 'journal' ? 'active' : ''}`}>
          <Link to="/admin/journal" className="nav-link"><JournalIcon /> Credit Journal</Link>
        </li>
        <li className={`nav-item ${activePage === 'reports' ? 'active' : ''}`}>
          <Link to="/admin/reports" className="nav-link"><ReportsIcon /> Reports</Link>
        </li>
        <li className={`nav-item ${activePage === 'managers' ? 'active' : ''}`}>
          <Link to="/admin/managers" className="nav-link"><ManagerIcon /> Hire Managers</Link>
        </li>
        <li className={`nav-item ${activePage === 'payroll' ? 'active' : ''}`}>
          <Link to="/admin/payroll" className="nav-link"><PayrollIcon /> Salary & Payroll</Link>
        </li>
        <li className={`nav-item ${activePage === 'branches' ? 'active' : ''}`}>
          <Link to="/admin/branches" className="nav-link"><BranchIcon /> Branches</Link>
        </li>
        <li className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}>
          <Link to="/admin/settings" className="nav-link"><SettingsIcon /> Settings</Link>
        </li>
      </ul>

      <div className="user-profile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <Link to="/admin/profile" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', flex: 1, padding: '6px', borderRadius: '8px', transition: 'all 0.2s', border: activePage === 'profile' ? '1px solid var(--secondary-container)' : '1px solid transparent', background: activePage === 'profile' ? 'rgba(252, 143, 52, 0.15)' : 'transparent' }}
              onMouseEnter={(e) => {
                if (activePage !== 'profile') e.currentTarget.style.backgroundColor = 'rgba(44, 62, 80, 0.4)';
              }}
              onMouseLeave={(e) => {
                if (activePage !== 'profile') e.currentTarget.style.backgroundColor = 'transparent';
              }}
        >
          <div className="avatar" style={{ border: activePage === 'profile' ? '2px solid var(--secondary-container)' : 'none', width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden' }}>
            <img alt="User" src={userAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div className="user-info">
            <h4 style={{ margin: 0, color: 'var(--on-primary)', fontSize: '12px', fontWeight: 600 }}>{userName}</h4>
            <p style={{ margin: 0, fontSize: '10px', color: 'var(--on-primary-container)', opacity: 0.5 }}>ADMINISTRATOR</p>
          </div>
        </Link>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          title="Logout"
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <LogoutIcon />
        </button>
      </div>
    </div>
  );
}
