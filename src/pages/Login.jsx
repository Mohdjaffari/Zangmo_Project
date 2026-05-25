import React, { useState } from 'react';
import '../assets/styles/login.css';

const UtensilsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
    <path d="M7 2v20"/>
    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
  </svg>
);

const StoreIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
    <path d="M2 7h20"/>
    <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
  </svg>
);

const IdCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 10h2"/>
    <path d="M16 14h2"/>
    <path d="M6.17 15a3 3 0 0 1 5.66 0"/>
    <circle cx="9" cy="11" r="2"/>
    <rect x="2" y="5" width="20" height="14" rx="2"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
    <line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="m12 5 7 7-7 7"/>
  </svg>
);

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [staffId, setStaffId] = useState('');
  const [password, setPassword] = useState('');

  React.useEffect(() => {
    const savedAccounts = localStorage.getItem('zangmo_user_accounts');
    if (!savedAccounts) {
      const initialAccounts = [
        { username: 'admin', password: 'admin', role: 'Admin', name: 'Mehdi Khan', branch: 'Mehdi Kitchen (Main)' },
        { username: 'manager', password: 'manager', role: 'Manager', name: 'Branch Manager', branch: 'Mehdi Kitchen (Main)' },
        { username: 'zangmo', password: 'zangmo', role: 'Manager', name: 'Zangmo Wangchuck', branch: 'Zangmo Kitchen' },
        { username: 'zm-4902', password: 'password', role: 'Manager', name: 'Zangmo Wangchuck', branch: 'Zangmo Kitchen' },
        { username: 'zm-8831', password: 'password', role: 'Staff', name: 'Rahul Sharma', branch: 'Mehdi Kitchen (Main)' },
        { username: 'zm-2309', password: 'password', role: 'Staff', name: 'Sunita Rai', branch: 'Zangmo Kitchen' },
        { username: 'zm-1044', password: 'password', role: 'Staff', name: 'Asad Khan', branch: 'Mehdi Kitchen (Main)' }
      ];
      localStorage.setItem('zangmo_user_accounts', JSON.stringify(initialAccounts));
    }

    const savedSales = localStorage.getItem('zangmo_sales_transactions');
    if (!savedSales) {
      const initialSales = [
        { id: 1, ticketNo: '8801', branch: 'Mehdi Kitchen (Main)', amount: 12450.00, date: 'May 23, 2026', itemsCount: 80 },
        { id: 2, ticketNo: '8802', branch: 'Mehdi Kitchen (Main)', amount: 8200.00, date: 'May 24, 2026', itemsCount: 40 },
        { id: 3, ticketNo: '8803', branch: 'Mehdi Kitchen (Main)', amount: 4000.00, date: 'May 25, 2026', itemsCount: 22 },
        { id: 4, ticketNo: '8804', branch: 'Zangmo Kitchen', amount: 10150.00, date: 'May 24, 2026', itemsCount: 65 },
        { id: 5, ticketNo: '8805', branch: 'Zangmo Kitchen', amount: 8092.50, date: 'May 25, 2026', itemsCount: 53 }
      ];
      localStorage.setItem('zangmo_sales_transactions', JSON.stringify(initialSales));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!staffId.trim() || !password.trim()) {
      alert("Please enter both Staff ID and Password.");
      return;
    }

    const savedAccounts = localStorage.getItem('zangmo_user_accounts');
    let accounts = [];
    if (savedAccounts) {
      try {
        accounts = JSON.parse(savedAccounts);
      } catch (err) {
        accounts = [];
      }
    }

    const targetUser = staffId.trim().toLowerCase();
    const account = accounts.find(acc => acc.username === targetUser);

    if (!account) {
      alert("Access Denied: Invalid Staff ID / Email or password.");
      return;
    }

    if (account.password !== password) {
      alert("Access Denied: Incorrect Password.");
      return;
    }

    // Set local session storage indicator
    sessionStorage.setItem('zangmo_logged_in', 'true');
    localStorage.setItem('zangmo_user_role', account.role);
    localStorage.setItem('zangmo_logged_user_name', account.name);
    localStorage.setItem('zangmo_logged_branch', account.branch || 'Mehdi Kitchen (Main)');
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-container">
      <div className="login-modal">
        <div className="logo-container">
          <div className="logo-box">
            <UtensilsIcon />
          </div>
        </div>
        
        <h1 className="login-title">Z&M Kitchen</h1>
        <p className="login-subtitle">Staff Access Portal</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="form-header">
              <label className="form-label" htmlFor="staffId">Staff ID or Email</label>
            </div>
            <div className="input-wrapper">
              <div className="input-icon">
                <IdCardIcon />
              </div>
              <input 
                type="text" 
                id="staffId" 
                className="input-field" 
                placeholder="e.g. ZM-1042 or admin" 
                value={staffId}
                onChange={e => setStaffId(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-header">
              <label className="form-label" htmlFor="password">Password</label>
              <a href="#" className="forgot-link">Forgot?</a>
            </div>
            <div className="input-wrapper">
              <div className="input-icon">
                <LockIcon />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                id="password" 
                className="input-field" 
                placeholder="••••••••" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="input-action"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Login <ArrowRightIcon />
          </button>
        </form>

        <div className="system-status">
          System Status: <span className="status-indicator">Online</span> • v1.4.2
        </div>
      </div>
    </div>
  );
}
