import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// SVGs
const GridIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const POSIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 19V5a2 2 0 012-2h12a2 2 0 012 2v14M8 10h8M8 14h8M8 6h8"/></svg>;
const MenuBookIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6.018C10.669 4.79 8.847 4 7 4a5 5 0 00-5 5v11a5 5 0 015-5c1.847 0 3.669.79 5 2.018m0-13.982C13.33 4.79 15.153 4 17 4a5 5 0 015 5v11a5 5 0 00-5-5c-1.847 0-3.669.79-5 2.018M12 6.018V21"/></svg>;
const TableIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v6H3V3zM3 9v12M21 9v12M7 9v12M17 9v12"/></svg>;
const UsersGroupIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
const EventsIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ExpensesIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>;
const InventoryIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const BriefcaseIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>;
const RestaurantMenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6v8h3v8h2V2c-2.76 0-5 2.24-5 4zm-5 3H9V2H7v7H5V2H3v7c0 2.21 1.79 4 4 4v9h2v-9c2.21 0 4-1.79 4-4V2h-2v7z"/></svg>;
const LogoutIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const UserIcon = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;

export default function ManagerSidebar({ activePage }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('zangmo_logged_user_name') || 'Branch Manager';
  });
  const [loggedBranch, setLoggedBranch] = useState(() => {
    return localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)';
  });
  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem('zangmo_logged_user_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb';
  });

  useEffect(() => {
    const handleStorage = () => {
      setUserName(localStorage.getItem('zangmo_logged_user_name') || 'Branch Manager');
      setLoggedBranch(localStorage.getItem('zangmo_logged_branch') || 'Mehdi Kitchen (Main)');
      setAvatar(localStorage.getItem('zangmo_logged_user_avatar') || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHIsYFXVtI2Nd1e5XZOoQ1xoyvN01OzoOzxbklay6ftS1H-uiC1o0dJAW6cGx_Yi7APORkALIWEGCSldZj6AvkR6CIIG7781_kQ7EJRGTZQRdw0c8B_LAxVUawI5_94LHUlBjvGg847wIojJfOH3JDzfH2DOtOFG8rndcs4eNZ_KV-O0T44ZYGXkVlj5pBe2i_3pCgiqRfiUOrDjN0ytRUox0zbrqCcWLRw_JYgzC2tmOe-XDJt56ZHGSoGWEv-g0nM-fUygIOkWJb');
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

  return (
    <div className="sidebar">
      <div className="brand">
        <div className="brand-top">
          <div className="brand-icon-box">
            <RestaurantMenuIcon />
          </div>
          <h2>Z&M Kitchen</h2>
        </div>
        <p style={{ textTransform: 'uppercase', fontSize: '11px', color: '#f59e0b', fontWeight: '700' }}>{loggedBranch}</p>
      </div>
      
      <ul className="nav-menu">
        <li className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <Link to="/dashboard" className="nav-link"><GridIcon /> Dashboard</Link>
        </li>
        <li className={`nav-item ${activePage === 'pos' ? 'active' : ''}`}>
          <Link to="/pos" className="nav-link"><POSIcon /> POS</Link>
        </li>
        <li className={`nav-item ${activePage === 'menu-management' ? 'active' : ''}`}>
          <Link to="/menu-management" className="nav-link"><MenuBookIcon /> Menu Management</Link>
        </li>
        <li className={`nav-item ${activePage === 'tables' ? 'active' : ''}`}>
          <Link to="/tables" className="nav-link"><TableIcon /> Table Management</Link>
        </li>
        <li className={`nav-item ${activePage === 'customers' ? 'active' : ''}`}>
          <Link to="/customers" className="nav-link"><UsersGroupIcon /> Customers</Link>
        </li>
        <li className={`nav-item ${activePage === 'events' ? 'active' : ''}`}>
          <Link to="/events" className="nav-link"><EventsIcon /> Events</Link>
        </li>
        <li className={`nav-item ${activePage === 'expenses' ? 'active' : ''}`}>
          <Link to="/expenses" className="nav-link"><ExpensesIcon /> Expenses</Link>
        </li>
        <li className={`nav-item ${activePage === 'inventory' ? 'active' : ''}`}>
          <Link to="/inventory" className="nav-link"><InventoryIcon /> Inventory</Link>
        </li>
        <li className={`nav-item ${activePage === 'hiring' ? 'active' : ''}`}>
          <Link to="/hiring" className="nav-link"><BriefcaseIcon /> Staff Hiring</Link>
        </li>
        <li className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
          <Link to="/profile" className="nav-link"><UserIcon /> Profile</Link>
        </li>
      </ul>
      
      <div className="user-profile" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          onClick={() => navigate('/profile')} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          title="View Profile"
        >
          <div className="avatar">
            <img alt="User" src={avatar} />
          </div>
          <div className="user-info">
            <h4>{userName}</h4>
            <p>MANAGER</p>
          </div>
        </div>
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
